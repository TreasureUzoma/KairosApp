import AuthMain from "@/components/AuthMain";
import TopNav from "@/components/authUI/TopNav";

export const metadata = {
  title: "Authentication - Continue to Kairos",
};


export default function Page() {
  return (
    <>
      <TopNav />
      <AuthMain />
    </>
  );
}
