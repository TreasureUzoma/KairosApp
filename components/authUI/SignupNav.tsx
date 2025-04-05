// import { Button } from "../ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "./Logo";

function SignupNav() {
  return (
    <main>
      <nav className="flex justify-between items-center mx-3 md:mx-12 font-Geist mt-8">
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
