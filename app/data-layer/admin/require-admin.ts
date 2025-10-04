import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const requireAdmin = cache(async function () {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/sign-in");
  }
  const role = session.user.role;
  console.log(role !== "admin");
  if (role !== "admin") {
    return redirect("/not-admin");
  }
  return session;
});
