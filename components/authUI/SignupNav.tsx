import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

function SignupNav() {
  return (
    <main>
      <nav className="flex justify-between items-center px-3 md:px-12 top-0 max-w-screen sticky">
        <Logo />
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
