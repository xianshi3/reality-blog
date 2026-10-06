import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabaseServer";
import { siteUrl } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/category`, lastModified: new Date() },
    { url: `${siteUrl}/ai-chat/fullscreen`, lastModified: new Date() },
  ];

  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("articles")
      .select("id, date, category")
      .order("date", { ascending: false });

    const articleRoutes: MetadataRoute.Sitemap = (data ?? []).map((a) => ({
      url: `${siteUrl}/article/${a.id}`,
      lastModified: a.date ?? new Date(),
    }));

    const categories = Array.from(
      new Set((data ?? []).map((a) => a.category).filter(Boolean))
    ) as string[];
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${siteUrl}/category?category=${encodeURIComponent(c)}`,
      lastModified: new Date(),
    }));

    return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
  } catch {
    return staticRoutes;
  }
}
