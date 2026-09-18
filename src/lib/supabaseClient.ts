import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // 运行时抛错，不阻塞构建
    throw new Error('Missing Supabase environment variables');
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

// 使用 Proxy 懒加载，保持原有调用方式 supabase.from(...)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: keyof SupabaseClient) {
    return getSupabaseClient()[prop];
  },
});
