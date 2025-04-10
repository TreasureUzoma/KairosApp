"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  CalendarDays,
  LinkIcon,
  MapPin,
  MessageCircle,
  Heart,
  Share2,
  Camera,
  Edit,
  Check,
  X,
} from "lucide-react";

export default function TwitterProfile() {
  const [activeTab] = useState("posts");
  const [bannerImage, setBannerImage] = useState("/thumbnail.jpg");
  const [profileImage, setProfileImage] = useState("/guy.jpg");
  const [bio, setBio] = useState(
    "Frontend Developer | Building beautiful UIs & clean code 🚀"
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(bio);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerImage(imageUrl);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleEditBio = () => {
    setIsEditingBio(true);
    setEditedBio(bio);
  };

  const handleSaveBio = () => {
    setBio(editedBio);
    setIsEditingBio(false);
  };

  const handleCancelEditBio = () => {
    setIsEditingBio(false);
  };

  return (
    <div className="bg-background border-gray-200 dark:border-neutral-800 text-black dark:text-white">
      {/* Banner */}
      <div
        className="relative h-48 bg-blue-500 cursor-pointer group"
        onClick={handleBannerClick}
      >
        <Image
          src={bannerImage || "/placeholder.svg"}
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
              className="relative w-44 h-44 rounded-full overflow-hidden mr-1 cursor-pointer group"
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
          <h1 className="text-xl font-bold">Leowave</h1>
          <p className="text-gray-500">@leo_wave</p>
        </div>

        {/* Bio */}
        <div className="mt-3 relative">
          {isEditingBio ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
                rows={3}
                maxLength={160}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBio}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600"
                >
                  <Check size={16} />
                  Save
                </button>
                <button
                  onClick={handleCancelEditBio}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <p className="text-gray-800 dark:text-gray-200 flex-grow">
                {bio}
              </p>
              <button
                onClick={handleEditBio}
                className="text-gray-500 hover:text-blue-500"
              >
                <Edit size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Location, Website, Join Date */}
        <div className="mt-3 flex flex-wrap gap-x-4 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-1">
            <LinkIcon size={16} />
            <a href="#" className="text-blue-500 hover:underline">
              leowave.dev
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
        <div className="">
          <button className="px-4 py-3 text-sm font-medium text-center text-black dark:text-white border-b-2">
            Posts
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="">
        {activeTab === "posts" &&
          [1, 2, 3, 4].map((num) => (
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
                  <div className="flex items-center">
                    <span className="font-bold mr-1">User Name</span>
                    <span className="text-gray-500">· 2h ago</span>
                  </div>

                  <p className="mt-3 text-[14px] mb-6 font-Geist">
                    Karos team just testing UI. Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Velit voluptatem ullam nam
                    blanditiis sit commodi ex sequi tempore quaerat at
                    cupiditate enim beatae ipsum, praesentium aut maiores
                    reprehenderit vero molestias totam iusto. Nam, ut.
                  </p>

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
    </div>
  );
}
