import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";
import Logo from "./Logo";
import Image from "next/image";
import MobileNav from "./MobileNav";

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "#",
    isActive: true,
  },
  {
    title: "Products",
    icon: ShoppingCart,
    href: "#",
  },
  {
    title: "Customers",
    icon: Users,
    href: "#",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "#",
  },
];

export function AppSidebar() {
  return (
    <>
      <aside className=" hidden md:flex h-screen w-64 flex-col border-r bg-white dark:bg-[#030712] border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-center py-5 border-b border-gray-200 dark:border-neutral-800">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-8">
            {navigationItems.map((item) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${
                    item.isActive
                      ? "bg-gray-100 dark:bg-neutral-800 text-black dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium font-Geist">
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile Section */}
        <div className="border-t border-gray-200 dark:border-neutral-800 px-4 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/guy.jpg"
              alt="User"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Wave
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Frontend Dev
              </span>
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile Navigation (only shown on small screens) */}
      <MobileNav />
    </>
  );
}
