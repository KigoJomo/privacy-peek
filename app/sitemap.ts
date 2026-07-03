import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return [
      {
        url: "https://privacy-peek.vercel.app",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }

  const site_ids = await fetchQuery(api.sites.getAllSiteIds);

  const sites: MetadataRoute.Sitemap = site_ids.map((id) => {
    return {
      url: `https://privacy-peek.vercel.app/site/${id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    }
  })

  return [
    {
      url: "https://privacy-peek.vercel.app",
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...sites
  ]
}
