import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // PrismaClient est instancié à l'import de lib/prisma — il faut juste
    // que la variable existe, aucune connexion n'est faite par les tests.
    env: {
      DATABASE_URL: "mysql://root@localhost:3306/pvs_ongd",
    },
  },
});
