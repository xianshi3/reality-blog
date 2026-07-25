import Link from "next/link";
import { createServerSupabase } from "@/lib/supabaseServer";
import ArticleItem from "@/components/article/ArticleItem";
import { FaPenToSquare, FaImages, FaNewspaper, FaFileLines, FaRocket, FaTag } from "react-icons/fa6";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  return "晚上好";
}

export default async function AdminPage() {
  const supabase = await createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="admin-card text-center max-w-md">
          <FaRocket className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            未登录，请先登录
          </p>
          <a href="/login" className="admin-btn admin-btn-primary">
            前往登录
          </a>
        </div>
      </div>
    );
  }

  const { data: articles, count } = await supabase
    .from("articles")
    .select("id, title, date", { count: "exact" })
    .order("date", { ascending: false });

  const totalArticles = count ?? articles?.length ?? 0;

  const { data: categories } = await supabase
    .from("articles")
    .select("category")
    .not("category", "is", null);

  const categoryCount = categories
    ? new Set(categories.map((c) => c.category)).size
    : 0;

  const { count: totalImages } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .not("image_url", "is", null);

  const recentArticles = articles?.slice(0, 10) ?? [];

  return (
    <div>
      {/* Welcome banner */}
      <div className="admin-welcome">
        <div className="admin-welcome-text">
          <h2>{getGreeting()}，管理员</h2>
          <p>欢迎回来，当前共有 {totalArticles} 篇文章</p>
        </div>
        <FaRocket className="admin-welcome-icon" />
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <FaFileLines />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{totalArticles}</span>
            <span className="admin-stat-label">文章总数</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <FaTag />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{categoryCount ?? 0}</span>
            <span className="admin-stat-label">分类数量</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <FaImages />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{totalImages}</span>
            <span className="admin-stat-label">封面图片</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-quick-actions">
        <Link href="/admin/create" className="admin-btn admin-btn-primary">
          <FaPenToSquare /> 写新文章
        </Link>
        <Link href="/admin/images" className="admin-btn admin-btn-secondary">
          <FaImages /> 管理图片
        </Link>
      </div>

      {/* Article list */}
      <div className="admin-card">
        <h2 className="admin-section-title">
          <FaNewspaper style={{ marginRight: 4 }} />
          最近文章
        </h2>
        {recentArticles.length > 0 ? (
          <ul className="admin-list">
            {recentArticles.map((article, idx) => (
              <ArticleItem key={article.id} article={article} delay={idx * 40} />
            ))}
          </ul>
        ) : (
          <div className="admin-empty">
            <FaNewspaper style={{ fontSize: "2rem", display: "block", margin: "0 auto 0.5rem" }} />
            <p>暂无文章，开始写第一篇吧</p>
            <Link href="/admin/create" className="admin-btn admin-btn-primary" style={{ marginTop: "1rem", display: "inline-flex" }}>
              <FaPenToSquare /> 写新文章
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
