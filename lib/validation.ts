import { z } from "zod";

export const currencySchema = z.enum(["FC", "USD"]);
export const userRoleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

export const productInputSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis."),
    slug: z.string().nullable().optional(),
    description: z.string().min(1, "La description est requise."),
    category: z.string().min(1, "Catégorie invalide."),
    priceAmount: z.number().nullable().optional(),
    currency: currencySchema.default("FC"),
    unit: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    badge: z.string().nullable().optional(),
    imageSrc: z.string().min(1, "L'URL de l'image est requise."),
    imageAlt: z.string().min(1, "Le texte alternatif de l'image est requis."),
    images: z
      .array(z.object({ url: z.string(), alt: z.string().optional() }))
      .default([]),
    comingSoon: z.boolean().default(false),
    onDemand: z.boolean().default(false),
    isPublished: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
  })
  .check((ctx) => {
    const data = ctx.value;
    if (
      !data.comingSoon &&
      (data.priceAmount === null || data.priceAmount === undefined)
    ) {
      ctx.issues.push({
        code: "custom",
        message:
          "Le prix est requis sauf si le produit est marqué « à venir ».",
        path: ["priceAmount"],
        input: data.priceAmount,
      });
    }
  });

export type ProductInput = z.infer<typeof productInputSchema>;

export const categoryInputSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  slug: z.string().nullable().optional(),
  icon: z.string().min(1, "L'icône est requise."),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;

const PASSWORD_MIN = 12;
const PASSWORD_MESSAGE = `Le mot de passe doit contenir au moins ${PASSWORD_MIN} caractères.`;

export const userCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  email: z.email("Format d'email invalide."),
  password: z.string().min(PASSWORD_MIN, PASSWORD_MESSAGE),
  role: userRoleSchema,
});

export const userUpdateSchema = userCreateSchema.extend({
  password: z
    .string()
    .min(PASSWORD_MIN, PASSWORD_MESSAGE)
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const messagePatchSchema = z.object({
  id: z.number().int().positive(),
  isRead: z.boolean().optional(),
  isStarred: z.boolean().optional(),
});

export const reorderSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});

// ── Profil & sécurité du compte ──

export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis."),
    password: z.string().min(PASSWORD_MIN, PASSWORD_MESSAGE),
    confirm: z.string(),
  })
  .check((ctx) => {
    if (ctx.value.password !== ctx.value.confirm) {
      ctx.issues.push({
        code: "custom",
        message: "Les deux mots de passe ne correspondent pas.",
        path: ["confirm"],
        input: ctx.value.confirm,
      });
    }
  });

const otpCodeSchema = z
  .string()
  .regex(/^\d{6}$/, "Le code doit contenir 6 chiffres.");

export const totpVerifySchema = z.object({ code: otpCodeSchema });

export const login2faSchema = z.object({
  pendingToken: z.string().min(1),
  code: otpCodeSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.email("Format d'email invalide."),
});

export const resetVerifySchema = z.object({
  email: z.email("Format d'email invalide."),
  code: otpCodeSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(PASSWORD_MIN, PASSWORD_MESSAGE),
    confirm: z.string(),
  })
  .check((ctx) => {
    if (ctx.value.password !== ctx.value.confirm) {
      ctx.issues.push({
        code: "custom",
        message: "Les deux mots de passe ne correspondent pas.",
        path: ["confirm"],
        input: ctx.value.confirm,
      });
    }
  });

export const contactSchema = z.object({
  nom: z.string().min(1).max(200),
  telephone: z.string().min(1).max(50),
  email: z.email().max(320),
  sujet: z.string().max(300).optional(),
  message: z.string().min(1).max(10000),
  // Honeypot anti-bot : champ invisible rempli uniquement par les bots.
  website: z.string().max(100).optional(),
});

export const trackEventSchema = z.object({
  type: z.enum([
    "PAGE_VIEW",
    "PRODUCT_VIEW",
    "SEARCH",
    "CATEGORY_VIEW",
    "QUOTE_REQUEST",
    "CONTACT_CLICK",
  ]),
  path: z.string().min(1).max(500),
  referrer: z.string().max(1000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Données invalides.";
}
