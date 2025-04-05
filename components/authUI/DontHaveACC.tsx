import Link from "next/link";

function DontHaveACC() {
  return (
    <footer className="bg-[#ffffff] border-t dark:bg-[#030712] dark:border-[#30343d] border-gray-300 absolute bottom-0 py-8 left-0 right-0">
      <div className="flex justify-center">
        <Link href="/">
          <p className="text-[#0072f7]">Don&apos;t have an account? Sign Up</p>
        </Link>
      </div>
    </footer>
  );
}

export default DontHaveACC;
