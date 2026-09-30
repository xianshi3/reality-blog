<div align="center">

[简体中文](README.md) · [English](README_EN.md)

</div>

<div align="center">
  <br/>
  <br/>
  <img src="https://img.shields.io/badge/Reality-Blog-6366f1?style=for-the-badge&logoColor=white" alt="Reality Blog" height="40"/>
  <br/>
  <br/>

  <p>
    <b>🚀 A modern personal blog built with Next.js 16</b><br/>
    <sub>Markdown writing · AI Chat · Dark mode · Parallax design · Full admin panel</sub>
  </p>

  <br/>

  <!-- Tech Stack Badges -->
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/TailwindCSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/></a>
  <br/>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/></a>
  <a href="https://www.framer.com/motion"><img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/></a>
  <a href="https://zhipuai.cn"><img src="https://img.shields.io/badge/ZhipuAI-3859FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==&logoColor=white" alt="ZhipuAI"/></a>
  <a href="https://github.com/remarkjs/react-markdown"><img src="https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white" alt="Markdown"/></a>

  <br/>
  <br/>

  <!-- Badges row -->
  <img src="https://img.shields.io/github/license/xianshi3/Reality-Blog?style=flat-square&color=6366f1" alt="License"/>
  <img src="https://img.shields.io/github/actions/workflow/status/xianshi3/Reality-Blog/ci.yml?style=flat-square" alt="CI"/>
  <img src="https://img.shields.io/badge/PRs-welcome-22c55e?style=flat-square" alt="PRs Welcome"/>
  <img src="https://img.shields.io/github/stars/xianshi3/Reality-Blog?style=flat-square&color=6366f1" alt="Stars"/>
  <img src="https://img.shields.io/github/last-commit/xianshi3/Reality-Blog?style=flat-square&color=6366f1" alt="Last Commit"/>

  <br/>
  <br/>

  <!-- Live Demo + Deploy -->
  <a href="https://reality-blog.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/></a>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxianshi3%2Freality-blog&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,ADMIN_EMAIL,ZHIPU_API_KEY,NEXT_PUBLIC_SITE_URL&project-name=reality-blog&demo-url=https%3A%2F%2Freality-blog.vercel.app&demo-title=Reality%20Blog&demo-description=A%20modern%20personal%20blog"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

  <br/>
  <br/>
  <br/>
</div>

---

## 📋 Table of Contents

<div align="center">

[Features](#-features) · [Tech Stack](#-tech-stack) · [Screenshots](#-screenshots) · [Quick Start](#-quick-start) · [Database](#-database) · [Admin Panel](#-admin-panel) · [Project Structure](#-project-structure) · [Highlights](#-highlights) · [Build & Deploy](#-build--deploy) · [Open Source](#-open-source)

</div>

---

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| <img src="https://img.shields.io/badge/Markdown-000000?style=flat-square&logo=markdown&logoColor=white"/> Writing | Full-featured Markdown editor with a toolbar for headings, lists, code blocks and images |
| <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white"/> Admin Panel | Dashboard stats, article management (search/pagination/category filter), image manager, profile settings |
| <img src="https://img.shields.io/badge/ZhipuAI-3859FF?style=flat-square&logoColor=white"/> AI Chat | Zhipu GLM-4-Flash model, floating bubble + fullscreen modes, streaming output |
| <img src="https://img.shields.io/badge/AI_Summary-6366f1?style=flat-square&logoColor=white"/> AI Summary | One-click one-line summary in the article card footer, with server-side + local caching |
| <img src="https://img.shields.io/badge/Mermaid-FF3670?style=flat-square&logo=mermaid&logoColor=white"/> Diagrams | Mermaid flow/sequence diagrams auto-rendered in articles & AI chat, both themes, falls back to code block on failure |
| <img src="https://img.shields.io/badge/dynamic-6366f1?style=flat-square&label=Parallax&labelColor=6366f1&color=6366f1"/> Parallax Home | Dynamic parallax background + 3D mouse tilt, custom background & titles |
| <img src="https://img.shields.io/badge/Framer-0055FF?style=flat-square&logo=framer&logoColor=white"/> Animations | Page transitions, card hover effects, parallax scrolling, like micro-interactions |
| <img src="https://img.shields.io/badge/dark_mode-000000?style=flat-square&logo=darkreader&logoColor=white"/> Dark Mode | Auto-detect + manual toggle, inline script prevents FOUC |
| <img src="https://img.shields.io/badge/responsive-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/> Responsive | Desktop / tablet / mobile, drawer menu on mobile |
| <img src="https://img.shields.io/badge/Image_Crop-000000?style=flat-square&logo=canvas&logoColor=white"/> Image Crop | Pre-upload crop: 1:1 avatar, 21:9 parallax background |
| <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/> GitHub Projects | Showcase featured repos (star/fork/language), API + ISR cache |
| <img src="https://img.shields.io/badge/SEO-4285F4?style=flat-square&logo=google&logoColor=white"/> SEO | Auto sitemap.xml, robots.txt, PWA manifest, OG/Twitter cards, custom 404 & error pages |

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Tech |
|----------|------|
| **Framework** | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript 5 |
| **Styling** | TailwindCSS 4 + frosted-glass effects (backdrop-filter) |
| **Database** | Supabase (PostgreSQL + Auth + Storage + RLS) |
| **Markdown** | react-markdown + remark-gfm + rehype-highlight + rehype-katex + Mermaid 12 |
| **Animation** | Framer Motion 12 + CSS Animations |
| **AI** | ZhipuAI SDK (GLM-4-Flash, SSE streaming) |
| **Images** | react-easy-crop + Supabase Storage |
| **Icons** | react-icons (Font Awesome 6) |
| **Code Highlight** | rehype-highlight (local GitHub light/dark themes, no CDN) |

</div>

---

## 📸 Screenshots

<div align="center">
  <img width="800" alt="Home" src="https://github.com/user-attachments/assets/2b94da33-2671-4484-9ce2-9c9633c18f6a" />
  <br/>
  <sub>🏠 Home — parallax background + article list + sidebar</sub>
  <br/><br/>
  <img width="800" alt="Article" src="https://github.com/user-attachments/assets/a888e74c-a450-4bdf-82da-0eae6d4a41d5" />
  <br/>
  <sub>📝 Article — Markdown rendering + table of contents + AI chat</sub>
  <br/><br/>
  <img width="800" alt="Admin" src="https://github.com/user-attachments/assets/29dd8d70-bd2f-4079-b3b6-dfd21dcf0fad" />
  <br/>
  <sub>⚙️ Admin panel — dashboard + frosted-glass sidebar</sub>
</div>

---

## 🚀 Quick Start

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxianshi3%2Freality-blog&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,ADMIN_EMAIL,ZHIPU_API_KEY,NEXT_PUBLIC_SITE_URL&project-name=reality-blog)

