import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, githubLink, projectLink, imageLink, tag } = body;

    if (!title || !description || !githubLink || !projectLink || !imageLink || !tag) {
        return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const newPost = {
        title,
        description,
        githubLink,
        projectLink,
        imageLink,
        tag,
        authorId: session.user.id,
        authorEmail: session.user.email,
        createdAt: serverTimestamp(),
        lastStreakAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: [],
        comments: [],
        score: Math.floor(Math.random() * 4) + 7, // Random score from 7–10
        streakDay: "day1"
    };

    const postRef = await addDoc(collection(db, "posts"), newPost);

    return NextResponse.json({
        message: "Post created",
        post: { id: postRef.id, ...newPost }
    });
}
