"use client";

import {
  Legend,
  LegendItem,
  LegendLabel,
  LegendMarker,
  LegendProgress,
  LegendValue,
  Ring,
  RingCenter,
  RingChart,
} from "@/components/charts";

export type SourceRingItem = {
  label: string;
  value: number;
  maxValue: number;
  color: string;
};

/**
 * Anneau « Sources d'acquisition » + légende — chargé en lazy
 * (next/dynamic) car la pile visx alourdit le bundle initial de l'admin.
 */
export default function SourcesChart({
  data,
  hoveredIndex,
  onHoverChange,
}: {
  data: SourceRingItem[];
  hoveredIndex: number | null;
  onHoverChange: (index: number | null) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="flex w-1/2 justify-center">
        <RingChart
          data={data}
          hoveredIndex={hoveredIndex}
          onHoverChange={onHoverChange}
        >
          {data.map((_, i) => (
            <Ring index={i} key={i} />
          ))}
          <RingCenter defaultLabel="Sources" />
        </RingChart>
      </div>

      <Legend
        hoveredIndex={hoveredIndex}
        items={data}
        onHoverChange={onHoverChange}
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
  );
}
