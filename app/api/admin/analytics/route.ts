import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { getAnalyticsData, AnalyticsTimeframe } from "@/lib/analytics";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifyAdminSessionToken(token);

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const daysParam = parseInt(searchParams.get("days") || "30", 10);
    const days: AnalyticsTimeframe = [7, 30, 90, 365].includes(daysParam)
      ? (daysParam as AnalyticsTimeframe)
      : 30;

    const data = await getAnalyticsData(days);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifyAdminSessionToken(token);

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { action } = await request.json().catch(() => ({ action: "seed" }));
    const { clearAnalyticsData, seedSampleAnalyticsData } = await import("@/lib/analytics");

    if (action === "clear") {
      await clearAnalyticsData();
      return NextResponse.json({ success: true, message: "Données analytics réinitialisées." });
    } else {
      await seedSampleAnalyticsData();
      return NextResponse.json({ success: true, message: "Données de test analytics générées avec succès." });
    }
  } catch (error) {
    console.error("Failed to reset analytics:", error);
    return NextResponse.json({ error: "Erreur lors de la réinitialisation." }, { status: 500 });
  }
}
