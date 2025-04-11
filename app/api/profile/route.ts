/* eslint-disable */
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    // Get the session from NextAuth
    const session = await auth();

    // Check if session exists (i.e., the user is authenticated)
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const email = session.user.email;

    // Fetch user data from Firestore
    const userDocRef = doc(db, "users", email);
    const userDoc = await getDoc(userDocRef);

    // Check if the user exists in Firestore
    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Safely retrieve and process data
    const userData = userDoc.data() as Partial<UserData>;

    // Query the posts collection to get the total post count for the user
    const postsQuery = query(
      collection(db, "posts"),
      where("email", "==", email)
    );
    const postsSnapshot = await getDocs(postsQuery);
    const totalProjects = postsSnapshot.size;

    // Return data with default values and fetched post count
    const returnData: UserData = {
      fullName: userData.fullName || "Unknown",
      email: email,
      profilePicUrl: userData.profilePicUrl,
      totalProjects: totalProjects,
      currentRank: userData.currentRank || 0,
      currentStreak: userData.currentStreak || 0,
    };

    return NextResponse.json(returnData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
