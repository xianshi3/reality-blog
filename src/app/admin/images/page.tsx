"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadImage } from "@/lib/upload";
import { FaTrashCan, FaImages, FaUpload, FaUser, FaImage } from "react-icons/fa6";
import "./images.css";

interface ImageItem {
  name: string;
  size?: number;
  publicUrl: string;
  article?: { id: number; title: string } | null;
  usage?: string;
}

function ImageSkeleton() {
  return (
    <div className="image-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="admin-skeleton" style={{ height: 210, borderRadius: 10 }} />
      ))}
    </div>
  );
}

export default function ImageManagerPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage
        .from("article-images")
        .list("", {
          limit: 1000,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        alert("加载图片失败：" + error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setLoading(false);
        return;
      }

      const files = data.filter((item) =>
        /\.(jpg|jpeg|png|webp|gif)$/i.test(item.name)
      );

      const [{ data: articlesData }, { data: profileData }] = await Promise.all([
        supabase.from("articles").select("id, title, image_url"),
        supabase.from("profile").select("avatar_url, parallax_image_url").single(),
      ]);

      const profile = profileData as { avatar_url?: string; parallax_image_url?: string } | null;

      const avatarName = profile?.avatar_url?.split("/").pop();
      const parallaxName = profile?.parallax_image_url?.split("/").pop();

      const imgs: ImageItem[] = files.map((item) => {
        const { data: urlData } = supabase.storage
          .from("article-images")
          .getPublicUrl(item.name);

        const relatedArticle = articlesData?.find((art) => {
          if (!art.image_url) return false;
          const artFileName = art.image_url.split("/").pop();
          return artFileName === item.name;
        });

        let usage: string | undefined;
        if (item.name === avatarName) usage = "头像";
        else if (item.name === parallaxName) usage = "视差背景";

        return {
          name: item.name,
          publicUrl: urlData.publicUrl,
          size: undefined,
          article: relatedArticle
            ? { id: relatedArticle.id, title: relatedArticle.title }
            : null,
          usage,
        };
      });

      const sizes = await Promise.all(
        imgs.map(async (img) => {
          try {
            const res = await fetch(img.publicUrl, { method: "HEAD" });
            if (!res.ok) return undefined;
            const length = res.headers.get("content-length");
            return length ? parseInt(length, 10) : undefined;
          } catch {
            return undefined;
          }
        })
      );

      setImages(imgs.map((img, i) => ({ ...img, size: sizes[i] })));
      setLoading(false);
    };

    fetchImages();
  }, []);

  const formatSize = (size?: number) => {
    if (!size || isNaN(size)) return "";
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDelete = async (publicUrl: string, name: string) => {
    if (!window.confirm("确定要删除这张图片吗？")) return;
    setDeleting(name);

    const res = await fetch("/api/storage", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setDeleting(null);

    if (!res.ok) {
      const data = await res.json();
      alert("删除失败：" + (data.error || "Unknown error"));
    } else {
      setImages((prev) => prev.filter((img) => img.publicUrl !== publicUrl));
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const name = url.split("/").pop()!;
      const { data: urlData } = supabase.storage.from("article-images").getPublicUrl(name);
      setImages((prev) => [{ name, publicUrl: urlData.publicUrl, article: null }, ...prev]);
    } catch (err) {
      alert("上传失败");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-title">
        <FaImages /> 图片管理
        {!loading && <span className="admin-stat-label" style={{ fontSize: "0.8rem", fontWeight: 400, marginLeft: 4 }}>({images.length})</span>}
      </div>

      <div className="mb-4">
        <button
          className="admin-btn admin-btn-secondary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <FaUpload /> {uploading ? "上传中..." : "上传图片"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>

      {loading ? (
        <ImageSkeleton />
      ) : images.length === 0 ? (
        <div className="admin-empty">
          <FaImages style={{ fontSize: "2.5rem", display: "block", margin: "0 auto 0.5rem" }} />
          <p>暂无图片</p>
        </div>
      ) : (
        <div className="image-grid">
          {images.map(({ publicUrl, size, name, article, usage }, idx) => (
            <div
              key={publicUrl}
              className={`image-card ${usage === "头像" ? "image-card-avatar" : ""} ${usage === "视差背景" ? "image-card-parallax" : ""}`}
              style={{ animationDelay: `${idx * 30}ms` }}
              title={article?.title || "未关联文章"}
            >
              <img src={publicUrl} alt={article?.title || "文章封面"} loading="lazy" />
              {usage && (
                <span className="image-usage-badge">
                  {usage === "头像" ? <FaUser /> : <FaImage />} {usage}
                </span>
              )}
              <div className="image-info">
                <p className="image-title">{article?.title || "未关联文章"}</p>
                {size && <span className="image-size">{formatSize(size)}</span>}
              </div>
              <button
                onClick={() => handleDelete(publicUrl, name)}
                className="image-delete-btn"
                disabled={deleting === name}
                aria-label={`删除图片 ${name}`}
              >
                <FaTrashCan />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
