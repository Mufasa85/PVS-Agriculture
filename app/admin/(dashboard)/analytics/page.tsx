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

        {/* Sélecteur de période */}
        <div className="flex items-center gap-2 rounded-[12px] border border-line bg-white p-1.5 shadow-soft">
          {[
            { label: "7 jours", value: 7 },
            { label: "30 jours", value: 30 },
            { label: "90 jours", value: 90 },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setDays(item.value as 7 | 30 | 90)}
              className={`rounded-[8px] px-3.5 py-1.5 text-[12.5px] font-bold transition-all ${
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

      {/* ── Graphique temporel principal (Courbes & Barres SVG) ── */}
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
          <div className="flex items-center gap-4 text-[12px] font-semibold text-ink-600">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-brand-500" /> Pages vues
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-400" /> Visiteurs uniques
            </span>
          </div>
        </div>

        {/* Visualisation SVG Interactive du Graphique */}
        <div className="relative mt-6 h-64 w-full">
          <div className="flex h-full items-end gap-1.5 sm:gap-2">
            {traffic.map((t, idx) => {
              const heightPercent = Math.max(Math.round((t.pageviews / maxPageviews) * 100), 4);
              const visitorHeightPercent = Math.max(Math.round((t.visitors / maxPageviews) * 100), 2);

              return (
                <div
                  key={t.rawDate}
                  className="group relative flex flex-1 flex-col items-center h-full justify-end"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Tooltip Hover */}
                  {hoveredPoint === idx && (
                    <div className="absolute -top-14 z-20 flex flex-col items-center rounded-lg bg-brand-900 px-3 py-1.5 text-center text-[11px] font-semibold text-white shadow-lg whitespace-nowrap pointer-events-none">
                      <span className="font-bold text-gold-400">{t.date}</span>
                      <span>{t.pageviews} vues • {t.visitors} visiteurs</span>
                    </div>
                  )}

                  {/* Barres empilées/juxtaposées */}
                  <div className="relative w-full max-w-[28px] flex items-end justify-center rounded-t-sm overflow-hidden bg-brand-50 hover:bg-brand-100 transition-colors">
                    {/* Barre Pageviews */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-sm transition-all duration-300 group-hover:from-brand-700 group-hover:to-brand-500"
                    />
                    {/* Barre Overlay Visiteurs */}
                    <div
                      style={{ height: `${visitorHeightPercent}%` }}
                      className="absolute bottom-0 w-full bg-emerald-400/80 rounded-t-sm transition-all"
                    />
                  </div>

                  {/* Label Date en bas (1 sur 3 ou 1 sur 5 selon largeur) */}
                  {(traffic.length <= 14 || idx % Math.ceil(traffic.length / 10) === 0) && (
                    <span className="mt-2 text-[10.5px] font-semibold text-ink-500 truncate w-full text-center">
                      {t.date}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
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
