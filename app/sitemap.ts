import type { MetadataRoute } from "next";
import content from "@/content/site.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = content.seo.siteUrl.startsWith("[[") ? "http://localhost:3000" : content.seo.siteUrl;
  return [{ url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
