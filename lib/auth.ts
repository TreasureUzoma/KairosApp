// src/lib/auth.ts (or adjust path as needed, e.g., lib/auth.ts)

import { db } from "@/lib/firebase"; // Ensure this points to your initialized Firestore instance
import type { NextAuthOptions, User as NextAuthUser, Account, Profile } from "next-auth";
import type { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  limit,
  Timestamp, // For type checking retrieved timestamps
  writeBatch, // For atomic writes
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// ------------------ Types ------------------

// Define a more specific type for Firestore Timestamps after retrieval
type FirestoreTimestamp = Timestamp;

// Define the structure of your user data in Firestore
// Ensure this matches the actual structure in your Firestore database
type FirestoreUser = {
  userId: string;
  fullName: string;
  email: string; // Store normalized email
  password?: null; // Optional if only OAuth
  createdAt: ReturnType<typeof serverTimestamp> | FirestoreTimestamp;
  updatedAt: ReturnType<typeof serverTimestamp> | FirestoreTimestamp;
  lastLogin: ReturnType<typeof serverTimestamp> | FirestoreTimestamp;
  emailVerified: boolean;
  profilePicUrl: string;
  accountRole: string; // e.g., 'user', 'admin'
  accountStatus: string; // e.g., 'active', 'inactive'
  oauthProviders: string[]; // Store all providers used by this user, e.g., ['google', 'github']
};

// Extend NextAuth types for Session and JWT
declare module "next-auth" {
  interface Session {
    // Add the userId to the session object available client-side
    user: {
      id: string; // Unique User ID from Firestore
      email: string;
      image: string;
      name: string;
    } & DefaultSession["user"]; // Keep existing DefaultSession fields
  }

  interface JWT {
    // Add fields to the JWT token payload
    id: string; // Unique User ID from Firestore
    email: string;
    picture?: string;
    name?: string;
    // You could potentially add accountRole here if needed frequently
  }
}

// ------------------ Environment Variable Checks ------------------

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
}

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GitHub OAuth environment variables (GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET)");
}


