import geoip from "geoip-lite";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import { prisma } from "@/lib/prisma";

countries.registerLocale(frLocale);

// Build reverse lookup: alpha-2 → numeric code
const alpha2ToNumeric: Record<string, string> = {};
for (const [numeric, alpha2] of Object.entries(countries.getNumericCodes())) {
  alpha2ToNumeric[alpha2 as string] = numeric;
}

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
  // Visitors by Country (ISO-2 code)
  const countryCounts: Record<string, number> = {};

  events.forEach((e) => {
    const meta = (e.metadata as Record<string, any>) || {};

    // Device
    const dev = meta.device || "Desktop";
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;

    // Source / Referrer & UTM parameters
    const ref = e.referrer?.toLowerCase() || "";
    const pathLower = e.path?.toLowerCase() || "";
    const utmSource = meta.utm_source?.toLowerCase() || "";

    if (
      utmSource.includes("google") ||
      utmSource.includes("bing") ||
      utmSource.includes("seo") ||
      utmSource.includes("search") ||
      ref.includes("google") ||
      ref.includes("bing") ||
      ref.includes("duckduckgo") ||
      ref.includes("yahoo") ||
      ref.includes("qwant") ||
      ref.includes("ecosia")
    ) {
      sourceCounts.Recherche += 1;
    } else if (
      utmSource.includes("facebook") ||
      utmSource.includes("instagram") ||
      utmSource.includes("linkedin") ||
      utmSource.includes("whatsapp") ||
      utmSource.includes("twitter") ||
      utmSource.includes("tiktok") ||
      utmSource.includes("youtube") ||
      utmSource.includes("social") ||
      ref.includes("facebook") ||
      ref.includes("instagram") ||
      ref.includes("linkedin") ||
      ref.includes("whatsapp") ||
      ref.includes("t.co") ||
      ref.includes("twitter") ||
      ref.includes("x.com") ||
      ref.includes("tiktok") ||
      ref.includes("youtube")
    ) {
      sourceCounts["Réseaux Sociaux"] += 1;
    } else if (!ref || ref.includes("localhost") || ref.includes("pvs-agriculture") || ref.includes("127.0.0.1")) {
      sourceCounts.Direct += 1;
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

    // Country (from metadata or IP lookup)
    let country = meta.country as string | undefined;
    if (!country && e.ipAddress && e.ipAddress !== "127.0.0.1") {
      const geo = geoip.lookup(e.ipAddress);
      country = geo?.country || undefined;
    }
    if (country) {
      const numeric = alpha2ToNumeric[country] || country;
      countryCounts[numeric] = (countryCounts[numeric] || 0) + 1;
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
    visitorsByCountry: countryCounts,
  };
}

export async function clearAnalyticsData() {
  try {
    await prisma.analyticsEvent.deleteMany({});
    return true;
  } catch (error) {
    console.error("Failed to clear analytics data:", error);
    return false;
  }
}

export async function seedSampleAnalyticsData() {
  try {
    await clearAnalyticsData();

    const PATHS = ["/", "/produits", "/tarifs", "/contact", "/a-propos", "/agriculture", "/elevage"];
    const SEARCH_QUERIES = [
      "maïs bio",
      "poulet de chair",
      "œufs frais",
      "tournesol",
      "haricots verts",
      "soja premium",
      "poussins d'un jour",
    ];
    const PRODUCTS = [
      { name: "Maïs Jaune Égrené", category: "Agriculture & Céréales" },
      { name: "Poulets de Chair Vivants", category: "Élevage & Volailles" },
      { name: "Œufs Frais de Ferme (Plateau x30)", category: "Élevage & Volailles" },
      { name: "Haricots Rouges Bio", category: "Agriculture & Céréales" },
      { name: "Poussins d'Un Jour Vaccinés", category: "Élevage & Volailles" },
      { name: "Graines de Tournesol", category: "Agriculture & Céréales" },
    ];
    const DEVICES = ["Desktop", "Desktop", "Desktop", "Mobile", "Mobile", "Mobile", "Mobile", "Tablet"];
    const SOURCES = [
      "",
      "https://www.google.com/",
      "https://www.google.com/",
      "https://www.facebook.com/",
      "https://www.linkedin.com/",
      "https://l.instagram.com/",
      "https://bing.com/",
    ];
    const IPS = Array.from({ length: 45 }, (_, i) => `197.234.${Math.floor(i / 5) + 1}.${(i % 10) * 23 + 12}`);

    const events = [];
    const now = new Date();

    for (let i = 59; i >= 0; i--) {
      const dayDate = new Date();
      dayDate.setDate(now.getDate() - i);
      const baseTraffic = i < 30 ? Math.floor(Math.random() * 35) + 40 : Math.floor(Math.random() * 25) + 25;

      for (let j = 0; j < baseTraffic; j++) {
        const hour = Math.floor(Math.random() * 15) + 7;
        const min = Math.floor(Math.random() * 60);
        const eventTime = new Date(dayDate);
        eventTime.setHours(hour, min, Math.floor(Math.random() * 60));

        const path = PATHS[Math.floor(Math.random() * PATHS.length)];
        const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
        const referrer = SOURCES[Math.floor(Math.random() * SOURCES.length)];
        const ipAddress = IPS[Math.floor(Math.random() * IPS.length)];

        const randType = Math.random();
        let type = "PAGE_VIEW";
        let metadata: any = { device };

        if (randType > 0.85) {
          type = "QUOTE_REQUEST";
          const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
          metadata = { ...metadata, productName: prod.name, categoryName: prod.category };
        } else if (randType > 0.55) {
          type = "PRODUCT_VIEW";
          const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
          metadata = { ...metadata, productName: prod.name, categoryName: prod.category };
        } else if (randType > 0.40) {
          type = "SEARCH";
          const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)];
          metadata = { ...metadata, query };
        }

        events.push({
          type,
          path: type === "PRODUCT_VIEW" ? `/produits/${slugify(metadata.productName || "")}` : path,
          referrer: referrer || null,
          userAgent: `Mozilla/5.0 (${device}; CPU OS like Mac OS X)`,
          ipAddress,
          metadata,
          createdAt: eventTime,
        });
      }
    }

    const batchSize = 100;
    for (let b = 0; b < events.length; b += batchSize) {
      const batch = events.slice(b, b + batchSize);
      await prisma.analyticsEvent.createMany({ data: batch });
    }

    return true;
  } catch (error) {
    console.error("Failed to seed sample analytics:", error);
    return false;
  }
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
