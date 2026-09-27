import React from "react";

export const markdownToText = (node: React.ReactNode): string => {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (Array.isArray(node)) return node.map(markdownToText).join("");
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (React.isValidElement(node)) {
    return markdownToText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
};

const getFirstChild = (children: React.ReactNode): React.ReactNode =>
  Array.isArray(children) ? children[0] : children;

export const getChildCodeClassName = (children: React.ReactNode): string | undefined => {
  const child = getFirstChild(children);
  if (!child || typeof child !== "object" || !("props" in child)) return undefined;
  const className = (child.props as { className?: string }).className;
  return typeof className === "string" ? className : undefined;
};

export const getMermaidCode = (children: React.ReactNode): string | null => {
  const className = getChildCodeClassName(children);
  if (typeof className !== "string" || !/language-mermaid/.test(className)) return null;
  const child = getFirstChild(children);
  if (!child || typeof child !== "object" || !("props" in child)) return null;
  return markdownToText((child.props as { children?: React.ReactNode }).children);
};
