import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const ADMIN_SESSION_COOKIE = "pvs_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 heures

export type AdminSession = {
  userId: number;
  email: string;
  role: UserRole;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET n'est pas défini dans les variables d'environnement.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<{
  id: number;
  email: string;
  name: string;
  role: UserRole;
  twoFactorEnabled: boolean;
} | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user || !user.isActive) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    twoFactorEnabled: user.twoFactorEnabled,
  };
}

export async function createAdminSessionToken(user: {
  id: number;
  email: string;
  role: UserRole;
}): Promise<string> {
  return new SignJWT({
    sub: String(user.id),
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function getSessionFromRequest(
  request: Request,
): Promise<AdminSession | null> {
  const token = request.headers
    .get("cookie")
    ?.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))?.[1];
  return verifyAdminSessionToken(token);
}

/**
 * Variante qui re-vérifie l'utilisateur en base : un compte désactivé ou
 * rétrogradé perd immédiatement l'accès, même si son JWT est encore valide.
 * À utiliser sur les routes sensibles (gestion des utilisateurs, etc.).
 */
export async function getFreshAdminSession(
  request: Request,
): Promise<AdminSession | null> {
  const session = await getSessionFromRequest(request);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { isActive: true, role: true },
  });

  if (!user || !user.isActive) return null;
  return { ...session, role: user.role };
}

/**
 * Token intermédiaire « en attente de 2FA » — prouve que le mot de passe
 * est bon mais n'ouvre pas de session. Valide 5 minutes.
 */
export async function createPending2faToken(userId: number): Promise<string> {
  return new SignJWT({ purpose: "2fa-pending" })
    .setSubject(String(userId))
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getSecretKey());
}

export async function verifyPending2faToken(
  token: string | undefined,
): Promise<number | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.purpose !== "2fa-pending" || typeof payload.sub !== "string") {
      return null;
    }
    return Number(payload.sub);
  } catch {
    return null;
  }
}

/**
 * Token « reset » émis après vérification du code OTP — autorise à définir
 * un nouveau mot de passe. Valide 10 minutes.
 */
export async function createPasswordResetToken(
  userId: number,
  email: string,
): Promise<string> {
  return new SignJWT({ purpose: "password-reset", email })
    .setSubject(String(userId))
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(getSecretKey());
}

export async function verifyPasswordResetToken(
  token: string | undefined,
): Promise<{ userId: number; email: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      payload.purpose !== "password-reset" ||
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return { userId: Number(payload.sub), email: payload.email };
  } catch {
    return null;
  }
}

export async function verifyAdminSessionToken(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }
    return {
      userId: Number(payload.sub),
      email: payload.email,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
