"use client";
import { useEffect } from "react";

const PALETTE = [
  ["#4285F4", "#1A73E8"], // vivid blue
  ["#EA4335", "#C5221F"], // red
  ["#FBBC05", "#F29900"], // yellow
  ["#34A853", "#188038"], // green
  ["#A142F4", "#9334E6"], // purple
];

const PARTICLE_TYPES = ["circle", "star", "dot", "diamond", "triangle", "plus"];

export default function CursorSpark() {
  useEffect(() => {
    let last = 0;
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout;

    const handleMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - last < 50) return; // Reduced frequency for better performance
      last = now;

      // Only create particles when actively moving
      if (!isMoving) {
        isMoving = true;
        createParticles(e.clientX, e.clientY, 1); // Reduced particle count
      }

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearTimeout(moveTimeout);
    };
  }, []);

  function createParticles(x: number, y: number, count = 1) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const particleType =
        PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)];
      el.className = `cursor-spark spark-${particleType}`;

      const pal = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const size = Math.round(6 + Math.random() * 12); // Larger, more visible particles
      const duration = 800 + Math.random() * 400; // Longer, smoother animation

      const angle = Math.random() * Math.PI * 2;
      const distance = 15 + Math.random() * 40; // Reduced spread for subtlety
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

      // Different particle shapes
      if (particleType === "star") {
        el.innerHTML = `<div class="spark-star">★</div>`;
      } else if (particleType === "dot") {
        el.innerHTML = `<div class="spark-dot"></div>`;
      } else if (particleType === "diamond") {
        el.innerHTML = `<div class="spark-diamond">◆</div>`;
      } else if (particleType === "triangle") {
        el.innerHTML = `<div class="spark-triangle">▲</div>`;
      } else if (particleType === "plus") {
        el.innerHTML = `<div class="spark-plus">✚</div>`;
      } else {
        el.innerHTML = `<div class="spark-core"></div>`;
      }

      document.body.appendChild(el);
      setTimeout(() => el.remove(), duration + 200);
    }
  }

  return null;
}
