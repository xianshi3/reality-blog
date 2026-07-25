-- 为已有 profile 表添加视差背景相关字段
-- 如果表还不存在这些列，执行下方 SQL

ALTER TABLE public.profile
  ADD COLUMN IF NOT EXISTS parallax_image_url text NOT NULL DEFAULT '/parallax-bg.png',
  ADD COLUMN IF NOT EXISTS parallax_title text NOT NULL DEFAULT 'Reality Blog',
  ADD COLUMN IF NOT EXISTS parallax_subtitle text NOT NULL DEFAULT '探索技术与世界的边界';
