import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { firstIssueMessage, forgotPasswordSchema } from "@/lib/validation";
import { buildOtpEmailHtml, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const GENERIC_SUCCESS = {
  message:
    "Si un compte existe pour cet email, un code de vérification a été envoyé.",
};

export const POST = withApiError(async (request: Request) => {
  const ip = getClientIp(request) ?? "unknown";
  const { success, retryAfter } = rateLimit(
    `forgot-password:${ip}`,
    5,
    15 * 60 * 1000,
  );
  if (!success) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Réponse identique que le compte existe ou non — ne pas révéler
  // quels emails sont enregistrés.
  if (!user || !user.isActive) {
    return NextResponse.json(GENERIC_SUCCESS);
  }

  const code = String(randomInt(100000, 999999));

  // Invalide les codes précédents, puis crée le nouveau.
  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { email } }),
    prisma.passwordResetToken.create({
      data: {
        email,
        codeHash: await bcrypt.hash(code, 10),
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
      },
    }),
  ]);

  const sent = await sendMail({
    to: email,
    subject: "Code de vérification — Réinitialisation du mot de passe",
    html: buildOtpEmailHtml(code),
  });

  if (!sent) {
    return NextResponse.json(
      { error: "Impossible d'envoyer l'email. Réessayez plus tard." },
      { status: 500 },
    );
  }

  return NextResponse.json(GENERIC_SUCCESS);
});
