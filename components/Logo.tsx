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
      <section className="flex justify-center items-center space-x-1">
        {theme === "dark" ? (
          <Image
            src="/logo/white-logo.png"
            alt="Logo Dark"
            width={29}
            height={29}
            className="object-contain"
            layout="intrinsic"
          />
        ) : (
          <Image
            src="/logo/black-logo.png"
            alt="Logo Light"
            width={29}
            height={29}
            className="object-contain"
            layout="intrinsic"
          />
        )}
        <p className="text-black text-[22px] font-orbitron md:text-[20px] font-bold dark:text-white tracking-[-1px]">
          Kairos
        </p>
      </section>
    </main>
  );
}

export default Logo;
