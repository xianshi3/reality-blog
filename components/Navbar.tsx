"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setIsDark(storedTheme === "dark");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/60 supports-backdrop-blur:bg-white/60 backdrop-blur-lg shadow-lg z-50 dark:bg-gray-900/60 dark:supports-backdrop-blur:bg-gray-900/60">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:py-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-extrabold text-gray-800 dark:text-white drop-shadow-lg">
          Reality Blog
        </Link>

        {/* 导航区域 */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          {/* 桌面导航链接 */}
          <ul className="hidden md:flex space-x-4 sm:space-x-8">
            {[
              { label: "首页", href: "/" },
              { label: "分类", href: "/category" },
              { label: "AI Chat", href: "/ai-chat/fullscreen" },
              { label: "联系我", href: "/contact" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm sm:text-base font-medium text-gray-800 dark:text-white hover:text-gray-600 
                  dark:hover:text-gray-300 transition-colors duration-200 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-white/20"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="text-sm sm:text-base font-medium text-gray-800 dark:text-white hover:text-gray-600 
            dark:hover:text-gray-300 transition-colors duration-200 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-white/20"
          >
            {isDark ? "浅色" : "深色"}
          </button>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-gray-800 dark:text-white hover:text-gray-600 
            dark:hover:text-gray-300 transition-colors duration-200 text-sm sm:text-base"
          >
            菜单
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg absolute top-14 sm:top-16 left-0 right-0 z-50 py-3 px-4">
          <ul className="space-y-2 sm:space-y-4">
            {[
              { label: "首页", href: "/" },
              { label: "分类", href: "/category" },
              { label: "AI Chat", href: "/ai-chat/fullscreen" },
              { label: "联系我", href: "/contact" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm sm:text-base font-medium text-gray-800 dark:text-white hover:text-gray-600 
                  dark:hover:text-gray-300 transition-colors duration-200 block px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-white/20"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}