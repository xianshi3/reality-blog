"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/upload";
import {
  FaBold, FaItalic, FaHeading, FaCode, FaListOl, FaListUl, FaImage,
  FaPenToSquare, FaUpload, FaTags, FaCalendar, FaFileLines, FaFolder,
} from "react-icons/fa6";
import "../editor.css";

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

interface ArticleForm {
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  tags: string;
}

const INITIAL_FORM: ArticleForm = {
  title: "",
  summary: "",
  content: "",
  date: "",
  category: "",
  tags: "",
};

export default function CreateArticle() {
  const [form, setForm] = useState<ArticleForm>(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  }, []);

  const handleToolbarInsert = useCallback((markdown: string) => {
    setForm((prev) => ({ ...prev, content: prev.content + markdown }));
  }, []);

  const updateField = useCallback((field: keyof ArticleForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    if (loading || !form.title) {
      alert("标题不能为空");
      return;
    }

    setLoading(true);
    let imageUrl = "";

    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error: any) {
        alert("图片上传失败：" + error.message);
        setUploading(false);
        setLoading(false);
        return;
      }
      setUploading(false);
    }

    const insertData: Record<string, unknown> = { ...form };
    if (imageUrl) insertData.image_url = imageUrl;
    for (const key of ["date", "summary", "content", "category", "tags"] as const) {
      if (!form[key]) delete insertData[key];
    }

    const res = await fetch("/api/article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insertData),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      alert("创建失败：" + (data.error || "Unknown error"));
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h1 className="admin-page-title">
          <FaPenToSquare /> 撰写新文章
        </h1>
        <button
          className="editor-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <><span className="btn-spinner" />发布中...</>
          ) : (
            "发布文章"
          )}
        </button>
      </div>

      <div className="editor-body">
        <div className="editor-main">
          <input
            type="text"
            placeholder="输入文章标题..."
            className="editor-title-input"
            value={form.title}
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
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
          />
        </div>

        <aside className="editor-sidebar">
          <div className="editor-card">
            <h3 className="editor-card-title"><FaImage /> 封面图片</h3>
            <button
              className="editor-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
            >
              <FaUpload /> {uploading ? "上传中..." : imageFile ? "更换图片" : "选择封面图片"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={uploading || loading}
              hidden
            />
            {imageFile && (
              <div className="editor-preview-wrap">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="封面预览"
                  className="editor-preview-img"
                />
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
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label className="editor-field-label"><FaFolder /> 分类</label>
              <input
                className="editor-field-input"
                placeholder="如：技术、生活、教程"
                value={form.category}
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
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label className="editor-field-label"><FaCalendar /> 发布日期</label>
              <input
                className="editor-field-input"
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
