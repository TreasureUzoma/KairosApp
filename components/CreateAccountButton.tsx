/* eslint-disable */

'use client'

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

function CreateAccountButton() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (session || pathname === '/auth') return null;
  // returns nothing if user is already signed in or in auth route

  return (
    <Link
      className="px-3 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover: opacity-90"
      href="/auth"
    >
      Create account
    </Link>
  );
}

export default CreateAccountButton;