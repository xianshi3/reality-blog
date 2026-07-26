"use client";

import { useEffect, useState } from "react";
import TechStackCard from "@/components/common/TechStackCard";
import SearchCard from "@/components/common/SearchCard";
import TagCard from "@/components/article/TagCard";
import ImageWithLoader from "@/components/common/ImageWithLoader";
import { FaUser, FaGithub, FaXTwitter } from "react-icons/fa6";
import type { Article } from "@/types/article";

interface Profile {
  name: string;
  title: string;
  avatar_url: string;
  github_url: string;
  twitter_url: string;
}

interface RightSidebarProps {
  articles: Article[];
  className?: string;
}

export default function RightSidebar({
  articles,
  className,
}: RightSidebarProps) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProfile(data);
      });
  }, []);

  const cardClass =
    "bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  const p = profile;

  return (
    <aside className={`lg:w-72 w-full space-y-6 ${className ?? ""}`}>

      <div className={`${cardClass} flex flex-col items-center text-center`}>

        <div className="mb-4 p-1 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 shadow-sm">
          {p?.avatar_url ? (
            <ImageWithLoader
              src={p.avatar_url}
              alt="头像"
              wrapperClassName="w-24 h-24 rounded-xl"
              className="w-24 h-24 rounded-xl object-cover ring-1 ring-white/50 dark:ring-white/20 shadow-lg hover:scale-105"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FaUser className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
          <FaUser className="text-base opacity-80" />
          {p?.name || "Reality"}
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {p?.title || "Full Stack Developer"}
        </p>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-4" />

        <div className="flex justify-center gap-4">
          <a
            href={p?.github_url || "https://github.com/xianshi3"}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-md"
          >
            <FaGithub className="w-5 h-5" />
          </a>

          <a
            href={p?.twitter_url || "https://x.com/xianshi_3"}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-md"
          >
            <FaXTwitter className="w-5 h-5" />
          </a>
        </div>
      </div>

      <TechStackCard articles={articles} />

      <SearchCard articles={articles} />

      <TagCard articles={articles} />

    </aside>
  );
}
