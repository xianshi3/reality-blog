import React from "react";
import type ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

type RemarkPlugins = NonNullable<
  React.ComponentProps<typeof ReactMarkdown>["remarkPlugins"]
>;
type RehypePlugins = NonNullable<
  React.ComponentProps<typeof ReactMarkdown>["rehypePlugins"]
>;

/** 完整插件集：博客文章页、全屏 AI 聊天页 */
export const articleRemarkPlugins: RemarkPlugins = [remarkGfm, remarkBreaks, remarkMath];
export const articleRehypePlugins: RehypePlugins = [
  rehypeRaw,
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "prepend" }],
  rehypeKatex,
  [rehypeHighlight, { plainText: ["mermaid"] }],
];

/** 轻量插件集：AI 浮窗消息气泡 */
export const chatRemarkPlugins: RemarkPlugins = [remarkGfm];
export const chatRehypePlugins: RehypePlugins = [
  [rehypeHighlight, { plainText: ["mermaid"] }],
];
