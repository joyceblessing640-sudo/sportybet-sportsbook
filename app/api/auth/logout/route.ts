import { SESSION_COOKIE } from "@/lib/auth";
import { jsonOk } from "@/lib/http";

export async function POST() {
  const res = jsonOk({ loggedOut: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