### Manual Setup

```bash
# 1. Clone
git clone https://github.com/xianshi3/Reality-Blog.git
cd Reality-Blog

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# edit .env.local and fill in your keys

# 4. Develop
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=          # Supabase service role key (server-only, writes + rate limiting)
ADMIN_EMAIL=                        # Admin email (admin pages & write APIs only allow this email)
ZHIPU_API_KEY=                      # Zhipu AI API key
NEXT_PUBLIC_SITE_URL=               # Real site domain (sitemap / robots / OG metadata)
GITHUB_TOKEN=                       # GitHub showcase (optional, unauthenticated API limited to 60 req/h)
```

---

## 📦 Database

### `articles` — Articles

```sql
CREATE TABLE articles (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title     TEXT NOT NULL,
  date      TIMESTAMP DEFAULT now(),
  category  TEXT,
  summary   TEXT,
  content   TEXT,
  tags      TEXT DEFAULT '{}',
  likes     INTEGER DEFAULT 0,
  ai_summary TEXT,
  image_url TEXT
);
```

### `profile` — Personal Info (single row)

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
  parallax_subtitle  TEXT NOT NULL DEFAULT 'Explore the edge of tech and the world',
  updated_at         TIMESTAMPTZ DEFAULT now()
);
```

> Full DDL, RLS policies, the atomic like function (`increment_likes`) and the cross-instance rate-limit table/function (`rate_limits` / `rate_limit_check`) can be found in [`schema.sql`](./schema.sql)

### Supabase Setup

1. Create a project on the [Supabase Dashboard](https://supabase.com)
2. **Auth** → Providers → enable Email
3. **Storage** → create a public bucket `article-images`
4. **SQL Editor** → run `schema.sql`
5. **Storage** → Policies → revoke the anonymous INSERT policy on `article-images` (uploads go through the authenticated server API; keep public read only)

> When upgrading, simply re-run `schema.sql` — it contains `IF NOT EXISTS` and idempotent upgrade statements (revoking legacy write policies, adding the rate-limit table).

---

## 🖥️ Admin Panel

```
/admin          ─ Dashboard (stats + recent articles)
/admin/create   ─ Write articles (Markdown editor)
/admin/articles ─ Article management (search / pagination / category filter)
/admin/images   ─ Image management (upload / crop / delete)
/admin/settings ─ Profile (avatar / bio / social / parallax background)
```

### API Routes

| Method | Path | Purpose |
|--------|------|---------|
| `GET/POST/PUT/DELETE` | `/api/article` | Article CRUD (write requires login) |
| `GET/POST` | `/api/article/[id]/like` | Likes (atomic RPC, anonymous allowed) |
| `POST` | `/api/article/[id]/summary` | AI one-line gist (rate-limited + server cache) |
| `GET/PUT` | `/api/profile` | Profile (PUT requires login) |
| `POST` | `/api/chat` | AI chat (SSE, cross-instance rate limiting) |
| `POST` | `/api/auth/set-cookie` | Login session |
| `POST` | `/api/storage` | Upload image (login required, service role storage) |
| `DELETE` | `/api/storage` | Delete image (login required) |

> Security: all write APIs verify the session on the server via `requireUser` (`auth.getUser()`); with `ADMIN_EMAIL` set, only the admin email can operate. The database only exposes public `SELECT`, and all writes go through the service role, so no registered user can modify data directly via the anon key. Admin pages are guarded by `proxy.ts`.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel (protected)
│   ├── article/[id]/       # Article detail
│   ├── category/           # Category archive
│   ├── login/              # Login page
│   ├── ai-chat/            # AI chat
│   ├── api/                # API routes
│   ├── not-found.tsx       # Global 404 page
│   ├── error.tsx           # Global error page
│   ├── sitemap.ts          # Auto sitemap
│   ├── robots.ts           # Crawler rules
│   ├── manifest.ts         # PWA manifest
│   └── icon.svg            # favicon
├── components/
│   ├── layout/             # Layout (Navbar, Header, RightSidebar, ThemeToggle, Footer)
│   ├── article/            # Article (Content, TOC, Search, Tags)
│   ├── common/             # Common (LikeButton, ImageCropper, MermaidDiagram)
│   ├── chat/               # AI chat components
│   ├── github/             # GitHub showcase components
│   └── admin/              # Admin components
├── config/                 # Site config (featured GitHub repos, etc.)
├── lib/                    # Utils (Supabase client, upload, GitHub API, Markdown rendering)
├── types/                  # TypeScript types
└── proxy.ts                # Auth proxy (Next.js 16 Proxy convention, getUser() verification)
```

