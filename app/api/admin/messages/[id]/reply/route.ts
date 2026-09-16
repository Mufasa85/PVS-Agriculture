import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { escapeHtml, sendMail } from "@/lib/mail";
import { getSessionFromRequest } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";

export const runtime = "nodejs";

const replySchema = z.object({
  message: z.string().trim().min(1).max(10000),
});

type RouteParams = { params: Promise<{ id: string }> };

export const POST = withApiError(
  async (request: Request, { params }: RouteParams) => {
    const { id } = await params;
    const messageId = Number(id);

    const contact = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });
    if (!contact) {
      return NextResponse.json(
        { error: "Message introuvable." },
        { status: 404 },
      );
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    const parsed = replySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Le message de réponse est requis." },
        { status: 422 },
      );
    }

    const reply = parsed.data.message;
    const sent = await sendMail({
      to: contact.email,
      subject: `Re: ${contact.sujet ?? "Votre demande"} — PVS ONGD`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <p style="color: #333; line-height: 1.7; white-space: pre-line;">${escapeHtml(reply)}</p>
          <hr style="border: none; border-top: 1px solid #e4e6f0; margin: 24px 0;" />
          <p style="color: #888; font-size: 12px;">
            PVS ONGD ASBL — Agriculture &amp; Élevage<br />
            En réponse à votre message : « ${escapeHtml(contact.sujet ?? "Demande de contact")} »
          </p>
        </div>
      `,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "L'envoi a échoué. Vérifiez la configuration email." },
        { status: 502 },
      );
    }

    // Marque le message comme lu : on lui a répondu.
    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    const session = await getSessionFromRequest(request);
    await logAudit({
      userId: session?.userId ?? null,
      action: "MESSAGE_REPLY",
      entityType: "ContactMessage",
      entityId: messageId,
      metadata: { to: contact.email },
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ success: true });
  },
);
