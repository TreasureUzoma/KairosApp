import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Menu - Kairos",
};

export default async function Page() {
  return (
    <main className="min-h-screen flex items-center px-8 justify-center">
      <p className="text-lg dark:text-white">
        Kairos Dashboard, just testing. Navigate to{" "}
        <Link
          href="/auth"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Auth Route
        </Link>
      </p>
    </main>
  );
}
