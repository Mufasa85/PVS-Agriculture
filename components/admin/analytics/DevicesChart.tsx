"use client";

import { curveCatmullRom } from "@visx/curve";

import {
  Background,
  ChartBrushLayout,
  ChartTooltip,
  Line,
  LineChart,
  XAxis,
} from "@/components/charts";

export type DeviceChartPoint = {
  date: Date;
  desktop: number;
  mobile: number;
  tablet: number;
};

/**
 * Graphique « Répartition par appareil » — chargé en lazy (next/dynamic)
 * car la pile visx/d3 alourdit le bundle initial de l'admin.
 */
export default function DevicesChart({ data }: { data: DeviceChartPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-[12px] border border-dashed border-line bg-brand-50/50">
        <p className="text-[13px] text-ink-500 font-medium">
          Aucune donnée disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full overflow-hidden sm:h-[350px] md:h-[400px] lg:h-[450px]">
      <ChartBrushLayout data={data} enabled height={60}>
        {(brushLayout) => (
          <LineChart
            data={data}
            xDomain={brushLayout.xDomain}
            tweenYDomainOnXDomainChange
          >
            <Background pattern="dots" opacity={0.85} />
            <Line
              dataKey="desktop"
              stroke="#3a45c4"
              curve={curveCatmullRom}
              fadeEdges
              strokeWidth={2}
            />
            <Line
              dataKey="mobile"
              stroke="#10b981"
              curve={curveCatmullRom}
              fadeEdges
              strokeWidth={2}
            />
            <Line
              dataKey="tablet"
              stroke="#f59e0b"
              curve={curveCatmullRom}
              fadeEdges
              strokeWidth={2}
            />
            <XAxis />
            <ChartTooltip />
          </LineChart>
        )}
      </ChartBrushLayout>
    </div>
  );
}
