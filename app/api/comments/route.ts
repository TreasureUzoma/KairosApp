import { comments, posts } from "@/app/dummy";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { page, limit, postId } = Object.fromEntries(searchParams) as {
      postId: string;
      page: string;
      limit: string;
    };

    if (!postId) {
        return NextResponse.json(
          { success: false, message: "No PostID provided" },
          { status: 400 }
        );
      }

    const findPost = posts.find((post) => post.id === postId);

    if (!findPost) {
      return NextResponse.json(
        { success: false, message: `Post Not Found with id ${postId}` },
        { status: 404 }
      );
    }

    const docLimit = parseInt(limit) || 10;
    const nextPage = parseInt(page) || 1;

    const postComments = comments
      .filter((comment) => comment.postId === postId)
      .slice((nextPage - 1) * docLimit, docLimit);

    return NextResponse.json({ success: true, comments: postComments });
  } catch (error) {
    console.log("[GET_COMMENTS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}
