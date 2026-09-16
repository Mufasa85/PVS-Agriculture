import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { withApiError } from "@/lib/api";

export const runtime = "nodejs";

export const POST = withApiError(async () => {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
});
