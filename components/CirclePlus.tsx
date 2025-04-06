import { Plus } from "lucide-react";
import Link from "next/link";

const CirclePlus = () => {

  return (
    <Link
      href="/new"
      className="fixed bottom-25 right-6 z-50 h-14 w-14 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-sm flex items-center justify-center hover:opacity-90 transition md:hidden"
    >
      <Plus className="h-6 w-6" />
    </Link>
  );
};

export default CirclePlus;
