import type { DocumentStats } from "../types";

export function calculateDocumentMetrics(markdown: string): DocumentStats {
  const lines = markdown.split(/\r?\n/);
  const lineCount = lines.length;
  const characterCount = markdown.length;
  const englishWordCount = (markdown.match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) ?? []).length;
  const cjkCharacterCount = (markdown.match(/[\u3400-\u9FFF]/g) ?? []).length;
  const paragraphCount = lines.filter((line) => line.trim().length > 0).length;
  const headingCount = lines.filter((line) => /^#{1,6}\s+/.test(line)).length;
  const imageCount = (markdown.match(/!\[[^\]]*\]\([^\)]+\)/g) ?? []).length;
  const codeBlockCount = (markdown.match(/```/g) ?? []).length / 2;
  const linkCount = (markdown.match(/\[[^\]]+\]\([^\)]+\)/g) ?? []).length;
  const readMinutes = Math.max(1, Math.ceil((englishWordCount + cjkCharacterCount) / 320));

  return {
    lineCount,
    characterCount,
    englishWordCount,
    cjkCharacterCount,
    paragraphCount,
    headingCount,
    imageCount,
    codeBlockCount,
    linkCount,
    readMinutes,
  };
}
