"use client";

import { useEffect, useState } from "react";
import ImageWithLoader from "@/components/common/ImageWithLoader";
import { FaUser, FaGithub, FaXTwitter } from "react-icons/fa6";

interface Profile {
  name: string;
  title: string;
  avatar_url: string;
  github_url: string;
  twitter_url: string;
}

/**
 * 个人资料卡片（首页右侧栏）
 * 展示头像、昵称、职位与社交链接，数据来自 /api/profile。
 * 卡片样式与侧栏其它卡片（技术栈 / 搜索 / 标签）保持一致。
 */
export default function ProfileCard({ className }: { className?: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProfile(data);
      });
  }, []);

  const p = profile;

  return (
    <div
      className={`
        flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center
        shadow-lg transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl
        dark:border-gray-800 dark:bg-[#23272f] sm:p-6
        ${className ?? ""}
      `}
    >
      {/* 头像：方形（rounded-xl 圆角），与网站卡片风格保持一致 */}
      <div className="group">
        {p?.avatar_url ? (
          <ImageWithLoader
            src={p.avatar_url}
            alt="头像"
            wrapperClassName="h-24 w-24 rounded-xl"
            className="h-24 w-24 rounded-xl object-cover ring-2 ring-gray-100 transition-transform duration-300 group-hover:scale-[1.03] dark:ring-white/10"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100 ring-2 ring-gray-100 transition-transform duration-300 group-hover:scale-[1.03] dark:bg-gray-800 dark:ring-white/10">
            <FaUser className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* 昵称 */}
      <h1 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {p?.name || "Reality"}
      </h1>

      {/* 职位 */}
      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
        {p?.title || "Full Stack Developer"}
      </p>

      {/* 分隔线 */}
      <div className="my-4 h-px w-full bg-gray-200 dark:bg-gray-800" />

      {/* 社交链接 */}
      <div className="flex items-center gap-3">
        <a
          href={p?.github_url || "https://github.com/xianshi3"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
          className="
            flex h-9 w-9 items-center justify-center rounded-lg
            border border-gray-200 text-gray-600 transition-all duration-300 ease-out
            hover:-translate-y-0.5 hover:border-gray-900 hover:bg-gray-900 hover:text-white hover:shadow-md
            dark:border-gray-700 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-gray-900
          "
        >
          <FaGithub className="h-4 w-4" />
        </a>

        <a
          href={p?.twitter_url || "https://x.com/xianshi_3"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          title="X (Twitter)"
          className="
            flex h-9 w-9 items-center justify-center rounded-lg
            border border-gray-200 text-gray-600 transition-all duration-300 ease-out
            hover:-translate-y-0.5 hover:border-gray-900 hover:bg-gray-900 hover:text-white hover:shadow-md
            dark:border-gray-700 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-gray-900
          "
        >
          <FaXTwitter className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
