"use client";

import { usePathname } from "next/navigation";
import { Home, Trophy, Bolt, User } from "lucide-react";
import Link from "next/link";

function MobileNav() {
  const pathname = usePathname();

  const navigationItems = [
    {
      title: "Home",
      icon: Home,
      href: "/home",
    },
    {
        title: "My Streaks",
        icon: Bolt,
        href: "/streaks"
    },    
    {
      title: "Leaderboard",
      icon: Trophy,
      href: "/leaderboard",
    },
    {
      title: "Profile",
      icon: User,
      href: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-0 w-full border-t bg-background md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex flex-col items-center justify-center font-semibold ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="mt-1 text-xs">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MobileNav;
