/**
 * 全站唯一的站点根地址来源。
 *
 * metadataBase / openGraph.url / sitemap / robots 都从这里取值，
 * 避免各处各自读环境变量，导致主域名在裸域名和 www 之间摇摆：
 * 一旦不一致，搜索引擎会重复收录，分享卡片也会指向会跳转的地址。
 *
 * 取值优先级：
 *  1. NEXT_PUBLIC_SITE_URL
 *  2. 生产构建兜底 -> https://PRIMARY_HOST
 *  3. 本地开发兜底 -> http://localhost:3000
 *
 * 无论环境变量里配的是裸域名还是 www，最终都会规范化为 www 主域名。
 */

/** 主域名：fork 本项目时改成你自己的域名（统一加 www 前缀） */
export const PRIMARY_HOST = "www.reality-blog.asia";

/** 裸域名，用于把 http://裸域名、https://裸域名 永久重定向到主域名 */
export const APEX_HOST = PRIMARY_HOST.replace(/^www\./, "");

const PRODUCTION_SITE_URL = `https://${PRIMARY_HOST}`;
const DEV_SITE_URL = "http://localhost:3000";

/** 去掉末尾斜杠，便于安全地拼接路径 */
function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

/** 裸域名改写为 www 主域名，并去掉末尾斜杠 */
function normalizeSiteUrl(raw: string): string {
  const trimmed = stripTrailingSlash(raw.trim());
  if (!trimmed) return PRODUCTION_SITE_URL;

  try {
    const url = new URL(trimmed);
    if (url.hostname === APEX_HOST) {
      url.hostname = PRIMARY_HOST;
    }
    return stripTrailingSlash(url.toString());
  } catch {
    // 环境变量写错（非完整 URL）时不要让 sitemap/robots 输出错误地址
    return PRODUCTION_SITE_URL;
  }
}

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const fallbackUrl =
  process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : DEV_SITE_URL;

/** 站点根地址（无末尾斜杠），例如 https://www.reality-blog.asia */
export const siteUrl = normalizeSiteUrl(configuredUrl || fallbackUrl);
