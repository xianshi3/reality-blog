import Image from "next/image";
import TechStackCard from './TechStackCard';

interface RightSidebarProps {
  tags: string[];
  recommends: string[];
}

/**
 * 右侧边栏组件，显示个人信息、技术栈、热门标签和推荐阅读列表
 */
export default function RightSidebar({ tags, recommends }: RightSidebarProps) {
  return (
    <aside className="lg:w-64 w-full space-y-6">
      {/* 个人信息卡片 - 淡入 + 缩放动画 */}
      <div className="flex flex-col items-center text-center bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 animate-fadeInUp animate-scaleIn">
        <Image
          className="avatarImg mb-3"
          src="/avatar.jpg"
          alt="头像"
          width={96}
          height={96}
          priority
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Reality</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          全栈开发工程师的技术与生活
        </p>
      </div>

      {/* 技术栈卡片 */}
      <TechStackCard />

      {/* 热门标签 - 右滑入动画 */}
      <div className="bg-white dark:bg-[#23272f] rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800 animate-fadeInRight">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 推荐阅读 - 延迟右滑入动画 */}
      <div className="bg-white dark:bg-[#23272f] rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800 animate-fadeInRight" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">推荐阅读</h3>
        <ul className="space-y-3 text-sm">
          {recommends.map((title, idx) => (
            <li key={idx}>
              <a
                href="#"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 group transition"
              >
                <span className="text-base group-hover:rotate-6 transition-transform">📌</span>
                <span className="truncate group-hover:underline">{title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}