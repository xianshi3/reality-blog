"use client";

import Link from "next/link";
import { FiHome, FiArrowLeft } from "react-icons/fi";

export default function MobileArticleNav({ title }: { title: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-3 py-2.5 bg-white/90 dark:bg-[#23272f]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 md:hidden">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex-shrink-0"
      >
        <FiHome className="w-4 h-4" />
        <span>首页</span>
      </Link>
      <span className="text-xs text-gray-300 dark:text-gray-600">|</span>
      <span className="text-sm text-gray-800 dark:text-gray-200 truncate min-w-0">
        {title}
      </span>
    </nav>
  );
}
