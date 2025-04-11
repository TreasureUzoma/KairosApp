/* eslint-disable */

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, LinkIcon, MessageCircle, Heart, Share2, Camera } from "lucide-react";

interface UserData {
  fullName: string;
  email: string;
  profilePicUrl: string;
  totalProjects: number;
  currentRank: number;
  currentStreak: number;
}

export default function KairosProfile() {
  const [activeTab] = useState("posts");
  const [bannerImage, setBannerImage] = useState("/thumbnail.jpg");
  const [profileImage, setProfileImage] = useState("/guy.jpg");
  const [userData, setUserData] = useState<UserData | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok) {
          setUserData(data);
          setProfileImage(data.profilePicUrl);
        } else {
          console.error("Error fetching user data:", data.error);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleBannerClick = () => bannerInputRef.current?.click();
  const handleProfileClick = () => profileInputRef.current?.click();

  const handleBannerChange = () => {};
  const handleProfileChange = () => {};

  return (
    <div className="bg-background border-gray-200 dark:border-neutral-800 text-black dark:text-white">
      {/* Banner */}
      <div className="relative h-35 md:h-48 bg-blue-500 cursor-pointer group" onClick={handleBannerClick}>
        <Image
          src={bannerImage || "/guy.png"}
          alt="Profile Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Camera className="text-white w-8 h-8" />
        </div>
        <input
          type="file"
          ref={bannerInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleBannerChange}
        />
      </div>

      {/* Profile Info */}
      <div className="px-4">
        <div className="flex justify-between -mt-12">
          <div className="relative">
            <div
              className="relative w-32 md:w-44 h-32 md:h-44 rounded-full overflow-hidden mr-1 cursor-pointer group"
              onClick={handleProfileClick}
            >
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white w-8 h-8" />
              </div>
              <input
                type="file"
                ref={profileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfileChange}
              />
            </div>
          </div>
        </div>

        {/* Name and Username */}
        <div className="mt-2">
          <h1 className="text-xl font-bold">{userData?.fullName || "Not Active"}</h1>
          <p className="text-gray-500">@{userData?.email?.split("@")[0] || "null"}</p>
        </div>

        {/* Bio */}
        <div className="mt-3 relative">
          <div className="flex items-start gap-2">
            <p className="text-gray-800 dark:text-gray-200 flex-grow">
              Ranked{" "}
              <Link href={`/#leaderboard${userData?.currentRank}`}>
                #{userData?.currentRank ?? 0}
              </Link>
            </p>
          </div>
        </div>

        {/* Location, Website, Join Date */}
        <div className="mt-3 flex flex-wrap gap-x-4 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <LinkIcon size={16} />
            <a href="#" rel="noreferrer" target="_blank" className="text-blue-500 hover:underline">
              domain.dev
            </a>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={16} />
            <span>Joined June 2020</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <div>
          <button className="px-4 py-3 text-sm font-medium text-center text-black dark:text-white border-b-2">
            Posts
          </button>
        </div>
      </div>

      {/* Posts */}
      <div>
        {activeTab === "posts" &&
          [1, 2, 3, 4].map(num => (
            <div
              key={num}
              className="border-b border-neutral-200 p-4 mb-9 dark:border-neutral-900 cursor-pointer"
            >
              <div className="flex">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                  <Image src={profileImage} alt="Profile" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-bold mr-1">{userData?.fullName || "User Name"}</span>
                    <span className="text-gray-500">· 2h ago</span>
                  </div>
                  <p className="mt-3 text-[14px] mb-6 font-Geist">
                    Karos team just testing UI. Lorem ipsum dolor sit amet consectetur...
                  </p>
                  <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-900 aspect-video overflow-hidden mb-3">
                    <Image
                      src="/gabriel-heinzer-g5jpH62pwes-unsplash.jpg"
                      alt="Post image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 font-medium px-1">
                    <button className="flex items-center gap-1 hover:text-red-500 transition">
                      <Heart className="w-4 h-4" /> Like
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition">
                      <MessageCircle className="w-4 h-4" /> Comment
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
