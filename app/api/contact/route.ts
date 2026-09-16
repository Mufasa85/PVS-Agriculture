import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { escapeHtml, sendMail } from "@/lib/mail";
import { getClientIp } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// 5 messages / IP / 10 minutes — l'endpoint envoie des emails,
// il ne doit pas servir de relais de spam.
const CONTACT_RATE_LIMIT = 5;
const CONTACT_WINDOW_MS = 10 * 60 * 1000;

type ContactPayload = {
  nom?: string;
  telephone?: string;
  email?: string;
  sujet?: string;
  message?: string;
  website?: string;
};

function buildEmailHtml(data: {
  nom: string;
  telephone: string;
  email: string;
  sujet: string;
  message: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a2b5f; border-bottom: 2px solid #d4a73e; padding-bottom: 12px;">
        Nouvelle demande de contact — PVS ONGD
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #1a2b5f; width: 120px;">Nom complet</td>
          <td style="padding: 8px 0;">${escapeHtml(data.nom)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #1a2b5f;">Téléphone</td>
          <td style="padding: 8px 0;">${escapeHtml(data.telephone)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #1a2b5f;">Email</td>
          <td style="padding: 8px 0;">${escapeHtml(data.email)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #1a2b5f;">Sujet</td>
          <td style="padding: 8px 0;">${escapeHtml(data.sujet)}</td>
        </tr>
      </table>
      <h3 style="color: #1a2b5f; margin-top: 24px;">Message</h3>
      <p style="white-space: pre-wrap; background: #f5f6fa; padding: 16px; border-radius: 8px; line-height: 1.6;">
        ${escapeHtml(data.message)}
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin-top: 24px;" />
      <p style="color: #888; font-size: 12px;">
        Cet email a été envoyé depuis le formulaire de contact du site PVS ONGD.
      </p>
    </div>
  `;
}

export async function POST(request: Request) {
  const ip = getClientIp(request) ?? "unknown";
  const { success, retryAfter } = rateLimit(
    `contact:${ip}`,
    CONTACT_RATE_LIMIT,
    CONTACT_WINDOW_MS,
  );
  if (!success) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Format de requête invalide." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Tous les champs obligatoires doivent être remplis et valides.",
      },
      { status: 422 },
    );
  }

  const { nom, telephone, email, sujet, message, website } = parsed.data;

  // Honeypot : le champ invisible "website" n'est rempli que par les bots.
  // On répond succès pour ne pas leur signaler le filtrage.
  if (website && website.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!toEmail) {
    console.error("[contact] CONTACT_TO_EMAIL manquant.");
    return NextResponse.json(
      { error: "Configuration email manquante côté serveur." },
      { status: 500 },
    );
  }

  try {
    const sent = await sendMail({
      to: toEmail,
      replyTo: email,
      subject: `[Contact] ${sujet ?? "Demande d'information"}`,
      html: buildEmailHtml({
        nom,
        telephone,
        email,
        sujet: sujet ?? "Non précisé",
        message,
      }),
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Une erreur est survenue lors de l'envoi de l'email." },
        { status: 500 },
      );
    }

    await prisma.contactMessage.create({
      data: {
        nom: nom.trim(),
        telephone: telephone.trim(),
        email: email.trim(),
        sujet: sujet?.trim() || null,
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Erreur d'envoi email:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de l'email." },
      { status: 500 },
    );
  }
}
