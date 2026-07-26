"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Article } from "@/types/article";
import Link from "next/link";
import { parseTags } from "@/lib/parseTags";
import { FiSearch, FiX, FiInbox } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import ImageWithLoader from "@/components/common/ImageWithLoader";

import "./category.css";
import Footer from "@/components/layout/Footer";

interface Props {
  articles: Article[];
}

export default function CategoryPageClient({ articles }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category");
  const tagFromUrl = searchParams.get("tag");
  const queryFromUrl = searchParams.get("q");

  const activeFilter = categoryFromUrl || tagFromUrl || "全部";
  const filterType = tagFromUrl ? "tag" : categoryFromUrl ? "category" : "all";

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(articles.map((art) => art.category || "未分类"))
    );
    cats.sort((a, b) => a.localeCompare(b));
    return cats;
  }, [articles]);

  const [selectedCategory, setSelectedCategory] = useState<string>(activeFilter);
  const [currentFilterType, setCurrentFilterType] = useState<"category" | "tag" | "all">(filterType);
  const [searchQuery, setSearchQuery] = useState(queryFromUrl || "");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedCategory(activeFilter);
    setCurrentFilterType(filterType);
  }, [categoryFromUrl, tagFromUrl]);

  useEffect(() => {
    setSearchQuery(queryFromUrl || "");
  }, [queryFromUrl]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current !== null) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const updateUrl = useCallback((q: string) => {
    if (searchTimerRef.current !== null) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      router.replace(`/category?${params.toString()}`, { scroll: false });
    }, 300);
  }, [searchParams, router]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrl(val);
  };

  const clearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.replace(`/category?${params.toString()}`, { scroll: false });
    searchRef.current?.focus();
  };

  const filteredByCategory = useMemo(() => {
    if (selectedCategory === "全部") return articles;

    if (currentFilterType === "tag") {
      return articles.filter((art) => {
        const tags = parseTags(art.tags);
        return tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());
      });
    }

    return articles.filter(
      (art) => (art.category || "未分类") === selectedCategory
    );
  }, [selectedCategory, currentFilterType, articles]);

  const searchedArticles = useMemo(() => {
    if (!searchQuery.trim()) return filteredByCategory;
    const q = searchQuery.toLowerCase();
    return filteredByCategory.filter((art) => {
      if (art.title.toLowerCase().includes(q)) return true;
      if (art.summary?.toLowerCase().includes(q)) return true;
      const tags = parseTags(art.tags);
      if (tags.some((t) => t.toLowerCase().includes(q))) return true;
      if (art.category?.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [searchQuery, filteredByCategory]);

  const groupedByCategory = useMemo(() => {
    return searchedArticles.reduce<Record<string, Article[]>>(
      (acc, article) => {
        const category = article.category || "未分类";
        if (!acc[category]) acc[category] = [];
        acc[category].push(article);
        return acc;
      },
      {}
    );
  }, [searchedArticles]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentFilterType(cat === "全部" ? "all" : "category");
  };

  const totalResults = searchedArticles.length;
  const hasActiveFilter = selectedCategory !== "全部" || currentFilterType === "tag";

  const clearAllFilters = () => {
    setSearchQuery("");
    handleCategorySelect("全部");
    const params = new URLSearchParams();
    router.replace("/category", { scroll: false });
  };

  return (
    <div className="category-page-container">
      <Navbar />

      <section className="category-hero">
        <h1>分类浏览</h1>
        <p className="category-hero-sub">共 {articles.length} 篇文章</p>

        <div className="category-search-row">
          <FiSearch className="search-icon" size={16} />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="搜索文章标题、摘要、标签..."
          />
          {searchQuery && (
            <button onClick={clearSearch} className="search-clear-btn">
              <FiX size={14} />
            </button>
          )}
        </div>
      </section>

      <div className="category-pills-sticky">
        <div className="category-pills-inner">
          <button
            className={`pill ${selectedCategory === "全部" && currentFilterType !== "tag" ? "active" : ""}`}
            onClick={() => handleCategorySelect("全部")}
          >
            全部
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill ${selectedCategory === cat && currentFilterType === "category" ? "active" : ""}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}

          {currentFilterType === "tag" && selectedCategory !== "全部" && (
            <>
              <span className="pill tag-pill">#{selectedCategory}</span>
              <button
                className="pill clear-pill"
                onClick={() => handleCategorySelect("全部")}
              >
                清除
              </button>
            </>
          )}

          {(searchQuery || hasActiveFilter) && (
            <span className="result-chip">
              {totalResults} 篇
            </span>
          )}
        </div>
      </div>

      <main className="category-content">
        {Object.keys(groupedByCategory).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FiInbox /></div>
            <p>没有匹配的文章</p>
            {(searchQuery || hasActiveFilter) && (
              <button onClick={clearAllFilters}>清除所有筛选</button>
            )}
          </div>
        ) : (
          Object.entries(groupedByCategory).map(([category, arts]) => (
            <section key={category} className="cat-section">
              <h2 className="cat-section-heading">
                <span className="dot" />
                {category}
                <span className="count">{arts.length} 篇</span>
              </h2>

              <div className="article-grid">
                {arts.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="art-card"
                  >
                    {article.image_url ? (
                      <div className="art-card-image-wrapper">
                        <ImageWithLoader
                          src={article.image_url}
                          alt={article.title}
                          className="art-card-image"
                          wrapperClassName="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="art-card-image-placeholder" />
                    )}
                    <div className="art-card-body">
                      <h3 className="art-card-title">{article.title}</h3>
                      {article.summary && (
                        <p className="art-card-summary">{article.summary}</p>
                      )}
                      {article.tags && (
                        <div className="art-card-meta">
                          {parseTags(article.tags).slice(0, 3).map((t) => (
                            <span key={t} className="tag">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <Footer currentYear={new Date().getFullYear()} />
    </div>
  );
}
