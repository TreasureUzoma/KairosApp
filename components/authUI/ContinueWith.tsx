import { FaLock } from "react-icons/fa";
import { Button } from "../ui/button";
function ContinueWith() {
  return (
    <Button className="bg-transparent w-full py-6 border md:text-[15px] text-[13px]  border-gray-300 text-black hover:bg-gray-100 dark:border-[#30343d] dark:bg-[#0e121c] dark:text-white dark:hover:bg-white dark:hover:text-black">
      <FaLock size={20} />
      <p className="font-Geist"> continue with Kairos</p>
    </Button>
  );
}

export default ContinueWith;
