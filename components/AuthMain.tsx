import GithubSignup from "@/components/authUI/GithubSignup";
import GoggleSignup from "@/components/authUI/GoggleSignup";
// import ContinueWith from "./authUI/ContinueWith";
// import DontHaveACC from "./authUI/DontHaveACC";

function AuthMain() {
  return (
    <main className="flex justify-center h-[80vh] mx-8 mt-18">
      <section>
        <h1 className="text-black md:text-[40px] text-[30px] font-bold dark:text-white tracking-[-1px]">
          Welcome with Kairos
        </h1>
        <p className="font-Geist font-Geist mb-6 text-gray-600 dark:text-gray-300">
          Sign in below to get started on your journey with us.
        </p>
        <div className="flex flex-col gap-y-4 mt-[-1rem]">
          <GithubSignup />
          <GoggleSignup />
        </div>
        <p className="text-sm text-gray-500  font-Geist dark:text-gray-400 mt-6 ">
          By continuing, you agree to our
          <span className="underline cursor-pointer text-blue-600 dark:text-blue-400">
            Terms of Service
          </span>
          and{" "}
          <span className="underline cursor-pointer text-blue-600 dark:text-blue-400">
            Privacy Policy
          </span>
        </p>
      </section>
    </main>
  );
}

export default AuthMain;
