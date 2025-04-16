"use client";

import Img from "@/components/Img";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { FormEvent, useState } from "react";
import TextAreaAutoRezise from "react-textarea-autosize";
import { mutate } from "swr";

type ServerResponse = {
  success: boolean;
  message: string;
};

export default function CommentForm({ postId }: { postId: string }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const maxLength = 300;

  const isDisabled = !text.trim() || text.length > maxLength || loading;

  const textColor = text.length > maxLength ? "text-red-500" : "text-gray";

  async function submitCondition(e: FormEvent) {
    return await handleSubmit(e);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const postComment = await axios.post<ServerResponse>("/api/comments", {
        text,
        postId,
      });
      const response = postComment.data;

      if (response.success) {
        setText("");
        mutate("/api/comments");
      }
    } catch (error) {
      console.log(error);

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mb-8" onSubmit={submitCondition}>
      <div className="mb-6 flex gap-4">
        <Img
          className="size-7.5 rounded-full object-cover"
          src={"/guy.jpg"}
          alt={`%d - avatar`}
        />
        <div className="flex-1">
          <TextAreaAutoRezise
            minRows={4}
            maxRows={7}
            placeholder="Add a comment..."
            className="border-light-gray text-zinc-600 dark:text-zinc-300 focus:ring-accent-foreground mb-2 w-full resize-none rounded-[10px] border p-3 ring ring-transparent outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center gap-5 py-3">
            <Button
              variant={"destructive"} size={"lg"}
              className="bg-primary flex items-center gap-2 rounded-[10px] p-2 px-3 text-sm text-white disabled:opacity-50"
              disabled={isDisabled}
            >
              <span>{loading ? "Posting..." : " Post"}</span>
            </Button>
            <p className={cn("text-sm", textColor)}>
              {maxLength - text.length}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
