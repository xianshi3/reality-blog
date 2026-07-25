"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineHashtag, HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import type { Article } from "@/types/article";
import { parseTags } from "@/lib/parseTags";

interface TagCardProps {
  articles: Article[];
}

const DEFAULT_VISIBLE_TAGS = 12;

function TagItem({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 cursor-pointer whitespace-nowrap border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
    >
      #{label}
      <span className="text-xs opacity-50">({count})</span>
    </span>
  );
}

export default function TagCard({ articles }: TagCardProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const tagMap = useMemo(() => {
    if (!articles) return [];

    const map = new Map<string, number>();

    articles.forEach((article) => {
      if (!article.tags) return;

      const tagArray = parseTags(article.tags);
      tagArray.forEach((tag: string) => {
        map.set(tag, (map.get(tag) || 0) + 1);
      });
    });

    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  const visibleTags = isExpanded ? tagMap : tagMap.slice(0, DEFAULT_VISIBLE_TAGS);

  const hasMore = tagMap.length > DEFAULT_VISIBLE_TAGS;

  return (
    <div className="bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 sm:p-6 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl">

      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <HiOutlineHashtag className="text-base text-gray-500 dark:text-gray-400" />
          标签
        </h3>
        <HiOutlineChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            !isCollapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          isCollapsed ? "max-h-0 opacity-0 mt-0" : "max-h-[2000px] opacity-100 mt-4"
        }`}
      >
        <div className="w-full h-px bg-gray-200 dark:bg-gray-800 mb-4" />

        <div className="flex flex-wrap gap-2">
          <TagItem
            label="全部"
            count={articles?.length || 0}
            onClick={() => router.push("/category")}
          />

          {visibleTags.map(([tag, count]) => (
            <TagItem
              key={tag}
              label={tag}
              count={count}
              onClick={() =>
                router.push(`/category?tag=${encodeURIComponent(tag)}`)
              }
            />
          ))}

          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              {isExpanded ? (
                <><HiOutlineChevronUp className="text-xs" /> 收起</>
              ) : (
                <><HiOutlineChevronDown className="text-xs" /> 更多 ({tagMap.length - DEFAULT_VISIBLE_TAGS})</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
