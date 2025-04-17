import { posts } from "@/app/dummy";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { page, limit } = Object.fromEntries(searchParams) as {
      page: string;
      limit: string;
    };

    const docLimit = parseInt(limit) || 10;
    const nextPage = parseInt(page) || 1;

    const streaks = posts.slice((nextPage - 1) * docLimit, docLimit);

    return NextResponse.json({ success: true, streaks });
  } catch (error) {
    console.log("[GET_HOME_PAGE_POSTS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}
