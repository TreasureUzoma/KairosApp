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
  Timestamp,
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
  return email.replace(/\./g, ",");
}

// ------------------ Types ------------------

type FirestoreUser = {
  userId: string;
  fullName: string;
  email: string;
  password: null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin: Timestamp;
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
    newUser: "/",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account) {
        try {
          const email = user.email?.toLowerCase();
          if (!email) throw new Error("Email not available from provider.");

          const encodedEmail = encodeEmailForKey(email);
          const mappingRef = rtdbRef(rtdb, `emailToUserId/${encodedEmail}`);
          const mappingSnap = await rtdbGet(mappingRef);

          let userId = "";
          const usersCollectionRef = collection(db, "users");
          let userRef: ReturnType<typeof doc>;
          let userSnap: Awaited<ReturnType<typeof getDoc>>;
          let userData: FirestoreUser | null = null;

          if (mappingSnap.exists()) {
            userId = mappingSnap.val();
            userRef = doc(usersCollectionRef, userId);
            userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              await updateDoc(userRef, {
                lastLogin: serverTimestamp(),
                updatedAt: serverTimestamp(),
                profilePicUrl:
                  user.image || userSnap.data()?.profilePicUrl || "/images/avatars/default.png",
                fullName: user.name || userSnap.data()?.fullName || "No Name",
              });

              const updatedSnap = await getDoc(userRef);
              userData = updatedSnap.data() as FirestoreUser;
            } else {
              console.warn(`RTDB mapping exists for ${email} (ID: ${userId}), but Firestore doc missing. Recreating.`);
              // Fall through
            }
          }

          if (!userData) {
            if (!mappingSnap.exists()) {
              userId = uuidv4();
              await rtdbSet(mappingRef, userId);
            }

            // Use either new or recovered userId
            userRef = doc(usersCollectionRef, userId);

            const firstUserQuery = query(usersCollectionRef, limit(1));
            const firstUserSnap = await getDocs(firstUserQuery);
            const isFirstUser = firstUserSnap.empty;

            const newUser: FirestoreUser = {
              userId,
              fullName: user.name || "No Name",
              email,
              password: null,
              createdAt: serverTimestamp() as Timestamp,
              updatedAt: serverTimestamp() as Timestamp,
              lastLogin: serverTimestamp() as Timestamp,
              emailVerified: profile?.email_verified ?? true,
              profilePicUrl: user.image || "/images/avatars/default.png",
              accountRole: isFirstUser ? "admin" : "oAuth user",
              accountStatus: "active",
              oauthProvider: account.provider.toLowerCase(),
            };

            await setDoc(userRef, newUser);
            userData = newUser;
          }

          if (userData) {
            token.id = userData.userId;
            token.email = userData.email;
            token.picture = userData.profilePicUrl;
            token.name = userData.fullName;
            token.accountRole = userData.accountRole;
            token.accountStatus = userData.accountStatus;
          } else {
            throw new Error("User data could not be determined.");
          }
        } catch {
          console.error("Error in JWT callback:", error);
          throw new Error(`JWT Callback failed: ${error.message}`);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.image = token.picture || "/images/avatars/default.png";
        session.user.name = token.name || "";
      }
      return session;
    },
  },
};
