import { prisma } from "@/lib/prisma";

export type EventType =
  | "PAGE_VIEW"
  | "PRODUCT_VIEW"
  | "SEARCH"
  | "CATEGORY_VIEW"
  | "QUOTE_REQUEST"
  | "CONTACT_CLICK";

export type AnalyticsTimeframe = 7 | 30 | 90 | 365;

export async function recordAnalyticsEvent(data: {
  type: EventType | string;
  path: string;
  referrer?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
  metadata?: Record<string, any> | null;
}) {
  try {
    return await prisma.analyticsEvent.create({
      data: {
        type: data.type,
        path: data.path,
        referrer: data.referrer || null,
        userAgent: data.userAgent || null,
        ipAddress: data.ipAddress || null,
        metadata: data.metadata ? (data.metadata as any) : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to record analytics event:", error);
    return null;
  }
}

export async function getAnalyticsData(days: AnalyticsTimeframe = 30) {
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - days);

  const prevStartDate = new Date();
  prevStartDate.setDate(now.getDate() - days * 2);

  // Fetch current period events
  const events = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch previous period events for growth rate calculation
  const prevEvents = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: {
        gte: prevStartDate,
        lt: startDate,
      },
    },
    select: {
      id: true,
      type: true,
      ipAddress: true,
    },
  });

  // Key metrics
  const totalPageviews = events.length;
  const prevTotalPageviews = prevEvents.length;
  const pageviewGrowth = prevTotalPageviews > 0
    ? Math.round(((totalPageviews - prevTotalPageviews) / prevTotalPageviews) * 100 * 10) / 10
    : 100;

  // Unique visitors (by IP)
  const uniqueVisitors = new Set(events.map((e) => e.ipAddress || "anonymous")).size;
  const prevUniqueVisitors = new Set(prevEvents.map((e) => e.ipAddress || "anonymous")).size;
  const visitorGrowth = prevUniqueVisitors > 0
    ? Math.round(((uniqueVisitors - prevUniqueVisitors) / prevUniqueVisitors) * 100 * 10) / 10
    : 100;

  // Product consultations
  const productViews = events.filter((e) => e.type === "PRODUCT_VIEW").length;
  const prevProductViews = prevEvents.filter((e) => e.type === "PRODUCT_VIEW").length;
  const productViewGrowth = prevProductViews > 0
    ? Math.round(((productViews - prevProductViews) / prevProductViews) * 100 * 10) / 10
    : 100;

  // Demandes de devis / conversion
  const quoteRequests = events.filter((e) => e.type === "QUOTE_REQUEST").length;
  const prevQuoteRequests = prevEvents.filter((e) => e.type === "QUOTE_REQUEST").length;
  const quoteGrowth = prevQuoteRequests > 0
    ? Math.round(((quoteRequests - prevQuoteRequests) / prevQuoteRequests) * 100 * 10) / 10
    : 100;

  const conversionRate = totalPageviews > 0
    ? Math.round((quoteRequests / totalPageviews) * 100 * 10) / 10
    : 0;

  // Group events by Date for trend chart
  const datesMap: Record<string, { pageviews: number; visitors: Set<string>; quotes: number }> = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    datesMap[dateStr] = { pageviews: 0, visitors: new Set(), quotes: 0 };
  }

  events.forEach((e) => {
    const dateStr = e.createdAt.toISOString().split("T")[0];
    if (datesMap[dateStr]) {
      datesMap[dateStr].pageviews += 1;
      if (e.ipAddress) datesMap[dateStr].visitors.add(e.ipAddress);
      if (e.type === "QUOTE_REQUEST") datesMap[dateStr].quotes += 1;
    }
  });

  const trafficTrend = Object.entries(datesMap).map(([date, data]) => {
    const d = new Date(date);
    const formattedDate = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    return {
      date: formattedDate,
      rawDate: date,
      pageviews: data.pageviews,
      visitors: data.visitors.size,
      quotes: data.quotes,
    };
  });

  // Device Breakdown from metadata
  const deviceCounts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
  // Traffic Sources
  const sourceCounts: Record<string, number> = { Direct: 0, Recherche: 0, "Réseaux Sociaux": 0, Références: 0 };
  // Top Products Viewed
  const productViewCounts: Record<string, { name: string; count: number; category: string }> = {};
  // Top Search Terms
  const searchCounts: Record<string, number> = {};

  events.forEach((e) => {
    const meta = (e.metadata as Record<string, any>) || {};

    // Device
    const dev = meta.device || "Desktop";
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;

    // Source / Referrer
    const ref = e.referrer?.toLowerCase() || "";
    if (!ref || ref.includes("localhost") || ref.includes("pvs-agriculture") || ref.includes("127.0.0.1")) {
      sourceCounts.Direct += 1;
    } else if (ref.includes("google") || ref.includes("bing") || ref.includes("duckduckgo")) {
      sourceCounts.Recherche += 1;
    } else if (ref.includes("facebook") || ref.includes("instagram") || ref.includes("linkedin") || ref.includes("whatsapp") || ref.includes("t.co")) {
      sourceCounts["Réseaux Sociaux"] += 1;
    } else {
      sourceCounts.Références += 1;
    }

    // Top Products
    if (e.type === "PRODUCT_VIEW" && meta.productName) {
      const name = meta.productName;
      if (!productViewCounts[name]) {
        productViewCounts[name] = { name, count: 0, category: meta.categoryName || "Général" };
      }
      productViewCounts[name].count += 1;
    }

    // Top Searches
    if (e.type === "SEARCH" && meta.query) {
      const q = meta.query.trim().toLowerCase();
      if (q) searchCounts[q] = (searchCounts[q] || 0) + 1;
    }
  });

  const topProducts = Object.values(productViewCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const topSearches = Object.entries(searchCounts)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Recent Live Activity stream (last 10 events)
  const recentEvents = events.slice(0, 10).map((e) => {
    const meta = (e.metadata as Record<string, any>) || {};
    return {
      id: e.id,
      type: e.type,
      path: e.path,
      device: meta.device || "Desktop",
      detail: meta.productName ? `Produit : ${meta.productName}` : meta.query ? `Recherche : "${meta.query}"` : e.path,
      timeAgo: formatTimeAgo(e.createdAt),
      createdAt: e.createdAt.toISOString(),
    };
  });

  return {
    timeframe: days,
    kpis: {
      totalPageviews: { value: totalPageviews, growth: pageviewGrowth },
      uniqueVisitors: { value: uniqueVisitors, growth: visitorGrowth },
      productViews: { value: productViews, growth: productViewGrowth },
      quoteRequests: { value: quoteRequests, growth: quoteGrowth, conversionRate },
    },
    trafficTrend,
    devices: deviceCounts,
    sources: sourceCounts,
    topProducts,
    topSearches,
    recentEvents,
  };
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSec < 60) return "À l'instant";
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `Il y a ${diffInMin} min`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours} h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `Il y a ${diffInDays} j`;
}
