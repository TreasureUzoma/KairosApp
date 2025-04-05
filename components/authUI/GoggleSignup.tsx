import React from "react";
import { FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
function GoggleSignup() {
  return (
    <main className="">
      <Button className="w-full py-6 bg-[#6b4fbb]">
        <FaGoogle size={20} />
        <p>Continou with Google</p>
      </Button>
    </main>
  );
}

export default GoggleSignup;
