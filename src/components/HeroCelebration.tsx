"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Official GDG Colors
const GDG_COLORS = [
  "#4285F4", // Google Blue
  "#EA4335", // Google Red
  "#FBBC04", // Google Yellow
  "#34A853", // Google Green
];

interface CircleParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  delay: number;
  opacity: number;
}

interface Burst {
  id: number;
  x: number;
  y: number;
  particles: CircleParticle[];
}

const generateCircleParticles = (
  centerX: number,
  centerY: number,
  count: number
): CircleParticle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: centerX,
    y: centerY,
    color: GDG_COLORS[Math.floor(Math.random() * GDG_COLORS.length)],
    size: Math.random() * 16 + 6, // Circle sizes between 6-22px
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
    velocity: Math.random() * 350 + 150,
    delay: Math.random() * 0.3,
    opacity: Math.random() * 0.4 + 0.6,
  }));
};

interface HeroCelebrationProps {
  show?: boolean;
  duration?: number;
  onComplete?: () => void;
}

const HeroCelebration: React.FC<HeroCelebrationProps> = ({
  show = true,
  duration = 3500,
  onComplete,
}) => {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Handle window size for SSR compatibility
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsVisible(show);
    }
  }, [show]);

  useEffect(() => {
    if (!show || !isVisible) return;

    // Create multiple bursts at different positions across the hero section
    const burstPositions = [
      { x: 15, y: 20 },
      { x: 85, y: 15 },
      { x: 50, y: 25 },
      { x: 25, y: 35 },
      { x: 75, y: 30 },
      { x: 10, y: 45 },
      { x: 90, y: 40 },
      { x: 40, y: 18 },
      { x: 60, y: 22 },
      { x: 30, y: 12 },
      { x: 70, y: 8 },
    ];

    const newBursts: Burst[] = burstPositions.map((pos, index) => ({
      id: index,
      x: pos.x,
      y: pos.y,
      particles: generateCircleParticles(
        0,
        0,
        20 + Math.floor(Math.random() * 12)
      ),
    }));

    // Stagger the bursts for a more dynamic effect
    const timeouts: NodeJS.Timeout[] = [];
    newBursts.forEach((burst, index) => {
      const timeout = setTimeout(() => {
        setBursts((prev) => [...prev, burst]);
      }, index * 100 + Math.random() * 80);
      timeouts.push(timeout);
    });

    // Hide after duration
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(hideTimeout);
    };
  }, [show, duration, isVisible, onComplete]);

  if (!isVisible || windowSize.width === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      <AnimatePresence>
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="absolute"
            style={{
              left: `${burst.x}%`,
              top: `${burst.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Central glow flash */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                width: 30,
                height: 30,
                background: `radial-gradient(circle, ${
                  GDG_COLORS[burst.id % GDG_COLORS.length]
                }80 0%, transparent 70%)`,
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Circle particles bursting outward */}
            {burst.particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos(particle.angle) * particle.velocity,
                  y: Math.sin(particle.angle) * particle.velocity + 80, // gravity effect
                  scale: [0, 1.3, 1, 0.6, 0],
                  opacity: [
                    0,
                    particle.opacity,
                    particle.opacity * 0.8,
                    particle.opacity * 0.4,
                    0,
                  ],
                }}
                transition={{
                  duration: 1.8 + Math.random() * 0.6,
                  delay: particle.delay,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size / 2}px ${particle.color}40`,
                }}
              />
            ))}

            {/* Inner ring of small circles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0.5],
                  opacity: [0, 0.9, 0],
                  x:
                    Math.cos((Math.PI * 2 * i) / 12) *
                    (60 + Math.random() * 30),
                  y:
                    Math.sin((Math.PI * 2 * i) / 12) *
                    (60 + Math.random() * 30),
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.05 + i * 0.03,
                  ease: "easeOut",
                }}
                className="absolute rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: GDG_COLORS[i % GDG_COLORS.length],
                  boxShadow: `0 0 8px ${GDG_COLORS[i % GDG_COLORS.length]}`,
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>

      {/* Floating circle confetti rain */}
      <AnimatePresence>
        {show && windowSize.width > 0 && (
          <>
            {Array.from({ length: 60 }).map((_, i) => {
              const size = Math.random() * 12 + 4;
              const color =
                GDG_COLORS[Math.floor(Math.random() * GDG_COLORS.length)];
              return (
                <motion.div
                  key={`confetti-${i}`}
                  initial={{
                    x: Math.random() * windowSize.width,
                    y: -30,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    y: windowSize.height * 0.7 + Math.random() * 100,
                    scale: [0, 1, 1, 0.8, 0],
                    opacity: [0, 0.8, 0.7, 0.4, 0],
                    x:
                      Math.random() * windowSize.width +
                      (Math.random() - 0.5) * 100,
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 1.5,
                    delay: Math.random() * 1.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    boxShadow: `0 0 ${size}px ${color}50`,
                  }}
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Pulsing circles in corners */}
      {[
        { x: "10%", y: "15%" },
        { x: "90%", y: "20%" },
        { x: "5%", y: "50%" },
        { x: "95%", y: "45%" },
      ].map((pos, idx) => (
        <motion.div
          key={`pulse-${idx}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 2.5, 0],
            opacity: [0, 0.6, 0.3, 0],
          }}
          transition={{
            duration: 1.5,
            delay: idx * 0.2 + 0.3,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{
            left: pos.x,
            top: pos.y,
            width: 40,
            height: 40,
            border: `3px solid ${GDG_COLORS[idx % GDG_COLORS.length]}`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
};

export default HeroCelebration;
