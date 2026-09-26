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
