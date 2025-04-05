/* eslint-disable */

import { db, rtdb } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  limit,
} from "firebase/firestore";
import {
  ref as rtdbRef,
  get as rtdbGet,
  set as rtdbSet,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import type { NextAuthOptions } from "next-auth";
import type { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

// --- Helper function to encode email for RTDB key ---
function encodeEmailForKey(email: string): string {
  // Replace forbidden characters. Using comma for dot is common.
  // we could also use Base64: Buffer.from(email).toString('base64')
  // but simple replacement is often sufficient and more readable in the DB.
  return email.replace(/\./g, ",");
}

// ------------------ Types ------------------

type FirestoreUser = {
  userId: string;
  fullName: string;
  email: string;
  password: null;
  createdAt: any;
  updatedAt: any;
  lastLogin: any;
  emailVerified: boolean;
  profilePicUrl: string;
  accountRole: string;
  accountStatus: string;
  oauthProvider: string;
};

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      image: string;
      name: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    email: string;
    picture?: string;
    name?: string;
    // Add any other user fields you want in the token
    accountRole?: string;
    accountStatus?: string;
  }
}

// ------------------ Fallback for missing env ------------------

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
    signIn: "/auth",
    newUser: "/", // Redirect new users to the homepage
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // `user`, `account`, `profile` are only passed on the first call after sign-in
      if (user && account) {
        try {
          const email = user.email?.toLowerCase();
          if (!email) {
            // Handle cases where email might be null (e.g., some GitHub configurations)
            throw new Error("Email not available from provider.");
          }

          const encodedEmail = encodeEmailForKey(email);
          const mappingRef = rtdbRef(rtdb, `emailToUserId/${encodedEmail}`);
          const mappingSnap = await rtdbGet(mappingRef);

          let userId: string;
          const usersCollectionRef = collection(db, "users");
          let userRef;
          let userSnap;
          let userData: FirestoreUser | null = null; // Initialize userData

          if (mappingSnap.exists()) {
            // User mapping exists in RTDB, try fetching from Firestore
            userId = mappingSnap.val();
            userRef = doc(usersCollectionRef, userId);
            userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              // --- Existing User Found ---
              console.log(`Existing user found: ${userId} for email: ${email}`);
              // Update last login time
              await updateDoc(userRef, {
                lastLogin: serverTimestamp(),
                updatedAt: serverTimestamp(),
                // Optionally update profile pic/name if changed in provider
                profilePicUrl: user.image || userSnap.data()?.profilePicUrl || "/images/avatars/default.png",
                fullName: user.name || userSnap.data()?.fullName || "No Name",
              });
              // Fetch the updated data to ensure token has latest info
              const updatedSnap = await getDoc(userRef);
              userData = updatedSnap.data() as FirestoreUser;

            } else {
              // Mapping exists but Firestore doc doesn't (data inconsistency)
              // Decide how to handle: Recreate Firestore doc? Log error?
              // For now, let's proceed as if it's a new user, using the existing userId
              console.warn(`RTDB mapping exists for ${email} (ID: ${userId}), but Firestore doc missing. Recreating.`);
              // Fall through to the 'new user' logic below, but using the existing userId
            }
          }

          // --- New User or Inconsistent State ---
          if (!userData) { // This covers both !mappingSnap.exists() and the inconsistent state above
            if (!mappingSnap.exists()) {
              // Generate a new userId only if mapping didn't exist
              userId = uuidv4();
              console.log(`New user mapping created: ${userId} for email: ${email}`);
              // Create mapping in RTDB *before* creating Firestore doc
              await rtdbSet(mappingRef, userId);
            }
             // Use the determined userId (new or existing from inconsistent state)
            userRef = doc(usersCollectionRef, userId);

            // Check if this is the *very first* user in the Firestore collection
            // Use a query with limit(1) for efficiency instead of getDocs()
            const firstUserQuery = query(usersCollectionRef, limit(1));
            const firstUserSnap = await getDocs(firstUserQuery);
            const isFirstUser = firstUserSnap.empty; // True if no documents exist yet

            console.log(`Creating new Firestore user document for ID: ${userId}`);
            const newUser: FirestoreUser = {
              userId,
              fullName: user.name || "No Name",
              email: email, // Store the original email
              password: null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              emailVerified: profile?.email_verified ?? true, // Use provider profile info if available
              profilePicUrl: user.image || "/images/avatars/default.png",
              accountRole: isFirstUser ? "admin" : "oAuth user",
              accountStatus: "active",
              oauthProvider: account.provider.toLowerCase(),
            };

            await setDoc(userRef, newUser);
            userData = newUser; // Use the newly created data
          }

          // --- Update Token ---
          if (userData) {
            token.id = userData.userId;
            token.email = userData.email;
            token.picture = userData.profilePicUrl;
            token.name = userData.fullName;
            token.accountRole = userData.accountRole; // Add role to token
            token.accountStatus = userData.accountStatus; // Add status to token
          } else {
             // This case should ideally not be reached if logic above is sound
             console.error("Failed to get or create user data for token population.");
             throw new Error("User data could not be determined.");
          }

        } catch (error) {
          console.error("Error in JWT callback:", error);
          // Decide how to handle the error. Returning the original token
          // might prevent login, or you could return a token without user info.
          // Throwing an error might be better to signal a failed login.
          // For now, just return the unmodified token to potentially allow session updates
          // return token;
          // Or throw to indicate failure:
          throw new Error(`JWT Callback failed: ${error.message}`);
        }
      }

      // Return the token (potentially updated with user info)
      return token;
    },

    async session({ session, token }) {
      // The token now contains the info we added in the jwt callback
      if (token && session.user) {
        session.user.id = token.id; // Add id from token to session
        session.user.email = token.email;
        session.user.image = token.picture || "/images/avatars/default.png";
        session.user.name = token.name || "";
        // You can add other properties from the token to the session if needed
        // session.user.role = token.accountRole;
      }
      return session;
    },
  },
  // Optional: Add error handling page
  // pages: {
  //   ...
  //   error: '/auth/error', // Error code passed in query string as ?error=
  // }
};
