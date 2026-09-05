import type { ReactNode } from "react";
import { cookies } from "next/headers";

import AdminTopBar from "@/components/admin/AdminTopBar";
import Sidebar from "@/components/admin/Sidebar";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  EDITOR: "Éditeur",
};

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

  const userName = user?.name ?? "Administrateur";
  const userRole = ROLE_LABELS[user?.role ?? session?.role ?? "EDITOR"] ?? "Éditeur";

  return (
    <div className="min-h-screen bg-[#f0f2f8]">
      <Sidebar
        isSuperAdmin={isSuperAdmin}
        user={{
          name: userName,
          email: user?.email ?? "",
          role: user?.role ?? session?.role ?? "EDITOR",
        }}
      />

      <div className="nav:pl-[248px]">
        {/* Barre top desktop (sticky) */}
        <div className="sticky top-0 z-20">
          <AdminTopBar userName={userName} userRole={userRole} />
        </div>

        <main className="min-h-screen px-5 py-7 nav:px-8 nav:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
