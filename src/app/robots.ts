// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/admin/", "/dashboard/"],
      },
    ],
    sitemap: "https://gdgvitb.in/sitemap.xml",
  };
}
