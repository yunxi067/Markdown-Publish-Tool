import type { DocumentStats } from "../types";

interface InsightsPanelProps {
  stats: DocumentStats;
  title: string;
  linesLabel: string;
  charsLabel: string;
  wordsLabel: string;
  cjkLabel: string;
  paragraphsLabel: string;
  headingsLabel: string;
  imagesLabel: string;
  codeBlocksLabel: string;
  linksLabel: string;
  readLabel: string;
  minuteLabel: string;
}

export function InsightsPanel({
  stats,
  title,
  linesLabel,
  charsLabel,
  wordsLabel,
  cjkLabel,
  paragraphsLabel,
  headingsLabel,
  imagesLabel,
  codeBlocksLabel,
  linksLabel,
  readLabel,
  minuteLabel,
}: InsightsPanelProps) {
  return (
    <aside className="panel insights-panel">
      <h2>{title}</h2>
      <ul>
        <li>{linesLabel}: {stats.lineCount}</li>
        <li>{charsLabel}: {stats.characterCount}</li>
        <li>{wordsLabel}: {stats.englishWordCount}</li>
        <li>{cjkLabel}: {stats.cjkCharacterCount}</li>
        <li>{paragraphsLabel}: {stats.paragraphCount}</li>
        <li>{headingsLabel}: {stats.headingCount}</li>
        <li>{imagesLabel}: {stats.imageCount}</li>
        <li>{codeBlocksLabel}: {stats.codeBlockCount}</li>
        <li>{linksLabel}: {stats.linkCount}</li>
        <li>{readLabel}: {stats.readMinutes} {minuteLabel}</li>
      </ul>
    </aside>
  );
}
