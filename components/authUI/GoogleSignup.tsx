import { Google } from "lucide-react";
import { Button } from "../ui/button";

interface GoogleSignupProps {
    onClick: () => void;
}

function GoogleSignup({ onClick }: GithubSignupProps) {
    return (
        <Button onClick={onClick} className="w-full py-6 bg-[#6b4fbb]">
            <Google size={20} />
            <p className="font-bold">Continue with Google</p>
        </Button>
    );
}

export default GoogleSignup;
