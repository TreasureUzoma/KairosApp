import { Button } from "../ui/button";
import { IconBrandGithub } from "@tabler/icons-react";

interface GithubSignupProps {
    onClick: () => void;
}
function GithubSignup({ onClick }: GithubSignupProps) {
    return (
        <Button onClick={onClick} className="mt-8 w-full py-6">
            <IconBrandGithub size={20} />
            <p className="font-bold">Continue with Github</p>
        </Button>
    );
}

export default GithubSignup;
