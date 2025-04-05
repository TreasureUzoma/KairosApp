import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center px-8 justify-center bg-gray-100">
      <p className="text-lg text-gray-800">
        Welcome, just testing. Navigate to{" "}
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
