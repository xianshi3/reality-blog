"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineChevronDown, HiOutlineX, HiOutlineArrowRight } from "react-icons/hi";
import { parseTags } from "@/lib/parseTags";
import type { Article } from "@/types/article";

interface SearchCardProps {
  articles: Article[];
}

const containerVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { staggerChildren: 0.03 },
  },
  exit: { opacity: 0, y: -8, scale: 0.98 },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
} as const;

export default function SearchCard({ articles }: SearchCardProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredArticles = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter((a) => {
      if (a.title.toLowerCase().includes(q)) return true;
      if (a.summary?.toLowerCase().includes(q)) return true;
      const tags = parseTags(a.tags);
      if (tags.some((t) => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [articles, query]);

  const showResults = query.trim().length > 0;

  useEffect(() => {
    setHighlightIdx(-1);
  }, [query]);

  useEffect(() => {
    if (!isCollapsed && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCollapsed]);

  const selectArticle = useCallback(
    (article: Article) => {
      router.push(article.link);
      setQuery("");
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showResults || filteredArticles.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev < filteredArticles.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev > 0 ? prev - 1 : filteredArticles.length - 1
        );
      } else if (e.key === "Enter" && highlightIdx >= 0) {
        e.preventDefault();
        selectArticle(filteredArticles[highlightIdx]);
      }
    },
    [showResults, filteredArticles, highlightIdx, selectArticle]
  );

  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightIdx]) {
        (items[highlightIdx] as HTMLElement).scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightIdx]);

  function highlightText(text: string, keyword: string) {
    if (!keyword.trim()) return text;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark
          key={i}
          className="bg-yellow-200 dark:bg-yellow-600/40 text-inherit rounded-sm px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  return (
    <div className="bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 sm:p-6 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl">

      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <HiOutlineSearch className="text-base text-gray-500 dark:text-gray-400" />
          搜索
        </h3>
        <HiOutlineChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            !isCollapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0 mt-0" : "max-h-[600px] opacity-100 mt-4"
        }`}
      >
        <div className="w-full h-px bg-gray-200 dark:bg-gray-800 mb-4" />

        <div className="relative">
          <motion.div
            className="relative"
            initial={false}
            animate={
              query
                ? { scale: 1.02, y: -2 }
                : { scale: 1, y: 0 }
            }
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <HiOutlineSearch
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${
                  query
                    ? "text-gray-600 dark:text-gray-300"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
              <input
                ref={inputRef}
                type="text"
                aria-label="搜索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="
                  w-full pl-10 pr-9 py-3 rounded-xl text-sm
                  transition-all duration-300 outline-none
                  bg-gray-100 dark:bg-[#2a2f3a]
                  text-gray-800 dark:text-gray-200
                  border-2 border-transparent
                  focus:bg-white dark:focus:bg-[#2f3545]
                  focus:border-gray-300 dark:focus:border-gray-600
                  focus:shadow-lg
                  hover:bg-gray-50 dark:hover:bg-[#2f3545]
                  placeholder:text-transparent
                "
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-150"
                  >
                    <HiOutlineX className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {showResults && filteredArticles.length > 0 && (
              <motion.div
                key="results"
                ref={listRef}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-3 space-y-1 overflow-y-auto max-h-72"
              >
                <div className="flex items-center gap-2 px-1 mb-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wider uppercase">
                    {filteredArticles.length} 篇
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                </div>

                {filteredArticles.map((article, idx) => (
                  <motion.div
                    key={article.id}
                    variants={itemVariants}
                    onClick={() => selectArticle(article)}
                    className={`
                      group relative px-3 py-3 rounded-xl cursor-pointer
                      transition-all duration-200 ease-out
                      ${
                        idx === highlightIdx
                          ? "bg-gray-100 dark:bg-gray-700 shadow-sm"
                          : "hover:bg-gray-50 dark:hover:bg-[#2a2f3a]"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                            {highlightText(article.title, query)}
                          </span>
                          <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {article.category}
                          </span>
                        </div>
                        {article.summary && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-1">
                            {highlightText(article.summary, query)}
                          </p>
                        )}
                      </div>
                      <HiOutlineArrowRight
                        className={`
                          flex-shrink-0 w-4 h-4 mt-0.5
                          transition-all duration-200
                          ${
                            idx === highlightIdx
                              ? "opacity-100 translate-x-0 text-gray-600 dark:text-gray-300"
                              : "opacity-0 -translate-x-2 text-gray-400"
                          }
                          group-hover:opacity-100 group-hover:translate-x-0
                        `}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {showResults && filteredArticles.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-4 py-10 text-center"
              >
                <div className="relative inline-flex items-center justify-center w-14 h-14 mb-3">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  <HiOutlineSearch className="relative w-5 h-5 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">无匹配结果</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
