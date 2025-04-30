import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postRef = doc(db, "posts", params.id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postData = postSnap.data();

    if (postData.authorId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = Timestamp.now();
    const lastStreakAt = postData.lastStreakAt as Timestamp | undefined;

    if (lastStreakAt) {
        const diffInSeconds = now.seconds - lastStreakAt.seconds;
        const twentyFourHours = 24 * 60 * 60;

        if (diffInSeconds < twentyFourHours) {
            const hoursLeft = Math.ceil((twentyFourHours - diffInSeconds) / 3600);
            return NextResponse.json(
                { error: `Wait ${hoursLeft}h before increasing streak again` },
                { status: 429 }
            );
        }
    }

    const currentStreak = parseInt((postData.streakDay || "day1").replace("day", ""), 10);
    const nextStreak = `day${currentStreak + 1}`;

    await updateDoc(postRef, {
        streakDay: nextStreak,
        lastStreakAt: serverTimestamp()
    });

    return NextResponse.json({
        message: "Streak incremented",
        newStreak: nextStreak
    });
}
