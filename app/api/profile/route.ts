import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "User is not authenticated" },
        { status: 401 }
      );
    }

    const email = session.user.email;

    // Get user document
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userData = userSnap.data() as Partial<IUserData>;

    // Count total posts by this user
    const postQuery = query(
      collection(db, "posts"),
      where("authorEmail", "==", email)
    );
    const postSnap = await getDocs(postQuery);
    const totalProjects = postSnap.size;

    const returnData: IUserData = {
      fullName: userData.fullName || "Anonymous",
      email,
      profilePicUrl: userData.profilePicUrl || "/default-avatar.png",
      totalProjects,
      currentRank: userData.currentRank || 0,
      currentStreak: userData.currentStreak || 0
    };

    return NextResponse.json({ success: true, data: returnData }, { status: 200 });
  } {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
