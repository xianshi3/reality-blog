/**
 * @file ArticlePage.tsx
 * @description 博客文章详情页，支持文章内容展示、目录、点赞、AI 聊天、返回首页等功能。
 *
 * 功能点：
 * - 从 Supabase 获取文章数据
 * - 展示文章标题、时间、分类、摘要、正文、标签
 * - 提供点赞功能 (LikeButton)
 * - 显示阅读进度条 (ReadingProgress)
 * - 显示文章目录 (ArticleToc)
 * - 提供 AI 聊天助手 (AIChat)
 * - 固定返回首页按钮 (ReturnHome)
 * - 页面底部 Footer
 *
 * @dependency Supabase, Next.js Server Components
 */

import type { Article } from '@/types/article';
import Footer from '@/components/layout/Footer';
import LikeButton from '@/components/common/LikeButton';
import { createServerSupabase } from '@/lib/supabaseServer';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleToc from '@/components/article/ArticleToc';
import ReturnHome from '@/components/common/ReturnHome';
import MobileArticleNav from '@/components/common/MobileArticleNav';
import TagList from '@/components/article/TagList';
import AIChat from '@/components/chat/AIChat';
import { Suspense } from 'react';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  // 解析路由参数（文章 ID）
  const { id } = await params;

  // 创建 Supabase 实例
  const supabase = await createServerSupabase();

  // 从数据库获取单篇文章
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();

  // 如果文章不存在或查询出错，显示错误信息
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen home-container">
        <div className="bg-red-100 text-red-700 p-6 rounded shadow animate-fadeInUp">
          <h2 className="font-bold text-lg mb-2">文章未找到</h2>
          <p>{error?.message}</p>
        </div>
      </div>
    );
  }

  // 构建 Article 类型对象，处理 tags 和链接
  const article: Article = {
    ...data,
    link: `/article/${data.id}`,
    tags: data.tags ? data.tags.split(',') : [],
  };

  // 当前年份（用于 Footer）
  const currentYear = new Date().getFullYear();

  // 格式化日期
  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '未知日期';

  return (
    <>
    <div className="article-page-container">
      {/* 固定返回首页按钮（桌面端） */}
      <div className="hidden md:block">
        <ReturnHome />
      </div>

      {/* 移动端顶部导航条 */}
      <MobileArticleNav title={article.title} />

      <div className="article-container">
        <main className="article-page-main">
          <article className="article-content">
            <h1 className="article-page-title">{article.title}</h1>

            <div className="article-page-meta">
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{article.category}</span>
            </div>

            {article.summary && <div className="article-page-summary">{article.summary}</div>}

            <ArticleContent content={article.content ?? ''} />

            <div className="tag-like-container">
              <TagList tags={article.tags ?? []} />
              <LikeButton articleId={article.id} initialLikes={article.likes ?? 0} />
            </div>
          </article>
        </main>

        <aside className="article-toc">
          <ArticleToc />
        </aside>
      </div>

      {/* 页脚 */}
      <Footer currentYear={currentYear} />
    </div>

    <Suspense fallback={null}>
      <AIChat />
    </Suspense>

    </>
  );
}
