import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  nom?: string;
  telephone?: string;
  email?: string;
  sujet?: string;
  message?: string;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml(data: Required<ContactPayload>): string {
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
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Format de requête invalide." },
      { status: 400 },
    );
  }

  const { nom, telephone, email, sujet, message } = body;

  if (!nom || !telephone || !email || !message) {
    return NextResponse.json(
      { error: "Tous les champs obligatoires doivent être remplis." },
      { status: 422 },
    );
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass || !toEmail || !fromEmail) {
    console.error("[contact] Variables d'environnement SMTP manquantes.");
    return NextResponse.json(
      { error: "Configuration email manquante côté serveur." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort) || 587,
    secure: (Number(smtpPort) || 587) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await transporter.sendMail({
      from: `"Formulaire PVS ONGD" <${fromEmail}>`,
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Erreur d'envoi email:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de l'email." },
      { status: 500 },
    );
  }
}
