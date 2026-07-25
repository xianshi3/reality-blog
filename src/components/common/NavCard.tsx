"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineHome, HiOutlineViewGrid, HiOutlineChat, HiOutlineChevronDown } from "react-icons/hi";
import ArticleSearch from "@/components/article/ArticleSearch";
import type { Article } from "@/types/article";

interface NavLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", icon: <HiOutlineHome />, label: "首页" },
  { href: "/category", icon: <HiOutlineViewGrid />, label: "分类" },
  { href: "/ai-chat/fullscreen", icon: <HiOutlineChat />, label: "AI Chat" },
];

interface NavCardProps {
  className?: string;
  articles: Article[];
}

export default function NavCard({ className = "", articles }: NavCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const cardBaseClass =
    "bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 sm:p-6 animate-fadeInUp animate-scaleIn";
  const cardHoverClass =
    "transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  return (
    <div className={`${cardBaseClass} ${cardHoverClass} ${className}`}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-wide flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
            <HiOutlineViewGrid className="text-lg text-blue-600 dark:text-blue-400" />
          </div>
          导航
        </h3>
        <HiOutlineChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            !isCollapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          isCollapsed ? "max-h-0 opacity-0 mt-0" : "max-h-[600px] opacity-100 mt-5"
        }`}
      >
        <div className="mb-5">
          <ArticleSearch
            value={search}
            onChange={setSearch}
            isOpen={!isCollapsed}
            articles={articles}
            onSelect={(article) => {
              router.push(article.link);
            }}
          />
        </div>

        <ul className="space-y-1.5">
          {NAV_LINKS.map(({ href, icon, label }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <span className="text-xl flex-shrink-0 text-gray-400 dark:text-gray-500">
                  {icon}
                </span>
                <span className="font-medium text-sm">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
