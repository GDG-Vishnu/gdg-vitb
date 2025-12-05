"use client";
import { useEffect } from "react";

const PALETTE = [
  ["#4285F4", "#1A73E8"], // vivid blue
  ["#EA4335", "#C5221F"], // red
  ["#FBBC05", "#F29900"], // yellow
  ["#34A853", "#188038"], // green
  ["#A142F4", "#9334E6"], // purple
];

export default function CursorSpark() {
  useEffect(() => {
    let last = 0;

    const handleMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - last < 10) return;
      last = now;

      createParticles(e.clientX, e.clientY, 3);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  function createParticles(x: number, y: number, count = 1) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "cursor-spark";

      const pal = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const size = Math.round(6 + Math.random() * 16);
      const duration = 500 + Math.random() * 600;

      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 70;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance * -1;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty("--tx", `${dx}px`);
      el.style.setProperty("--ty", `${dy}px`);
      el.style.setProperty("--duration", `${duration}ms`);
      el.style.setProperty("--size", `${size}px`);
      el.style.setProperty("--c1", pal[0]);
      el.style.setProperty("--c2", pal[1]);

      el.innerHTML = `<div class="spark-core"></div>`;

      document.body.appendChild(el);
      setTimeout(() => el.remove(), duration + 100);
    }
  }

  return null;
}
