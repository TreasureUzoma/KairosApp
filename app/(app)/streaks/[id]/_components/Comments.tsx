"use client";

import Img from "@/components/Img";
import CommentLoader from "@/loaders/CommentLoader";
import axios from "axios";
import { ImFileEmpty } from "react-icons/im";
import useSWR from "swr";

type ApiResponse = {
  success: boolean;
  comments: IComment[];
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function CommentSection({ postId }: { postId: string }) {
  const url = `/api/comments?postId=${postId}`;
  const { data, isLoading, error } = useSWR<ApiResponse>(url, fetcher);

  if (error) {
    return <p>error...</p>;
  }

  if (isLoading) {
    return <CommentLoader />;
  }
  const { comments } = data!;

  return (
    <section className=" divide-y divide-light-gray/60">
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <CommentCards comment={comment} key={index} />
        ))
      ) : (
        <div className=" grid gap-5 text-gray justify-items-center">
          <ImFileEmpty />
          <p className="no comment yet"></p>
        </div>
      )}
    </section>
  );
}

const CommentCards = ({ comment }: { comment: IComment }) => {
  const { user, content } = comment;
  return (
    <div className="flex gap-4 py-5">
      <Img
        className="size-10 rounded-full object-cover"
        src={"/guy.jpg"}
        alt={`%d's avatar`}
      />

      <div className="flex-1 space-y-2">
        <span className="text-primary font-medium">{user.fullName}</span>

        <p className="text-gray-700 dark:text-gray-300 text-base">{content}</p>

        <div className="text-gray-500 flex items-center gap-4 pt-1 text-sm">
          <span>2hours ago</span>
        </div>
      </div>
    </div>
  );
};
