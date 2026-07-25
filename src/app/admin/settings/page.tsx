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
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    title: "",
    avatar_url: "",
    github_url: "",
    twitter_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProfile(data);
        else setError(data.error);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setProfile((prev) => ({ ...prev, avatar_url: url }));
      setMessage("头像上传成功");
      setError("");
    } catch (err) {
      setError("头像上传失败");
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
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaUpload /> 上传头像
          </button>
        </div>

        <div className="space-y-4">
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

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}
        {message && !error && (
          <p className="mt-4 text-sm text-green-500">{message}</p>
        )}

        <button
          className="admin-btn admin-btn-primary mt-6"
          onClick={handleSave}
          disabled={saving}
        >
          <FaCheck /> {saving ? "保存中..." : "保存"}
        </button>
      </div>
    </div>
  );
}
