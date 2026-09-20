import "dotenv/config";
import { defineConfig } from "prisma/config";

import { ensureDatabaseUrl } from "./lib/db-config";

// La CLI Prisma (`migrate`, `db pull`, `db push`, etc.) lit aussi
// `DATABASE_URL`. On la construit depuis DB_* si besoin, AVANT que
// Prisma ne charge sa config.
ensureDatabaseUrl();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
