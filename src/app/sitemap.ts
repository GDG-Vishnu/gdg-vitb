import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gdgvitb.in";
  const currentDate = new Date();

  // Static routes with priority and change frequency
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contactus`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
  ];

  // TODO: Add dynamic event routes when you have event data
  // Example:
  // const events = await fetchEvents();
  // const eventRoutes = events.map((event) => ({
  //   url: `${baseUrl}/events/${event.id}`,
  //   lastModified: new Date(event.updatedAt),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }));

  return routes;
}
