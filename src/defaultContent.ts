import type { Locale } from "./types";

const zhContent = `# Markdown 排版发布工具

从飞书、Notion、网页或文档粘贴内容，快速转换为可发布样式。

## 功能

- Markdown 实时预览
- 主题一键切换
- 微信兼容复制
- HTML / PDF / DOC 导出

> 专注内容本身，排版交给工具。

\`\`\`ts
console.log("你好，Markdown");
\`\`\``;

const enContent = `# Markdown Publish Tool

Paste rich text from Notion, Feishu, web pages or docs, and publish with stable styles.

## Features

- Real-time markdown preview
- Theme switching
- WeChat-compatible copy
- HTML / PDF / DOC export

> Keep content first, formatting should be automatic.

\`\`\`ts
console.log("hello markdown");
\`\`\``;

export const defaultContentByLocale: Record<Locale, string> = {
  zh: zhContent,
  en: enContent,
};

export const defaultContent = defaultContentByLocale.zh;
