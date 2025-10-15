"use client";

import React from "react";

type DataPoint = { label: string; value: number };

type Props = {
  data: DataPoint[];
  height?: number;
  colors?: string[];
};

export default function BarChart({ data, height = 200, colors }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = data.length > 0 ? Math.floor(100 / data.length) : 100;
  const palette = colors || ["#4584F4", "#33A854", "#F1AE08", "#E6452D"];

  return (
    <div className="w-full">
      <div className="flex items-end gap-3" style={{ height }}>
        {data.map((d, i) => (
          <div key={d.label} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t-md"
              title={`${d.label}: ${d.value}`}
              style={{
                height: `${(d.value / max) * 100}%`,
                background: palette[i % palette.length],
                width: "100%",
              }}
            />
            <div className="text-xs mt-2 text-center truncate w-full">
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
