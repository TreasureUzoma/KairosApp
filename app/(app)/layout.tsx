import { AppSidebar } from "@/components/Sidebar";
import SignupNav from "@/components/authUI/SignupNav";
import CirclePlus from "@/components/CirclePlus"

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
        <div className="flex-1  flex flex-col min-h-screen">
          {/* Top Navbar */}
          <div className=" sticky top-0 z-40 ">
            <SignupNav />
          </div>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 ">{children}</main>
          
          <CirclePlus />
        </div>
      </div>
    </>
  );
}
