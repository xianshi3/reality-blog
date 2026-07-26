"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";
import ImageWithLoader from "@/components/common/ImageWithLoader";
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
 * - 支持切换动画
 */
export default function MainContent({
  articles,
  className = "",
  currentPage = 1,
}: MainContentProps) {

  const [displayPage, setDisplayPage] = useState(currentPage);
  const [transitionStage, setTransitionStage] =
    useState<"enter" | "exit">("enter");

  /**
   * 页码切换动画
   */
  useEffect(() => {
    if (currentPage !== displayPage) {
      setTransitionStage("exit");

      const timer = setTimeout(() => {
        setDisplayPage(currentPage);
        setTransitionStage("enter");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentPage, displayPage]);

  return (
    <main className={`space-y-8 ${className}`}>

      {/* ===================== */}
      {/* 文章列表 */}
      {/* ===================== */}

      <div
        key={displayPage}
        className={
          transitionStage === "enter"
            ? "page-transition-enter-active"
            : "page-transition-exit-active"
        }
      >
        {/* 统一 grid，不再分年份 */}
        <div className="md:columns-2 columns-1 gap-x-6">

          {articles.map((article) => (
            <div key={article.link} className="break-inside-avoid mb-6">
              <Link
                href={article.link}
                className="article-item group flex flex-col w-full overflow-hidden"
              >

                {/* 封面图 */}
                {article.image_url && (
                  <div className="w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-[#1e2128] p-3">
                    <ImageWithLoader
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-auto object-contain rounded-lg shadow-sm"
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

                  {/* 底部信息 */}
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span>
                      {article.date
                        ? new Date(article.date).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "未知日期"}
                    </span>

                    <FiBookOpen className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-200" />
                  </div>

                </div>
              </Link>
            </div>
          ))}

        </div>
      </div>

    </main>
  );
}
