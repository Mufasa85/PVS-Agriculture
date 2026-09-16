import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getFreshAdminSession } from "@/lib/auth";
import { withApiError } from "@/lib/api";
import { generateTotpSecret, totpQrCodeDataUrl } from "@/lib/totp";

export const runtime = "nodejs";

// Génère un secret TOTP + QR code. Le secret est stocké mais la 2FA n'est
// activée qu'après vérification d'un code (route /enable).
export const POST = withApiError(async (request: Request) => {
  const session = await getFreshAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true, twoFactorEnabled: true },
  });
  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable." },
      { status: 404 },
    );
  }
  if (user.twoFactorEnabled) {
    return NextResponse.json(
      { error: "La double authentification est déjà activée." },
      { status: 409 },
    );
  }

  const secret = generateTotpSecret();

  await prisma.user.update({
    where: { id: session.userId },
    data: { twoFactorSecret: secret },
  });

  const qrCode = await totpQrCodeDataUrl(user.email, secret);

  return NextResponse.json({ qrCode, secret });
});