---

## 🌟 Highlights

### Parallax Home

Background scrolls with an offset, and mouse hover creates 3D tilt + parallax. The background, title and subtitle are customizable from the admin panel; leave them empty to hide.

### GitHub Projects

- 🐙 A **featured open-source projects** section below the home article list (frosted-glass cards, dark mode support)
- ⭐ Auto-syncs **star / fork / language / description** (GitHub API + ISR hourly cache; hides gracefully on API failure)
- ⚙️ Which repos to show is controlled by `src/config/github.ts`; optionally set `GITHUB_TOKEN` to raise the API limit

### AI Chat

| Mode | Entry | Features |
|------|-------|----------|
| 💬 Floating | Bottom-left bubble | Draggable, ask anytime |
| 🖥️ Fullscreen | `/ai-chat/fullscreen` | History / edit message / export Markdown / retry |

Built on the Zhipu GLM-4-Flash model with SSE streaming.

### AI One-Line Summary

The article card footer has an "AI Summary" entry (a minimal text button). Clicking it generates a one-line summary with GLM-4-Flash: the result is stored in the database `ai_summary` column (shared by all visitors) and cached in the browser, so repeated clicks are instant and cost nothing; click again to collapse. The endpoint is IP rate-limited to prevent API key abuse.

### Reading Experience

- 📑 Draggable **table of contents** (fixed/floating switch)
- 🎨 **Syntax highlighting** for code blocks (rehype-highlight, local GitHub light/dark themes, light background in light mode)
- 📊 **Mermaid diagrams** (flow/sequence charts, unified across article page and both AI chat renderers)
- ❤️ Responsive **like button** with animation

### SEO & Error Handling

- 🗺️ Auto-generated **sitemap.xml** (articles / categories / static pages) and **robots.txt**
- 📱 **PWA manifest** + favicon + OG/Twitter share images
- 🚧 Frosted-glass **404 / error pages** (global + root-layout error boundaries, dark mode aware)

### Security

- 🔐 Server-side session verification for all write APIs (`requireUser` → `auth.getUser()`), optional `ADMIN_EMAIL` allowlist
- 🔒 Least-privilege database: public `SELECT` only; article/profile writes go through the service role; the anon key is read-only
- 📤 Image uploads go through the authenticated server API (service role), preventing anonymous abuse
- ❤️ Likes use the atomic `increment_likes` RPC (SECURITY DEFINER), no race conditions; local dedup prevents repeat likes on refresh
- 🚦 Cross-instance AI chat / summary rate limiting (database RPC count, in-memory fallback) to prevent API key abuse

---

## 📦 Build & Deploy

```bash
npm run build    # build
npm start        # start
npm run lint     # lint
```

Deploying to [Vercel](https://vercel.com) is recommended — it auto-detects Next.js with zero config.

---

## 🤝 Open Source

This project is open source under the [MIT](./LICENSE) license. Stars, forks and PRs are welcome!

| Doc | Description |
|-----|-------------|
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guide: workflow, commit conventions, code style |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Contributor Covenant code of conduct |
| [SECURITY.md](./SECURITY.md) | Security vulnerability reporting |
| [Issue templates](./.github/ISSUE_TEMPLATE) | Bug report / feature request templates |

### Contributors

Thanks to everyone who has contributed:

<a href="https://github.com/xianshi3/Reality-Blog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=xianshi3/Reality-Blog" />
</a>

---

<div align="center">
  <br/>
  <sub>Built with ❤️ using Next.js & Supabase</sub>
  <br/>
  <br/>
  <a href="https://github.com/xianshi3/Reality-Blog">
    <img src="https://img.shields.io/badge/View_on_GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  <br/>
  <br/>
</div>
