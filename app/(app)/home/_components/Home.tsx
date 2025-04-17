"use client";

import React from "react";
import axios from "axios";
import useSWR from "swr";
import Img from "@/components/Img";
import { cn } from "@/lib/utils";
import StreakLoader from "@/loaders/PostLoader";
import Link from "next/link";
import PostActionBtn from "../../_components/PostActionBtns";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  streaks: IStreak[];
};

const Home = () => {
  const { data, isLoading, error } = useSWR<ApiResponse>(
    "/api/streaks",
    fetcher
  );

  if (error) {
    return <p>error...</p>;
  }

  if (isLoading) {
    return <StreakLoader />;
  }

  const { streaks } = data!;

  return (
    <div className=" divide-y divide-light-gray/50">
      {streaks.map((streak, index) => (
        <StreakCards key={index} streak={streak} />
      ))}
    </div>
  );
};

const StreakCards = ({ streak }: { streak: IStreak }) => {
  const { description, images, likes, user, commentsCount, id } = streak;
  return (
    <div className=" p-4 mb-9 py-7.5">
      <div className="flex">
        <div className="relative  overflow-hidden mr-3">
          <Img
            src="/guy.jpg"
            alt="Profile"
            className="object-cover w-12 h-12 rounded-full"
          />
        </div>

        <div className="flex-1">
          <Link href={`/streaks/${id}`}>
            <div className="flex items-center">
              <span className="font-bold mr-1">{user.fullName}</span>
              <span className="text-gray-500">2h ago</span>
            </div>

            <p className="mt-3 text-[14px] mb-6 font-Geist">{description}</p>

            {images.length > 0 && (
              <div
                className={cn(
                  "relative flex rounded-2xl border border-neutral-200 dark:border-neutral-900 aspect-video overflow-hidden mb-3",
                  images.length > 1 && "h-125 aspect-auto"
                )}
              >
                {images.map((_, index) => (
                  <Img
                    key={index}
                    src="/gabriel-heinzer-g5jpH62pwes-unsplash.jpg"
                    alt="Tweet image"
                    className="object-cover"
                  />
                ))}
              </div>
            )}
          </Link>

          {/* Action Buttons */}
          <PostActionBtn likes={likes} commentsCount={commentsCount} />
        </div>
      </div>
    </div>
  );
};

export default Home;
