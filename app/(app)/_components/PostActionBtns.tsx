import { Heart, MessageCircle, Share2 } from "lucide-react";

type Props = {
  likes: number;
  commentsCount: number;
};

export default function PostActionBtn({ likes, commentsCount }: Props) {
  return (
    <div className="flex justify-between text-sm text-gray-500 font-medium px-1">
      <button className="flex items-center gap-1 hover:text-red-500 transition">
        <Heart className="w-4 h-4" />
        <span className="mx-1">{likes}</span>
        Like
      </button>
      <button className="flex items-center gap-1 hover:text-blue-500 transition">
        <MessageCircle className="w-4 h-4" />
        <span className="mx-1">{commentsCount}</span>
        Comment
      </button>
      <button className="flex items-center gap-1 hover:text-green-500 transition">
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
}
