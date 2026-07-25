"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPenToSquare, FaTrashCan, FaFileLines } from "react-icons/fa6";

export default function ArticleItem({
  article,
  delay = 0,
  showImage,
}: {
  article: { id: string; title: string; date?: string; image_url?: string };
  delay?: number;
  showImage?: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm(`确定要删除文章「${article.title}」吗？`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    const res = await fetch("/api/article", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: article.id }),
    });
    setIsDeleting(false);

    if (!res.ok) {
      const data = await res.json();
      alert("删除失败：" + (data.error || "Unknown error"));
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  return (
    <li className="admin-list-item" style={{ animationDelay: `${delay}ms` }}>
      {showImage && (
        <div className="admin-article-thumb">
          {article.image_url && !imgError ? (
            <img
              src={article.image_url}
              alt=""
              onError={() => setImgError(true)}
            />
          ) : (
            <FaFileLines />
          )}
        </div>
      )}
      <div className="admin-article-info">
        <span className="admin-article-title">
          <FaFileLines style={{ fontSize: "0.75rem", opacity: 0.4, flexShrink: 0 }} />
          {article.title}
        </span>
        {formattedDate && <span className="admin-article-date">{formattedDate}</span>}
      </div>

      <div className="admin-btns">
        <Link
          href={`/admin/edit/${article.id}`}
          className="admin-edit-link"
          aria-label={`编辑文章 ${article.title}`}
        >
          <FaPenToSquare />
        </Link>
        <button
          onClick={handleDelete}
          className="admin-delete-btn"
          disabled={isDeleting}
          aria-label={`删除文章 ${article.title}`}
        >
          {isDeleting ? <span className="delete-spinner" /> : <FaTrashCan />}
        </button>
      </div>
    </li>
  );
}
