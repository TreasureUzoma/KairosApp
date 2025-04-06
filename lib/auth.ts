/* eslint-disable */

import { db } from "@/lib/firebase";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";

// Extend the session and token types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
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

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
        })
    ],

    pages: {
        signIn: "/auth",
        newUser: "/"
    },

    session: {
        strategy: "jwt"
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (user && account) {
                const email = user.email?.toLowerCase();
                const userRef = doc(collection(db, "users"), email!);
                const userSnap = await getDoc(userRef);

                let userData: any;

                if (!userSnap.exists()) {
                    userData = {
                        userId: user.id,
                        fullName: user.name || "No Name Provided",
                        email,
                        password: null,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        lastLogin: serverTimestamp(),
                        emailVerified: true,
                        profilePicUrl:
                            user.image || "/images/avatars/default.png",
                        accountRole: "oAuth user",
                        accountStatus: "active",
                        oauthProvider: account.provider.toLowerCase()
                    };

                    await setDoc(userRef, userData);
                } else {
                    await updateDoc(userRef, {
                        lastLogin: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    });

                    userData = userSnap.data();
                }

                token.id = userData?.userId || user.id;
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
                    id: token.id as string,
                    email: token.email || "",
                    image:
                        typeof token.picture === "string"
                            ? token.picture
                            : "/default-avatar.png",
                    name: token.name || ""
                };
            }
            return session;
        }
    }
});
