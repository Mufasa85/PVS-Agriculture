import geoip from "geoip-lite";
import { NextResponse } from "next/server";
import { anonymizeIp, recordAnalyticsEvent } from "@/lib/analytics";
import { rateLimit } from "@/lib/rate-limit";
import { trackEventSchema } from "@/lib/validation";

export const runtime = "nodejs";

// 120 événements / IP / minute — une page peut déclencher plusieurs
// événements (pageview + vue produit + recherche), mais pas des centaines.
const TRACK_RATE_LIMIT = 120;
const TRACK_WINDOW_MS = 60 * 1000;

// Taille max du payload metadata sérialisé (anti stockage abusif)
const METADATA_MAX_BYTES = 2048;

export async function POST(request: Request) {
  try {
    const forwardHeader = request.headers.get("x-forwarded-for");
    const realIp = forwardHeader
      ? forwardHeader.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "127.0.0.1";

    const { success, retryAfter } = rateLimit(
      `track:${realIp}`,
      TRACK_RATE_LIMIT,
      TRACK_WINDOW_MS,
    );
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = trackEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 422 });
    }

    const { type, path, referrer, metadata } = parsed.data;

    if (metadata && JSON.stringify(metadata).length > METADATA_MAX_BYTES) {
      return NextResponse.json(
        { error: "Metadata too large" },
        { status: 413 },
      );
    }

    const userAgent = request.headers.get("user-agent") || undefined;

    // Detect device basic type from userAgent
    const ua = (userAgent || "").toLowerCase();
    let device = "Desktop";
    if (
      ua.includes("mobile") ||
      ua.includes("iphone") ||
      ua.includes("android")
    ) {
      device = "Mobile";
    } else if (ua.includes("ipad") || ua.includes("tablet")) {
      device = "Tablet";
    }

    // Géolocalisation sur l'IP réelle, puis anonymisation avant stockage.
    const geo = geoip.lookup(realIp);
    const country = geo?.country || null;
    const ipAddress = anonymizeIp(realIp);

    const mergedMetadata = {
      ...(metadata || {}),
      device,
      ...(country ? { country } : {}),
    };

    const event = await recordAnalyticsEvent({
      type,
      path,
      referrer: referrer || request.headers.get("referer") || undefined,
      userAgent,
      ipAddress,
      metadata: mergedMetadata,
    });

    return NextResponse.json({ success: true, eventId: event?.id });
  } catch (error) {
    console.error("Tracking endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
