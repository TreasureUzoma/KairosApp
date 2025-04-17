import Image from "next/image";
import { FaGithub, FaLink } from "react-icons/fa";
import CommentForm from "./CommentForm";
import PostActionBtn from "@/app/(app)/_components/PostActionBtns";
import CommentSection from "./Comments";

export default function StreakApp({ streak }: { streak: IStreak }) {
  const {
    user,
    title,
    description,
    project,
    github,
    likes,
    commentsCount,
    id,
  } = streak;
  return (
    <div className="p-4 mb-9 cursor-pointer">
      <div className="flex">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
          <Image src="/guy.jpg" alt="Profile" fill className="object-cover" />
        </div>

        <div className="flex-1 flex flex-col gap-5">
          {/* User Info */}
          <div className="flex items-center">
            <span className="font-bold mr-1">{user.fullName}</span>
            <span className="text-gray-500">· 2h ago</span>
          </div>

          <div className="grid gap-4 py-5">
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            <p className=" text-[14px] font-Geist">{description}</p>
          </div>

          <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-900 aspect-auto overflow-hidden mb-3">
            <Image
              src="/gabriel-heinzer-g5jpH62pwes-unsplash.jpg"
              alt="Tweet image"
              height={1080}
              width={1080}
              className="object-cover h-125 w-full"
            />
          </div>

          <div className="flex gap-5 text-gray-600">
            <a
              aria-label="github link"
              href={github}
              className="flex items-center hover:underline dark:hover:text-blue-500 gap-2"
            >
              <FaGithub className="size-5" />
              <span className="text-sm font-semibold">GitHub</span>
            </a>
            <a
              href={project}
              aria-label="project link"
              className="flex items-center hover:underline dark:hover:text-blue-500 gap-2 "
            >
              <FaLink className="size-5" />
              <span className="text-sm font-semibold">Project</span>
            </a>
          </div>

          {/* Action Buttons */}
          <PostActionBtn likes={likes} commentsCount={commentsCount} />

          <div className="grid gap-5 py-7 border-t border-light-gray">
            <CommentForm postId="Lorem" />

            <CommentSection postId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
