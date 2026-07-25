"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function ReturnHome() {
  const [hidden, setHidden] = useState(false);
  const [pos, setPos] = useState({ top: 20, left: 20 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let lastScrollY = 0;
    function onScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPos((p) => ({
      top: Math.min(Math.max(p.top + dy, 10), window.innerHeight - 50),
      left: Math.min(Math.max(p.left + dx, 10), window.innerWidth - 100),
    }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp(e: React.PointerEvent) {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <Link
      href="/"
      className={`return-home ${hidden ? "hidden" : ""}`}
      aria-label="返回首页"
      style={{ top: pos.top, left: pos.left, position: "fixed" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <FiHome className="text-base" />
      <span>返回首页</span>
    </Link>
  );
}
