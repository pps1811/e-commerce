import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

/**
 * Defense in depth: proxy.ts already blocks non-admins from /admin/* at the
 * edge, but every admin server action/page re-checks here too, since a
 * server action can be invoked directly and doesn't go through the route
 * matcher the same way a page navigation does.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }
  return session;
}

export async function requireAdminAction(): Promise<Session> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required");
  }
  return session;
}
