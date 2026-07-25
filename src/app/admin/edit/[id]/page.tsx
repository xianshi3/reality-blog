"use client";

import "../../editor.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { uploadImage } from "@/lib/upload";
import { supabase } from "@/lib/supabaseClient";
import {
  FaBold, FaItalic, FaHeading, FaCode, FaListOl, FaListUl, FaImage,
  FaPenToSquare, FaUpload, FaTags, FaCalendar, FaFileLines, FaFolder,
  FaCheck,
} from "react-icons/fa6";

const TOOLBAR_ACTIONS = [
  { label: "标题 1", icon: FaHeading, markdown: "# " },
  { label: "标题 2", icon: FaHeading, markdown: "## ", style: { fontSize: "0.85rem" } },
  { label: "标题 3", icon: FaHeading, markdown: "### ", style: { fontSize: "0.75rem" } },
  { label: "加粗", icon: FaBold, markdown: "**加粗文字**" },
  { label: "斜体", icon: FaItalic, markdown: "*斜体文字*" },
  { label: "代码块", icon: FaCode, markdown: "\n```\n\n```\n" },
  { label: "有序列表", icon: FaListOl, markdown: "\n1. " },
  { label: "无序列表", icon: FaListUl, markdown: "\n- " },
  { label: "图片", icon: FaImage, markdown: "\n![图片描述](图片URL)\n" },
];

interface ArticleData {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  tags: string;
  image_url: string;
  [key: string]: unknown;
}

function LoadingSkeleton() {
  return (
    <div className="editor-page">
      <div className="editor-header">
        <div className="admin-skeleton" style={{ width: 140, height: 28, borderRadius: 6 }} />
        <div className="admin-skeleton" style={{ width: 110, height: 38, borderRadius: 8 }} />
      </div>
      <div className="editor-body">
        <div className="editor-main">
          <div className="admin-skeleton" style={{ height: 48, borderRadius: 6 }} />
          <div className="admin-skeleton" style={{ height: 36, borderRadius: 8 }} />
          <div className="admin-skeleton" style={{ height: 400, borderRadius: 8 }} />
        </div>
        <aside className="editor-sidebar">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="admin-skeleton" style={{ height: 140, borderRadius: 8 }} />
          ))}
        </aside>
      </div>
    </div>
  );
}

export default function EditArticle() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("加载文章失败：" + error.message);
        router.push("/admin");
        return;
      }

      if (data) {
        setForm(data as unknown as ArticleData);
      }
      setLoading(false);
    })();
  }, [id, router]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  }, []);

  const handleToolbarInsert = useCallback((markdown: string) => {
    setForm((f: ArticleData | null) => {
      if (!f) return f;
      return { ...f, content: (f.content || "") + markdown };
    });
  }, []);

  const updateField = useCallback((field: string, value: string) => {
    setForm((f: ArticleData | null) => {
      if (!f) return f;
      return { ...f, [field]: value };
    });
  }, []);

  const handleUpdate = async () => {
    if (!form || saving) return;
    if (!form.title) {
      alert("标题不能为空");
      return;
    }

    setSaving(true);

    let imageUrl = form.image_url || "";

    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error: any) {
        alert("图片上传失败：" + error.message);
        setUploading(false);
        setSaving(false);
        return;
      }
      setUploading(false);
    }

    const updateData: Record<string, unknown> = {};
    if (form.title) updateData.title = form.title;
    if (imageUrl) updateData.image_url = imageUrl;
    if (form.date) updateData.date = form.date;
    if (form.summary) updateData.summary = form.summary;
    if (form.content) updateData.content = form.content;
    if (form.category) updateData.category = form.category;
    if (form.tags) updateData.tags = form.tags;

    const res = await fetch("/api/article", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updateData, id }),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      alert("更新失败：" + (data.error || "Unknown error"));
    } else {
      router.push("/admin");
    }
  };

  if (loading || !form) return <LoadingSkeleton />;

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : form.image_url;

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h1 className="admin-page-title">
          <FaPenToSquare /> 编辑文章
        </h1>
        <button
          className="editor-submit-btn"
          onClick={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <><span className="btn-spinner" />保存中...</>
          ) : (
            <><FaCheck /> 保存修改</>
          )}
        </button>
      </div>

      <div className="editor-body">
        <div className="editor-main">
          <input
            type="text"
            placeholder="输入文章标题..."
            className="editor-title-input"
            value={form.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
          />

          <div className="editor-toolbar">
            {TOOLBAR_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="toolbar-btn"
                  title={action.label}
                  onClick={() => handleToolbarInsert(action.markdown)}
                >
                  <Icon style={action.style} />
                </button>
              );
            })}
          </div>

          <textarea
            className="editor-textarea"
            placeholder="开始写作，支持 Markdown 语法..."
            value={form.content || ""}
            onChange={(e) => updateField("content", e.target.value)}
          />
        </div>

        <aside className="editor-sidebar">
          <div className="editor-card">
            <h3 className="editor-card-title"><FaImage /> 封面图片</h3>
            <button
              className="editor-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || saving}
            >
              <FaUpload /> {uploading ? "上传中..." : previewUrl ? "更换图片" : "选择封面图片"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={uploading || saving}
              hidden
            />
            {previewUrl && (
              <div className="editor-preview-wrap">
                <img src={previewUrl} alt="封面预览" className="editor-preview-img" />
              </div>
            )}
          </div>

          <div className="editor-card">
            <h3 className="editor-card-title"><FaFileLines /> 基本信息</h3>
            <div className="editor-field">
              <label className="editor-field-label">摘要</label>
              <input
                className="editor-field-input"
                placeholder="文章简要概述..."
                value={form.summary || ""}
                onChange={(e) => updateField("summary", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label className="editor-field-label"><FaFolder /> 分类</label>
              <input
                className="editor-field-input"
                placeholder="如：技术、生活、教程"
                value={form.category || ""}
                onChange={(e) => updateField("category", e.target.value)}
              />
            </div>
          </div>

          <div className="editor-card">
            <h3 className="editor-card-title"><FaTags /> 元数据</h3>
            <div className="editor-field">
              <label className="editor-field-label">标签</label>
              <input
                className="editor-field-input"
                placeholder="逗号分隔，如：React, Next.js"
                value={form.tags || ""}
                onChange={(e) => updateField("tags", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label className="editor-field-label"><FaCalendar /> 发布日期</label>
              <input
                className="editor-field-input"
                type="date"
                value={form.date || ""}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
