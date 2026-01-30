import { useState, useEffect, useCallback } from "react";

export const useResponsive = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const handleResize = useCallback(() => {
    const w = window.innerWidth;
    setIsMobile(w < 1024);
    setIsTablet(w >= 1024 && w < 1280);
    if (w >= 1024) setMobileOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return {
    mobileOpen,
    setMobileOpen,
    isMobile,
    isTablet,
    mounted,
  };
};
