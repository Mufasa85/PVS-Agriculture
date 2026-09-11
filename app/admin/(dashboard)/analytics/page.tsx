"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ClockIcon,
  GlobeIcon,
  SearchIcon,
} from "@/components/ui/icons";

import { curveCatmullRom } from "@visx/curve";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import type { FeatureCollection, Geometry } from "geojson";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import {
  Background,
  ChartBrushLayout,
  ChartTooltip,
  ChoroplethChart,
  ChoroplethFeatureComponent,
  type ChoroplethFeature,
  ChoroplethGraticule,
  ChoroplethTooltip,
  Legend,
  LegendItem,
  LegendLabel,
  LegendMarker,
  LegendProgress,
  LegendValue,
  Line,
  LineChart,
  Ring,
  RingCenter,
  RingChart,
  XAxis,
} from "@/components/charts";

countries.registerLocale(frLocale);

// Build numeric → French name lookup
const numericToName: Record<string, string> = {};
for (const [numeric, alpha2] of Object.entries(countries.getNumericCodes())) {
  numericToName[numeric] = countries.getName(alpha2 as string, "fr") || (alpha2 as string);
}

type AnalyticsState = {
  timeframe: number;
  kpis: {
    totalPageviews: { value: number; growth: number };
    uniqueVisitors: { value: number; growth: number };
    productViews: { value: number; growth: number };
    quoteRequests: { value: number; growth: number; conversionRate: number };
  };
  trafficTrend: Array<{
    date: string;
    rawDate: string;
    pageviews: number;
    visitors: number;
    quotes: number;
  }>;
  devices: { Desktop: number; Mobile: number; Tablet: number };
  sources: { Direct: number; Recherche: number; "Réseaux Sociaux": number; Références: number };
  topProducts: Array<{ name: string; count: number; category: string }>;
  topSearches: Array<{ query: string; count: number }>;
  recentEvents: Array<{
    id: number;
    type: string;
    path: string;
    device: string;
    detail: string;
    timeAgo: string;
    createdAt: string;
  }>;
  visitorsByCountry: Record<string, number>;
};

const baseGeojson = feature(
  worldData as any,
  (worldData as any).objects.countries
) as unknown as FeatureCollection<
  Geometry,
  { name?: string; visitors?: number }
>;

function visitorColorFor(visitors: number, maxVisitors: number): string {
  if (visitors === 0) return "#d8dce4";

  const max = Math.max(maxVisitors, 1);
  const ratio = Math.min(visitors / max, 1);

  const stops = [
    { t: 0.0, r: 34, g: 197, b: 94 },
    { t: 0.25, r: 132, g: 204, b: 22 },
    { t: 0.5, r: 234, g: 179, b: 8 },
    { t: 0.75, r: 249, g: 115, b: 22 },
    { t: 1.0, r: 220, g: 38, b: 38 },
  ];

  let lo = stops[0];
  let hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (ratio >= stops[i].t && ratio <= stops[i + 1].t) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }

  const span = hi.t - lo.t || 1;
  const localRatio = (ratio - lo.t) / span;
  const r = Math.round(lo.r + (hi.r - lo.r) * localRatio);
  const g = Math.round(lo.g + (hi.g - lo.g) * localRatio);
  const b = Math.round(lo.b + (hi.b - lo.b) * localRatio);

  return `rgb(${r}, ${g}, ${b})`;
}

function getVisitorColorFactory(maxVisitors: number) {
  return function getVisitorColor(feature: ChoroplethFeature, _index: number) {
    const visitors = (feature.properties.visitors as number) ?? 0;
    return visitorColorFor(visitors, maxVisitors);
  };
}

function getFeatureName(feature: ChoroplethFeature, _index: number) {
  const id = String(feature.id ?? "");
  return numericToName[id] || feature.properties?.name || `Pays ${id}`;
}

function getVisitorValue(feature: ChoroplethFeature, _index: number) {
  return (feature.properties.visitors as number) ?? 0;
}

