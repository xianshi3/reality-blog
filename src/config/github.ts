/**
 * GitHub 项目展示配置
 *
 * - GITHUB_USERNAME：GitHub 用户名，用于生成「查看全部」链接与仓库完整路径
 * - BLOG_REPO：本博客自身的仓库名，用于「更新日志」卡片拉取提交记录
 * - CHANGELOG_COMMIT_LIMIT：更新日志卡片展示的提交条数（1-100）
 * - FEATURED_REPOS：首页展示的仓库名列表，按数组顺序展示，可自行增删
 *   （需为 GITHUB_USERNAME 名下的公开仓库；API 拉取失败的仓库会自动跳过）
 */
export const GITHUB_USERNAME = "xianshi3";

export const BLOG_REPO = "reality-blog";

export const CHANGELOG_COMMIT_LIMIT = 8;

export const FEATURED_REPOS = [
  "reality-blog",
  "virtual-path-mes",
  "machine-vision-app",
  "markdown-to-pdf-converter",
  "virtual-path-core",
  "yuetu-books-miniapp",
];
