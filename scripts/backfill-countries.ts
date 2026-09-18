import geoip from "geoip-lite";
import { prisma } from "@/lib/prisma";

async function backfillCountries() {
  console.log("🌍 Backfill: Starting country enrichment for analytics events...");

  const events = await prisma.analyticsEvent.findMany({
    where: {
      ipAddress: { not: null },
    },
    select: { id: true, ipAddress: true, metadata: true },
  });

  console.log(`📊 Found ${events.length} events with IP addresses.`);

  let updated = 0;
  let skipped = 0;

  for (const event of events) {
    const meta = (event.metadata as Record<string, any>) || {};

    if (meta.country) {
      skipped++;
      continue;
    }

    if (!event.ipAddress || event.ipAddress === "127.0.0.1") {
      skipped++;
      continue;
    }

    const geo = geoip.lookup(event.ipAddress);
    const country = geo?.country || null;

    if (!country) {
      skipped++;
      continue;
    }

    await prisma.analyticsEvent.update({
      where: { id: event.id },
      data: {
        metadata: { ...meta, country },
      },
    });
    updated++;
  }

  console.log(`✅ Backfill complete: ${updated} events updated, ${skipped} skipped.`);
  await prisma.$disconnect();
}

backfillCountries().catch((err) => {
  console.error("❌ Backfill failed:", err);
  process.exit(1);
});
