"use client";

import { useEffect, useState, useRef } from "react";
import { uploadImage } from "@/lib/upload";
import { FaCheck, FaUpload } from "react-icons/fa6";

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

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    title: "",
    avatar_url: "",
    github_url: "",
    twitter_url: "",
    parallax_image_url: "",
    parallax_title: "",
    parallax_subtitle: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const parallaxInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProfile(data);
        else setError(data.error);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleUpload = async (file: File, field: "avatar_url" | "parallax_image_url") => {
    try {
      const url = await uploadImage(file);
      setProfile((prev) => ({ ...prev, [field]: url }));
      setMessage(field === "avatar_url" ? "头像上传成功" : "背景图上传成功");
      setError("");
    } catch (err) {
      setError("上传失败");
    }
  };

  const handleSave = async () => {
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

  return (
    <div>
      <h1 className="admin-page-title">个人信息设置</h1>

      <div className="admin-card" style={{ maxWidth: 600 }}>
        <h2 className="admin-section-title">头像</h2>
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-3">
            <img
              src={profile.avatar_url || "/avatar.png"}
              alt="头像"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-200 dark:ring-blue-800"
            />
          </div>
          <input
            type="file"
            ref={avatarInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "avatar_url")}
          />
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => avatarInputRef.current?.click()}
          >
            <FaUpload /> 上传头像
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">名称</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">职业 / 标语</label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub 链接</label>
            <input
              type="url"
              value={profile.github_url}
              onChange={(e) => setProfile((p) => ({ ...p, github_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter / X 链接</label>
            <input
              type="url"
              value={profile.twitter_url}
              onChange={(e) => setProfile((p) => ({ ...p, twitter_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
          <h2 className="admin-section-title mb-4">首页视差背景</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">背景图</label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                {profile.parallax_image_url && (
                  <img
                    src={profile.parallax_image_url}
                    alt="背景图预览"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <input
                type="file"
                ref={parallaxInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "parallax_image_url")}
              />
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => parallaxInputRef.current?.click()}
              >
                <FaUpload /> 上传背景图
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标题</label>
              <input
                type="text"
                value={profile.parallax_title}
                onChange={(e) => setProfile((p) => ({ ...p, parallax_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">副标题</label>
              <input
                type="text"
                value={profile.parallax_subtitle}
                onChange={(e) => setProfile((p) => ({ ...p, parallax_subtitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {message && !error && (
          <p className="text-sm text-green-500">{message}</p>
        )}

        <button
          className="admin-btn admin-btn-primary mt-4"
          onClick={handleSave}
          disabled={saving}
        >
          <FaCheck /> {saving ? "保存中..." : "保存"}
        </button>
      </div>
    </div>
  );
}
