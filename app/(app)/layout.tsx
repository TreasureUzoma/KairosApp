import { AppSidebar } from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import CirclePlus from "@/components/CirclePlus";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Overall Layout Wrapper */}
      <div className="min-h-screen flex flex-col md:flex-row relative">
        <div className=" md:fixed md:inset-y-0 md:left-0 md:w-64 z-50">
          <AppSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1  md:pl-64   flex-col ">
          {/* Top Navbar */}
          <div className=" sticky top-0 z-40 ">
            <TopNav />
          </div>

          {/* Page Content */}
          <main className="flex-1 mb-20">{children}</main>
          <CirclePlus />
        </div>
      </div>
    </>
  );
}
