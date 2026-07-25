<div align="center">

# Reality Blog

**现代化个人博客 — 技术写作 × AI 聊天 × 全栈管理**

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

</div>

---

## ✨ 特性

| 特性 | 描述 |
|------|------|
| 📝 **Markdown 写作** | 全功能 Markdown 编辑器，工具栏快速插入语法 |
| 🏷️ **分类与标签** | 文章分类归档，标签云导航 |
| 🤖 **AI 聊天** | 集成智谱 GLM-4-Flash，浮动气泡 / 全屏双模式 |
| 🎨 **视差首页** | 动态视差滚动背景 + 鼠标交互效果 |
| 🌓 **深色模式** | 系统感知 + 手动切换，无闪烁 |
| 🖼️ **图片管理** | 上传 / 裁剪 / 删除，自动识别头像和背景图 |
| 🔍 **文章管理** | 分页列表、标题搜索、分类筛选 |
| 📊 **管理控制台** | 数据概览、快捷操作、最近文章 |
| ⚡ **Turbopack** | 开发服务器极速启动 |
| 📱 **响应式设计** | 桌面 / 平板 / 手机全适配 |

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────┐
│           Next.js 16 (App Router)        │
│  ┌──────────┐  ┌──────────────────┐  │
│  │  Server   │  │     Client       │  │
│  │  Pages    │  │    Components    │  │
│  ├──────────┤  ├──────────────────┤  │
│  │ API Routes│  │ Framer Motion   │  │
│  │ Supabase  │  │ react-easy-crop │  │
│  │ Server    │  │ Theme Toggle    │  │
│  └──────────┘  └──────────────────┘  │
│           TailwindCSS 4                │
├─────────────────────────────────────┤
│           Supabase                    │
│  ┌──────────┐  ┌──────────────────┐  │
│  │ PostgreSQL│  │  Auth (Email)   │  │
│  ├──────────┤  ├──────────────────┤  │
│  │ Storage  │  │    RLS Policy    │  │
│  └──────────┘  └──────────────────┘  │
├─────────────────────────────────────┤
│       ZhipuAI (GLM-4-Flash)          │
└─────────────────────────────────────┘
```

### 核心依赖

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 16, React 19, TypeScript 5 |
| **样式** | TailwindCSS 4, CSS Modules |
| **数据库** | Supabase (PostgreSQL + Auth + Storage) |
| **Markdown** | react-markdown, remark-gfm, rehype-highlight, rehype-slug |
| **动画** | Framer Motion 12 |
| **AI** | ZhipuAI SDK (GLM-4-Flash) |
| **图片裁剪** | react-easy-crop |
| **图标** | react-icons (Font Awesome 6) |

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/xianshi3/Reality-Blog.git
cd Reality-Blog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ZHIPU_API_KEY=your-zhipu-api-key
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

---

## 📖 数据库配置

### 表结构

<details>
<summary><code>articles</code> — 文章表</summary>

```sql
CREATE TABLE articles (
  id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title    TEXT NOT NULL,
  date     TIMESTAMP DEFAULT now(),
  category TEXT,
  summary  TEXT,
  content  TEXT,
  tags     TEXT DEFAULT '{}',
  likes    INTEGER DEFAULT 0,
  image_url TEXT
);
```
</details>

<details>
<summary><code>profile</code> — 个人信息表（单行）</summary>

```sql
CREATE TABLE profile (
  id                 INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name               TEXT NOT NULL DEFAULT 'Reality',
  title              TEXT NOT NULL DEFAULT 'Full Stack Developer',
  avatar_url         TEXT NOT NULL DEFAULT '/avatar.png',
  github_url         TEXT NOT NULL DEFAULT 'https://github.com/xianshi3',
  twitter_url        TEXT NOT NULL DEFAULT 'https://x.com/xianshi_3',
  parallax_image_url TEXT NOT NULL DEFAULT '/parallax-bg.png',
  parallax_title     TEXT NOT NULL DEFAULT 'Reality Blog',
  parallax_subtitle  TEXT NOT NULL DEFAULT '探索技术与世界的边界',
  updated_at         TIMESTAMPTZ DEFAULT now()
);
```
</details>

> 完整 SQL 见 [`schema.sql`](./schema.sql)

### Supabase 配置

1. 在 [Supabase Dashboard](https://supabase.com) 创建项目
2. 启用 **Email Auth**（Settings → Authentication → Providers）
3. 创建 `article-images` 存储桶（公开）
4. 执行 `schema.sql` 创建表并设置 RLS

---

## 🖥️ 后台管理

| 页面 | 路径 | 功能 |
|------|------|------|
| **控制台** | `/admin` | 数据统计、快捷操作、最近文章 |
| **写文章** | `/admin/create` | Markdown 编辑器 + 工具栏 |
| **文章管理** | `/admin/articles` | 分页、搜索、分类筛选、编辑/删除 |
| **图片管理** | `/admin/images` | 上传 / 裁剪 / 删除，显示使用场景 |
| **个人信息** | `/admin/settings` | 头像、简介、社交链接、视差背景 |

### API 路由

| 路径 | 方法 | 用途 |
|------|------|------|
| `/api/article` | POST/PUT/DELETE | 文章 CRUD |
| `/api/article/[id]/like` | GET/POST | 点赞 |
| `/api/profile` | GET/PUT | 个人信息 |
| `/api/storage` | DELETE | 删除图片 |
| `/api/chat` | POST | AI 聊天（SSE 流式） |
| `/api/auth/set-cookie` | POST | 登录会话 |

---

## 🌟 功能展示

### 首页视差效果

动态 parallax 背景跟随滚动，鼠标悬停产生 3D 倾斜 + 移动视差，支持自定义背景图、标题、副标题。

### AI 聊天

- **浮动模式**：页面右下角可拖拽气泡，随时提问
- **全屏模式**：`/ai-chat/fullscreen`，历史记录、编辑消息、导出 Markdown、重试
- 基于智谱 GLM-4-Flash 模型，流式输出

### 文章阅读体验

- 顶部 **阅读进度条**
- 可拖拽 **目录**（支持固定/浮动切换）
- 代码块 **语法高亮**（highlight.js GitHub Dark 主题）
- 响应式 **点赞** 按钮

---

## 📦 构建部署

```bash
# 构建
npm run build

# 启动
npm start

# 代码检查
npm run lint
```

推荐部署到 [Vercel](https://vercel.com)（零配置，自动识别 Next.js）。

---

## 📄 许可证

[MIT](./LICENSE)
