"use client";
import Image from "next/image";
import googleLogo from "../public/google.jpg";
import githubLogo from "../public/github-image.jpg";
import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn("google");
  };
  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center font-semibold justify-center h-14 px-16 mt-4 text-xl transition-colors duration-200 bg-white border-2 border-black rounded-lg focus:shadow-outline hover:bg-slate-200"
    >
      <Image
        src={googleLogo}
        alt="Google"
        width={20}
        height={20}
        className="mr-2"
      />
      Continue with Google
    </button>
  );
}

export function GithubSignInButton() {
  const handleClick = () => {
    signIn("github");
  };
  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center font-semibold justify-center h-14 px-16 mt-4 text-xl transition-colors duration-200 bg-white border-2 border-black rounded-lg focus:shadow-outline hover:bg-slate-200"
    >
      <Image
        src={githubLogo}
        alt="GitHub"
        width={20}
        height={20}
        className="mr-2"
      />
      Continue with GitHub
    </button>
  );
}
