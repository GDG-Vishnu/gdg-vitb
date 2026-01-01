"use client";

import { useState, useEffect } from "react";

interface PopupState {
  welcome: boolean;
  particles: boolean;
  notifications: Array<{
    id: string;
    message: string;
    icon: string;
    color: string;
    position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    visible: boolean;
  }>;
}

export const usePopupAnimations = () => {
  const [popupStates, setPopupStates] = useState<PopupState>({
    welcome: false,
    particles: false,
    notifications: [],
  });

  const [hasShownOnLoad, setHasShownOnLoad] = useState(false);

  const notifications = [
    {
      id: "gdg-community",
      message: "Join 1000+ developers in our community!",
      icon: "👥",
      color: "bg-blue-500",
      position: "top-right" as const,
    },
    {
      id: "events",
      message: "Exciting tech events coming soon!",
      icon: "📅",
      color: "bg-green-500",
      position: "top-left" as const,
    },
    {
      id: "learning",
      message: "Learn cutting-edge technologies!",
      icon: "🚀",
      color: "bg-purple-500",
      position: "bottom-right" as const,
    },
    {
      id: "networking",
      message: "Connect with industry experts!",
      icon: "🤝",
      color: "bg-orange-500",
      position: "bottom-left" as const,
    },
  ];

  // Initialize popup sequence on component mount
  useEffect(() => {
    if (hasShownOnLoad) return;

    const timer = setTimeout(() => {
      startPopupSequence();
      setHasShownOnLoad(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasShownOnLoad]);

  const startPopupSequence = () => {
    // Step 1: Show particle burst immediately
    setPopupStates((prev) => ({
      ...prev,
      particles: true,
    }));

    // Step 2: Show welcome popup after particle burst
    setTimeout(() => {
      setPopupStates((prev) => ({
        ...prev,
        welcome: true,
      }));
    }, 1500);

    // Step 3: Hide particles
    setTimeout(() => {
      setPopupStates((prev) => ({
        ...prev,
        particles: false,
      }));
    }, 2500);

    // Step 4: Show notifications sequentially
    notifications.forEach((notification, index) => {
      setTimeout(() => {
        setPopupStates((prev) => ({
          ...prev,
          notifications: [
            ...prev.notifications,
            { ...notification, visible: true },
          ],
        }));

        // Auto-hide each notification after 4 seconds
        setTimeout(() => {
          setPopupStates((prev) => ({
            ...prev,
            notifications: prev.notifications.map((n) =>
              n.id === notification.id ? { ...n, visible: false } : n
            ),
          }));
        }, 4000);
      }, 3000 + index * 800);
    });
  };

  const closeWelcome = () => {
    setPopupStates((prev) => ({
      ...prev,
      welcome: false,
    }));
  };

  const hideNotification = (id: string) => {
    setPopupStates((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, visible: false } : n
      ),
    }));
  };

  const triggerParticleBurst = () => {
    setPopupStates((prev) => ({
      ...prev,
      particles: true,
    }));

    setTimeout(() => {
      setPopupStates((prev) => ({
        ...prev,
        particles: false,
      }));
    }, 1500);
  };

  const showWelcomePopup = () => {
    setPopupStates((prev) => ({
      ...prev,
      welcome: true,
    }));
  };

  // Reset all popups (useful for testing)
  const resetPopups = () => {
    setPopupStates({
      welcome: false,
      particles: false,
      notifications: [],
    });
    setHasShownOnLoad(false);
  };

  return {
    popupStates,
    closeWelcome,
    hideNotification,
    triggerParticleBurst,
    showWelcomePopup,
    startPopupSequence,
    resetPopups,
  };
};
