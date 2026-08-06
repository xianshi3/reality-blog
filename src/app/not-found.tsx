import Link from "next/link";
import { FaGhost } from "react-icons/fa6";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-[#1a1a1a]">
      <div className="max-w-md w-full bg-white/30 dark:bg-[#2c2c2c]/30 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4 font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          404
        </div>
        <FaGhost className="text-4xl mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">页面不存在</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          你访问的页面可能已被移除或链接有误
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
