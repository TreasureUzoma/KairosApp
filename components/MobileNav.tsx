import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
function MobileNav() {
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
  return (
    <div className="fixed bottom-0 left-0 z-0 w-full border-t bg-background md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navigationItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`flex flex-col items-center justify-center ${
              item.isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="mt-1 text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MobileNav;
