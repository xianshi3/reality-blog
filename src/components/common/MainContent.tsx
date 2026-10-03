"use client";

import Link from "next/link";
import ImageWithLoader from "@/components/common/ImageWithLoader";
import ArticleCardFooter from "@/components/common/ArticleCardFooter";
import type { Article } from "@/types/article";

interface MainContentProps {
  articles: Article[];
  className?: string;
  currentPage?: number;
}

/**
 * 主内容组件
 * 功能：
 * - 直接按时间顺序展示文章
 * - 切页时通过 key 重挂载触发入场动画
 */
export default function MainContent({
  articles,
  className = "",
  currentPage = 1,
}: MainContentProps) {

  return (
    <main className={`space-y-8 ${className}`}>

      {/* ===================== */}
      {/* 文章列表 */}
      {/* ===================== */}

      <div key={currentPage}>
        {/* 响应式瀑布流：无侧栏时双栏，xl 起侧栏出现收窄为单栏，2xl 再回到双栏 */}
        <div className="columns-1 gap-x-6 md:columns-2 xl:columns-1 2xl:columns-2">

          {articles.map((article, index) => (
            <div key={article.link} className="break-inside-avoid mb-6">
              <Link
                href={article.link}
                className="article-item group flex flex-col w-full overflow-hidden"
                style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
              >

                {/* 封面图 */}
                {article.image_url && (
                  <div className="w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-[#1e2128] p-3">
                    <ImageWithLoader
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-auto object-contain rounded-lg shadow-sm"
                      wrapperClassName="w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                      loading="eager"
                    />
                  </div>
                )}

                {/* 文章内容 */}
                <div className="flex flex-col mt-4">

                  {/* 标题 + 分类 */}
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="article-title flex-1">
                      {article.title}
                    </h3>
                    {article.category && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 mt-0.5">
                        {article.category}
                      </span>
                    )}
                  </div>

                  {/* 摘要 */}
                  <p className="article-summary mb-3">
                    {article.summary}
                  </p>

                  {/* 标签 */}
                  {article.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(Array.isArray(article.tags) ? article.tags : (article.tags as string).split(',')).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[11px] rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* AI 一句话梗概 */}
                  <ArticleCardFooter articleId={article.id} date={article.date} />

                </div>
              </Link>
            </div>
          ))}

        </div>
      </div>

    </main>
  );
}
