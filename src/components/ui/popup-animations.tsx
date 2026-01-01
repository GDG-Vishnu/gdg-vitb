"use client";

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupAnimationProps {
  isVisible: boolean;
  children: ReactNode;
  animationType?:
    | "scale"
    | "fade"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "bounce"
    | "zoom"
    | "rotate";
  duration?: number;
  delay?: number;
  className?: string;
}

const animationVariants = {
  scale: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  },
  slideDown: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
  },
  slideLeft: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  },
  slideRight: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  bounce: {
    initial: { scale: 0, y: 100 },
    animate: { scale: 1, y: 0 },
    exit: { scale: 0, y: 100 },
  },
  zoom: {
    initial: { scale: 0.3, opacity: 0, rotate: -180 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0.3, opacity: 0, rotate: 180 },
  },
  rotate: {
    initial: { rotate: -360, scale: 0, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    exit: { rotate: 360, scale: 0, opacity: 0 },
  },
};

export const PopupAnimation: React.FC<PopupAnimationProps> = ({
  isVisible,
  children,
  animationType = "scale",
  duration = 0.5,
  delay = 0,
  className = "",
}) => {
  const variant = animationVariants[animationType];

  const transitionConfig =
    animationType === "bounce"
      ? {
          type: "spring" as const,
          stiffness: 400,
          damping: 10,
          delay,
        }
      : { duration, delay, ease: "easeOut" as const };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={variant.initial}
          animate={variant.animate}
          exit={variant.exit}
          transition={transitionConfig}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Specialized popup components
export const WelcomePopup: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  return (
    <PopupAnimation isVisible={isVisible} animationType="zoom" duration={0.8}>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      >
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 relative overflow-hidden border-4 border-black"
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-red-50 to-yellow-50"
            animate={{
              background: [
                "linear-gradient(45deg, #3b82f6, #ef4444, #eab308, #22c55e)",
                "linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6)",
                "linear-gradient(225deg, #eab308, #22c55e, #3b82f6, #ef4444)",
                "linear-gradient(315deg, #22c55e, #3b82f6, #ef4444, #eab308)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ opacity: 0.1 }}
          />

          <div className="relative z-10">
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>

            {/* Google colored welcome text */}
            <motion.h2
              className="text-3xl font-bold text-center mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-blue-600">W</span>
              <span className="text-red-600">e</span>
              <span className="text-yellow-600">l</span>
              <span className="text-blue-600">c</span>
              <span className="text-green-600">o</span>
              <span className="text-red-600">m</span>
              <span className="text-yellow-600">e</span>
              <span className="text-gray-800 ml-2">to</span>
            </motion.h2>

            <motion.p
              className="text-center text-gray-700 mb-6 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Google Developer Group
              <br />
              <span className="font-semibold text-black">
                Vishnu Institute of Technology
              </span>
            </motion.p>

            {/* Animated decorative elements */}
            <div className="flex justify-center space-x-4 mb-6">
              {[
                { color: "#3b82f6", delay: 0.7 },
                { color: "#ef4444", delay: 0.9 },
                { color: "#eab308", delay: 1.1 },
                { color: "#22c55e", delay: 1.3 },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    delay: item.delay,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            <motion.button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Our Community 🚀
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </PopupAnimation>
  );
};

export const NotificationPopup: React.FC<{
  isVisible: boolean;
  message: string;
  icon?: string;
  color?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}> = ({
  isVisible,
  message,
  icon = "🎉",
  color = "bg-blue-500",
  position = "top-right",
}) => {
  const positionClasses = {
    "top-right": "top-20 right-4",
    "top-left": "top-20 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <PopupAnimation
      isVisible={isVisible}
      animationType="slideLeft"
      duration={0.6}
    >
      <motion.div
        className={`fixed z-40 ${positionClasses[position]}`}
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        exit={{ x: 100 }}
      >
        <motion.div
          className={`${color} text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white max-w-sm`}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xl">{icon}</span>
            <span className="font-medium">{message}</span>
          </div>
        </motion.div>
      </motion.div>
    </PopupAnimation>
  );
};

export const ParticleBurst: React.FC<{
  isVisible: boolean;
  centerX?: number;
  centerY?: number;
}> = ({ isVisible, centerX = 50, centerY = 50 }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: ["#3b82f6", "#ef4444", "#eab308", "#22c55e"][i % 4],
    angle: (360 / 12) * i,
    distance: 80 + Math.random() * 40,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {particles.map((particle) => {
            const x =
              centerX +
              Math.cos((particle.angle * Math.PI) / 180) * particle.distance;
            const y =
              centerY +
              Math.sin((particle.angle * Math.PI) / 180) * particle.distance;

            return (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: particle.color,
                  left: `${centerX}%`,
                  top: `${centerY}%`,
                }}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: x - centerX + "%",
                  y: y - centerY + "%",
                  opacity: [1, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  delay: Math.random() * 0.3,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
};
