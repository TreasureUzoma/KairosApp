import Img from "@/components/Img";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import { FaGithub, FaLink } from "react-icons/fa";
import CommentForm from "./CommentForm";

export default function StreakApp() {
  return (
    <div className="p-4 mb-9 cursor-pointer">
      <div className="flex">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
          <Image src="/guy.jpg" alt="Profile" fill className="object-cover" />
        </div>

        <div className="flex-1 flex flex-col gap-5">
          {/* User Info */}
          <div className="flex items-center">
            <span className="font-bold mr-1">User Name</span>
            <span className="text-gray-500">· 2h ago</span>
          </div>

          <div className="grid gap-4 py-5">
            <h1 className="text-2xl font-bold text-primary">
              Responsive Site, Kairo
            </h1>
            <p className=" text-[14px] font-Geist">
              Karos team just testing ui Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Velit voluptatem ullam nam blanditiis sit
              commodi ex sequi tempore quaerat at cupiditate enim beatae ipsum,
              praesentium aut maiores reprehenderit vero molestias totam iusto.
              Nam, ut.
            </p>
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
              href="#"
              className="flex items-center hover:underline dark:hover:text-blue-500 gap-2"
            >
              <FaGithub className="size-5" />
              <span className="text-sm font-semibold">GitHub</span>
            </a>
            <a
              href="#"
              aria-label="project link"
              className="flex items-center hover:underline dark:hover:text-blue-500 gap-2 "
            >
              <FaLink className="size-5" />
              <span className="text-sm font-semibold">Project</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between text-sm text-gray-500 font-medium py-5 border-t border-b border-gray-300 px-1">
            <button className="flex items-center gap-1 hover:text-red-500 transition">
              <Heart className="w-4 h-4" />
              Like
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500 transition">
              <MessageCircle className="w-4 h-4" />
              Comment
            </button>
            <button className="flex items-center gap-1 hover:text-green-500 transition">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="grid gap-5">
            <CommentForm postId="Lorem" />

            <div className="divide-y divide-muted-foreground">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="flex gap-4 py-5">
                  <Img
                    className="size-10 rounded-full object-cover"
                    src={"/guy.jpg"}
                    alt={`%d's avatar`}
                  />

                  <div className="flex-1 space-y-2">
                    <span className="text-primary font-medium">{"User"}</span>

                    <p className="text-gray-700 dark:text-gray-300 text-base">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Explicabo quo distinctio, aliquid sed similique dolore
                      ipsum tempore sequi placeat incidunt, officia veritatis
                      eius consectetur quisquam sit. Perspiciatis, minima?
                      Totam, ea.
                    </p>

                    <div className="text-gray-500 flex items-center gap-4 pt-1 text-sm">
                      <span>2hours ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
