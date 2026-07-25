"use client";
import { useState } from "react";
import { HiOutlineChevronDown, HiOutlineBell } from "react-icons/hi";

interface AnnouncementCardProps {
  totalCount: number;
  message?: string;
}

export default function AnnouncementCard({
  totalCount,
  message = "目前我会在有空闲时间更新博客，内容还在持续完善中",
}: AnnouncementCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const cardBaseClass =
    "bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 animate-fadeInUp animate-scaleIn";
  const cardHoverClass =
    "transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`${cardBaseClass} ${cardHoverClass}`}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <HiOutlineBell className="text-base text-gray-500 dark:text-gray-400" />
          公告
        </h3>
        <HiOutlineChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            !isCollapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          isCollapsed ? "max-h-0 opacity-0 mt-0" : "max-h-96 opacity-100 mt-5"
        }`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {message}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>文章总数：{totalCount}</div>
          <div>今日日期：{today}</div>
        </div>
      </div>
    </div>
  );
}
