"use client";

import { useState } from 'react';

export default function TechStackCard() {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend' | 'devops'>('frontend');

  const techStack = {
    frontend: [
      { name: 'Next.js', level: 70, icon: '🅰️' },
      { name: 'React', level: 75, icon: '⚛️' },
      { name: 'TypeScript', level: 85, icon: '📘' },
      { name: 'Tailwind CSS', level: 80, icon: '🎨' },
      { name: 'Vue.js', level: 90, icon: '🟢' }
    ],
    backend: [
      { name: 'JavaSE', level: 85, icon: '☕' },
      { name: '.NET', level: 80, icon: '🔷' },
      { name: 'Go', level: 75, icon: '🐹' },
      { name: 'Python', level: 80, icon: '🐍' },
      { name: 'C++', level: 70, icon: '➕➕' }
    ],
    devops: [
      { name: 'Vercel', level: 80, icon: '▲' },
      { name: 'Docker', level: 70, icon: '🐳' },
      { name: 'Git', level: 85, icon: '🐙' },
      { name: 'CI/CD', level: 75, icon: '🔄' },
      { name: 'AWS', level: 65, icon: '☁️' }
    ]
  };

  return (
    <div className="bg-white dark:bg-[#23272f] rounded-xl font-sans shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* 标题 */}
      <div className="p-6 pb-0">
        <h3 className="text-xl font-bold flex items-center text-gray-800 dark:text-gray-100">
          <span className="mr-2 hover:rotate-45 transition-transform duration-300">💻</span> 
          <span className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">我的技术栈</span>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300">
          根据项目经验评估的技术熟练度
        </p>
      </div>

      {/* 标签页 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 mt-4">
        <button
          onClick={() => setActiveTab('frontend')}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-all duration-300 ${
            activeTab === 'frontend'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 scale-105'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-[1.03]'
          }`}
        >
          前端技术
        </button>
        <button
          onClick={() => setActiveTab('backend')}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-all duration-300 ${
            activeTab === 'backend'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 scale-105'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-[1.03]'
          }`}
        >
          后端技术
        </button>
        <button
          onClick={() => setActiveTab('devops')}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-all duration-300 ${
            activeTab === 'devops'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 scale-105'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-[1.03]'
          }`}
        >
          运维部署
        </button>
      </div>

      {/* 技术栈内容 */}
      <div className="p-6">
        <ul className="space-y-4">
          {techStack[activeTab].map((tech, index) => (
            <li 
              key={tech.name}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium flex items-center text-gray-700 dark:text-gray-300 group">
                  <span className="mr-2 group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </span>
                  <span className="group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {tech.name}
                  </span>
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {tech.level}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${tech.level}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}