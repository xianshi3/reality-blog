"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Navbar 导航栏组件
 *
 * 提供顶部固定导航，包括 Logo、页面链接以及深浅色主题切换。
 * 支持自动读取/保存用户主题设置到 localStorage。
 */
export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 控制菜单的展开和收起

  // 初次加载时读取本地主题设置
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setIsDark(storedTheme === "dark");
  }, []);

  // 根据主题状态应用 HTML 根节点的类名
  useEffect(() => {
    const root = document.documentElement;
    const theme = isDark ? "dark" : "light";

    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  // 切换主题函数
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo 区域 */}
        <Link href="/" className="text-2xl font-extrabold text-gray-800 dark:text-white drop-shadow-lg">
          Reality Blog
        </Link>

        {/* 导航区域（在小屏下改为可折叠菜单） */}
        <div className="flex items-center space-x-8 md:space-x-8">
          {/* 在大屏幕上显示导航链接 */}
          <ul className="hidden md:flex space-x-8">
            {[
              { label: "首页", href: "/" },
              { label: "分类", href: "/category" },
              { label: "联系我", href: "/contact" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-medium text-gray-800 dark:text-white hover:text-gray-600 
                  dark:hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/20"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="font-medium text-gray-800 dark:text-white hover:text-gray-600 
            dark:hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/20"
          >
            {isDark ? "浅色模式" : "深色模式"}
          </button>

          {/* 在小屏下显示菜单文字 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center px-3 py-2 rounded-lg text-gray-800 dark:text-white hover:text-gray-600 
            dark:hover:text-gray-300 transition-colors duration-200"
          >
            菜单 {/* 直接使用菜单文字 */}
          </button>
        </div>
      </div>

      {/* 在小屏时显示菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg absolute top-16 left-0 right-0 z-50 py-4 px-6">
          <ul className="space-y-4">
            {[
              { label: "首页", href: "/" },
              { label: "分类", href: "/category" },
              { label: "联系我", href: "/contact" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-medium text-gray-800 dark:text-white hover:text-gray-600 
                  dark:hover:text-gray-300 transition-colors duration-200 block px-3 py-2 rounded-lg hover:bg-white/20"
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