// ------------------ Auth Options Configuration ------------------

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      // Optional: Request specific scopes or profile details
      // authorization: { params: { scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email' } }
    }),
    GitHubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
       // Optional: Request specific scopes like user:email
       // authorization: { params: { scope: 'read:user user:email' } }
    }),
  ],

  pages: {
    signIn: "/auth", // Your custom sign-in page route
    // error: '/auth/error', // Optional: Custom error page
    // signOut: '/auth/signout', // Optional: Custom sign out page
    // verifyRequest: '/auth/verify-request', // Optional: Check email page for Email provider
     newUser: '/', // Optional: Redirect new users to a specific page
  },

  session: {
    // Use JSON Web Tokens for session strategy
    strategy: "jwt",
    // Optional: Set session max age
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    /**
     * Called after successful signin.
     * Use this callback to persist user data, link accounts, etc.
     * The `user`, `account`, `profile` parameters are only passed on the first call after sign-in.
     * Subsequent calls (like session refreshes) will only have the `token` parameter.
     */
    async jwt({ token, user, account, profile }) {
      // Only process if user, account, and email are present (initial sign-in)
      if (user && account && user.email) {
        const normalizedEmail = user.email.toLowerCase();
        const currentProvider = account.provider.toLowerCase();
        console.log(`[Auth] JWT Callback: Processing login for email="${normalizedEmail}" via provider="${currentProvider}"`);

        try {
          // --- Step 1: Check if email exists via query ---
          const emailsRef = collection(db, "emails");
          const emailQuery = query(
              emailsRef,
              where("email", "==", normalizedEmail),
              limit(1)
          );
          const emailQuerySnapshot = await getDocs(emailQuery);

          let userId: string;
          let firestoreUser: FirestoreUser | null = null; // Use specific type

          if (!emailQuerySnapshot.empty) {
            // --- EXISTING USER FLOW ---
            const emailDoc = emailQuerySnapshot.docs[0];
            userId = emailDoc.data().userId;
            console.log(`[Auth] JWT Callback: Email found, maps to userId="${userId}"`);

            if (!userId) {
               console.error(`[Auth Error] Corrupt data: Email mapping doc ${emailDoc.id} for ${normalizedEmail} is missing userId!`);
               throw new Error("User mapping data is corrupted.");
            }

            // --- Step 2: Get user data ---
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
               // This indicates inconsistency: mapping exists, but user doc doesn't.
               console.error(`[Auth Error] Data inconsistency: User document for userId ${userId} (email ${normalizedEmail}) not found! Re-creating user document.`);
               // Attempt to recover by creating the user document with the existing userId
               firestoreUser = await createNewUser(userId, normalizedEmail, currentProvider, user, profile);
               await setDoc(userRef, firestoreUser); // Use setDoc to create it
               console.log(`[Auth] JWT Callback: Re-created missing user document for userId="${userId}"`);

            } else {
               // --- Step 3: Update existing user ---
               console.log(`[Auth] JWT Callback: User document found for userId="${userId}". Updating...`);
               firestoreUser = userSnap.data() as FirestoreUser;
               const existingProviders = firestoreUser.oauthProviders || [];
               const updatedProviders = existingProviders.includes(currentProvider)
                 ? existingProviders
                 : [...existingProviders, currentProvider]; // Add new provider if needed

               // Prepare updates
               const updates: Partial<FirestoreUser> = {
                 lastLogin: serverTimestamp(),
                 updatedAt: serverTimestamp(),
                 // Optionally update mutable profile info from provider
                 profilePicUrl: user.image || firestoreUser.profilePicUrl, // Update if provider has newer image
                 fullName: user.name || firestoreUser.fullName,          // Update if provider has newer name
                 oauthProviders: updatedProviders,                       // Update provider list
               };

               await updateDoc(userRef, updates);
               console.log(`[Auth] JWT Callback: Updated user document for userId="${userId}"`);

               // Update local object with non-timestamp fields for token enrichment
               firestoreUser = { ...firestoreUser, ...updates, userId: userId }; // Ensure userId is present
            }

          } else {
            // --- NEW USER FLOW ---
            console.log(`[Auth] JWT Callback: Email "${normalizedEmail}" not found. Creating new user...`);
            // Step 2: Generate new userId
            userId = uuidv4();

            // Step 3: Prepare new user data
            firestoreUser = await createNewUser(userId, normalizedEmail, currentProvider, user, profile);

            // Step 4: Create user doc and email mapping atomically
            const batch = writeBatch(db);
            const userRef = doc(db, "users", userId); // Ref for users/userId
            const newEmailRef = doc(collection(db, "emails")); // Auto-ID ref for emails mapping

            // Add operations to batch
            batch.set(userRef, firestoreUser); // Create user document
            batch.set(newEmailRef, { // Create email -> userId mapping
                email: normalizedEmail,
                userId: userId
            });

            // Commit batch
            await batch.commit();
            console.log(`[Auth] JWT Callback: Successfully created user (userId="${userId}") and email mapping (docId="${newEmailRef.id}")`);
          }

          // --- Step 5: Enrich JWT token ---
          // Ensure we have the essential user details (userId and email at minimum)
          if (firestoreUser && userId) {
              token.id = userId; // Add our unique Firestore userId
              token.email = firestoreUser.email; // Use normalized email from Firestore record
              token.picture = firestoreUser.profilePicUrl;
              token.name = firestoreUser.fullName;
              // Add other fields if needed, e.g., token.role = firestoreUser.accountRole;
              console.log(`[Auth] JWT Callback: Token enriched with user data (id: ${token.id})`);
          } else {
             // Should not happen if logic above is correct, but good to log
             console.error("[Auth Error] Failed to obtain valid user data after DB operations. Token might be incomplete.");
             // Decide how to handle this - maybe return unmodified token or throw?
             // For now, we proceed, but essential data might be missing downstream.
          }

        } catch (error) {
          console.error("[Auth Error] Error during JWT callback processing:", error);
          // Optional: Return a token indicating an error or the original token
          // Depending on needs, you might want session creation to fail here.
          // Example: return { ...token, error: "ProcessingError" };
          // Returning the potentially partially modified token:
          return token;
        }
      } else {
        // This path is taken for JWT refreshes or when initial sign-in params aren't available
        // console.log("[Auth] JWT Callback: Refresh or non-signin call.");
      }

      // Return the potentially modified token
      return token;
    },

    /**
     * Called after the `jwt` callback.
     * Takes data from the token and merges it into the session object.
     */
    async session({ session, token }) {
       // `token` contains the data added in the `jwt` callback
       // Assign the userId and potentially other details from the token to the session.user object
       if (token && token.id && typeof token.id === 'string') {
           session.user.id = token.id; // Add the userId to the session object
           // Ensure other fields are populated correctly, falling back if necessary
           session.user.email = token.email || session.user.email || ""; // Prioritize token email
           session.user.name = token.name || session.user.name || "";     // Prioritize token name
           session.user.image = token.picture || session.user.image || "/images/avatars/default.png"; // Prioritize token picture
           // console.log(`[Auth] Session Callback: Session enriched with token data (userId: ${session.user.id})`);
       } else {
           console.warn("[Auth Warn] Session Callback: Token did not contain expected 'id'. Session user might be incomplete.");
       }
       return session; // Return the modified session object
    },
  },

  // Enable debug messages in development for more insight
  debug: process.env.NODE_ENV === 'development',

  // Optional: Add event listeners for debugging or logging specific events
  // events: {
  //   async signIn(message) { console.log("Sign In Event:", message); },
  //   async session(message) { console.log("Session Event:", message); },
  //   async signOut(message) { console.log("Sign Out Event:", message); },
  // },
};


