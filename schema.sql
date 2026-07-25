-- ============================================================
-- Reality Blog - 数据库完整建表脚本
-- 在 Supabase SQL Editor 中执行即可
-- ============================================================

-- ==================== 文章表 ====================
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date timestamp without time zone DEFAULT now(),
  category text,
  summary text,
  content text,
  tags text DEFAULT '{}',
  image_url text,
  likes integer DEFAULT 0,
  CONSTRAINT articles_pkey PRIMARY KEY (id)
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 前台匿名可读
CREATE POLICY "articles_select_public" ON public.articles
  FOR SELECT USING (true);

-- 后台认证用户可增删改
CREATE POLICY "articles_insert_auth" ON public.articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "articles_update_auth" ON public.articles
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "articles_delete_auth" ON public.articles
  FOR DELETE USING (auth.role() = 'authenticated');

-- ==================== 个人信息表 ====================
CREATE TABLE IF NOT EXISTS public.profile (
  id integer NOT NULL DEFAULT 1 CHECK (id = 1),
  name text NOT NULL DEFAULT 'Reality',
  title text NOT NULL DEFAULT 'Full Stack Developer',
  avatar_url text NOT NULL DEFAULT '/avatar.png',
  github_url text NOT NULL DEFAULT 'https://github.com/xianshi3',
  twitter_url text NOT NULL DEFAULT 'https://x.com/xianshi_3',
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_pkey PRIMARY KEY (id)
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_select_public" ON public.profile
  FOR SELECT USING (true);

CREATE POLICY "profile_insert_auth" ON public.profile
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "profile_update_auth" ON public.profile
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 插入默认个人信息
INSERT INTO public.profile (id, name, title, avatar_url, github_url, twitter_url)
VALUES (1, 'Reality', 'Full Stack Developer', '/avatar.png', 'https://github.com/xianshi3', 'https://x.com/xianshi_3')
ON CONFLICT (id) DO NOTHING;

-- ==================== 存储桶 ====================
-- 在 Supabase Dashboard → Storage 手动创建 article-images 桶
-- 或者执行下方 SQL（需要 service_role key，建议在 Dashboard 操作）
-- INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);
