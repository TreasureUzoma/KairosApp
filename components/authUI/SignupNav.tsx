import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import Link from "next/link"

function SignupNav() {
  return (
    <main>
      <nav className="flex justify-between items-center px-4 py-4 md:px-12 top-0 max-w-screen sticky border-b border-neutral-200 dark:border-neutral-900">
        <Link href="/">
          <Logo />
        </Link>
        <ul className="flex items-center gap-x-4">
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </main>
  );
}

export default SignupNav;
