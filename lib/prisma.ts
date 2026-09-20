import { PrismaClient } from "@prisma/client";

import { ensureDatabaseUrl } from "@/lib/db-config";

// On construit/injecte `DATABASE_URL` depuis les variables DB_*
// AVANT d'instancier PrismaClient. Si `DATABASE_URL` est déjà définie
// (dev local avec docker-compose, CI, etc.), elle est conservée telle
// quelle.
ensureDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
