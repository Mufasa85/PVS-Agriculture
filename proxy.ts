import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";

// Note : `export const runtime` est interdit dans un fichier `proxy.ts`.
// Le proxy s'exécute toujours sur le runtime Node.js par défaut sous
// Next.js 16, donc cette déclaration déclenche une erreur de build.

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  return [
    "default-src 'self'",
    // 'strict-dynamic' : les scripts chargés par un script nonce sont fiables.
    // unsafe-eval requis en dev (Webpack HMR).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Tailwind produit du CSS compilé, mais framer-motion et les libs de
    // charts injectent des styles inline.
    "style-src 'self' 'unsafe-inline'",
    // Images : locales + data: (QR code 2FA, placeholders) + CDN externes.
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const next = () => {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("Content-Security-Policy", csp);
    return response;
  };

  const isLoginPage =
    pathname === "/admin/login" || pathname === "/admin/forgot-password";
  // /api/admin/login/* (dont /2fa) et /api/admin/forgot-password/* sont
  // publics : ils émettent la session après vérification du code.
  const isLoginApi =
    pathname === "/api/admin/login" || pathname.startsWith("/api/admin/login/");
  const isForgotApi = pathname.startsWith("/api/admin/forgot-password");
  const isProtectedPage = pathname.startsWith("/admin") && !isLoginPage;
  const isProtectedApi =
    pathname.startsWith("/api/admin") && !isLoginApi && !isForgotApi;

  if (!isProtectedPage && !isProtectedApi) {
    return next();
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
      return NextResponse.json(
        { error: "Accès réservé aux super administrateurs." },
        { status: 403 },
      );
    }
    const adminHomeUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminHomeUrl);
  }

  return next();
}

export const config = {
  matcher: [
    {
      // Toutes les pages sauf assets statiques — la CSP doit couvrir tout
      // le site, pas seulement l'admin.
      source:
        "/((?!_next/static|_next/image|favicon.ico|uploads|files|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff2?)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
