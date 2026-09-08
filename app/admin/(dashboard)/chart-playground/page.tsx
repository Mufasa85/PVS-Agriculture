"use client";

import { useState } from "react";
import { curveCatmullRom } from "@visx/curve";
import {
  Background,
  ChartBrushLayout,
  ChartTooltip,
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

const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2025, 0, 1 + i),
  desktop: Math.round(180 + Math.sin(i / 4.2) * 70 + ((i * 9) % 31)),
  mobile: Math.round(120 + Math.cos(i / 3.8) * 55 + ((i * 5) % 23)),
  tablet: Math.round(150 + Math.sin(i / 5.1 + 1) * 48 + ((i * 7) % 19)),
}));

const ringData = [
  { label: "Desktop", value: 4200, maxValue: 5000, color: "#3a45c4" },
  { label: "Mobile", value: 3100, maxValue: 5000, color: "#10b981" },
  { label: "Tablet", value: 1800, maxValue: 5000, color: "#f59e0b" },
];

export default function ChartPlaygroundPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

      <h1 className="text-2xl font-bold">Ring Chart - Legend</h1>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <RingChart
          data={ringData}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
          size={180}
        >
          {ringData.map((_, i) => (
            <Ring index={i} key={i} />
          ))}
          <RingCenter defaultLabel="Sessions" />
        </RingChart>

        <Legend
          hoveredIndex={hoveredIndex}
          items={ringData}
          onHoverChange={setHoveredIndex}
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
  );
}