"use client";

import { useMemo, useState } from "react";
import { HiOutlineChevronDown, HiOutlineCode } from "react-icons/hi";
import {
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiVuedotjs,
  SiGo, SiPython, SiDocker, SiAmazon, SiGit, SiJavascript,
  SiNodedotjs, SiPostgresql, SiSupabase, SiFramer,
} from "react-icons/si";
import { FaJava, FaPython, FaLinux } from "react-icons/fa";
import { TbBrandCSharp, TbBrandSwift } from "react-icons/tb";
import type { Article } from "@/types/article";

const TECH_MAP: Record<string, { name: string; icon: React.ReactNode }> = {
  nextjs: { name: "Next.js", icon: <SiNextdotjs /> },
  next: { name: "Next.js", icon: <SiNextdotjs /> },
  react: { name: "React", icon: <SiReact /> },
  typescript: { name: "TypeScript", icon: <SiTypescript /> },
  tailwind: { name: "Tailwind CSS", icon: <SiTailwindcss /> },
  tailwindcss: { name: "Tailwind CSS", icon: <SiTailwindcss /> },
  vue: { name: "Vue.js", icon: <SiVuedotjs /> },
  vuejs: { name: "Vue.js", icon: <SiVuedotjs /> },
  java: { name: "Java", icon: <FaJava /> },
  dotnet: { name: ".NET", icon: <TbBrandCSharp /> },
  "c#": { name: "C#", icon: <TbBrandCSharp /> },
  go: { name: "Go", icon: <SiGo /> },
  python: { name: "Python", icon: <FaPython /> },
  docker: { name: "Docker", icon: <SiDocker /> },
  aws: { name: "AWS", icon: <SiAmazon /> },
  git: { name: "Git", icon: <SiGit /> },
  javascript: { name: "JavaScript", icon: <SiJavascript /> },
  node: { name: "Node.js", icon: <SiNodedotjs /> },
  nodejs: { name: "Node.js", icon: <SiNodedotjs /> },
  postgresql: { name: "PostgreSQL", icon: <SiPostgresql /> },
  postgres: { name: "PostgreSQL", icon: <SiPostgresql /> },
  supabase: { name: "Supabase", icon: <SiSupabase /> },
  framer: { name: "Framer Motion", icon: <SiFramer /> },
  "framer motion": { name: "Framer Motion", icon: <SiFramer /> },
  swift: { name: "Swift", icon: <TbBrandSwift /> },
  linux: { name: "Linux", icon: <FaLinux /> },
};

interface TechStackCardProps {
  articles?: Article[];
}

export default function TechStackCard({ articles = [] }: TechStackCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const techCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const article of articles) {
      const text = [
        article.title?.toLowerCase() || "",
        article.summary?.toLowerCase() || "",
        article.content?.toLowerCase() || "",
        ...(Array.isArray(article.tags) ? article.tags : typeof article.tags === "string" ? [article.tags.toLowerCase()] : []),
      ].join(" ");

      for (const keyword of Object.keys(TECH_MAP)) {
        if (text.includes(keyword)) {
          counts[keyword] = (counts[keyword] || 0) + 1;
        }
      }
    }

    return Object.entries(counts)
      .map(([key, count]) => ({ key, ...TECH_MAP[key], count }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  const maxCount = techCounts.length > 0 ? Math.max(...techCounts.map(t => t.count)) : 1;

  return (
    <div className="bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl overflow-hidden max-w-md mx-auto">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2.5">
          <HiOutlineCode className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
            技术栈
          </span>
          {techCounts.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
              {techCounts.length}
            </span>
          )}
        </div>
        <HiOutlineChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            !isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          !isCollapsed ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5">
          {techCounts.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {techCounts.map((tech) => {
                const size = 0.8 + (tech.count / maxCount) * 0.4;
                return (
                  <div
                    key={tech.key}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                  >
                    <span
                      className="text-gray-600 dark:text-gray-300 transition-transform duration-300 hover:scale-110"
                      style={{ fontSize: `${1.1 * size}rem` }}
                    >
                      {tech.icon}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-tight">
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
              暂无技术数据
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
