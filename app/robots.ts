import type { MetadataRoute } from "next";
import content from "@/content/site.json";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = content.seo.siteUrl.startsWith("[[") ? "http://localhost:3000" : content.seo.siteUrl;
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
