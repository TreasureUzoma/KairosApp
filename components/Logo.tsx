"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function Logo() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main>
      <section className="flex justify-center items-center space-x-2">
        {theme === "dark" ? (
          <Image
            src="/logo/white-logo.png"
            alt="Logo Dark"
            width={40}
            height={40}
            className="object-contain"
            layout="intrinsic"
          />
        ) : (
          <Image
            src="/logo/black-logo.png"
            alt="Logo Light"
            width={40}
            height={40}
            className="object-contain"
            layout="intrinsic"
          />
        )}
        <p className="text-black text-[28px] md:text-[35px] font-bold dark:text-white">
          Kairos
        </p>
      </section>
    </main>
  );
}

export default Logo;
