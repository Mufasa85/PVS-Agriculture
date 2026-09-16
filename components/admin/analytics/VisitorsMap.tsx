"use client";

import { useMemo } from "react";

import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import type { FeatureCollection, Geometry } from "geojson";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";

import {
  ChoroplethChart,
  ChoroplethFeatureComponent,
  type ChoroplethFeature,
  ChoroplethGraticule,
  ChoroplethTooltip,
} from "@/components/charts";

countries.registerLocale(frLocale);

// Build numeric → French name lookup
const numericToName: Record<string, string> = {};
for (const [numeric, alpha2] of Object.entries(countries.getNumericCodes())) {
  numericToName[numeric] =
    countries.getName(alpha2 as string, "fr") || (alpha2 as string);
}

const baseGeojson = feature(
  worldData as any,
  (worldData as any).objects.countries,
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

/**
 * Carte choroplèthe « Visiteurs par pays » + liste des top pays.
 * Chargée en lazy (next/dynamic) : topojson + world-atlas +
 * i18n-iso-countries représentent l'essentiel du poids de la page.
 */
export default function VisitorsMap({
  visitorsByCountry,
}: {
  visitorsByCountry: Record<string, number>;
}) {
  const geojson = useMemo(
    () => ({
      ...baseGeojson,
      features: baseGeojson.features.map((f) => ({
        ...f,
        properties: {
          ...f.properties,
          visitors: visitorsByCountry[String(f.id)] || 0,
        },
      })),
    }),
    [visitorsByCountry],
  );

  const maxVisitors = useMemo(() => {
    const vals = Object.values(visitorsByCountry);
    return vals.length > 0 ? Math.max(...vals) : 0;
  }, [visitorsByCountry]);

  const getVisitorColor = useMemo(
    () => getVisitorColorFactory(maxVisitors),
    [maxVisitors],
  );

  const totalVisitors =
    Object.values(visitorsByCountry).reduce((s, v) => s + v, 0) || 1;

  return (
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
          {Object.entries(visitorsByCountry)
            .sort(([, a], [, b]) => b - a)
            .map(([numeric, count]) => {
              const pct = Math.round((count / totalVisitors) * 100);
              const name = numericToName[numeric] || numeric;
              return (
                <div
                  key={numeric}
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors hover:bg-brand-50/60"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: visitorColorFor(count, maxVisitors),
                      }}
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
          {Object.keys(visitorsByCountry).length === 0 && (
            <p className="py-4 text-center text-[12.5px] text-ink-500">
              Aucune donnée géographique disponible.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
