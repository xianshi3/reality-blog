"use client";

import { useCallback, useState, useMemo } from "react";
import { FiBookOpen } from "react-icons/fi";
import { TbSparkles } from "react-icons/tb";

interface ArticleCardFooterProps {
  articleId: string;
  date?: string;
}

type Status = "idle" | "loading" | "done" | "error";

const STORAGE_PREFIX = "ai-summary:";

function readCache(articleId: string): string | null {
  try {
    return localStorage.getItem(STORAGE_PREFIX + articleId);
  } catch {
    return null;
  }
}

function writeCache(articleId: string, summary: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + articleId, summary);
  } catch {
    // 忽略存储失败（隐私模式等）
  }
}

function formatDate(date?: string): string {
    if (!date) return "未知日期";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "未知日期";
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

/**
 * 文章卡片底部信息栏：日期 + AI 摘要触发 + 阅读图标。
 * AI 摘要结果在服务端与浏览器本地各缓存一份，重复点击零开销。
 */
export default function ArticleCardFooter({ articleId, date }: ArticleCardFooterProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleToggle = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      // 卡片外层是 <Link>，阻止点击时跳转
      e.preventDefault();
      e.stopPropagation();

      if (status === "loading") return;

      if (status === "done") {
        setExpanded((v) => !v);
        return;
      }

      const cached = readCache(articleId);
      if (cached) {
        setSummary(cached);
        setStatus("done");
        setExpanded(true);
        return;
      }

      setStatus("loading");
      setError("");
      try {
        const res = await fetch(`/api/article/${articleId}/summary`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "生成失败");
        setSummary(data.summary);
        writeCache(articleId, data.summary);
        setStatus("done");
        setExpanded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "生成失败，请稍后再试");
        setStatus("error");
      }
    },
    [articleId, status]
  );

  const active = status === "done" || status === "error";

  const formattedDate = useMemo(() => formatDate(date), [date]);

  return (
    <div className="article-footer">
      <div className="article-footer-row">
        <span>{formattedDate}</span>

        <div className="article-footer-actions">
          <button
            type="button"
            onClick={handleToggle}
            disabled={status === "loading"}
            aria-busy={status === "loading"}
            aria-expanded={status === "done" ? expanded : undefined}
            aria-label="AI 摘要"
            className={`ai-trigger${status === "loading" ? " is-loading" : ""}${active ? " is-active" : ""}`}
          >
            {status === "loading" ? (
              <span className="ai-spinner" aria-hidden />
            ) : (
              <TbSparkles className="ai-trigger-icon" aria-hidden />
            )}
            <span>{status === "loading" ? "生成中" : "AI 摘要"}</span>
          </button>

          <FiBookOpen className="article-footer-read" />
        </div>
      </div>

      {status === "error" && (
        <p className="ai-panel ai-panel-error" role="status">
          {error}
        </p>
      )}
      {status === "done" && expanded && <p className="ai-panel">{summary}</p>}
    </div>
  );
}
