// basic nextauth setups 
// gets auth options from /lib/auth
// the whole logic runs in this route cus its server side

import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;