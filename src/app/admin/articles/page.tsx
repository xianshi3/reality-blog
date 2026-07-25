import Link from "next/link";
import { createServerSupabase } from "@/lib/supabaseServer";
import ArticleItem from "@/components/article/ArticleItem";
import { FaFileLines, FaNewspaper, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const PAGE_SIZE = 15;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

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

  const { count: total } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, date, image_url")
    .order("date", { ascending: false })
    .range(from, to);

  return (
    <div>
      <h1 className="admin-page-title">
        <FaNewspaper /> 文章管理
        {total !== undefined && (
          <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "#9ca3af", marginLeft: 4 }}>({total})</span>
        )}
      </h1>

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
            <p>暂无文章</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="admin-pagination">
            <Link
              href={`/admin/articles?page=${currentPage - 1}`}
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
                  <Link
                    href={`/admin/articles?page=${p}`}
                    className={`admin-page-btn ${p === currentPage ? "active" : ""}`}
                  >
                    {p}
                  </Link>
                </span>
              ))}

            <Link
              href={`/admin/articles?page=${currentPage + 1}`}
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
