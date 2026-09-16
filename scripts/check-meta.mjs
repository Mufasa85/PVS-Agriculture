// Vérification rapide des balises SEO sur les pages publiques (dev server).
const base = process.argv[2] ?? "http://localhost:3000";
const pages = ["/", "/agriculture", "/tarifs", "/contact"];

for (const p of pages) {
  const res = await fetch(base + p);
  const html = await res.text();
  const og = [
    ...html.matchAll(/<meta property="og:([^"]+)" content="([^"]*)"/g),
  ];
  const tw = [
    ...html.matchAll(/<meta name="twitter:([^"]+)" content="([^"]*)"/g),
  ];
  const canon = html.match(/rel="canonical" href="([^"]*)"/);
  const ld = [...html.matchAll(/application\/ld\+json/g)];
  console.log(`\n=== ${p} (${res.status}) ===`);
  console.log("canonical:", canon?.[1] ?? "—");
  for (const m of og.slice(0, 9)) console.log(`  og:${m[1]} = ${m[2]}`);
  for (const m of tw.slice(0, 4)) console.log(`  twitter:${m[1]} = ${m[2]}`);
  console.log(`  JSON-LD blocks: ${ld.length}`);
}
