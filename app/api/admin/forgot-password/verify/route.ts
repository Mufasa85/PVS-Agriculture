import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/auth";
import { getClientIp } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { firstIssueMessage, resetVerifySchema } from "@/lib/validation";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;

export const POST = withApiError(async (request: Request) => {
  const ip = getClientIp(request) ?? "unknown";
  const { success, retryAfter } = rateLimit(
    `forgot-verify:${ip}`,
    10,
    15 * 60 * 1000,
  );
  if (!success) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = resetVerifySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const code = parsed.data.code;

  const invalidResponse = () =>
    NextResponse.json({ error: "Code invalide ou expiré." }, { status: 401 });

  const token = await prisma.passwordResetToken.findFirst({
    where: { email, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (
    !token ||
    token.expiresAt < new Date() ||
    token.attempts >= MAX_ATTEMPTS
  ) {
    return invalidResponse();
  }

  const matches = await bcrypt.compare(code, token.codeHash);

  if (!matches) {
    await prisma.passwordResetToken.update({
      where: { id: token.id },
      data: { attempts: { increment: 1 } },
    });
    return invalidResponse();
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return invalidResponse();
  }

  // Code consommé — usage unique.
  await prisma.passwordResetToken.update({
    where: { id: token.id },
    data: { usedAt: new Date() },
  });

  const resetToken = await createPasswordResetToken(user.id, email);
  return NextResponse.json({ resetToken });
});
