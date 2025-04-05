// import { Button } from "../ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

function SignupNav() {
  return (
    <main>
      <nav className="flex justify-between items-center mx-3 md:mx-12 font-geist mt-8 top-0 left-0 right-0 sticky">
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
