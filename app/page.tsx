/**
 * 博客首页
 * 展示文章列表、侧边栏、推荐、标签、AI 对话等功能。
 * 
 * @module Home
 */

import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import MainContent from "../components/MainContent";
import RightSidebar from "../components/RightSidebar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";
import type { Article } from "../types/article";
import AIChat from "../components/AIChat";
import RandomArticleCard from '../components/RandomArticleCard';

/**
 * 博客首页组件
 * 获取文章数据并渲染主内容、侧边栏、AI 对话等
 */
export default async function Home() {
  // 获取文章列表
  const { data: articlesRaw, error, status } = await supabase
    .from("articles")
    .select("*")
    .order("date", { ascending: false });

  // 数据获取失败时的错误提示
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-6 rounded shadow">
          <h2 className="font-bold text-lg mb-2">数据获取失败</h2>
          <p>状态码：{status}</p>
          <p>错误信息：{error.message}</p>
        </div>
      </div>
    );
  }

  // 处理文章数据
  const articles: Article[] = (articlesRaw ?? []).map((item) => ({
    ...item,
    link: `/article/${item.id}`,
  }));
  const currentYear = new Date().getFullYear();

  // 标签和推荐内容
  const tags = [
    ".NET",
    "Java",
    "Vue",
    "JavaScript",
    "React",
    "Tailwind",
    "Next.js",
  ];
  const recommends = [
    "测试  深入理解 React",
    "测试  Vite 与 Webpack 对比",
    "测试  使用 Tailwind 构建博客",
  ];

  return (
    <div className="home-container pt-16 bg-gray-100 min-h-screen">
      {/* 头部导航 */}
      <Header />
      {/* 主体内容区域 */}
      <main className="container mx-auto flex flex-col lg:flex-row w-full max-w-6xl px-4 gap-6 py-8">
        <LeftSidebar articles={articles}/>
        <MainContent articles={articles} />
        <RightSidebar tags={tags} recommends={recommends} />
      </main>
      {/* AIChat 固定在左下角 */}
      <div className="fixed bottom-4 left-4 z-50 w-[350px] max-w-[90vw] pointer-events-auto">
        <AIChat />
      </div>
      {/* 页脚 */}
      <Footer currentYear={currentYear} />
    </div>
  );
}