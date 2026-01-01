"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  rotation: number;
  shape: "circle" | "square" | "triangle" | "star" | "line";
  delay: number;
}

interface Burst {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

// Official GDG Colors
const GDG_COLORS = [
  "#4285F4", // Google Blue
  "#EA4335", // Google Red
  "#FBBC04", // Google Yellow
  "#34A853", // Google Green
];

const shapes = ["circle", "square", "triangle", "star", "line"] as const;

const generateParticles = (
  centerX: number,
  centerY: number,
  count: number
): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: centerX,
    y: centerY,
    color: GDG_COLORS[Math.floor(Math.random() * GDG_COLORS.length)],
    size: Math.random() * 12 + 4,
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
    velocity: Math.random() * 400 + 200,
    rotation: Math.random() * 720 - 360,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    delay: Math.random() * 0.2,
  }));
};

const ParticleShape: React.FC<{ shape: Particle["shape"]; color: string; size: number }> = ({
  shape,
  color,
  size,
}) => {
  switch (shape) {
    case "circle":
      return (
        <div
          className="rounded-full"
          style={{ width: size, height: size, backgroundColor: color }}
        />
      );
    case "square":
      return (
        <div
          style={{ width: size, height: size, backgroundColor: color }}
        />
      );
    case "triangle":
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
          }}
        />
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            fill={color}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      );
    case "line":
      return (
        <div
          style={{
            width: size * 2,
            height: 3,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      );
    default:
      return null;
  }
};

const CelebrationBlast: React.FC<{ show?: boolean; duration?: number }> = ({
  show = true,
  duration = 4000,
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

    // Create multiple bursts at different positions
    const burstPositions = [
      { x: 20, y: 30 },
      { x: 80, y: 20 },
      { x: 50, y: 40 },
      { x: 15, y: 60 },
      { x: 85, y: 55 },
      { x: 35, y: 25 },
      { x: 65, y: 35 },
      { x: 50, y: 15 },
    ];

    const newBursts: Burst[] = burstPositions.map((pos, index) => ({
      id: index,
      x: pos.x,
      y: pos.y,
      particles: generateParticles(0, 0, 25 + Math.floor(Math.random() * 15)),
    }));

    // Stagger the bursts
    const timeouts: NodeJS.Timeout[] = [];
    newBursts.forEach((burst, index) => {
      const timeout = setTimeout(() => {
        setBursts((prev) => [...prev, burst]);
      }, index * 150 + Math.random() * 100);
      timeouts.push(timeout);
    });

    // Hide after duration
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(hideTimeout);
    };
  }, [show, duration, isVisible]);

  if (!isVisible || windowSize.width === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
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
            {/* Central flash */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 rounded-full"
              style={{
                width: 40,
                height: 40,
                background: `radial-gradient(circle, ${GDG_COLORS[burst.id % GDG_COLORS.length]} 0%, transparent 70%)`,
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Particles */}
            {burst.particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x: Math.cos(particle.angle) * particle.velocity,
                  y: Math.sin(particle.angle) * particle.velocity + 100, // Add gravity effect
                  scale: [0, 1.2, 1, 0.5],
                  opacity: [0, 1, 1, 0],
                  rotate: particle.rotation,
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  delay: particle.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute"
                style={{ transformOrigin: "center center" }}
              >
                <ParticleShape
                  shape={particle.shape}
                  color={particle.color}
                  size={particle.size}
                />
              </motion.div>
            ))}

            {/* Sparkle trails */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: Math.cos((Math.PI * 2 * i) / 8) * (100 + Math.random() * 50),
                  y: Math.sin((Math.PI * 2 * i) / 8) * (100 + Math.random() * 50),
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + i * 0.05,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  boxShadow: `0 0 10px ${GDG_COLORS[i % GDG_COLORS.length]}, 0 0 20px ${GDG_COLORS[i % GDG_COLORS.length]}`,
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>

      {/* Floating confetti rain effect */}
      <AnimatePresence>
        {show && windowSize.width > 0 && (
          <>
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                initial={{
                  x: Math.random() * windowSize.width,
                  y: -20,
                  rotate: 0,
                  opacity: 0,
                }}
                animate={{
                  y: windowSize.height + 50,
                  rotate: Math.random() * 720 - 360,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
                className="absolute"
              >
                <div
                  style={{
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                    backgroundColor:
                      GDG_COLORS[Math.floor(Math.random() * GDG_COLORS.length)],
                    borderRadius: Math.random() > 0.5 ? "50%" : "0",
                  }}
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationBlast;
