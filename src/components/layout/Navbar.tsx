"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import {
  FiCompass,
  FiFolder,
  FiCpu,
  FiMenu,
  FiX,
  FiTerminal,
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
    { label: "首页", href: "/", icon: <FiCompass size={16} /> },
    { label: "分类", href: "/category", icon: <FiFolder size={16} /> },
    { label: "AI Chat", href: "/ai-chat/fullscreen", icon: <FiCpu size={16} /> },
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
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-gray-900 transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-black/[0.09] dark:bg-white/[0.08] dark:text-white dark:group-hover:bg-white/[0.14]">
            <FiTerminal size={18} strokeWidth={2} />
          </span>
          <span className="text-xl font-semibold tracking-tight text-gray-800 dark:text-white [font-family:var(--font-title)] sm:text-2xl">
            Reality Blog
          </span>
        </Link>

        {/* 右侧区域 */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* 桌面导航 */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map(({ label, href, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="
                    group relative flex items-center gap-2
                    text-sm sm:text-base font-medium
                    text-gray-800 dark:text-gray-200
                    px-3 py-2 rounded-lg
                    transition-all duration-300 ease-out
                    hover:bg-white/50 dark:hover:bg-white/5
                    hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                  "
                >
                  <span className="inline-flex text-gray-500 dark:text-gray-400 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-px group-hover:text-blue-500 dark:group-hover:text-blue-400">
                    {icon}
                  </span>

                  {label}

                  {/* 底部滑动线（中心向外展开） */}
                  <span
                    className="
                      absolute left-3 right-3 -bottom-1 h-[2px] rounded-full
                      bg-gradient-to-r from-blue-500 to-cyan-400
                      origin-center scale-x-0
                      transition-transform duration-300 ease-out
                      group-hover:scale-x-100
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
              transition-all duration-300 ease-out
              hover:bg-white/50 dark:hover:bg-white/10 hover:scale-105
              active:scale-90
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
                transition-all duration-300 ease-out
                hover:bg-white/50 dark:hover:bg-white/10 hover:translate-x-1
                active:scale-[0.98]
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
