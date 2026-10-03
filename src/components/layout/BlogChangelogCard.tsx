"use client";

import { useState } from "react";
import { FaGitAlt, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { HiOutlineChevronDown } from "react-icons/hi";
import { BLOG_REPO, GITHUB_USERNAME } from "@/config/github";
import type { ChangelogEntry } from "@/types/changelog";

/**
 * 提交信息前缀 → 徽标配色
 * 浅色下用 -700 一档保证 10px 小字对比度达标，暗色沿用 -400
 */
const TYPE_STYLES: Record<string, string> = {
  feat: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  fix: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  docs: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  perf: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  refactor: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  style: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
  test: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
  build: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  ci: "bg-lime-50 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400",
  revert: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  chore: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

/** 无前缀提交使用的中性配色 */
const NEUTRAL_STYLE = "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";

const TYPE_PATTERN =
  /^(feat|fix|docs|perf|refactor|style|test|build|ci|revert|chore)\s*[:：]\s*(.+)$/i;

/**
 * 拆出提交类型与正文。
 * 没有 `type:` 前缀的提交（如「修复xxx：yyy」）原样展示，不加徽标。
 */
function parseMessage(message: string): { type: string | null; text: string } {
  const matched = TYPE_PATTERN.exec(message);
  if (!matched) return { type: null, text: message };

  return {
    type: matched[1].toLowerCase(),
    text: matched[2].trim() || message,
  };
}

interface BlogChangelogCardProps {
  entries: ChangelogEntry[];
}

/**
 * 博客更新日志卡片
 * 展示本博客仓库最近的提交记录，点击跳转 GitHub 对应提交页。
 * 条目与日期文案均由服务端注入，客户端只负责折叠交互。
 *
 * 布局：每条为「元信息行（类型 + 日期 + SHA）」+「正文独占整行」，
 * 避免徽标宽度差异造成正文左边缘参差，同时把正文可用宽度让给中文长句。
 */
export default function BlogChangelogCard({ entries }: BlogChangelogCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (entries.length === 0) return null;

  const commitsUrl = `https://github.com/${GITHUB_USERNAME}/${BLOG_REPO}/commits`;

  return (
    <div className="bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl overflow-hidden">

      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        aria-expanded={!isCollapsed}
        className="w-full px-5 py-4 flex items-center justify-between gap-2 text-left cursor-pointer"
      >
        <span className="flex items-center gap-2.5 shrink-0">
          <FaGitAlt className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
            更新日志
          </span>
        </span>

        <span className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {entries[0].dateLabel}更新
          </span>
          <HiOutlineChevronDown
            className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300 ${
              !isCollapsed ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* grid-rows 0fr→1fr 由内容决定展开高度，无需写死 max-height，
          避免侧栏变窄或字体渲染差异导致内容被裁切 */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isCollapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        }`}
      >
        <div className="overflow-hidden">
          {/* pl-9=36px：正文起点 36；圆点 left-[-13px] → 占 23~31，中心 27，与竖线同轴 */}
          <ol className="relative px-5 pb-1 pl-9">

          {/* 时间轴竖线：起点对齐首个圆点中心，终点收在末项 */}
          <span
            aria-hidden
            className="absolute left-[27px] top-2 bottom-3 w-px bg-gray-200 dark:bg-gray-800"
          />

          {entries.map((entry, index) => {
            const { type, text } = parseMessage(entry.message);
            const isLatest = index === 0;

            return (
              <li key={entry.sha} className="relative pb-4 last:pb-1">
                {/* 圆点：最新一条高亮为翠绿，其余随底色弱化。
                    absolute 定位使其绘制在链接 hover 底色之上，ring 正好遮住底色边缘。 */}
                <span
                  aria-hidden
                  className={`absolute left-[-13px] top-[7px] z-10 w-2 h-2 rounded-full ring-4 ${
                    isLatest
                      ? "bg-emerald-500 ring-emerald-500/15"
                      : "bg-gray-300 dark:bg-gray-600 ring-white dark:ring-[#23272f]"
                  }`}
                />

                <a
                  href={entry.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={text}
                  className="group -mx-2 block rounded-lg px-2 py-1 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  {/* 元信息行：类型徽标 / 日期 / 短 SHA 同一基线 */}
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                    {type && (
                      <span
                        className={`shrink-0 rounded px-1 py-px text-[10px] font-semibold uppercase tracking-wide ${
                          TYPE_STYLES[type] ?? NEUTRAL_STYLE
                        }`}
                      >
                        {type}
                      </span>
                    )}
                    <span className="shrink-0">{entry.dateLabel}</span>
                    <span aria-hidden className="shrink-0">·</span>
                    <code className="font-mono truncate">{entry.shortSha}</code>
                  </div>

                  {/* 正文独占整行 */}
                  <p
                    className={`mt-1 text-[13px] leading-relaxed line-clamp-2 transition-colors duration-200 ${
                      isLatest
                        ? "font-medium text-gray-800 dark:text-gray-200"
                        : "text-gray-600 dark:text-gray-400"
                    } group-hover:text-gray-900 dark:group-hover:text-gray-100`}
                  >
                    {text}
                  </p>
                </a>
              </li>
            );
          })}
        </ol>

          <div className="px-5 pb-5">
            <a
              href={commitsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border-t border-gray-100 dark:border-gray-800 pt-3 text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200 hover:text-gray-700 dark:hover:text-gray-200"
            >
              在 GitHub 查看全部提交
              <FaArrowUpRightFromSquare className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}