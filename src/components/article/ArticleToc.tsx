"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaList, FaChevronDown, FaXmark } from "react-icons/fa6";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  className?: string;
}

export default function ArticleToc({ className }: Props) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ x: 8, y: 120 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("toc-open");
    if (saved === "true") setIsOpen(true);
    const savedPos = localStorage.getItem("toc-pos");
    if (savedPos) {
      try { setPos(JSON.parse(savedPos)); } catch {}
    }
  }, []);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1200);
      setIsDesktop(window.innerWidth >= 1200);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    localStorage.setItem("toc-open", isOpen ? "true" : "false");
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem("toc-pos", JSON.stringify(pos));
  }, [pos]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && isExpanded && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobile, isExpanded]);

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll(
        "article.article-content h1[id], article.article-content h2[id], article.article-content h3[id], article.article-content h4[id], article.article-content h5[id], article.article-content h6[id]"
      )
    );

    const newTocItems = headingElements.map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: Number(el.tagName.substring(1)),
    }));

    setTocItems(newTocItems);

    if (headingElements.length > 0) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          if (visibleEntries.length > 0) {
            setActiveId((visibleEntries[0].target as HTMLElement).id);
          } else {
            const scrollY = window.scrollY;
            let active = (headingElements[0] as HTMLElement).id;
            for (const el of headingElements) {
              const top = el.getBoundingClientRect().top + scrollY;
              if (scrollY >= top - 120) {
                active = el.id;
              }
            }
            setActiveId(active);
          }
        },
        {
          rootMargin: "-80px 0px -60% 0px",
          threshold: 0,
        }
      );

      for (const el of headingElements) {
        observerRef.current.observe(el);
      }
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, itemId: string) => {
    e.preventDefault();
    const target = document.getElementById(itemId) || document.querySelector(`[id="${CSS.escape(itemId)}"]`);
    if (target) {
      const topOffset = 80;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -topOffset);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    }
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (isMobile) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { x: pos.x, y: pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [isMobile, pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPos({
      x: Math.max(8, Math.min(window.innerWidth - 248, posStart.current.x + dx)),
      y: Math.max(8, posStart.current.y + dy),
    });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  if (tocItems.length === 0) return null;

  if (isMobile) {
    return (
      <div ref={containerRef} className={className ?? ""}>
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="collapsed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleExpand}
              className="fixed bottom-20 right-4 z-50 flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-white/90 dark:bg-[#23272f]/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg text-sm text-gray-600 dark:text-gray-300"
            >
              <FaList className="text-xs" />
              <span>目录</span>
              <span className="text-[10px] text-gray-400">({tocItems.length})</span>
              <FaChevronDown className="text-[10px] transition-transform duration-200" />
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 bottom-4 z-50 max-h-[70vh] flex flex-col rounded-2xl bg-white dark:bg-[#23272f] border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                  <FaList className="text-xs text-gray-500" />
                  <span>目录</span>
                  <span className="text-xs font-normal text-gray-400">({tocItems.length})</span>
                </div>
                <button onClick={toggleExpand} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FaXmark className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-1 px-2 toc-scroll">
                {tocItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={(e) => handleClick(e, item.id)}
                    className={`block rounded-lg py-2 text-sm transition-colors duration-150 ${
                      activeId === item.id
                        ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 0.75 + 0.75}rem`, paddingRight: "0.75rem" }}
                  >
                    <span className="truncate block">{item.text}</span>
                  </motion.a>
                ))}
              </div>
              <div className="flex-none px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 dark:text-gray-500 text-center">
                点击跳转 · 点击外部关闭
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!isDesktop) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 -translate-y-1/2 z-50 left-0 flex items-center gap-1.5 pl-1.5 pr-2.5 py-5 rounded-r-xl bg-white/80 dark:bg-[#23272f]/80 backdrop-blur-md border border-l-0 border-gray-200/60 dark:border-gray-700/60 shadow-md hover:shadow-lg transition-all cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 group"
        aria-label="打开目录"
      >
        <FaList className="text-xs" />
        <span style={{ writingMode: "vertical-rl" }} className="text-[0.7rem] tracking-widest">
          目录
        </span>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="z-50 flex flex-col overflow-hidden min-h-0 rounded-xl shadow-lg bg-white/85 dark:bg-[#23272f]/85 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60"
      style={{
        position: "fixed",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: "240px",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700/60 cursor-grab active:cursor-grabbing select-none">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          <FaList className="text-xs text-blue-500" />
          目录
          <span className="text-xs font-normal text-gray-400 dark:text-gray-500">({tocItems.length})</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          aria-label="关闭目录"
        >
          <FaXmark />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 py-1 toc-desktop-list toc-scroll" style={{ maxHeight: "min(50vh, 400px)" }}>
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`block transition-all duration-200 py-1.5 rounded-lg mx-2 ${
              activeId === item.id
                ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800/30"
            }`}
            style={{
              paddingLeft: `${(item.level - 1) * 0.75 + 0.75}rem`,
              paddingRight: "0.75rem",
            }}
          >
            <span className="truncate block text-sm">{item.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
