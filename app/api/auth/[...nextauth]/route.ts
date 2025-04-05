// basic nextauth setups 
// gets auth options from /lib/auth
// the whole logic runs in this route cus its server side

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };