"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import {
  FiHome,
  FiGrid,
  FiMessageSquare,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prevScrollRef = useRef(0);

  useEffect(() => {
    prevScrollRef.current = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;
      const delta = current - prevScrollRef.current;

      setScrolled(current > 8);

      if (current <= 0) {
        setHidden(false);
      } else if (delta > 5) {
        setHidden(true);
      } else if (delta < -5) {
        setHidden(false);
      }

      prevScrollRef.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "首页", href: "/", icon: <FiHome size={16} /> },
    { label: "分类", href: "/category", icon: <FiGrid size={16} /> },
    { label: "AI Chat", href: "/ai-chat/fullscreen", icon: <FiMessageSquare size={16} /> },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        [-webkit-backdrop-filter:saturate(180%)_blur(20px)]
        [backdrop-filter:saturate(180%)_blur(20px)]
        border-b
        transition-all duration-300
        ${
          scrolled
            ? "bg-white/80 supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/80 dark:supports-[backdrop-filter]:bg-gray-900/80 border-gray-200/70 dark:border-white/10 shadow-lg"
            : "bg-white/55 supports-[backdrop-filter]:bg-white/55 dark:bg-gray-900/50 dark:supports-[backdrop-filter]:bg-gray-900/50 border-transparent"
        }
      `}
      style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
    >
      <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:py-4 sm:px-6">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl sm:text-2xl text-gray-800 dark:text-white [font-family:var(--font-title)] tracking-[0.05em]"
        >
          <span>Reality Blog</span>
        </Link>

        {/* 右侧区域 */}
        <div className="flex items-center space-x-4 sm:space-x-8">

          {/* 桌面导航 */}
          <ul className="hidden md:flex space-x-6">
            {navItems.map(({ label, href, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="
                    group relative flex items-center gap-2
                    text-sm sm:text-base font-medium
                    text-gray-800 dark:text-gray-200
                    px-3 py-2 rounded-lg
                    transition-all duration-300
                    hover:bg-white/40 dark:hover:bg-white/5
                  "
                >
                  <span className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {icon}
                  </span>

                  {label}

                  {/* 底部滑动线 */}
                  <span
                    className="
                      absolute left-0 -bottom-1 h-[2px] w-0
                      bg-blue-500
                      transition-all duration-300
                      group-hover:w-full
                    "
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* 主题切换 */}
          <ThemeToggle />

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="
              md:hidden
              flex items-center justify-center
              rounded-lg
              p-2
              text-gray-800 dark:text-white
              hover:bg-white/30 dark:hover:bg-white/10
              transition-all duration-300
            "
          >
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div
        className={`
          md:hidden absolute left-0 right-0 z-50
          transition-all duration-300 overflow-hidden
          ${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div className="bg-white/90 supports-[backdrop-filter]:bg-white/80 dark:bg-gray-800/90 dark:supports-[backdrop-filter]:bg-gray-900/80 [-webkit-backdrop-filter:saturate(180%)_blur(20px)] [backdrop-filter:saturate(180%)_blur(20px)] shadow-lg border-t border-gray-200/60 dark:border-white/5 py-4 px-6 space-y-3">
          {navItems.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className="
                flex items-center gap-3
                text-sm font-medium
                text-gray-800 dark:text-white
                px-3 py-2 rounded-lg
                hover:bg-white/40 dark:hover:bg-white/10
                transition-all duration-300
              "
            >
              <span className="text-gray-500 dark:text-gray-400">{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
