import { FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
function GoogleSignup() {
  return (
    <main className="">
      <Button className="w-full py-6 bg-[#6b4fbb]">
        <FaGoogle size={20} />
        <p className="font-bold">Continue with Google</p>
      </Button>
    </main>
  );
}

export default GoogleSignup;
