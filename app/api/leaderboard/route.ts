import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const postsQuery = query(collection(db, "posts"));
    const postsSnapshot = await getDocs(postsQuery);

    const userStats: Record<string, { email: string, postCount: number, streakSum: number }> = {};

    postsSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const authorId = data.authorId;
        const email = data.authorEmail;
        const streakDay = data.streakDay || "day1";
        const streakCount = parseInt(streakDay.replace("day", ""), 10);

        if (!userStats[authorId]) {
            userStats[authorId] = { email, postCount: 0, streakSum: 0 };
        }

        userStats[authorId].postCount += 1;
        userStats[authorId].streakSum += isNaN(streakCount) ? 1 : streakCount;
    });

    const sortedLeaderboard = Object.entries(userStats)
        .map(([userId, stats]) => ({
            userId,
            email: stats.email,
            postCount: stats.postCount,
            streakSum: stats.streakSum,
            score: stats.postCount + stats.streakSum
        }))
        .sort((a, b) => b.score - a.score);

    const paginated = sortedLeaderboard.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({
        page,
        pageSize,
        total: sortedLeaderboard.length,
        results: paginated
    });
}


// usage example
// /api/leaderboard?page=1&pageSize=10