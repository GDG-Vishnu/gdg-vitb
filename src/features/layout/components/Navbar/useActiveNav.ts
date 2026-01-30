import { usePathname } from "next/navigation";
import { useCallback } from "react";

export const useActiveNav = () => {
  const pathname = usePathname();

  const isActive = useCallback(
    (href?: string): boolean => {
      if (!href || !pathname) return false;
      const legacy = href === "/" ? "/client" : `/client${href}`;
      const legacyAlt = href === "/teams" ? "/client/Teams" : undefined;
      const nested = [
        "/events",
        "/teams",
        "/about",
        "/gallery",
        "/contactus",
        "/recruitment",
        "/hack-a-tron-3.0",
      ];
      const isNested = nested.includes(href);
      if (isNested)
        return (
          pathname.startsWith(href) ||
          pathname.startsWith(legacy) ||
          (legacyAlt ? pathname.startsWith(legacyAlt) : false)
        );
      if (href === "/") return pathname === "/" || pathname === legacy;
      return (
        pathname === href ||
        pathname === legacy ||
        (legacyAlt ? pathname === legacyAlt : false)
      );
    },
    [pathname]
  );

  return isActive;
};
