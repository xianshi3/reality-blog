"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh">
      <body>
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-[#1a1a1a]">
          <div className="max-w-md w-full bg-white/30 dark:bg-[#2c2c2c]/30 backdrop-blur-md border border-red-200 dark:border-red-400 rounded-2xl shadow-xl p-8 text-center">
            <div className="text-5xl mb-4 text-red-500 animate-bounce">⚠️</div>
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
              应用发生严重错误
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 break-words">
              {error.message || "发生未知错误，请稍后重试"}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                错误标识：{error.digest}
              </p>
            )}
            <button
              onClick={reset}
              className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              重新加载
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
