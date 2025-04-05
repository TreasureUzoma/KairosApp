import { db } from "@/lib/firebase";
import type { NextAuthOptions, Session, User } from "next-auth";
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
import { v4 as uuidv4 } from "uuid";

// ------------------ Types ------------------

type FirestoreUser = {
  userId: string;
  fullName: string;
  email: string;
  password: null;
  createdAt: ReturnType<typeof serverTimestamp>;
  updatedAt: ReturnType<typeof serverTimestamp>;
  lastLogin: ReturnType<typeof serverTimestamp>;
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
    async jwt({ token, user, account }) {
      if (user && account) {
        const email = user.email?.toLowerCase() || "";
        const userId = uuidv4(); // Directly generate userId if it's not in Firestore

        const userRef = doc(collection(db, "users"), userId);
        const userSnap = await getDoc(userRef);
        let userData: FirestoreUser;

        if (!userSnap.exists()) {
          // Create a new user if it doesn't exist
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
          // Update last login and timestamp if user exists
          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          userData = userSnap.data() as FirestoreUser;
        }

        // Assign values to JWT token
        token.id = userId;
        token.email = userData.email;
        token.picture = userData.profilePicUrl;
        token.name = userData.fullName;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        // Assign token data to session user object
        session.user = {
          ...session.user,
          email: token.email || "",
          image: typeof token.picture === "string" ? token.picture : "/images/avatars/default.png",
          name: token.name || "",
        };
      }
      return session;
    },
  },
};
