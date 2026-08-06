import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabaseServer";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/category`, lastModified: new Date() },
    { url: `${baseUrl}/ai-chat/fullscreen`, lastModified: new Date() },
  ];

  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("articles")
      .select("id, date, category, updated_at")
      .order("date", { ascending: false });

    const articleRoutes: MetadataRoute.Sitemap = (data ?? []).map((a) => ({
      url: `${baseUrl}/article/${a.id}`,
      lastModified: a.updated_at ?? a.date ?? new Date(),
    }));

    const categories = Array.from(
      new Set((data ?? []).map((a) => a.category).filter(Boolean))
    ) as string[];
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/category?category=${encodeURIComponent(c)}`,
      lastModified: new Date(),
    }));

    return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
  } catch {
    return staticRoutes;
  }
}
