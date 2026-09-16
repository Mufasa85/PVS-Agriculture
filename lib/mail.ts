import nodemailer from "nodemailer";

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

/**
 * Envoi d'email multi-provider.
 * - EMAIL_PROVIDER=resend → API HTTP Resend (clé EMAIL_API_KEY)
 * - EMAIL_PROVIDER=brevo  → API HTTP Brevo (clé EMAIL_API_KEY)
 * - sinon                 → SMTP via nodemailer (SMTP_HOST/PORT/USER/PASS)
 * Renvoie false si la configuration est incomplète ou l'envoi échoue.
 */
export async function sendMail(options: MailOptions): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER;
  const from = process.env.EMAIL_FROM ?? process.env.CONTACT_FROM_EMAIL;

  if (!from) {
    console.error("[mail] EMAIL_FROM / CONTACT_FROM_EMAIL manquant.");
    return false;
  }

  try {
    if (provider === "resend") return await sendViaResend(from, options);
    if (provider === "brevo") return await sendViaBrevo(from, options);
    return await sendViaSmtp(from, options);
  } catch (error) {
    console.error("[mail] Erreur d'envoi:", error);
    return false;
  }
}

async function sendViaResend(from: string, options: MailOptions) {
  const apiKey = process.env.EMAIL_API_KEY;
  if (!apiKey) {
    console.error("[mail] EMAIL_API_KEY manquant (provider=resend).");
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `PVS ONGD <${from}>`,
      to: [options.to],
      reply_to: options.replyTo,
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!res.ok) {
    console.error("[mail] Resend:", res.status, await res.text());
  }
  return res.ok;
}

async function sendViaBrevo(from: string, options: MailOptions) {
  const apiKey = process.env.EMAIL_API_KEY;
  if (!apiKey) {
    console.error("[mail] EMAIL_API_KEY manquant (provider=brevo).");
    return false;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: from, name: "PVS ONGD" },
      to: [{ email: options.to }],
      ...(options.replyTo ? { replyTo: { email: options.replyTo } } : {}),
      subject: options.subject,
      htmlContent: options.html,
    }),
  });

  if (!res.ok) {
    console.error("[mail] Brevo:", res.status, await res.text());
  }
  return res.ok;
}

async function sendViaSmtp(from: string, options: MailOptions) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.error("[mail] Variables SMTP manquantes (SMTP_HOST/USER/PASS).");
    return false;
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"PVS ONGD" <${from}>`,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
  });
  return true;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildOtpEmailHtml(code: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a2b5f; border-bottom: 2px solid #d4a73e; padding-bottom: 12px;">
        Réinitialisation du mot de passe — PVS ONGD
      </h2>
      <p style="color: #333; line-height: 1.6;">
        Voici votre code de vérification, valable <strong>10 minutes</strong> :
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1a2b5f; background: #f5f6fa; padding: 14px 28px; border-radius: 10px;">
          ${escapeHtml(code)}
        </span>
      </div>
      <p style="color: #888; font-size: 12px;">
        Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
        Le code ne peut être utilisé qu'une seule fois.
      </p>
    </div>
  `;
}
