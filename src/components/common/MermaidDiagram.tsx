"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  code: string;
};

export default function MermaidDiagram({ code }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      const el = containerRef.current;
      if (!el) return;
      const seq = ++sequenceRef.current;
      try {
        const mermaid = (await import("mermaid")).default;
        const isDark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
        });
        const { svg } = await mermaid.render(`mermaid-diagram-${seq}`, code);
        if (cancelled || seq !== sequenceRef.current) return;
        el.innerHTML = svg;
        setFailed(false);
      } catch (err) {
        console.error("Mermaid render failed:", err);
        if (!cancelled) setFailed(true);
      }
    };

    render();

    const observer = new MutationObserver(() => {
      render();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [code]);

  return (
    <>
      <div
        className="mermaid-diagram"
        ref={containerRef}
        style={failed ? { display: "none" } : undefined}
      />
      {failed && (
        <pre className="mermaid-fallback">
          <code>{code}</code>
        </pre>
      )}
    </>
  );
}
