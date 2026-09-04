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
    throw new Error("AUTH_SECRET n'est pas défini dans les variables d'environnement.");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<{ id: number; email: string; name: string; role: UserRole } | null> {
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

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function createAdminSessionToken(user: {
  id: number;
  email: string;
  role: UserRole;
}): Promise<string> {
  return new SignJWT({ sub: String(user.id), email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
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
