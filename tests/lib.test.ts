import { describe, expect, it } from "vitest";

import { formatProductPrice, slugify } from "@/lib/products";
import { rateLimit } from "@/lib/rate-limit";
import { detectImageMime } from "@/lib/uploads";
import { productInputSchema, userCreateSchema } from "@/lib/validation";

describe("slugify", () => {
  it("normalise les accents et la casse", () => {
    expect(slugify("Œufs (plateau)")).toBe("oeufs-plateau");
    expect(slugify("Élevage Caprins")).toBe("elevage-caprins");
  });

  it("nettoie les caractères spéciaux", () => {
    expect(slugify("  Poulet — Poids 12! ")).toBe("poulet-poids-12");
    expect(slugify("---")).toBe("");
  });
});

describe("formatProductPrice", () => {
  it("retourne « Bientôt disponible » pour comingSoon ou prix nul", () => {
    expect(
      formatProductPrice({
        comingSoon: true,
        priceAmount: 100,
        currency: "FC",
      }),
    ).toBe("Bientôt disponible");
    expect(
      formatProductPrice({
        comingSoon: false,
        priceAmount: null,
        currency: "FC",
      }),
    ).toBe("Bientôt disponible");
  });

  it("formate le montant selon la devise", () => {
    expect(
      formatProductPrice({
        comingSoon: false,
        priceAmount: 13000,
        currency: "FC",
      }),
    ).toMatch(/13[\s  ]*000 FC/);
    expect(
      formatProductPrice({
        comingSoon: false,
        priceAmount: 8,
        currency: "USD",
      }),
    ).toBe("8 $");
  });
});

describe("rateLimit", () => {
  it("bloque après N tentatives dans la fenêtre", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).success).toBe(true);
    }
    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.success).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("les clés sont indépendantes", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).success).toBe(false);
    expect(rateLimit(b, 1, 60_000).success).toBe(true);
  });
});

describe("detectImageMime", () => {
  it("reconnaît les signatures d'images", () => {
    const png = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0,
    ]);
    expect(detectImageMime(png)).toBe("image/png");

    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...new Array(8).fill(0)]);
    expect(detectImageMime(jpeg)).toBe("image/jpeg");
  });

  it("rejette les non-images", () => {
    expect(detectImageMime(Buffer.from("<html></html>"))).toBeNull();
    expect(detectImageMime(Buffer.from([0x00]))).toBeNull();
  });
});

describe("productInputSchema", () => {
  const valid = {
    name: "Tilapia",
    description: "Poisson d'étang",
    category: "poissons",
    priceAmount: 8,
    currency: "USD",
    imageSrc: "/uploads/products/x.jpg",
    imageAlt: "Tilapia",
  };

  it("accepte un produit valide", () => {
    expect(productInputSchema.safeParse(valid).success).toBe(true);
  });

  it("exige un prix sauf si comingSoon", () => {
    const noPrice = { ...valid, priceAmount: undefined };
    expect(productInputSchema.safeParse(noPrice).success).toBe(false);
    expect(
      productInputSchema.safeParse({ ...noPrice, comingSoon: true }).success,
    ).toBe(true);
  });
});

describe("userCreateSchema", () => {
  it("exige un mot de passe d'au moins 12 caractères", () => {
    const base = { name: "Admin", email: "a@b.cd", role: "ADMIN" };
    expect(
      userCreateSchema.safeParse({ ...base, password: "court" }).success,
    ).toBe(false);
    expect(
      userCreateSchema.safeParse({ ...base, password: "mot-de-passe-long" })
        .success,
    ).toBe(true);
  });

  it("rejette un email invalide", () => {
    expect(
      userCreateSchema.safeParse({
        name: "Admin",
        email: "pas-un-email",
        password: "mot-de-passe-long",
        role: "EDITOR",
      }).success,
    ).toBe(false);
  });
});
