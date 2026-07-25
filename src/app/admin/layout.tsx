"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaGaugeHigh,
  FaPenToSquare,
  FaImages,
  FaGear,
  FaArrowLeft,
  FaBars,
  FaXmark,
  FaNewspaper,
} from "react-icons/fa6";
import "./admin.css";

const NAV_ITEMS: { href: string; label: string; icon: React.ComponentType; exact?: boolean; disabled?: boolean }[] = [
  { href: "/admin", label: "控制台", icon: FaGaugeHigh },
  { href: "/admin/create", label: "写文章", icon: FaPenToSquare },
  { href: "/admin", label: "文章管理", icon: FaNewspaper, exact: true },
  { href: "/admin/images", label: "图片管理", icon: FaImages },
  { href: "/admin/settings", label: "设置", icon: FaGear },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.disabled) return false;
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M8 7h8" /><path d="M8 11h6" /><path d="M8 15h4" />
              </svg>
            </div>
            <span>Reality Blog</span>
          </Link>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="关闭侧边栏"
          >
            <FaXmark />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.disabled ? "#" : item.href}
                className={`admin-nav-item ${isActive(item) ? "active" : ""} ${item.disabled ? "disabled" : ""}`}
                onClick={() => setSidebarOpen(false)}
                aria-disabled={item.disabled}
              >
                <Icon />
                <span>{item.label}</span>
                {item.disabled && <span className="admin-nav-badge">即将推出</span>}
                {isActive(item) && <span className="admin-nav-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">A</div>
            <span>管理员</span>
          </div>
          <Link href="/" className="admin-nav-item">
            <FaArrowLeft />
            <span>返回前台</span>
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-mobile-header">
          <button
            className="admin-mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="打开菜单"
          >
            <FaBars />
          </button>
          <span className="admin-mobile-title">管理后台</span>
        </div>

        {children}
      </div>
    </div>
  );
}
