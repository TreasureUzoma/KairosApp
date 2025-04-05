import { db } from "@/lib/firebase"; // Ensure this points to your initialized Firestore instance
import type { NextAuthOptions } from "next-auth";
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
  limit, // Import limit
  Timestamp,
  writeBatch,
  addDoc, // Import addDoc for creating docs with auto-ID
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// ------------------ Types ------------------
// (Types remain the same as the previous corrected version)
// Define a more specific type for Firestore Timestamps after retrieval
type FirestoreTimestamp = Timestamp;

type FirestoreUser = {
  userId: string;
  fullName: string;
  email: string; // Store normalized email
  password?: null; // Optional if only OAuth
  createdAt: ReturnType<typeof serverTimestamp> | FirestoreTimestamp; // Allow both server and retrieved timestamps
  updatedAt: ReturnType<typeof serverTimestamp> | FirestoreTimestamp;
  lastLogin: ReturnType<typeof serverTimestamp> | FirestoreTimestamp;
  emailVerified: boolean;
  profilePicUrl: string;
  accountRole: string;
  accountStatus: string;
  oauthProviders: string[]; // Store all providers used by this user
};

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    // Add userId to the session user
    user: {
      id: string; // Add the userId here
      email: string;
      image: string;
      name: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string; // Ensure id is always present in the JWT payload
    email: string;
    picture?: string;
    name?: string;
    // You can add other FirestoreUser fields here if needed downstream
  }
}


// ------------------ Fallback for missing env ------------------
// (Environment variable checks remain the same)
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GitHub OAuth environment variables");
}

// ------------------ Auth Options ------------------

export const authOptions: NextAuthOptions = {
  // (Providers, pages, session strategy remain the same)
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/auth", // Your custom sign-in page
    // newUser: "/", // Redirect new users (or all users after sign-in) here
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Runs *after* successful sign-in (OAuth), *before* session callback
      if (user && account && user.email) {
        const normalizedEmail = user.email.toLowerCase();
        const currentProvider = account.provider.toLowerCase();
        console.log(`JWT Callback: Processing login for email: ${normalizedEmail} via ${currentProvider}`);

        try {
          // --- Step 1: Query the 'emails' collection for the normalized email ---
          const emailsRef = collection(db, "emails");
          // *** CHANGE: Query by the 'email' field instead of using email as ID ***
          const emailQuery = query(
              emailsRef,
              where("email", "==", normalizedEmail),
              limit(1) // We only expect one mapping per email
          );
          const emailQuerySnapshot = await getDocs(emailQuery);

          let userId: string;
          let userData: FirestoreUser | null = null;

          // *** CHANGE: Check if the query returned any documents ***
          if (!emailQuerySnapshot.empty) {
            // --- EXISTING USER ---
            const emailDoc = emailQuerySnapshot.docs[0]; // Get the first (and only) doc
            userId = emailDoc.data().userId;
            console.log(`JWT Callback: Email ${normalizedEmail} found in emails collection, mapping to userId: ${userId}`);

            if (!userId) {
               console.error(`Error: Email mapping document ${emailDoc.id} for ${normalizedEmail} is missing userId!`);
               throw new Error("User mapping data is corrupted.");
            }

            // --- Step 2: Get user data from 'users' collection ---
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
               console.error(`Error: User document for userId ${userId} (email ${normalizedEmail}) not found! Re-creating.`);
               // Re-create user doc using the *existing* userId
               userData = await createNewUser(userId, normalizedEmail, currentProvider, user, profile);
               // Need to write this new user data (outside the original batch logic, or adjust)
               await setDoc(userRef, userData); // Simple set for recovery case

            } else {
               // --- Step 3: Update existing user's data ---
               console.log(`JWT Callback: User ${userId} found. Updating last login.`);
               userData = userSnap.data() as FirestoreUser;
               const updatedProviders = userData.oauthProviders?.includes(currentProvider)
                 ? userData.oauthProviders
                 : [...(userData.oauthProviders || []), currentProvider];

               await updateDoc(userRef, {
                 lastLogin: serverTimestamp(),
                 updatedAt: serverTimestamp(),
                 profilePicUrl: user.image || userData.profilePicUrl,
                 fullName: user.name || userData.fullName,
                 oauthProviders: updatedProviders,
               });
               // Refresh userData with potential updates (optional)
               userData.lastLogin = serverTimestamp();
               userData.updatedAt = serverTimestamp();
               userData.profilePicUrl = user.image || userData.profilePicUrl;
               userData.fullName = user.name || userData.fullName;
               userData.oauthProviders = updatedProviders;
            }

          } else {
            // --- NEW USER ---
            console.log(`JWT Callback: Email ${normalizedEmail} not found. Creating new user.`);
            // --- Step 2: Generate new unique userId ---
            userId = uuidv4();

            // --- Step 3: Create the user data object ---
             userData = await createNewUser(userId, normalizedEmail, currentProvider, user, profile);

            // --- Step 4: Create documents atomically using a batch ---
             const batch = writeBatch(db);
             const userRef = doc(db, "users", userId);

             // *** CHANGE: Create email mapping doc with auto-ID ***
             // Create a reference to a *new* document in 'emails' collection
             const newEmailRef = doc(collection(db, "emails")); // Creates ref with auto-ID
             // Set the data for the new email mapping document
             batch.set(newEmailRef, {
                email: normalizedEmail, // Store the email as a field
                userId: userId
             });

             // Set the data for the new user document
             batch.set(userRef, userData);

             // Commit the batch
             await batch.commit();
             console.log(`JWT Callback: Successfully created user ${userId} and email mapping doc ${newEmailRef.id} for ${normalizedEmail}.`);
          }

          // --- Step 5: Populate JWT token ---
          if (userData) {
              token.id = userId;
              token.email = userData.email;
              token.picture = userData.profilePicUrl;
              token.name = userData.fullName;
          } else {
             console.error("JWT Callback: UserData is null after processing. Cannot populate token effectively.");
          }

        } catch (error) {
          console.error("Error processing user in JWT callback:", error);
          return token; // Or handle error more explicitly
        }
      }

      return token;
    },

    async session({ session, token }) {
      // (Session callback remains the same - reads from the populated token)
       if (token && token.id) {
        session.user.id = token.id as string;
        session.user.email = token.email || "";
        session.user.image = typeof token.picture === "string" ? token.picture : "/images/avatars/default.png";
        session.user.name = token.name || "";
      } else {
         console.log("Session Callback: Token missing expected data (id).")
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};


// Helper function to create new user data object
// (Helper function remains the same)
async function createNewUser(
    userId: string,
    normalizedEmail: string,
    provider: string,
    user: /* import('next-auth').User */ any,
    profile: /* import('next-auth/providers').Profile */ any
): Promise<FirestoreUser> {
     let emailVerified = false;
    if (provider === 'google' && profile?.email_verified) {
        emailVerified = true;
    }

    const newUser: FirestoreUser = {
        userId,
        fullName: user.name || "User",
        email: normalizedEmail,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        emailVerified: emailVerified,
        profilePicUrl: user.image || "/images/avatars/default.png",
        accountRole: "user",
        accountStatus: "active",
        oauthProviders: [provider],
    };
    return newUser;
}