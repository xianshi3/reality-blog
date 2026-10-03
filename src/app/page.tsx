import Link from 'next/link';
import Header from '@/components/layout/Header';
import MainContent from '@/components/common/MainContent';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import Footer from '@/components/layout/Footer';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import AIChat from '@/components/chat/DynamicAIChat';
import GitHubProjects from '@/components/github/GitHubProjects';
import { createServerSupabase } from '@/lib/supabaseServer';
import { parseTags } from '@/lib/parseTags';
import type { Article } from '@/types/article';

// 每页显示的文章数量
const PAGE_SIZE = 6;

/**
 * 博客首页组件（SSR）
 * 加载指定页码的文章数据，并渲染完整页面结构
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;

  // 当前页码，默认为第1页（非法参数一律回退到第1页）
  const rawPage = parseInt(sp.page ?? '1', 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  // Supabase 查询文章的起止索引
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 创建服务端 Supabase 客户端
  const supabase = await createServerSupabase();

  // 从 Supabase 拉取文章数据（按时间降序）
  const { data: articlesRaw, error, status, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .range(from, to);

  // 拉取视差背景数据
  const { data: profile } = await supabase
    .from('profile')
    .select('parallax_image_url, parallax_title, parallax_subtitle')
    .eq('id', 1)
    .maybeSingle();

  // 错误处理：返回错误组件
  if (error) {
    return <ErrorDisplay status={status} message={error.message} />;
  }

  // 格式化文章数据，附加链接，转换 tags
  const articles: Article[] = (articlesRaw ?? []).map((item) => ({
    ...item,
    link: `/article/${item.id}`,
    tags: parseTags(item.tags),
  }));

  // 计算总页数
  let totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
  if (count === null && articles.length > 0) {
    totalPages = Math.ceil(articles.length / PAGE_SIZE);
  }

  // 渲染完整页面结构
  return (
    <div className="home-container">
      {/* 顶部导航栏 */}
      <Header
        parallaxImage={profile?.parallax_image_url || "/parallax-bg.png"}
        parallaxTitle={profile?.parallax_title ?? ""}
        parallaxSubtitle={profile?.parallax_subtitle ?? ""}
      />

      {/* 主体区域：桌面端为「左侧栏 + 文章 + 右侧栏」三栏并排；
          xl 以下通过 order 调整为「文章 → 左侧栏 → 右侧栏」纵向堆叠 */}
      <main className="container-home">
        <LeftSidebar className="order-2 xl:order-none" />
        <MainContent
          className="order-1 xl:order-none flex-1 min-w-0"
          articles={articles}
          currentPage={page}
        />
        <RightSidebar
          className="order-3 xl:order-none"
          articles={articles}
        />
      </main>

      {/* 分页 - 居中显示 */}
      {totalPages > 1 && (
        <nav aria-label="分页导航" className="pagination" style={{ marginTop: 0, marginBottom: '3rem' }}>
          {page > 1 && (
            <Link href={`/?page=${page - 1}`}>上一页</Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/?page=${p}`}
              className={p === page ? "active" : ""}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={`/?page=${page + 1}`}>下一页</Link>
          )}
        </nav>
      )}

      {/* 底部固定 AI 聊天组件 */}
      <AIChat />

      {/* GitHub 开源项目展示 */}
      <GitHubProjects />

      {/* 页面底部 Footer */}
      <Footer currentYear={new Date().getFullYear()} />
    </div>
  );
}
