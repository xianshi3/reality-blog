"use client";

import { useEffect, useState, useRef } from "react";
import { uploadImage } from "@/lib/upload";
import ImageCropper from "@/components/common/ImageCropper";
import { FaCheck, FaUpload, FaUser, FaGear, FaImage } from "react-icons/fa6";

interface Profile {
  name: string;
  title: string;
  avatar_url: string;
  github_url: string;
  twitter_url: string;
  parallax_image_url: string;
  parallax_title: string;
  parallax_subtitle: string;
}

function SettingsSkeleton() {
  return (
    <div>
      <div className="admin-page-title">
        <div className="admin-skeleton" style={{ width: 160, height: 28 }} />
      </div>
      <div className="admin-card" style={{ maxWidth: 600 }}>
        <div className="flex flex-col items-center mb-6">
          <div className="admin-skeleton" style={{ width: 96, height: 96, borderRadius: 12, marginBottom: 12 }} />
          <div className="admin-skeleton" style={{ width: 100, height: 32, borderRadius: 8 }} />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-4">
            <div className="admin-skeleton" style={{ width: 60, height: 14, marginBottom: 6 }} />
            <div className="admin-skeleton" style={{ width: "100%", height: 38, borderRadius: 8 }} />
          </div>
        ))}
        <div className="admin-skeleton" style={{ width: 120, height: 38, borderRadius: 8, marginTop: 24 }} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropField, setCropField] = useState<"avatar_url" | "parallax_image_url" | null>(null);
  const [cropDataUrl, setCropDataUrl] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const parallaxInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProfile(data);
        else setError(data.error);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleFileSelect = (file: File, field: "avatar_url" | "parallax_image_url") => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropFile(file);
      setCropField(field);
      setCropDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async (blob: Blob) => {
    if (!cropField) return;
    const file = new File([blob], cropFile?.name || "crop.jpg", { type: "image/jpeg" });
    try {
      const url = await uploadImage(file);
      setProfile((prev) => prev ? { ...prev, [cropField]: url } : prev);
      setMessage(cropField === "avatar_url" ? "头像上传成功" : "背景图上传成功");
      setError("");
    } catch {
      setError("上传失败");
    }
    setCropFile(null);
    setCropField(null);
    setCropDataUrl(null);
  };

  const handleCropCancel = () => {
    setCropFile(null);
    setCropField(null);
    setCropDataUrl(null);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage("保存成功");
    } catch (err: any) {
      setError(err.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SettingsSkeleton />;

  if (!profile) {
    return (
      <div>
        <h1 className="admin-page-title">个人信息设置</h1>
        <div className="admin-card text-center" style={{ maxWidth: 600 }}>
          <p className="text-gray-500 dark:text-gray-400 py-8">加载失败：{error || "未知错误"}</p>
        </div>
      </div>
    );
  }

  const update = (field: keyof Profile, value: string) =>
    setProfile((p) => p ? { ...p, [field]: value } : p);

  return (
    <div>
      <h1 className="admin-page-title">
        <FaGear /> 个人信息设置
      </h1>

      <div className="admin-card" style={{ maxWidth: 600 }}>
        {/* 头像 */}
        <div className="admin-form-section">
          <h2 className="admin-form-section-title"><FaUser /> 头像</h2>
          <div className="flex flex-col items-center">
            <div className="p-1 mb-3 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-md shadow-sm">
              <img
                src={profile.avatar_url || "/avatar.png"}
                alt="头像"
                className="rounded-xl object-cover ring-1 ring-white/50 dark:ring-white/20 shadow-lg"
                style={{ width: 96, height: 96 }}
              />
            </div>
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file, "avatar_url");
                e.target.value = "";
              }}
            />
            <button className="admin-btn admin-btn-secondary" onClick={() => avatarInputRef.current?.click()}>
              <FaUpload /> 上传头像
            </button>
          </div>
        </div>

        {/* 个人信息 */}
        <div className="admin-form-section">
          <h2 className="admin-form-section-title"><FaUser /> 个人信息</h2>

          <div className="admin-form-group">
            <label className="admin-form-label">名称</label>
            <input className="admin-form-input" value={profile.name} onChange={(e) => update("name", e.target.value)} />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">职业 / 标语</label>
            <input className="admin-form-input" value={profile.title} onChange={(e) => update("title", e.target.value)} />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">GitHub 链接</label>
            <input className="admin-form-input" value={profile.github_url} onChange={(e) => update("github_url", e.target.value)} />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Twitter / X 链接</label>
            <input className="admin-form-input" value={profile.twitter_url} onChange={(e) => update("twitter_url", e.target.value)} />
          </div>
        </div>

        {/* 视差背景 */}
        <div className="admin-form-section">
          <h2 className="admin-form-section-title"><FaImage /> 首页视差背景</h2>

          <div className="admin-form-group">
            <label className="admin-form-label">背景图</label>
            <div className="admin-upload-area">
              <div className="admin-upload-preview">
                {profile.parallax_image_url ? (
                  <img src={profile.parallax_image_url} alt="背景图预览" />
                ) : (
                  <span>暂无</span>
                )}
              </div>
              <input
                type="file"
                ref={parallaxInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file, "parallax_image_url");
                  e.target.value = "";
                }}
              />
              <button className="admin-btn admin-btn-secondary" onClick={() => parallaxInputRef.current?.click()}>
                <FaUpload /> 上传
              </button>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">标题（留空隐藏）</label>
            <input className="admin-form-input" value={profile.parallax_title} onChange={(e) => update("parallax_title", e.target.value)} placeholder="输入标题文字" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">副标题（留空隐藏）</label>
            <input className="admin-form-input" value={profile.parallax_subtitle} onChange={(e) => update("parallax_subtitle", e.target.value)} placeholder="输入副标题文字" />
          </div>
        </div>

        {error && <div className="admin-message admin-message-error mb-4">{error}</div>}
        {message && !error && <div className="admin-message admin-message-success mb-4">{message}</div>}

        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          <FaCheck /> {saving ? "保存中..." : "保存"}
        </button>
      </div>

      {/* Cropper modal */}
      {cropDataUrl && cropField && (
        <ImageCropper
          image={cropDataUrl}
          aspect={cropField === "avatar_url" ? 1 : 21 / 9}
          onCrop={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
