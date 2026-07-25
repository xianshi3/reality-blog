"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TechStackCard from "@/components/common/TechStackCard";
import TagCard from "@/components/article/TagCard";
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
    "relative bg-white/70 dark:bg-[#23272f]/70 backdrop-blur-md border border-white/40 dark:border-gray-700/40 rounded-2xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  const p = profile;

  return (
    <aside className={`lg:w-72 w-full space-y-6 ${className ?? ""}`}>

      <div className={`${cardClass} flex flex-col items-center text-center`}>

        <div className="mb-4 p-1 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-md shadow-sm">
          <Image
            src={p?.avatar_url || "/avatar.png"}
            alt="头像"
            width={96}
            height={96}
            sizes="96px"
            quality={100}
            priority
            className="rounded-xl object-cover ring-1 ring-white/50 dark:ring-white/20 shadow-lg transition-transform duration-300 hover:scale-105"
          />
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
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-md"
          >
            <FaGithub className="w-5 h-5" />
          </a>

          <a
            href={p?.twitter_url || "https://x.com/xianshi_3"}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-md"
          >
            <FaXTwitter className="w-5 h-5" />
          </a>
        </div>
      </div>

      <TechStackCard />

      <TagCard articles={articles} />

    </aside>
  );
}
