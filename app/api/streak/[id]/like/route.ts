/* eslint-disable */

import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: any } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.id;
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
        likes: arrayUnion(session.user.id)
    });

    return NextResponse.json({ message: "Post liked" });
}
