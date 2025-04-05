import AuthMain from "@/components/AuthMain";
import SignupNav from "@/components/authUI/SignupNav";

export const metadata = {
  title: "Authentication - Continue to Kairos",
};


export default function Page() {
  return (
    <>
      <SignupNav />
      <AuthMain />
    </>
  );
}
