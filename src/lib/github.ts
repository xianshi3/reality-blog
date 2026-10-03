import { GITHUB_USERNAME, BLOG_REPO, CHANGELOG_COMMIT_LIMIT, FEATURED_REPOS } from "@/config/github";

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

/** 博客更新日志用的精简提交信息 */
export interface GitHubCommit {
  sha: string;
  shortSha: string;
  /** 提交信息首行 */
  message: string;
  htmlUrl: string;
  /** ISO 8601 时间字符串 */
  date: string;
}

/** GitHub commits 接口的原始响应结构（只声明用到的字段） */
interface CommitItem {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string } | null;
  };
}

const GITHUB_API = "https://api.github.com";
const FETCH_TIMEOUT_MS = 10_000;

/**
 * 统一的 GitHub API 请求：带认证、超时与 ISR 缓存。
 * 任何失败都降级为 null，不向页面抛出错误。
 */
async function githubFetch<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "reality-blog",
    };

    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${GITHUB_API}${path}`, {
      headers,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate },
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchRepo(fullName: string): Promise<GitHubRepo | null> {
  return githubFetch<GitHubRepo>(`/repos/${fullName}`, 3600);
}

export async function getFeaturedRepos(): Promise<GitHubRepo[]> {
  const repos = await Promise.all(
    FEATURED_REPOS.map((name) => fetchRepo(`${GITHUB_USERNAME}/${name}`))
  );
  return repos.filter((repo): repo is GitHubRepo => repo !== null);
}

/**
 * 拉取博客仓库最近的提交记录，用于首页「更新日志」卡片。
 * 30 分钟缓存一次；接口不可用时返回空数组，卡片自动隐藏。
 */
export async function getBlogCommits(
  limit: number = CHANGELOG_COMMIT_LIMIT
): Promise<GitHubCommit[]> {
  const perPage = Math.min(Math.max(limit, 1), 100);

  const items = await githubFetch<CommitItem[]>(
    `/repos/${GITHUB_USERNAME}/${BLOG_REPO}/commits?per_page=${perPage}`,
    1800
  );

  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    sha: item.sha,
    shortSha: item.sha.slice(0, 7),
    message: item.commit.message.split("\n")[0].trim(),
    htmlUrl: item.html_url,
    date: item.commit.author?.date ?? "",
  }));
}
