"use client";

import React from "react";

type DataPoint = { label: string; value: number };

type Props = {
  data: DataPoint[];
  size?: number;
  colors?: string[];
};

export default function PieChart({ data, size = 160, colors }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const palette = colors || ["#4584F4", "#33A854", "#F1AE08", "#E6452D"];

  let angle = -90; // start at top
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {data.map((d, i) => {
          const delta = (d.value / total) * 360;
          const large = delta > 180 ? 1 : 0;
          const start = angle;
          const end = angle + delta;

          const r = size / 2;
          const a0 = (Math.PI / 180) * start;
          const a1 = (Math.PI / 180) * end;
          const x0 = Math.cos(a0) * r;
          const y0 = Math.sin(a0) * r;
          const x1 = Math.cos(a1) * r;
          const y1 = Math.sin(a1) * r;

          const path = `M 0 0 L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
          angle += delta;
          return (
            <path
              key={d.label}
              d={path}
              fill={palette[i % palette.length]}
              stroke="#fff"
            />
          );
        })}
      </g>
    </svg>
  );
}
