import { db } from "@/lib/firebase";
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
} from "firebase/firestore";
import {
  getDatabase,
  ref as rtdbRef,
  get as rtdbGet,
  set as rtdbSet,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";

// session and token types
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      image: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    email: string;
    picture?: string;
    name?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
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
    async jwt({ token, user, account }) {
      // we are indexing by email stored in real-time db and userid stored in firestore 
      // this block gets email from oAuth, searches the email in firebase realtime db, gets userid from real-time db, and the fetches user data with the found user id in firestore 
      // extra latency but helps in keeping everything in check 
      
      if (user && account) {
        const email = user.email?.toLowerCase();
        const realtimeDb = getDatabase();
        const mappingRef = rtdbRef(realtimeDb, `emailToUserId/${email}`);
        const mappingSnap = await rtdbGet(mappingRef);

        let userId: string;

        if (mappingSnap.exists()) {
          userId = mappingSnap.val();
        } else {
          userId = uuidv4();
          await rtdbSet(mappingRef, userId);
        }

        const userRef = doc(collection(db, "users"), userId);
        const userSnap = await getDoc(userRef);
        let userData: any;

        if (!userSnap.exists()) {
          userData = {
            userId,
            fullName: user.name || "No Name",
            email,
            password: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            emailVerified: true,
            profilePicUrl: user.image || "/images/avatars/default.png",
            accountRole: "oAuth user",
            accountStatus: "active",
            oauthProvider: account.provider.toLowerCase(),
          };

          await setDoc(userRef, userData);
        } else {
          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          userData = userSnap.data();
        }

        token.id = userId;
        token.email = userData?.email;
        token.picture = userData?.profilePicUrl;
        token.name = userData?.fullName;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          email: token.email || "",
          image: typeof token.picture === "string" ? token.picture : "/default-avatar.png",
          name: token.name || "",
        };
      }
      return session;
    },
  },
};
