import { usePathname } from "next/navigation";
import { useCallback } from "react";

export const useActiveNav = () => {
  const pathname = usePathname();

  const isActive = useCallback(
    (href?: string): boolean => {
      if (!href || !pathname) return false;
      const nested = [
        "/events",
        "/teams",
        "/about",
        "/gallery",
        "/contactus",
        // "/recruitment",
        "/hack-a-tron-3.0",
      ];
      const isNested = nested.includes(href);
      if (isNested) {
        // "/events" should NOT highlight when on /events/ongoing/**
        if (href === "/events" && pathname.startsWith("/events/ongoing"))
          return false;
        return pathname.startsWith(href);
      }
      if (href === "/") return pathname === "/";
      // "/events/ongoing" should highlight on detail pages too
      if (href === "/events/ongoing")
        return pathname.startsWith("/events/ongoing");
      return pathname === href;
    },
    [pathname],
  );

  return isActive;
};
