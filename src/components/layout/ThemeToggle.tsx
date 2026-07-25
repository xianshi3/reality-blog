"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "theme";

function getStoredTheme(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function getSystemDark(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored === "dark") {
      setIsDark(true);
      applyTheme(true);
    } else if (stored === "light") {
      setIsDark(false);
      applyTheme(false);
    } else {
      const prefersDark = getSystemDark();
      setIsDark(prefersDark);
      applyTheme(prefersDark);
      try {
        localStorage.setItem(THEME_KEY, prefersDark ? "dark" : "light");
      } catch {}
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch {}
  }, [isDark, mounted]);

  const toggle = () => setIsDark((prev) => !prev);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      onKeyDown={onKeyDown}
      aria-label="切换主题"
      title="切换主题"
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
    >
      <span
        className={`absolute top-1/2 left-1 w-5 h-5 rounded-full shadow-sm transform -translate-y-1/2 transition duration-300 ease-in-out ${
          isDark ? "translate-x-7 bg-gray-800" : "translate-x-0 bg-white"
        }`}
      />
    </button>
  );
}
