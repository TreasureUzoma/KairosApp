import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const lastCreatedAt = searchParams.get("lastCreatedAt");

    let postsQuery;

    if (lastCreatedAt) {
        postsQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            startAfter(new Date(lastCreatedAt)),
            limit(pageSize)
        );
    } else {
        postsQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            limit(pageSize)
        );
    }

    const snapshot = await getDocs(postsQuery);

    const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return NextResponse.json({
        posts,
        nextCursor: posts.length > 0 ? posts[posts.length - 1].createdAt.toDate().toISOString() : null
    });
}

// usage example 
// /api/posts?pageSize=10 or /api/posts?pageSize=10&lastCreatedAt=2024-12-01T10:20:00.000Z