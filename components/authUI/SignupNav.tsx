import { Button } from "../ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "./Logo";

function SignupNav() {
  return (
    <main>
      <nav className="flex justify-between items-center mx-3 md:mx-12 font-Geist mt-8">
        <Logo />
        <ul className="flex items-center gap-x-4">
          <li className="text-[#6b6866] md:text-[15px] text-[13px] dark:text-white">
            Contact
          </li>
          <li>
            <Button className="bg-transparent border md:text-[15px] text-[13px] px-4 py-2 border-gray-300 text-black hover:bg-gray-100 dark:border-[#30343d] dark:bg-[#0e121c] dark:text-white dark:hover:bg-white dark:hover:text-black">
              Sign up
            </Button>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </main>
  );
}

export default SignupNav;
