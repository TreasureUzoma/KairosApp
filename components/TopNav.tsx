import { ThemeToggle } from "@/components/ThemeToggle";
import CreateAccountButton from "@/components/CreateAccountButton";

import Link from "next/link";
import Img from "./Img";

function TopNav() {
  return (
    <main>
      <nav className="flex justify-between px-4 bg-white dark:bg-black items-center  py-[1.03rem] md:px-12 top-0 max-w-screen sticky border-b border-neutral-200 dark:border-neutral-900">
        <Link href="/" className="md:invisible">
          <Img src={"/logo.svg"} className="h-7.5 dark:invert w-fit" alt="logo" />
        </Link>
        <ul className="flex items-center gap-x-2">
          <li>
            <CreateAccountButton />
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </main>
  );
}

export default TopNav;
