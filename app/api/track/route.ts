import geoip from "geoip-lite";
import { NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, path, referrer, metadata } = body;

    if (!path) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const forwardHeader = request.headers.get("x-forwarded-for");
    const ipAddress = forwardHeader
      ? forwardHeader.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "127.0.0.1";

    // Detect device basic type from userAgent
    const ua = (userAgent || "").toLowerCase();
    let device = "Desktop";
    if (ua.includes("mobile") || ua.includes("iphone") || ua.includes("android")) {
      device = "Mobile";
    } else if (ua.includes("ipad") || ua.includes("tablet")) {
      device = "Tablet";
    }

    // Geolocate IP to country
    const geo = geoip.lookup(ipAddress);
    const country = geo?.country || null;

    const mergedMetadata = {
      ...(metadata || {}),
      device,
      ...(country ? { country } : {}),
    };

    const event = await recordAnalyticsEvent({
      type: type || "PAGE_VIEW",
      path,
      referrer: referrer || request.headers.get("referer") || undefined,
      userAgent,
      ipAddress,
      metadata: mergedMetadata,
    });

    return NextResponse.json({ success: true, eventId: event?.id });
  } catch (error) {
    console.error("Tracking endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
