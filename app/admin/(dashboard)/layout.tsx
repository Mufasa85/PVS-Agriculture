import type { ReactNode } from "react";
import { cookies } from "next/headers";

import Sidebar from "@/components/admin/Sidebar";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);
  const isSuperAdmin = session?.role === "SUPER_ADMIN";

  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true, email: true, role: true },
      })
    : null;

  return (
    <div className="min-h-screen bg-[#f4f5fa]">
      <Sidebar
        isSuperAdmin={isSuperAdmin}
        user={{
          name: user?.name ?? "Administrateur",
          email: user?.email ?? "",
          role: user?.role ?? session?.role ?? "EDITOR",
        }}
      />

      <div className="nav:pl-[264px]">
        <main className="min-h-screen px-5 py-8 nav:px-10 nav:py-10">{children}</main>
      </div>
    </div>
  );
}
