/**
 * LeftSidebar 左侧边栏组件
 *
 * 用于展示博客导航链接、公告信息和随机文章推荐。
 * 默认适配大屏分栏布局，在小屏下全宽显示。
 */
import RandomArticleCard from './RandomArticleCard';
import type { Article } from '../types/article';

interface LeftSidebarProps {
  articles: Article[];
}

export default function LeftSidebar({ articles }: LeftSidebarProps) {
  return (
    <aside className="lg:w-1/4 w-full space-y-6 animate-fadeInLeft delay-100">
      {/* 导航菜单卡片 */}
      <div className="flex flex-col text-center bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 animate-fadeInUp animate-scaleIn">
        <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">导航</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span className="mr-2">🏠</span> 首页
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span className="mr-2">📚</span> 分类
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span className="mr-2">📧</span> 联系我
            </a>
          </li>
          <li>
            <a href="/ai-chat/fullscreen" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span className="mr-2">🤖</span> AI Chat
            </a>
          </li>
        </ul>
      </div>

      {/* 公告卡片 */}
      <div className="flex flex-col text-center bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 animate-fadeInUp animate-scaleIn">
        <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">公告</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          欢迎来到 <span className="text-blue-600 dark:text-blue-400 font-medium">Reality</span> 的博客！<br />
          正在持续更新中，敬请期待 <span className="text-yellow-500">✨</span>
        </p>
      </div>

      {/* 随机文章推荐卡片 */}
      <RandomArticleCard articles={articles} />
    </aside>
  );
}