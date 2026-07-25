import Link from "next/link";
import { createServerSupabase } from "@/lib/supabaseServer";
import ArticleItem from "@/components/article/ArticleItem";
import { FaFileLines, FaNewspaper, FaChevronLeft, FaChevronRight, FaMagnifyingGlass } from "react-icons/fa6";

const PAGE_SIZE = 15;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const search = sp.search || "";
  const categoryFilter = sp.category || "";

  const supabase = await createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="admin-card text-center max-w-md">
          <FaNewspaper className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">请先登录</p>
          <a href="/login" className="admin-btn admin-btn-primary">前往登录</a>
        </div>
      </div>
    );
  }

  // Fetch distinct categories for filter
  const { data: allCategories } = await supabase
    .from("articles")
    .select("category")
    .not("category", "is", null)
    .neq("category", "");

  const categories = allCategories
    ? [...new Set(allCategories.map((c) => c.category).filter(Boolean) as string[])].sort()
    : [];

  // Build query
  let query = supabase
    .from("articles")
    .select("id, title, date, image_url, category", { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (categoryFilter) {
    query = query.eq("category", categoryFilter);
  }

  const { data: articles, count: total } = await query
    .order("date", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (search) params.set("search", search);
    if (categoryFilter) params.set("category", categoryFilter);
    const qs = params.toString();
    return `/admin/articles${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <h1 className="admin-page-title">
        <FaNewspaper /> 文章管理
        {total !== undefined && (
          <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "#9ca3af", marginLeft: 4 }}>({total})</span>
        )}
      </h1>

      {/* Search & Filter */}
      <div className="admin-card" style={{ marginBottom: "1rem", padding: "0.75rem 1rem" }}>
        <form method="GET" action="/admin/articles" className="admin-articles-toolbar">
          <div className="admin-search-box">
            <FaMagnifyingGlass className="admin-search-icon" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="搜索文章标题..."
              className="admin-search-input"
            />
          </div>

          <select
            name="category"
            className="admin-category-select"
            defaultValue={categoryFilter}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value) params.set("category", e.target.value);
              else params.delete("category");
              params.delete("page");
              window.location.href = `/admin/articles?${params.toString()}`;
            }}
          >
            <option value="">全部分类</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button type="submit" className="admin-btn admin-btn-primary" style={{ flexShrink: 0 }}>
            <FaMagnifyingGlass /> 搜索
          </button>

          {(search || categoryFilter) && (
            <Link href="/admin/articles" className="admin-btn admin-btn-secondary" style={{ flexShrink: 0 }}>
              清除筛选
            </Link>
          )}
        </form>
      </div>

      <div className="admin-card">
        {articles && articles.length > 0 ? (
          <ul className="admin-list">
            {articles.map((article, idx) => (
              <ArticleItem
                key={article.id}
                article={article}
                delay={idx * 40}
                showImage
              />
            ))}
          </ul>
        ) : (
          <div className="admin-empty">
            <FaFileLines style={{ fontSize: "2rem", display: "block", margin: "0 auto 0.5rem" }} />
            <p>{search || categoryFilter ? "没有匹配的文章" : "暂无文章"}</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="admin-pagination">
            <Link
              href={buildHref(currentPage - 1)}
              className={`admin-page-btn ${currentPage <= 1 ? "disabled" : ""}`}
              aria-disabled={currentPage <= 1}
            >
              <FaChevronLeft />
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((p, idx, arr) => (
                <span key={p} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="admin-page-ellipsis">...</span>}
                  <Link href={buildHref(p)} className={`admin-page-btn ${p === currentPage ? "active" : ""}`}>
                    {p}
                  </Link>
                </span>
              ))}

            <Link
              href={buildHref(currentPage + 1)}
              className={`admin-page-btn ${currentPage >= totalPages ? "disabled" : ""}`}
              aria-disabled={currentPage >= totalPages}
            >
              <FaChevronRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
