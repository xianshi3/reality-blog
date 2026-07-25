"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHashtag, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { parseTags } from "@/lib/parseTags";

interface TagListProps {
  tags: string[] | string | undefined;
}

const DEFAULT_VISIBLE_TAGS = 6;
const MAX_VISIBLE_TAGS_EXPANDED = 12;

// 标签入场动画变体
const tagVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.02,
      duration: 0.25,
      ease: "easeOut" as const,
    },
  }),
};

// 展开按钮动画
const expandButtonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
};

function TagItem({
  label,
  index,
}: {
  label: string;
  index: number;
}) {
  return (
    <motion.a
      href={`/category?tag=${encodeURIComponent(label)}`}
      custom={index}
      initial="hidden"
      animate="visible"
      variants={tagVariants}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="
        inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full
        bg-gray-100 dark:bg-gray-700
        text-gray-700 dark:text-gray-200
        hover:bg-gray-200 dark:hover:bg-gray-600
        hover:text-gray-900 dark:hover:text-white
        transition-colors duration-200
        cursor-pointer
        whitespace-nowrap
        shadow-sm hover:shadow-md
        no-underline
      "
    >
      #{label}
    </motion.a>
  );
}

export default function TagList({ tags }: TagListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tagArray = useMemo(() => parseTags(tags), [tags]);

  const visibleTags = isExpanded
    ? tagArray.slice(0, MAX_VISIBLE_TAGS_EXPANDED)
    : tagArray.slice(0, DEFAULT_VISIBLE_TAGS);

  const hasMore = tagArray.length > DEFAULT_VISIBLE_TAGS;

  if (tagArray.length === 0) return null;

  return (
    <div className="tag-list-wrapper">
      {/* 标签列表 */}
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag: string, idx: number) => (
          <TagItem key={tag} label={tag} index={idx} />
        ))}

        {/* 展开/收起按钮 */}
        <AnimatePresence>
          {hasMore && (
            <motion.button
              initial="hidden"
              animate="visible"
              variants={expandButtonVariants}
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full
                bg-gray-100 dark:bg-gray-700
                text-gray-500 dark:text-gray-400
                hover:bg-gray-200 dark:hover:bg-gray-600
                transition-colors duration-200
                cursor-pointer
              "
            >
              {isExpanded ? (
                <>
                  <FaChevronUp className="text-xs" />
                  收起
                </>
              ) : (
                <>
                  <FaChevronDown className="text-xs" />
                  更多 ({tagArray.length - DEFAULT_VISIBLE_TAGS})
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}