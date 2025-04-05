import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center px-8 justify-center">
      <p className="text-lg text-white dark:text-gray-800">
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
