import { ThemeToggle } from "@/components/ThemeToggle";
import { GithubSignInButton, GoogleSignInButton } from "@/components/AuthButtons";

export default function Page() {
  return (
    <div>
      <ThemeToggle />
      <div>
        <h1>Sign in To Continue</h1>
        <GithubSignInButton />
        <GoogleSignInButton/>
      </div>
    </div>
  );
}
