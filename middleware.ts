import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isProtectedPage = pathname.startsWith("/admin") && !isLoginPage;
  const isProtectedApi = pathname.startsWith("/api/admin") && !isLoginApi;

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isUsersPage = pathname.startsWith("/admin/users");
  const isUsersApi = pathname.startsWith("/api/admin/users");

  if ((isUsersPage || isUsersApi) && session.role !== "SUPER_ADMIN") {
    if (isUsersApi) {
      return NextResponse.json({ error: "Accès réservé aux super administrateurs." }, { status: 403 });
    }
    const adminHomeUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminHomeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
