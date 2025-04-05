import { Button } from "../ui/button";

import { FaGithub } from "react-icons/fa";

function GithubSignup() {
  return (
    <main className="mt-8">
      <Button className="w-full py-6">
        <FaGithub size={20} />
        <p className="font-bold">Continue with Github</p>
      </Button>
    </main>
  );
}

export default GithubSignup;