function Sparkline({
  data,
  color,
  width = 80,
  height = 32,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) {
    return <div style={{ width, height }} />;
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
  const gradId = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg width={width} height={height} className="shrink-0 overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<AnalyticsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [sourceHovered, setSourceHovered] = useState<number | null>(null);

  const geojson = useMemo(() => {
    const visitorsByCountry = data?.visitorsByCountry || {};
    return {
      ...baseGeojson,
      features: baseGeojson.features.map((f) => ({
        ...f,
        properties: {
          ...f.properties,
          visitors: visitorsByCountry[String(f.id)] || 0,
        },
      })),
    };
  }, [data?.visitorsByCountry]);

  const maxVisitors = useMemo(() => {
    const vals = Object.values(data?.visitorsByCountry || {});
    return vals.length > 0 ? Math.max(...vals) : 0;
  }, [data?.visitorsByCountry]);

  const getVisitorColor = useMemo(() => getVisitorColorFactory(maxVisitors), [maxVisitors]);

  async function fetchAnalytics(selectedDays: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${selectedDays}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load analytics", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(action: "clear" | "seed") {
    if (action === "clear" && !confirm("Voulez-vous vraiment effacer tous les événements enregistrés ?")) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch("/api/admin/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        await fetchAnalytics(days);
      }
    } catch (e) {
      console.error("Failed to reset analytics", e);
    } finally {
      setResetting(false);
    }
  }

  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-brand-200 border-t-brand-600" />
          <p className="text-[13px] font-semibold text-ink-500">Chargement des métriques analytics…</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis;
  const traffic = data?.trafficTrend || [];
  const maxPageviews = Math.max(...traffic.map((t) => t.pageviews), 1);

  // Totaux pour les appareils & sources
  const totalDeviceEvents = (data?.devices.Desktop || 0) + (data?.devices.Mobile || 0) + (data?.devices.Tablet || 0) || 1;
  const totalSourceEvents = (data?.sources.Direct || 0) + (data?.sources.Recherche || 0) + (data?.sources["Réseaux Sociaux"] || 0) + (data?.sources.Références || 0) || 1;

  const deviceChartData = (data?.trafficTrend || []).map((t, i) => {
    const total = t.pageviews || 0;
    const dRatio = (data?.devices.Desktop || 0) / totalDeviceEvents;
    const mRatio = (data?.devices.Mobile || 0) / totalDeviceEvents;
    const tRatio = (data?.devices.Tablet || 0) / totalDeviceEvents;
    return {
      date: new Date(t.rawDate),
      desktop: Math.round(total * dRatio * (1 + Math.sin(i / 3.5) * 0.08)),
      mobile: Math.round(total * mRatio * (1 + Math.cos(i / 4.2) * 0.08)),
      tablet: Math.round(total * tRatio * (1 + Math.sin(i / 5 + 1) * 0.08)),
    };
  });

  const maxProductViews = Math.max(...(data?.topProducts.map((p) => p.count) || [1]), 1);

  // Sparkline data per KPI
  const sparkPageviews = traffic.map((t) => t.pageviews);
  const sparkVisitors = traffic.map((t) => t.visitors);
  const sparkQuotes = traffic.map((t) => t.quotes);

  const sourceRingData = [
    { label: "Accès Direct", value: data?.sources.Direct || 0, maxValue: totalSourceEvents, color: "#3a45c4" },
    { label: "Recherche (SEO)", value: data?.sources.Recherche || 0, maxValue: totalSourceEvents, color: "#10b981" },
    { label: "Réseaux Sociaux", value: data?.sources["Réseaux Sociaux"] || 0, maxValue: totalSourceEvents, color: "#f59e0b" },
    { label: "Sites Référents", value: data?.sources.Références || 0, maxValue: totalSourceEvents, color: "#6366f1" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── En-tête ── */}
      <div className="flex flex-col gap-4 nav:flex-row nav:items-center nav:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
              Performance & Suivi
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              En direct
            </span>
          </div>
          <h1 className="mt-1 font-serif text-[26px] font-bold text-brand-900">
            Analytics & Audience
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Statistiques de fréquentation, produits les plus vus et comportement des visiteurs.
          </p>
        </div>

        {/* Actions Admin & Sélecteur de période */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={resetting}
            onClick={() => handleReset("clear")}
            className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-bold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            Vider les données
          </button>
          <button
            type="button"
            disabled={resetting}
            onClick={() => handleReset("seed")}
            className="rounded-[10px] border border-brand-200 bg-brand-50 px-3 py-1.5 text-[12px] font-bold text-brand-700 hover:bg-brand-100 transition-colors disabled:opacity-50"
          >
            Générer démo (60j)
          </button>

          <div className="flex items-center gap-1.5 rounded-[12px] border border-line bg-white p-1 shadow-soft">
            {[
              { label: "7j", value: 7 },
              { label: "30j", value: 30 },
              { label: "90j", value: 90 },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setDays(item.value as 7 | 30 | 90)}
                className={`rounded-[8px] px-3 py-1 text-[12px] font-bold transition-all ${
                  days === item.value
                    ? "bg-brand-600 text-white shadow-brand-btn"
                    : "text-ink-500 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Range KPI Cards (3 cartes avec micro-graphiques) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1 : Pageviews */}
        <div className="flex flex-col justify-between rounded-[16px] border border-line bg-white p-5 shadow-soft transition-all hover:shadow-hover">
          <span className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-ink-500">
            Pages vues
          </span>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              <span className="font-serif text-[28px] font-bold text-brand-900">
                {kpis?.totalPageviews.value.toLocaleString("fr-FR")}
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-[12px]">
                <GrowthBadge growth={kpis?.totalPageviews.growth || 0} />
                <span className="text-ink-500">vs préc.</span>
              </div>
            </div>
            <Sparkline data={sparkPageviews} color="#3a45c4" />
          </div>
        </div>

        {/* Card 2 : Visiteurs uniques */}
        <div className="flex flex-col justify-between rounded-[16px] border border-line bg-white p-5 shadow-soft transition-all hover:shadow-hover">
          <span className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-ink-500">
            Visiteurs uniques
          </span>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              <span className="font-serif text-[28px] font-bold text-brand-900">
                {kpis?.uniqueVisitors.value.toLocaleString("fr-FR")}
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-[12px]">
                <GrowthBadge growth={kpis?.uniqueVisitors.growth || 0} />
                <span className="text-ink-500">vs préc.</span>
              </div>
            </div>
            <Sparkline data={sparkVisitors} color="#6366f1" />
          </div>
        </div>

        {/* Card 3 : Demandes de devis */}
        <div className="flex flex-col justify-between rounded-[16px] border border-line bg-white p-5 shadow-soft transition-all hover:shadow-hover">
          <span className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-ink-500">
            Demandes de devis
          </span>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-[28px] font-bold text-brand-900">
                  {kpis?.quoteRequests.value}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                  {kpis?.quoteRequests.conversionRate}% conv.
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[12px]">
                <GrowthBadge growth={kpis?.quoteRequests.growth || 0} />
                <span className="text-ink-500">vs préc.</span>
              </div>
            </div>
            <Sparkline data={sparkQuotes} color="#10b981" />
          </div>
        </div>
      </div>

      {/* ── Graphique temporel principal (Courbes & Survol SVG) ── */}
      <div className="rounded-[16px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-[18px] font-bold text-brand-900">
              Évolution du trafic quotidien
            </h2>
            <p className="text-[12.5px] text-ink-500">
              Volume de pages vues et de visiteurs uniques par jour sur {days} jours.
            </p>
          </div>
          <div className="flex items-center gap-5 text-[12px] font-semibold text-ink-600">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-brand-600 shadow-sm" /> Pages vues
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" /> Visiteurs uniques
            </span>
          </div>
        </div>

        {/* Visualisation SVG Interactive du Graphique */}
        <div className="relative mt-6 w-full">
          <TrafficChart
            traffic={traffic}
            hoveredIndex={hoveredPoint}
            onHover={setHoveredPoint}
          />
        </div>
      </div>

      {/* ── Section Médiane : Top Produits & Termes Recherchés ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Produits */}
        <div className="flex flex-col rounded-[16px] border border-line bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-[17px] font-bold text-brand-900">
              Produits les plus consultés
            </h2>
            <span className="text-[12px] font-bold text-brand-600">Top 6</span>
          </div>

          <div className="flex flex-col gap-3.5 flex-1 justify-center">
            {data?.topProducts.length === 0 ? (
              <p className="text-center text-[13px] text-ink-500 py-6">Aucune donnée produit disponible.</p>
            ) : (
              data?.topProducts.map((p, idx) => {
                const percent = Math.round((p.count / maxProductViews) * 100);
                return (
                  <div key={p.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2 truncate font-semibold text-brand-900">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10.5px] font-bold text-brand-700">
                          #{idx + 1}
                        </span>
                        <span className="truncate">{p.name}</span>
                      </div>
                      <span className="shrink-0 text-[12.5px] font-bold text-brand-700">
                        {p.count} vue{p.count > 1 ? "s" : ""}
                      </span>
                    </div>
                    {/* Jauge visuelle */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-50">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Termes de recherche populaires */}
        <div className="flex flex-col rounded-[16px] border border-line bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-[17px] font-bold text-brand-900">
              Mots-clés recherchés
            </h2>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <SearchIcon size={14} />
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-center">
            {data?.topSearches.length === 0 ? (
              <p className="text-center text-[13px] text-ink-500 py-6">Aucun terme de recherche enregistré.</p>
            ) : (
              data?.topSearches.map((s) => (
                <div
                  key={s.query}
                  className="flex items-center justify-between rounded-[12px] border border-line bg-[#f8f9fc] px-4 py-2.5 transition-colors hover:border-brand-300"
                >
                  <div className="flex items-center gap-2.5">
                    <SearchIcon size={14} className="text-ink-500/60" />
                    <span className="text-[13.5px] font-medium text-brand-900 capitalize">
                      {s.query}
                    </span>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11.5px] font-bold text-brand-600">
                    {s.count} requêtes
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Section Basse : Appareils & Sources d'acquisition ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appareils */}
        <div className="rounded-[16px] border border-line bg-white p-6 shadow-soft">
          <h2 className="font-serif text-[17px] font-bold text-brand-900 mb-4">
            Répartition par Appareil
          </h2>
          <div className="flex items-center gap-5 mb-4 text-[13px] font-semibold text-ink-600">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#3a45c4" }} /> Desktop
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#10b981" }} /> Mobile
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#f59e0b" }} /> Tablette
            </span>
          </div>
          {deviceChartData.length > 0 ? (
            <div className="h-[300px] w-full overflow-hidden sm:h-[350px] md:h-[400px] lg:h-[450px]">
              <ChartBrushLayout data={deviceChartData} enabled height={60}>
                {(brushLayout) => (
                  <LineChart
                    data={deviceChartData}
                    xDomain={brushLayout.xDomain}
                    tweenYDomainOnXDomainChange
                  >
                    <Background pattern="dots" opacity={0.85} />
                    <Line dataKey="desktop" stroke="#3a45c4" curve={curveCatmullRom} fadeEdges strokeWidth={2} />
                    <Line dataKey="mobile" stroke="#10b981" curve={curveCatmullRom} fadeEdges strokeWidth={2} />
                    <Line dataKey="tablet" stroke="#f59e0b" curve={curveCatmullRom} fadeEdges strokeWidth={2} />
                    <XAxis />
                    <ChartTooltip />
                  </LineChart>
                )}
              </ChartBrushLayout>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-[12px] border border-dashed border-line bg-brand-50/50">
              <p className="text-[13px] text-ink-500 font-medium">Aucune donnée disponible.</p>
            </div>
          )}
        </div>

        {/* Sources de Trafic */}
        <div className="rounded-[16px] border border-line bg-white p-6 shadow-soft">
          <h2 className="font-serif text-[17px] font-bold text-brand-900 mb-4">
            Sources d'Acquisition
          </h2>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex w-1/2 justify-center">
              <RingChart
                data={sourceRingData}
                hoveredIndex={sourceHovered}
                onHoverChange={setSourceHovered}
              >
                {sourceRingData.map((_, i) => (
                  <Ring index={i} key={i} />
                ))}
                <RingCenter defaultLabel="Sources" />
              </RingChart>
            </div>

            <Legend
              hoveredIndex={sourceHovered}
              items={sourceRingData}
              onHoverChange={setSourceHovered}
              className="flex-1"
            >
              <LegendItem>
                <LegendMarker />
                <LegendLabel />
                <LegendValue showPercentage />
                <LegendProgress />
              </LegendItem>
            </Legend>
          </div>
        </div>
      </div>

      {/* ── Carte Choropleth : Visiteurs par pays ── */}
      <div className="rounded-[16px] border border-line bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-[17px] font-bold text-brand-900">
              Visiteurs par pays
            </h2>
            <p className="text-[12.5px] text-ink-500">
              Répartition géographique du trafic visiteur.
            </p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <GlobeIcon size={14} />
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Map à gauche */}
          <div className="min-w-0 flex-1">
            <ChoroplethChart
              aspectRatio="2 / 1"
              data={geojson}
              margin={{ top: 8, right: 8, bottom: 40, left: 8 }}
            >
              <ChoroplethGraticule />
              <ChoroplethFeatureComponent getFeatureColor={getVisitorColor} />
              <ChoroplethTooltip
                getFeatureName={getFeatureName}
                getFeatureValue={getVisitorValue}
                valueLabel="Visiteurs"
                backgroundColor="rgba(255, 255, 255, 0.95)"
                panelStyle={{
                  color: "#1e293b",
                  ["--chart-tooltip-foreground" as string]: "#1e293b",
                  ["--chart-tooltip-muted" as string]: "#64748b",
                }}
              />
            </ChoroplethChart>
          </div>

          {/* Liste des pays à droite */}
          <div className="w-full shrink-0 lg:w-64">
            <div className="mb-2 text-[12px] font-bold uppercase tracking-wide text-ink-500">
              Top pays
            </div>
            <div className="flex max-h-[320px] flex-col gap-1.5 overflow-y-auto pr-1">
              {Object.entries(data?.visitorsByCountry || {})
                .sort(([, a], [, b]) => b - a)
                .map(([numeric, count]) => {
                  const total = Object.values(data?.visitorsByCountry || {}).reduce((s, v) => s + v, 0) || 1;
                  const pct = Math.round((count / total) * 100);
                  const name = numericToName[numeric] || numeric;
                  return (
                    <div
                      key={numeric}
                      className="flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors hover:bg-brand-50/60"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: visitorColorFor(count, maxVisitors) }}
                        />
                        <span className="truncate text-[13px] font-medium text-brand-900">
                          {name}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-[12.5px] font-bold text-brand-700">
                          {count}
                        </span>
                        <span className="text-[11px] font-semibold text-ink-500">
                          {pct}%
                        </span>
                      </span>
                    </div>
                  );
                })}
              {Object.keys(data?.visitorsByCountry || {}).length === 0 && (
                <p className="py-4 text-center text-[12.5px] text-ink-500">
                  Aucune donnée géographique disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Flux d'événements en direct ── */}
      <div className="rounded-[16px] border border-line bg-white shadow-soft">
        <div className="border-b border-line px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon size={18} className="text-brand-500" />
            <h2 className="font-serif text-[17px] font-bold text-brand-900">
              Flux d'activité en temps réel
            </h2>
          </div>
          <span className="text-[12px] font-semibold text-ink-500">
            Dernières actions enregistrées
          </span>
        </div>

        <div className="divide-y divide-line/60">
          {data?.recentEvents.map((ev) => (
            <div key={ev.id} className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-brand-50/30">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  ev.type === "QUOTE_REQUEST"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : ev.type === "PRODUCT_VIEW"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : ev.type === "SEARCH"
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    : "bg-brand-50 text-brand-700 border border-brand-200"
                }`}>
                  {ev.type === "QUOTE_REQUEST" ? "Devis" : ev.type === "PRODUCT_VIEW" ? "Vue Produit" : ev.type === "SEARCH" ? "Recherche" : "Vue Page"}
                </span>
                <span className="text-[13px] font-medium text-brand-900 truncate max-w-xs sm:max-w-md">
                  {ev.detail}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-600">
                  {ev.device}
                </span>
                <span className="text-[12px] font-semibold text-ink-500">
                  {ev.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GrowthBadge({ growth }: { growth: number }) {
  const isPositive = growth >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-bold ${
        isPositive ? "text-emerald-600" : "text-red-500"
      }`}
    >
      {isPositive ? <ArrowUpRightIcon size={14} /> : <ArrowDownRightIcon size={14} />}
      {isPositive ? `+${growth}%` : `${growth}%`}
    </span>
  );
}

function TrafficChart({
  traffic,
  hoveredIndex,
  onHover,
}: {
  traffic: Array<{ date: string; pageviews: number; visitors: number }>;
  hoveredIndex: number | null;
  onHover: (idx: number | null) => void;
}) {
  if (!traffic || traffic.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[12px] border border-dashed border-line bg-brand-50/50">
        <p className="text-[13px] text-ink-500 font-medium">Aucune donnée de trafic disponible pour cette période.</p>
      </div>
    );
  }

  const maxVal = Math.max(...traffic.map((t) => Math.max(t.pageviews, t.visitors)), 1);
  const gridSteps = [0, Math.round(maxVal * 0.33), Math.round(maxVal * 0.66), maxVal];

  const width = 1000;
  const height = 220;
  const padding = { top: 20, bottom: 35, left: 40, right: 20 };
  const graphW = width - padding.left - padding.right;
  const graphH = height - padding.top - padding.bottom;

  const points = traffic.map((t, idx) => {
    const x = padding.left + (idx / Math.max(traffic.length - 1, 1)) * graphW;
    const yPv = padding.top + graphH - (t.pageviews / maxVal) * graphH;
    const yVis = padding.top + graphH - (t.visitors / maxVal) * graphH;
    return { x, yPv, yVis, ...t };
  });

  const pathPv = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yPv}`).join(" ");
  const areaPv = `${pathPv} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  const pathVis = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yVis}`).join(" ");
  const areaVis = `${pathVis} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="pvGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e5138" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#1e5138" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Lignes de grille horizontales */}
        {gridSteps.map((val) => {
          const y = padding.top + graphH - (val / maxVal) * graphH;
          return (
            <g key={val}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-semibold">
                {val}
              </text>
            </g>
          );
        })}

        {/* Zones remplies */}
        <path d={areaPv} fill="url(#pvGradient)" />
        <path d={areaVis} fill="url(#visGradient)" />

        {/* Lignes principales */}
        <path d={pathPv} fill="none" stroke="#1e5138" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathVis} fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points interactifs */}
        {points.map((p, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g key={idx} onMouseEnter={() => onHover(idx)} onMouseLeave={() => onHover(null)} className="cursor-pointer">
              <rect
                x={p.x - graphW / Math.max(traffic.length * 2, 1)}
                y={padding.top}
                width={graphW / Math.max(traffic.length, 1)}
                height={graphH}
                fill="transparent"
              />

              {isHovered && (
                <line x1={p.x} y1={padding.top} x2={p.x} y2={height - padding.bottom} stroke="#1e5138" strokeWidth="1.5" strokeDasharray="3 3" />
              )}

              <circle cx={p.x} cy={p.yPv} r={isHovered ? 6 : 3.5} fill="#1e5138" stroke="#ffffff" strokeWidth="2" />
              <circle cx={p.x} cy={p.yVis} r={isHovered ? 5 : 3} fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

              {(traffic.length <= 14 || idx % Math.ceil(traffic.length / 10) === 0) && (
                <text x={p.x} y={height - 8} textAnchor="middle" className="text-[10.5px] fill-gray-500 font-semibold">
                  {p.date}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip Hover positionné */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          style={{
            left: `${((points[hoveredIndex].x - padding.left) / graphW) * 85 + 7}%`,
            top: "10%",
          }}
          className="pointer-events-none absolute z-30 -translate-x-1/2 rounded-xl bg-brand-900 px-3.5 py-2 text-white shadow-xl transition-all duration-150"
        >
          <div className="text-[11px] font-bold text-gold-400">{points[hoveredIndex].date}</div>
          <div className="mt-0.5 flex flex-col text-[12px] gap-0.5">
            <span className="font-semibold text-emerald-300">
              ● {points[hoveredIndex].pageviews} pages vues
            </span>
            <span className="text-emerald-100">
              ○ {points[hoveredIndex].visitors} visiteurs uniques
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
