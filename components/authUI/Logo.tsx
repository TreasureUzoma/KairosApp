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
      <section>
        {theme === "dark" ? (
          <Image
            src="/logo/1743827430400.png"
            alt="Logo Dark"
            width={40}
            height={40}
            className="w-6 h-6 sm:w-10 sm:h-10 object-contain"
            layout="intrinsic"
          />
        ) : (
          <Image
            src="/logo/1743827430395.png"
            alt="Logo Light"
            width={40}
            height={40}
            className="w-12 h-12 sm:w-12 sm:h-12 object-contain"
            layout="intrinsic"
          />
        )}
      </section>
    </main>
  );
}

export default Logo;
