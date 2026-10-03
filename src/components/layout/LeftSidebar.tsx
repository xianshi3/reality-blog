import BlogChangelogCard from "@/components/layout/BlogChangelogCard";
import { getBlogCommits } from "@/lib/github";
import type { ChangelogEntry } from "@/types/changelog";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 把 ISO 时间格式化成中文相对日期。
 * 只在服务端执行一次，客户端直接用结果，避免 hydration 时区不一致。
 */
function formatDateLabel(iso: string): string {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";

  const now = Date.now();
  const days = Math.floor((now - time) / DAY_MS);

  if (days <= 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;

  const date = new Date(time);
  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  return date.toLocaleDateString("zh-CN", {
    year: sameYear ? undefined : "numeric",
    month: "short",
    day: "numeric",
  });
}

interface LeftSidebarProps {
  className?: string;
}

/**
 * 首页左侧栏（服务端组件）
 * 只承载「更新日志」；提交记录拉取失败时该卡片自动不渲染。
 * xl 以下不并排显示，而是排在文章列表之后（见 page.tsx 的 order 控制）。
 */
export default async function LeftSidebar({ className }: LeftSidebarProps) {
  const commits = await getBlogCommits();

  const entries: ChangelogEntry[] = commits.map((commit) => ({
    sha: commit.sha,
    shortSha: commit.shortSha,
    message: commit.message,
    htmlUrl: commit.htmlUrl,
    dateLabel: formatDateLabel(commit.date),
  }));

  return (
    <aside className={`w-full xl:w-60 2xl:w-64 flex-shrink-0 space-y-6 ${className ?? ""}`}>

      <BlogChangelogCard entries={entries} />

    </aside>
  );
}