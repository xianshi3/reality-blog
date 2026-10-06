import { APEX_HOST, PRIMARY_HOST } from "./src/config/site";

// 从环境变量动态读取 Supabase 域名，避免硬编码，方便 fork 与多环境部署
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost = "";
if (supabaseUrl) {
  try {
    supabaseHost = new URL(supabaseUrl).hostname;
  } catch {
    supabaseHost = "";
  }
}

const nextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  /**
   * 裸域名永久重定向（308）到 www 主域名。
   * 只匹配 Host 为裸域名的请求，本地开发（localhost）不受影响。
   * 与 `@/config/site` 的主域名保持同一来源，改域名只改一处。
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: APEX_HOST }],
        destination: `https://${PRIMARY_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
