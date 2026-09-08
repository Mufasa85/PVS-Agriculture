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

const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2025, 0, 1 + i),
  desktop: Math.round(180 + Math.sin(i / 4.2) * 70 + ((i * 9) % 31)),
  mobile: Math.round(120 + Math.cos(i / 3.8) * 55 + ((i * 5) % 23)),
  tablet: Math.round(150 + Math.sin(i / 5.1 + 1) * 48 + ((i * 7) % 19)),
}));

export default function ChartPlaygroundPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Line Chart - Trio with Brush</h1>
      <div className="h-[400px] w-full">
        <ChartBrushLayout data={chartData} enabled height={72}>
          {(brushLayout) => (
            <LineChart
              data={chartData}
              xDomain={brushLayout.xDomain}
              tweenYDomainOnXDomainChange
            >
              <Background pattern="dots" opacity={0.85} />
              <Line
                dataKey="desktop"
                curve={curveCatmullRom}
                fadeEdges
                strokeWidth={2}
              />
              <Line
                dataKey="mobile"
                curve={curveCatmullRom}
                fadeEdges
                strokeWidth={2}
              />
              <Line
                dataKey="tablet"
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
    </div>
  );
}