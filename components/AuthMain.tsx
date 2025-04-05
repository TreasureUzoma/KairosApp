import GithubSignup from "@/components/authUI/GithubSignup";
import GoggleSignup from "@/components/authUI/GoggleSignup";
import ContinueWith from "./authUI/ContinueWith";
import DontHaveACC from "./authUI/DontHaveACC";

function AuthMain() {
  return (
    <main className="flex justify-center mt-18">
      <section>
        <h1 className="text-black md:text-[40px] text-[30px] font-bold dark:text-white tracking-[-1px]">
          continue with Kairos
        </h1>
        <div className="flex flex-col gap-y-4 mt-[-1rem]">
          <GithubSignup />
          <GoggleSignup />
          <ContinueWith />
        </div>
        <DontHaveACC />
      </section>
    </main>
  );
}

export default AuthMain;