// ------------------ Helper Function ------------------

/**
 * Creates the initial Firestore user data object.
 * @param userId - The unique ID generated for the user.
 * @param normalizedEmail - The user's email (lowercased).
 * @param provider - The OAuth provider ID (e.g., 'google', 'github').
 * @param user - The user object from NextAuth callback.
 * @param profile - The profile object from NextAuth callback (provider-specific details).
 * @returns A Promise resolving to the FirestoreUser object.
 */
async function createNewUser(
    userId: string,
    normalizedEmail: string,
    provider: string,
    user: NextAuthUser, // Use imported NextAuthUser type
    profile: Profile      // Use imported Profile type
): Promise<FirestoreUser> {
    console.log(`[Auth Helper] Creating new Firestore user object for userId="${userId}", email="${normalizedEmail}"`);

    // Attempt to determine email verification status (example)
    let emailVerified = false;
    if (provider === 'google' && (profile as any)?.email_verified === true) {
        // Google provides 'email_verified' in its standard profile scope
        emailVerified = true;
        console.log(`[Auth Helper] Email verified via Google profile.`);
    }
    // GitHub doesn't provide verification status directly in basic profile.
    // Requires 'user:email' scope and potentially checking profile.emails array if available.
    // For simplicity, default to false unless explicitly verified.

    const newUser: FirestoreUser = {
        userId,
        fullName: user.name || `User_${userId.substring(0, 6)}`, // Use name or generate fallback
        email: normalizedEmail, // Store the clean, normalized email
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(), // Set initial login time
        emailVerified: emailVerified, // Set based on provider info (if available)
        profilePicUrl: user.image || "/images/avatars/default.png", // Use image or default fallback
        accountRole: "user", // Default role for new users
        accountStatus: "active", // Default status for new users
        oauthProviders: [provider], // Initialize with the first provider
    };
    return newUser;
}