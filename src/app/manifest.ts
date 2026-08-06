import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reality Blog",
    short_name: "Reality",
    description: "Reality 的个人技术博客：探索技术与世界的边界",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f23",
    theme_color: "#6366f1",
    lang: "zh-CN",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/avatar.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
