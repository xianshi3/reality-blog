"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineChevronDown, HiOutlineRefresh } from "react-icons/hi";
import type { Article } from "@/types/article";

interface RandomArticleCardProps {
  articles: Article[];
}

export default function RandomArticleCard({ articles }: RandomArticleCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);

  const getRandomArticle = () => {
    if (articles.length === 0) {
      setArticle(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * articles.length);
    setArticle(articles[randomIndex]);
  };

  useEffect(() => {
    getRandomArticle();
  }, [articles]);

  return (
    <div className="bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 animate-fadeInUp animate-scaleIn
    transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <HiOutlineRefresh className="text-base text-gray-500 dark:text-gray-400" />
          随机日志
        </h3>
        <HiOutlineChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            !isCollapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          isCollapsed ? "max-h-0 opacity-0 mt-0" : "max-h-96 opacity-100 mt-3"
        }`}
      >
        {article ? (
          <>
            <div className="flex justify-end mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  getRandomArticle();
                }}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                换一篇
              </button>
            </div>
            <Link href={article.link} className="space-y-2 block text-left">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {article.summary || "暂无摘要"}
              </p>
            </Link>
            <div className="mt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{article.category || "未分类"}</span>
              <span>
                {new Date(article.date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 dark:text-gray-400">暂无推荐文章</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                getRandomArticle();
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              重试
            </button>
          </>
        )}
      </div>
    </div>
  );
}
