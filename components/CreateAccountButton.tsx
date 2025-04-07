import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function CreateAccountButton() {
    const session = await auth();

    if (session?.user) return null;
    // returns nothing since user is already logged in

    return (
        <Link
            className="px-3 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover: opacity-90"
            href="/auth"
        >
            Create account
        </Link>
    );
}
