import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";

const Home = () => {
  return (
    <div>
      {[1, 2, 3, 4].map((num) => (
        <div
          key={num}
          className="border-b border-neutral-200 p-4 mb-9 dark:border-neutral-900 cursor-pointer"
        >
          <div className="flex">
            {/* Profile Picture */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
              <Image
                src="/guy.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>

            {/* Post Content */}
            <div className="flex-1">
              {/* User Info */}
              <div className="flex items-center">
                <span className="font-bold mr-1">User Name</span>
                <span className="text-gray-500">· 2h ago</span>
                {/* <MoreHorizontal className="h-4 w-4 ml-auto text-gray-500" /> */}
              </div>

              {/* Post Text */}
              <p className="mt-3 text-[14px] mb-6 font-Geist">
                Karos team just testing ui Lorem ipsum dolor sit amet
                consectetur, adipisicing elit. Velit voluptatem ullam nam
                blanditiis sit commodi ex sequi tempore quaerat at cupiditate
                enim beatae ipsum, praesentium aut maiores reprehenderit vero
                molestias totam iusto. Nam, ut.
              </p>

              {/* Optional Tweet Image */}
              <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-900 aspect-video overflow-hidden mb-3">
                <Image
                  src="/gabriel-heinzer-g5jpH62pwes-unsplash.jpg"
                  alt="Tweet image"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between text-sm text-gray-500 font-medium px-1">
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
