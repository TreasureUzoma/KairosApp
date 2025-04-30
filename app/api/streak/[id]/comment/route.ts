/* eslint-disable */

import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: any } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { comment, rating } = body;

    if (!comment || typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Invalid comment or rating" }, { status: 400 });
    }

    const postId = params.id;
    const postRef = doc(db, "posts", postId);

    const commentData = {
        userId: session.user.id,
        userEmail: session.user.email,
        comment,
        rating,
        createdAt: serverTimestamp()
    };

    await updateDoc(postRef, {
        comments: arrayUnion(commentData)
    });

    return NextResponse.json({ message: "Comment added" });
}
