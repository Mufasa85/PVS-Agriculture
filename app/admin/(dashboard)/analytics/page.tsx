"use client";

import { useEffect, useState } from "react";

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BarChartIcon,
  ClockIcon,
  EyeIcon,
  GlobeIcon,
  MonitorIcon,
  PackageIcon,
  SearchIcon,
  SmartphoneIcon,
  TrendingUpIcon,
} from "@/components/ui/icons";

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
};

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<AnalyticsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

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

  const maxProductViews = Math.max(...(data?.topProducts.map((p) => p.count) || [1]), 1);

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

      {/* ── Range KPI Cards (4 cartes) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 nav:grid-cols-4">
        {/* Card 1 : Pageviews */}
        <div className="flex flex-col justify-between rounded-[16px] border border-line bg-white p-5 shadow-soft transition-all hover:shadow-hover">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-ink-500">
              Pages vues
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-50 text-brand-600">
              <EyeIcon size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-[28px] font-bold text-brand-900">
              {kpis?.totalPageviews.value.toLocaleString("fr-FR")}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[12px]">
              <GrowthBadge growth={kpis?.totalPageviews.growth || 0} />
              <span className="text-ink-500">vs période précédente</span>
            </div>
          </div>
        </div>

        {/* Card 2 : Visiteurs uniques */}
        <div className="flex flex-col justify-between rounded-[16px] border border-line bg-white p-5 shadow-soft transition-all hover:shadow-hover">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-ink-500">
              Visiteurs uniques
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-indigo-50 text-indigo-600">
              <GlobeIcon size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-[28px] font-bold text-brand-900">
              {kpis?.uniqueVisitors.value.toLocaleString("fr-FR")}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[12px]">
              <GrowthBadge growth={kpis?.uniqueVisitors.growth || 0} />
              <span className="text-ink-500">vs période précédente</span>
            </div>
          </div>
        </div>

        {/* Card 3 : Vues Produits */}
        <div className="flex flex-col justify-between rounded-[16px] border border-line bg-white p-5 shadow-soft transition-all hover:shadow-hover">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-ink-500">
              Vues produits
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-amber-50 text-amber-600">
              <PackageIcon size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-[28px] font-bold text-brand-900">
              {kpis?.productViews.value.toLocaleString("fr-FR")}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[12px]">
              <GrowthBadge growth={kpis?.productViews.growth || 0} />
              <span className="text-ink-500">vs période précédente</span>
            </div>
          </div>
        </div>

        {/* Card 4 : Demandes de devis */}
        <div className="flex flex-col justify-between rounded-[16px] border border-line bg-white p-5 shadow-soft transition-all hover:shadow-hover">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-ink-500">
              Demandes de devis
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-600">
              <TrendingUpIcon size={18} />
            </div>
          </div>
          <div className="mt-3">
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
              <span className="text-ink-500">vs période précédente</span>
            </div>
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
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Desktop", count: data?.devices.Desktop || 0, icon: MonitorIcon, color: "text-brand-600", bg: "bg-brand-50" },
              { label: "Mobile", count: data?.devices.Mobile || 0, icon: SmartphoneIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Tablette", count: data?.devices.Tablet || 0, icon: MonitorIcon, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((d) => {
              const Icon = d.icon;
              const pct = Math.round((d.count / totalDeviceEvents) * 100);
              return (
                <div key={d.label} className="flex flex-col items-center rounded-[14px] border border-line p-4 text-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${d.bg} ${d.color} mb-2`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[12px] font-semibold text-ink-500">{d.label}</span>
                  <span className="font-serif text-[20px] font-bold text-brand-900 mt-1">{pct}%</span>
                  <span className="text-[11px] text-ink-500">{d.count} visites</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sources de Trafic */}
        <div className="rounded-[16px] border border-line bg-white p-6 shadow-soft">
          <h2 className="font-serif text-[17px] font-bold text-brand-900 mb-4">
            Sources d'Acquisition
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Accès Direct", count: data?.sources.Direct || 0, color: "bg-brand-600" },
              { label: "Moteurs de Recherche (SEO)", count: data?.sources.Recherche || 0, color: "bg-emerald-500" },
              { label: "Réseaux Sociaux", count: data?.sources["Réseaux Sociaux"] || 0, color: "bg-amber-500" },
              { label: "Sites Référents", count: data?.sources.Références || 0, color: "bg-indigo-500" },
            ].map((src) => {
              const pct = Math.round((src.count / totalSourceEvents) * 100);
              return (
                <div key={src.label} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[13px] font-medium">
                    <span className="text-brand-900">{src.label}</span>
                    <span className="font-bold text-brand-700">{pct}% ({src.count})</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-50">
                    <div style={{ width: `${pct}%` }} className={`h-full rounded-full ${src.color}`} />
                  </div>
                </div>
              );
            })}
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
