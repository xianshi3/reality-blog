import { createServerSupabaseAdmin } from "@/lib/supabaseServer";

// 进程内限流兜底：单实例部署或未配置 service role 时使用
const rateHits = new Map<string, number[]>();
const CLEANUP_THRESHOLD = 10_000;

function isRateLimitedInMemory(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const hits = (rateHits.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  rateHits.set(key, hits);

  if (rateHits.size > CLEANUP_THRESHOLD) {
    const cutoff = now - windowMs;
    for (const [k, ts] of rateHits) {
      // 快速路径：如果最新时间戳都过期，直接删除
      if (ts[ts.length - 1] < cutoff) {
        rateHits.delete(k);
      } else {
        // 否则过滤过期时间戳
        const fresh = ts.filter((t) => t >= cutoff);
        if (fresh.length === 0) rateHits.delete(k);
        else rateHits.set(k, fresh);
      }
    }
  }

  return hits.length > max;
}

/**
 * 跨实例限流：借助 Supabase 数据库共享计数（service role 调用 RPC），
 * 避免 Serverless 多实例下进程内限流失效；数据库不可用时回退到进程内限流。
 *
 * @param key      限流键（建议带命名空间，如 `chat:1.2.3.4`）
 * @param windowMs 时间窗口（毫秒）
 * @param max      窗口内允许的最大请求数
 * @returns 是否应被限流
 */
export async function isRateLimited(key: string, windowMs: number, max: number): Promise<boolean> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return isRateLimitedInMemory(key, windowMs, max);
  }

  try {
    const supabase = createServerSupabaseAdmin();
    const { data, error } = await supabase.rpc("rate_limit_check", {
      p_key: key,
      p_window_ms: windowMs,
      p_max: max,
    });

    if (!error && typeof data === "boolean") {
      return !data;
    }
  } catch {
    // 忽略，回退到进程内限流
  }

  return isRateLimitedInMemory(key, windowMs, max);
}

/** 从请求头解析客户端 IP（取 x-forwarded-for 第一段） */
export function getClientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
}
