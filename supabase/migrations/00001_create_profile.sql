-- 在 Supabase SQL Editor 中执行

CREATE TABLE IF NOT EXISTS public.profile (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL DEFAULT 'Reality',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  avatar_url TEXT NOT NULL DEFAULT '/avatar.png',
  github_url TEXT NOT NULL DEFAULT 'https://github.com/xianshi3',
  twitter_url TEXT NOT NULL DEFAULT 'https://x.com/xianshi_3',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- 允许所有用户读取（前台展示）
CREATE POLICY "profile_select_public" ON public.profile
  FOR SELECT USING (true);

-- 仅允许已认证用户修改（后台管理）
CREATE POLICY "profile_update_auth" ON public.profile
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "profile_insert_auth" ON public.profile
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 插入默认数据
INSERT INTO public.profile (id, name, title, avatar_url, github_url, twitter_url)
VALUES (1, 'Reality', 'Full Stack Developer', '/avatar.png', 'https://github.com/xianshi3', 'https://x.com/xianshi_3')
ON CONFLICT (id) DO NOTHING;
