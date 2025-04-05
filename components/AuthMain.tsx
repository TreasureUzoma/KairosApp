"use client"

import GithubSignup from "@/components/authUI/GithubSignup";
import GoogleSignup from "@/components/authUI/GoogleSignup";

import { signIn } from "next-auth/react";

function AuthMain() {
  return (
    <main className="flex justify-center h-[90vh]">
      <section className="mx-8 my-auto">
        <h1 className="text-black md:text-[40px] text-[30px] font-bold dark:text-white tracking-[-1px]">
          Welcome to Kairos
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Sign in below to get started on your journey with us.
        </p>
        <div className="flex flex-col gap-y-4 mt-[-1rem]">
          <GithubSignup onClick={() => signIn("github", { callbackUrl: "/" })} />
          <GoogleSignup onClick={() => signIn("google", { callbackUrl: "/" })}/>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-7">
          By continuing, you agree to our{" "}
          <span className="hover:underline text-blue-600 dark:text-blue-400">
            Terms of Service
          </span>
          and{" "}
          <span className="hover:underline text-blue-600 dark:text-blue-400">{" "}
            Privacy Policy
          </span>
        </p>
      </section>
    </main>
  );
}

export default AuthMain;
