import { db } from "@/lib/firebase";
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";

// Type for the user data stored in Firestore
interface UserData {
    fullName: string;
    email: string;
    profilePicUrl: string;
    totalProjects: number;
    currentRank: number;
    currentStreak: number;
}

export async function GET(req: NextRequest): Promise<Response> {
    try {
        // Get the session from NextAuth
        const session = await getServerSession(authOptions);

        // Check if session exists (i.e., the user is authenticated)
        if (!session || !session.user || !session.user.email) {
            return NextResponse(
                JSON.stringify({ error: "User is not authenticated" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!req.auth) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const email = session.user.email; // Get email from session

        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", email);
        const userDoc = await getDoc(userDocRef);

        // Check if the user exists in Firestore
        if (!userDoc.exists()) {
            return new NextResponse(
                JSON.stringify({ error: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Safely retrieve and process data
        const userData = (userDoc.data() as Partial<UserData>) || {}; // Treat as partial in case fields are missing

        // Query the posts collection to get the total post count for the user
        const postsQuery = query(
            collection(db, "posts"),
            where("email", "==", email)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const totalProjects = postsSnapshot.size; // Count the number of posts (projects)

        // Return data with default values and fetched post count
        const returnData: UserData = {
            fullName: userData.fullName || "Unknown",
            email: userData.email || "Unknown",
            profilePicUrl: userData.profilePicUrl || "", // Assuming profilePicUrl is the correct field name
            totalProjects: totalProjects, // Total post count fetched from Firestore
            currentRank: 0, // Set rank to 0 by default for now
            currentStreak: userData.currentStreak || 0
        };

        return new NextResponse(JSON.stringify(returnData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return new NextResponse(
            JSON.stringify({ error: "Something went wrong." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
