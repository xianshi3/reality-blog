"use client";

import { useState, useEffect } from 'react';
import type { Article } from '../types/article';

interface RandomArticleCardProps {
  articles: Article[];
  onArticleChange?: (article: Article) => void;
  initialLoadDelay?: number;
}

export default function RandomArticleCard({ 
  articles, 
  onArticleChange,
  initialLoadDelay = 800
}: RandomArticleCardProps) {
  const [randomArticle, setRandomArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const getRandomArticle = () => {
    if (articles.length === 0) {
      setRandomArticle(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setShowAnswer(false);
    setIsFlipping(true);
    setIsSpinning(true);
    setHasInteracted(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * articles.length);
      const selectedArticle = articles[randomIndex];
      
      const articleWithSafeTags = {
        ...selectedArticle,
        tags: Array.isArray(selectedArticle.tags) ? selectedArticle.tags : []
      };
      
      setRandomArticle(articleWithSafeTags);
      setIsLoading(false);
      
      if (onArticleChange) {
        onArticleChange(articleWithSafeTags);
      }

      setTimeout(() => {
        setIsFlipping(false);
        setIsSpinning(false);
      }, 300);
    }, hasInteracted ? 500 : initialLoadDelay);
  };

  useEffect(() => {
    getRandomArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]);

  const renderTags = () => {
    if (!randomArticle?.tags || randomArticle.tags.length === 0) {
      return <span className="text-gray-400 dark:text-gray-500">暂无标签</span>;
    }
    return randomArticle.tags.map((tag, index) => (
      <span key={tag} className="inline-flex items-center">
        {tag}
        {index < randomArticle.tags!.length - 1 && (
          <span className="mx-1 text-gray-300 dark:text-gray-600">·</span>
        )}
      </span>
    ));
  };

  const renderCategory = () => {
    if (!randomArticle?.category) {
      return <span className="text-gray-400 dark:text-gray-500">未分类</span>;
    }
    return (
      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs">
        {randomArticle.category}
      </span>
    );
  };

  const renderDate = () => {
    if (!randomArticle?.date) return null;
    return (
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(randomArticle.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </span>
    );
  };

  // 默认显示3星难度
  const renderDifficulty = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span 
          key={i} 
          className={`w-3 h-3 rounded-full ${i <= 3 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
        />
      ))}
    </div>
  );

  // 默认显示0阅读量
  const renderViews = () => (
    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full">
      阅读量: 0
    </span>
  );

  return (
    <div className={`bg-white/90 dark:bg-[#23272f]/90 backdrop-blur-sm rounded-2xl p-6 font-sans shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${isFlipping ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          <span className={`inline-flex items-center mr-2 ${isSpinning ? 'animate-spin' : ''}`}>🎲</span>
          随机文章挑战
        </h3>
        {randomArticle && (
          <button 
            onClick={getRandomArticle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="换一篇"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 transition-opacity duration-200">
          看看今天为你推荐什么文章？
        </p>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4 py-2">
            <div className="h-4 bg-gray-200/80 dark:bg-gray-700/80 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200/80 dark:bg-gray-700/80 rounded w-full"></div>
              <div className="h-3 bg-gray-200/80 dark:bg-gray-700/80 rounded w-5/6"></div>
            </div>
            <div className="flex gap-2 pt-4">
              <div className="h-8 bg-gray-200/80 dark:bg-gray-700/80 rounded-lg w-1/2"></div>
              <div className="h-8 bg-gray-200/80 dark:bg-gray-700/80 rounded-lg w-1/2"></div>
            </div>
          </div>
        ) : randomArticle ? (
          <>
            {!showAnswer ? (
              <div className="bg-blue-50/70 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/50 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-blue-700 dark:text-blue-300 font-medium animate-fadeIn">
                    猜猜这篇文章关于什么？
                  </p>
                  {renderCategory()}
                </div>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 transition-opacity delay-75">
                  <span className="font-medium mr-1">标签:</span>
                  <div className="inline-flex flex-wrap items-center gap-1">
                    {renderTags()}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-opacity delay-100">
                  <span className="font-medium">难度:</span>
                  {renderDifficulty()}
                </div>
              </div>
            ) : (
              <div className="bg-green-50/70 dark:bg-green-900/30 p-4 rounded-lg border border-green-200/50 dark:border-green-800/50 animate-flipIn backdrop-blur-sm">
                <h4 className="font-bold text-green-700 dark:text-green-300 animate-fadeIn delay-150 line-clamp-2">
                  {randomArticle.title}
                </h4>
                <p className="text-sm mt-2 text-gray-800 dark:text-gray-200 animate-fadeIn delay-200 line-clamp-3">
                  {randomArticle.summary || '暂无摘要'}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  {renderDate()}
                  {renderViews()}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg  font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  揭晓答案
                </button>
              ) : (
                <a
                  href={randomArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg  font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  阅读全文
                </a>
              )}
              <button
                onClick={getRandomArticle}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] border border-gray-200 dark:border-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                换一篇
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 animate-fadeIn">暂无文章数据</p>
            <button
              onClick={getRandomArticle}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              重新加载
            </button>
          </div>
        )}
      </div>
    </div>
  );
}