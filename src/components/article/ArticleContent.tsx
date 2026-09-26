"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';

type Props = {
  content: string;
};

export default function ArticleContent({ content }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          rehypeKatex,
          rehypeHighlight,
        ]}
        components={{
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table {...props} className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          code: ({ children, ...props }) => {
            const inline = typeof children === "string" && !children.includes("\n");
            if (inline) {
              return <code {...props} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
            }
            return <code {...props} className="block p-4 overflow-x-auto text-sm font-mono">{children}</code>;
          },
          pre: ({ children, ...props }) => (
            <pre {...props} className="overflow-x-auto p-4 rounded-lg bg-gray-900 dark:bg-gray-950">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
