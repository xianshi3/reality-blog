"use client";

import ReactMarkdown from "react-markdown";
import MermaidDiagram from "@/components/common/MermaidDiagram";
import { getMermaidCode } from "@/lib/markdownText";
import { articleRemarkPlugins, articleRehypePlugins } from "@/lib/markdownPlugins";
import 'katex/dist/katex.min.css';

type Props = {
  content: string;
};

export default function ArticleContent({ content }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={articleRemarkPlugins}
        rehypePlugins={articleRehypePlugins}
        components={{
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table {...props} className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          code: ({ children, className, ...props }) => {
            const inline = typeof children === "string" && !children.includes("\n");
            if (inline) {
              return <code {...props} className={`bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono ${className ?? ""}`}>{children}</code>;
            }
            return <code {...props} className={`block p-4 overflow-x-auto text-sm font-mono ${className ?? ""}`}>{children}</code>;
          },
          pre: ({ children, className, ...props }) => {
            const mermaidCode = getMermaidCode(children);
            if (mermaidCode !== null) {
              return <MermaidDiagram code={mermaidCode} />;
            }
            return (
              <pre {...props} className={`overflow-x-auto p-4 rounded-lg ${className ?? ""}`}>
                {children}
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
