import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { getTheme } from "./themes";
import { headingAccentDataUri, headingDecorationDataUri, headingTrailDataUri } from "./assets/svgDecorations";
import type {
  CodeStylePreset,
  CustomThemeConfig,
  HeadingDecorationConfig,
  HeadingStyleConfig,
  HeadingStylePreset,
} from "../types";

interface CodeStylePalette {
  blockBg: string;
  overlay: string;
  headerBg: string;
  headerBorder: string;
  headerText: string;
  codeText: string;
  inlineBg: string;
  borderColor: string;
  shadow: string;
  keyword: string;
  string: string;
  title: string;
  number: string;
  comment: string;
  attr: string;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  highlight(code: string, language: string) {
    if (language && hljs.getLanguage(language)) {
      return `<pre><code class=\"hljs language-${language}\">${hljs.highlight(code, { language }).value}</code></pre>`;
    }
    return `<pre><code class=\"hljs language-plain\">${md.utils.escapeHtml(code)}</code></pre>`;
  },
});

export function preprocessMarkdown(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/^\*\*\s+(.+?)\s+\*\*$/gm, "**$1**")
    .replace(/^\s*([-_*])\s*\1\s*\1\s*$/gm, "---")
    .replace(/\n{3,}/g, "\n\n");
}

function headingBase(level: "h1" | "h2" | "h3"): string {
  if (level === "h1") {
    return "font-size:30px;line-height:1.32;font-weight:800;letter-spacing:0.01em;word-break:break-word;overflow-wrap:anywhere;";
  }
  if (level === "h2") {
    return "font-size:24px;line-height:1.4;font-weight:800;letter-spacing:0.01em;word-break:break-word;overflow-wrap:anywhere;";
  }
  return "font-size:20px;line-height:1.45;font-weight:760;letter-spacing:0.015em;word-break:break-word;overflow-wrap:anywhere;";
}

function parseHexColor(color: string): [number, number, number] {
  const hex = color.trim().replace("#", "");
  const normalized = hex.length === 3
    ? hex.split("").map((value) => value + value).join("")
    : hex;

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return [29, 121, 183];
  }

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function rgba(color: string, alpha: number): string {
  const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch[1].split(",").slice(0, 3).map((value) => Number.parseFloat(value.trim()));
    return `rgba(${r},${g},${b},${alpha})`;
  }
  const [r, g, b] = parseHexColor(color);
  return `rgba(${r},${g},${b},${alpha})`;
}

function mix(color: string, target: [number, number, number], ratio: number): string {
  const [r, g, b] = parseHexColor(color);
  const mixed = [r, g, b].map((value, index) => Math.round(value + (target[index] - value) * ratio));
  return `rgb(${mixed[0]},${mixed[1]},${mixed[2]})`;
}

function headingBadgeSvg(text: string, fill: string, fontSize: number, extra = ""): string {
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='84' height='44' viewBox='0 0 84 44'>${extra}<text x='42' y='31' text-anchor='middle' font-size='${fontSize}' font-style='italic' font-weight='700' fill='${fill}'>${text}</text></svg>`)}")`;
}

function headingSceneSvg(parts: string, width: number, height: number, viewBox: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='${viewBox}'>${parts}</svg>`)}")`;
}

function headingDecoration(level: "h1" | "h2" | "h3", color: string, config: HeadingDecorationConfig): string {
  if (!config.enabled) {
    return "";
  }

  const size = level === "h1" ? 25 : level === "h2" ? 21 : 18;
  const accentSize = level === "h1" ? 42 : level === "h2" ? 36 : 32;
  const trailWidth = level === "h1" ? 72 : level === "h2" ? 64 : 56;
  const trailHeight = level === "h1" ? 32 : level === "h2" ? 28 : 24;
  const styles: Exclude<HeadingDecorationConfig["style"], "auto">[] = ["gem", "cross", "triangle", "ring", "spark", "ribbon", "bloom", "orbit"];
  const resolvedStyle = config.style === "auto"
    ? styles[color.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % styles.length]
    : config.style;
  const variantMap: Record<Exclude<HeadingDecorationConfig["style"], "auto">, number> = {
    gem: 0,
    cross: 1,
    triangle: 2,
    ring: 3,
    spark: 4,
    ribbon: 1,
    bloom: 0,
    orbit: 3,
  };
  const badgeUri = headingDecorationDataUri(level, color, variantMap[resolvedStyle], size);
  const accentUri = headingAccentDataUri(resolvedStyle, color, accentSize);
  const trailUri = headingTrailDataUri(resolvedStyle, color, trailWidth, trailHeight);
  const leftHalo = `radial-gradient(circle at 18px 50%, ${rgba(color, 0.28)} 0, ${rgba(color, 0.14)} 38%, ${rgba(color, 0)} 72%)`;
  const rightHalo = `radial-gradient(circle at calc(100% - 20px) 30%, ${rgba(color, 0.18)} 0, ${rgba(color, 0.08)} 36%, ${rgba(color, 0)} 72%)`;
  const centerGlow = `linear-gradient(90deg, ${rgba(color, 0)} 0%, ${rgba(color, 0.07)} 18%, ${rgba(color, 0.14)} 50%, ${rgba(color, 0.07)} 82%, ${rgba(color, 0)} 100%)`;
  const offsetY = level === "h1" ? "0.9em" : level === "h2" ? "0.82em" : "0.78em";
  return `background-image:${leftHalo},${rightHalo},${centerGlow},${accentUri},${trailUri},${badgeUri};background-repeat:no-repeat;background-position:0 ${offsetY},100% 18%,center calc(100% - 1px),0 ${offsetY},right top,10px ${offsetY};background-size:${accentSize}px ${accentSize}px,52px 52px,100% 18px,${accentSize}px ${accentSize}px,${trailWidth}px ${trailHeight}px,${size}px ${size}px;padding-top:12px;padding-right:${trailWidth - 8}px;padding-bottom:14px;padding-left:${accentSize + 12}px;min-height:${accentSize + 10}px;`;
}

function headingStyle(
  level: "h1" | "h2" | "h3",
  preset: HeadingStylePreset,
  primary: string,
  decoration: HeadingDecorationConfig,
): string {
  const base = headingBase(level);
  const deco = headingDecoration(level, primary, decoration);
  const paddingPrefix = deco ? (level === "h1" ? 34 : 30) : 12;
  const cardPaddingPrefix = deco ? (level === "h1" ? 36 : 32) : 12;
  const soft = mix(primary, [255, 255, 255], 0.58);
  const warm = mix(primary, [255, 224, 178], 0.45);
  const cool = mix(primary, [205, 232, 255], 0.52);
  const deep = mix(primary, [26, 26, 34], 0.35);
  const pink = mix(primary, [252, 146, 183], 0.62);
  const lilac = mix(primary, [168, 142, 255], 0.54);
  const peach = mix(primary, [255, 129, 88], 0.38);
  const ink = mix(primary, [18, 18, 18], 0.82);
  const muted = mix(primary, [245, 245, 245], 0.72);
  const chapterNumber = level === "h1" ? "1" : level === "h2" ? "2" : "3";
  const chapterSize = level === "h1" ? 24 : level === "h2" ? 21 : 18;

  if (preset === "pastel") {
    return `${base}margin:1.2em auto 0.8em;padding:16px 20px 10px 42px;display:table;width:auto;max-width:100%;font-weight:800;color:${cool};background-image:radial-gradient(circle at 18px 16px, ${rgba(primary, 0.34)} 0 4px, transparent 4px),radial-gradient(circle at 30px 6px, ${rgba(primary, 0.2)} 0 3px, transparent 3px),linear-gradient(transparent 36%, ${rgba(primary, 0.14)} 36% 74%, transparent 74%),${deco ? deco.match(/background-image:([^;]+);/)?.[1] ?? "none" : "none"};background-repeat:no-repeat,no-repeat,no-repeat,no-repeat;background-position:0 0,0 0,0 100%,0 0;background-size:auto,auto,100% 100%,48px 48px;text-shadow:0 2px 0 ${rgba(soft, 0.65)};`;
  }
  if (preset === "shadow") {
    return `${base}margin:1.15em auto 0.8em;display:table;width:auto;max-width:100%;font-weight:800;color:${mix(primary, [130, 98, 255], 0.28)};text-shadow:0 6px 0 ${rgba(soft, 0.8)},0 10px 18px ${rgba(primary, 0.12)};letter-spacing:0.02em;`;
  }
  if (preset === "numbered") {
    return `${base}margin:1.3em auto 0.85em;padding-top:${chapterSize + 20}px;display:block;text-align:center;letter-spacing:0.015em;color:${peach};background-image:${headingBadgeSvg(chapterNumber, peach, chapterSize)};background-repeat:no-repeat;background-position:center top;background-size:74px 40px;`;
  }
  if (preset === "frame") {
    return `${base}margin:1.25em auto 0.8em;padding:18px 34px;display:table;width:auto;max-width:100%;font-weight:800;color:${deep};border:1.5px solid ${rgba(primary, 0.55)};box-shadow:0 -8px 0 -7px ${deep},0 8px 0 -7px ${deep},0 14px 0 -13px ${rgba(primary, 0.24)};background-image:linear-gradient(${rgba(primary, 0.08)}, ${rgba(primary, 0.08)}),url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='520' height='110' viewBox='0 0 520 110'><path d='M22 24 H498' stroke='${rgba(primary, 0.5)}' stroke-width='1'/><path d='M22 86 H498' stroke='${rgba(primary, 0.5)}' stroke-width='1'/><path d='M34 16 V32 M486 78 V94' stroke='${deep}' stroke-width='4' stroke-linecap='square'/></svg>`)}");background-repeat:no-repeat,no-repeat;background-position:center,center;background-size:100% 100%,100% 100%;`;
  }
  if (preset === "banner") {
    return `${base}margin:1.1em 0 0.8em;padding:10px 20px;display:inline-block;position:relative;font-weight:800;color:white;background:${mix(primary, [255, 120, 92], 0.18)};box-shadow:14px 0 0 -13px ${rgba(primary, 0.28)};background-image:linear-gradient(135deg, transparent 0 84%, ${rgba(warm, 0.9)} 84% 100%);background-repeat:no-repeat;background-position:right center;background-size:38px 100%;padding-right:48px;border-bottom:3px solid ${rgba(primary, 0.82)};`;
  }
  if (preset === "twinkle") {
    const stars = headingSceneSvg(
      `<circle cx='12' cy='30' r='3.3' fill='${cool}'/><circle cx='15' cy='10' r='1.8' fill='${rgba(cool, 0.5)}'/><circle cx='47' cy='22' r='1.9' fill='${rgba(warm, 0.62)}'/><path d='M28 8 L31 16 L39 18 L31 20 L28 28 L25 20 L17 18 L25 16 Z' fill='${pink}'/><path d='M45 18 L47 23 L52 24 L47 25 L45 30 L43 25 L38 24 L43 23 Z' fill='${warm}'/><circle cx='35' cy='12' r='4' fill='none' stroke='${cool}' stroke-width='2.2'/>`,
      60,
      40,
      "0 0 60 40",
    );
    return `${base}margin:1.18em auto 0.82em;padding:10px 0 12px 54px;display:table;width:auto;max-width:100%;color:${cool};text-shadow:0 2px 0 ${rgba(soft, 0.76)};background-image:${stars},linear-gradient(transparent 38%, ${rgba(cool, 0.18)} 38% 78%, transparent 78%);background-repeat:no-repeat,no-repeat;background-position:left 2px top 2px,14px 62%;background-size:48px 34px,calc(100% - 12px) 1.05em;`;
  }
  if (preset === "mist") {
    return `${base}margin:1.22em auto 0.85em;display:table;width:auto;max-width:100%;color:${lilac};letter-spacing:0.02em;text-shadow:0 5px 0 ${rgba(muted, 0.85)},0 9px 18px ${rgba(lilac, 0.14)};background-image:linear-gradient(180deg, transparent 52%, ${rgba(muted, 0.72)} 52% 76%, transparent 76%);background-repeat:no-repeat;background-position:center 78%;background-size:92% 16px;`;
  }
  if (preset === "chapter") {
    const badge = headingBadgeSvg(chapterNumber, peach, chapterSize + 2, `<path d='M30 7 C34 9 36 13 36 18' stroke='${rgba(peach, 0.35)}' stroke-width='1.2' fill='none'/>`);
    return `${base}margin:1.45em auto 0.9em;padding-top:${chapterSize + 28}px;display:block;text-align:center;color:${peach};letter-spacing:0.01em;background-image:${badge};background-repeat:no-repeat;background-position:center top;background-size:84px 44px;`;
  }
  if (preset === "mono") {
    const frame = headingSceneSvg(
      `<path d='M16 16 H504' stroke='${rgba(ink, 0.86)}' stroke-width='1.2'/><path d='M16 96 H504' stroke='${rgba(ink, 0.86)}' stroke-width='1.2'/><path d='M34 28 V44 M486 68 V84' stroke='${ink}' stroke-width='5'/><path d='M40 22 H52 M46 16 V28 M468 82 H480 M474 76 V88' stroke='${ink}' stroke-width='4' stroke-linecap='square'/>`,
      520,
      112,
      "0 0 520 112",
    );
    return `${base}margin:1.35em auto 0.9em;padding:18px 34px;display:table;width:auto;max-width:100%;color:${ink};background-image:linear-gradient(${rgba(muted, 0.52)}, ${rgba(muted, 0.52)}),${frame};background-repeat:no-repeat,no-repeat;background-position:center,center;background-size:100% 100%,100% 100%;border:1.5px solid ${rgba(ink, 0.68)};box-shadow:0 12px 0 -10px ${rgba(muted, 0.9)};`;
  }
  if (preset === "coral") {
    const coralFill = mix(primary, [241, 101, 79], 0.22);
    return `${base}margin:1.12em 0 0.86em;padding:11px 22px 11px 16px;display:inline-block;width:auto;max-width:100%;color:white;background-image:linear-gradient(135deg, ${coralFill} 0 83%, ${rgba(warm, 0.9)} 83% 100%),linear-gradient(90deg, transparent 0 100%);background-repeat:no-repeat,no-repeat;background-position:left top,100% calc(100% - 2px);background-size:100% 100%,260px 3px;padding-right:54px;box-shadow:34px 0 0 -31px ${rgba(primary, 0.22)};border-bottom:3px solid ${rgba(coralFill, 0.84)};`;
  }
  if (preset === "underline") {
    const marker = headingSceneSvg(
      `<path d='M12 28 C62 14 138 13 226 24 C318 36 402 30 500 20' fill='none' stroke='${rgba(warm, 0.92)}' stroke-width='18' stroke-linecap='round' opacity='0.68'/>`,
      520,
      56,
      "0 0 520 56",
    );
    return `${base}margin:1.16em 0 0.8em;padding:0 4px 8px;display:inline-block;width:auto;max-width:100%;color:${deep};background-image:${marker};background-repeat:no-repeat;background-position:center calc(100% - 2px);background-size:100% 26px;`;
  }
  if (preset === "corner") {
    const corners = headingSceneSvg(
      `<path d='M14 30 V12 H50 M470 12 H506 V30 M14 82 V100 H50 M470 100 H506 V82' fill='none' stroke='${rgba(primary, 0.62)}' stroke-width='4' stroke-linecap='square'/>`,
      520,
      112,
      "0 0 520 112",
    );
    return `${base}margin:1.28em auto 0.86em;padding:18px 26px;display:table;width:auto;max-width:100%;text-align:center;color:${deep};background-image:${corners};background-repeat:no-repeat;background-position:center;background-size:100% 100%;`;
  }
  if (preset === "seal") {
    const seal = headingSceneSvg(
      `<rect x='8' y='8' width='30' height='30' rx='4' fill='none' stroke='${rgba(primary, 0.82)}' stroke-width='3'/><path d='M16 16 H30 M16 23 H30 M16 30 H26' stroke='${rgba(primary, 0.82)}' stroke-width='2.6' stroke-linecap='round'/>`,
      48,
      48,
      "0 0 48 48",
    );
    return `${base}margin:1.15em 0 0.8em;padding:8px 0 8px 56px;display:inline-block;width:auto;max-width:100%;color:${deep};background-image:${seal},linear-gradient(90deg, ${rgba(primary, 0.18)} 0 3px, transparent 3px);background-repeat:no-repeat,no-repeat;background-position:left center,42px center;background-size:40px 40px,1px 70%;`;
  }

  if (preset === "bar") {
    return `${base}margin:1.04em 0 0.72em;padding:8px 14px 8px ${paddingPrefix}px;border-left:5px solid ${primary};background:linear-gradient(90deg, ${rgba(primary, 0.12)}, rgba(0,0,0,0.02));${deco}`;
  }
  if (preset === "card") {
    return `${base}margin:1.08em 0 0.76em;padding:12px 14px 12px ${cardPaddingPrefix}px;border-radius:12px;background:linear-gradient(135deg, rgba(255,255,255,0.7), rgba(0,0,0,0.03));border:1px solid ${rgba(primary, 0.7)};box-shadow:0 12px 24px ${rgba(primary, 0.08)};${deco}`;
  }
  if (preset === "capsule") {
    return `${base}margin:1em 0 0.74em;padding:7px 16px;border-radius:999px;display:inline-block;background:${primary};color:white;box-shadow:0 10px 20px ${rgba(primary, 0.18)};`;
  }
  if (preset === "minimal") {
    return `${base}margin:1.05em 0 0.76em;letter-spacing:0.12em;color:${primary};padding-bottom:6px;border-bottom:1px solid ${rgba(primary, 0.25)};${deco}`;
  }
  return `${base}margin:1.06em 0 0.76em;padding-bottom:10px;border-bottom:3px solid ${primary};box-shadow:inset 0 -10px 0 ${rgba(primary, 0.08)};${deco}`;
}

function resolveCodeStyle(codeStyle: CodeStylePreset, themeCodeBg: string): CodeStylePalette {
  if (codeStyle === "mac") {
    return {
      blockBg: "#1f2228",
      overlay: "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(48,53,62,0.35) 58%, rgba(15,17,22,0.85))",
      headerBg: "linear-gradient(90deg, rgba(48,52,60,0.95), rgba(36,40,47,0.88))",
      headerBorder: "rgba(255, 255, 255, 0.12)",
      headerText: "#d9dee7",
      codeText: "#e9edf5",
      inlineBg: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.12)",
      shadow: "0 20px 40px rgba(8, 10, 14, 0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
      keyword: "#ff7ab2",
      string: "#a5da7b",
      title: "#7dcfff",
      number: "#f5a97f",
      comment: "#8b94a7",
      attr: "#c6a0f6",
    };
  }

  if (codeStyle === "night") {
    return {
      blockBg: "#0f1726",
      overlay: "linear-gradient(160deg, rgba(71, 104, 178, 0.28), rgba(16, 24, 38, 0.7) 55%, rgba(6, 10, 18, 0.95))",
      headerBg: "linear-gradient(90deg, rgba(22,31,50,0.96), rgba(16,23,38,0.84))",
      headerBorder: "rgba(122, 149, 204, 0.35)",
      headerText: "#d3def5",
      codeText: "#ebf2ff",
      inlineBg: "rgba(82, 117, 188, 0.2)",
      borderColor: "rgba(122, 149, 204, 0.28)",
      shadow: "0 22px 48px rgba(4, 9, 18, 0.46), inset 0 1px 0 rgba(255,255,255,0.06)",
      keyword: "#9db7ff",
      string: "#93e0c5",
      title: "#7ad0ff",
      number: "#ffbe7d",
      comment: "#7d8aa8",
      attr: "#e8a3ff",
    };
  }

  if (codeStyle === "paper") {
    return {
      blockBg: "#f2e8d1",
      overlay: "linear-gradient(160deg, rgba(255,255,255,0.72), rgba(206,177,117,0.14) 58%, rgba(177,139,71,0.2))",
      headerBg: "linear-gradient(90deg, rgba(233,214,175,0.95), rgba(216,194,148,0.86))",
      headerBorder: "rgba(133, 101, 43, 0.3)",
      headerText: "#4a3612",
      codeText: "#2f2719",
      inlineBg: "rgba(173, 139, 73, 0.25)",
      borderColor: "rgba(133, 101, 43, 0.25)",
      shadow: "0 14px 34px rgba(89, 63, 18, 0.18), inset 0 1px 0 rgba(255,255,255,0.65)",
      keyword: "#7c3f9a",
      string: "#2f7a42",
      title: "#175f9c",
      number: "#b5531f",
      comment: "#8f7f63",
      attr: "#9c5e13",
    };
  }

  if (codeStyle === "matrix") {
    return {
      blockBg: "#05170f",
      overlay: "linear-gradient(160deg, rgba(25, 167, 111, 0.18), rgba(5, 23, 15, 0.75) 55%, rgba(2, 10, 6, 0.95))",
      headerBg: "linear-gradient(90deg, rgba(8,44,29,0.95), rgba(4,32,20,0.88))",
      headerBorder: "rgba(69, 183, 132, 0.35)",
      headerText: "#b5f7d8",
      codeText: "#dfffea",
      inlineBg: "rgba(35, 155, 108, 0.22)",
      borderColor: "rgba(69, 183, 132, 0.28)",
      shadow: "0 20px 42px rgba(1, 17, 10, 0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
      keyword: "#7dffb6",
      string: "#d4ff7d",
      title: "#71ffef",
      number: "#ffc76b",
      comment: "#6c9f87",
      attr: "#98ffa9",
    };
  }

  return {
    blockBg: themeCodeBg,
    overlay: "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(0,0,0,0.05) 65%, rgba(0,0,0,0.12))",
    headerBg: "linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0.12))",
    headerBorder: "rgba(255,255,255,0.12)",
    headerText: "#e8edf2",
    codeText: "#e9edf3",
    inlineBg: "rgba(0,0,0,0.08)",
    borderColor: "rgba(255,255,255,0.12)",
    shadow: "0 16px 34px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
    keyword: "#78a6ff",
    string: "#6fd3ad",
    title: "#66c7ff",
    number: "#f6b26b",
    comment: "#93a0ad",
    attr: "#d08fff",
  };
}

function inlineStyleMap(
  primary: string,
  palette: CodeStylePalette,
  headingStyles: HeadingStyleConfig,
  headingDecoration: HeadingDecorationConfig,
): Record<string, string> {
  return {
    h1: headingStyle("h1", headingStyles.h1, primary, headingDecoration),
    h2: headingStyle("h2", headingStyles.h2, primary, headingDecoration),
    h3: headingStyle("h3", headingStyles.h3, primary, headingDecoration),
    p: "line-height:1.86;margin:0.7em 0;",
    blockquote: `border-left:4px solid ${primary};padding:8px 14px;margin:1em 0;background:rgba(0,0,0,0.03);`,
    a: `color:${primary};text-decoration:none;border-bottom:1px solid ${primary};`,
    ul: "padding-left:1.4em;line-height:1.8;",
    ol: "padding-left:1.5em;line-height:1.8;",
    img: "max-width:100%;height:auto;border-radius:8px;margin:10px 0;",
    table: "width:100%;border-collapse:collapse;display:table;",
    th: `border:1px solid #ddd;padding:8px;background:${primary};color:white;`,
    td: "border:1px solid #ddd;padding:8px;",
    code: `font-family:Consolas,Monaco,'Courier New',monospace;padding:2px 6px;border-radius:6px;background:${palette.inlineBg};font-size:0.92em;`,
    pre: `margin:1.1em 0;border-radius:16px;overflow:hidden;padding:0;border:1px solid ${palette.borderColor};`,
  };
}

function getCodeLanguage(className: string): string {
  const match = className.match(/language-([a-z0-9_+-]+)/i);
  if (!match) {
    return "TEXT";
  }
  return match[1].toUpperCase();
}

function injectHighlightStyles(article: HTMLElement, palette: CodeStylePalette): void {
  const styleTag = article.ownerDocument.createElement("style");
  styleTag.textContent = `
    .md-body .hljs { color: ${palette.codeText}; }
    .md-body .hljs-keyword,
    .md-body .hljs-selector-tag,
    .md-body .hljs-literal,
    .md-body .hljs-type { color: ${palette.keyword}; font-weight: 600; }
    .md-body .hljs-string,
    .md-body .hljs-doctag,
    .md-body .hljs-regexp { color: ${palette.string}; }
    .md-body .hljs-title,
    .md-body .hljs-function,
    .md-body .hljs-built_in { color: ${palette.title}; }
    .md-body .hljs-number,
    .md-body .hljs-symbol,
    .md-body .hljs-bullet { color: ${palette.number}; }
    .md-body .hljs-attr,
    .md-body .hljs-variable,
    .md-body .hljs-property { color: ${palette.attr}; }
    .md-body .hljs-comment,
    .md-body .hljs-quote { color: ${palette.comment}; font-style: italic; }
  `;
  article.prepend(styleTag);
}

function enhanceCodeBlocks(article: HTMLElement, primary: string, palette: CodeStylePalette): void {
  article.querySelectorAll("pre").forEach((preNode) => {
    const pre = preNode as HTMLElement;
    const code = pre.querySelector("code") as HTMLElement | null;
    if (!code) {
      return;
    }

    const language = getCodeLanguage(code.className);

    pre.setAttribute(
      "style",
      [
        pre.getAttribute("style") ?? "",
        `background:${palette.overlay},${palette.blockBg}`,
        `box-shadow:${palette.shadow}`,
      ].join(";"),
    );

    code.setAttribute(
      "style",
      [
        code.getAttribute("style") ?? "",
        "display:block",
        "padding:15px 18px 18px",
        "font-size:14px",
        "line-height:1.75",
        "background:transparent",
        `color:${palette.codeText}`,
      ].join(";"),
    );

    const header = article.ownerDocument.createElement("div");
    header.setAttribute(
      "style",
      [
        "display:flex",
        "align-items:center",
        "justify-content:space-between",
        "padding:9px 14px",
        "font-size:11px",
        "font-weight:700",
        "letter-spacing:0.12em",
        `border-bottom:1px solid ${palette.headerBorder}`,
        `background:${palette.headerBg}`,
      ].join(";"),
    );

    const dots = article.ownerDocument.createElement("span");
    dots.textContent = "● ● ●";
    dots.setAttribute("style", `color:${primary};opacity:0.9;text-shadow:0 0 10px ${primary}55;`);

    const lang = article.ownerDocument.createElement("span");
    lang.textContent = language;
    lang.setAttribute("style", `color:${palette.headerText};`);

    header.appendChild(dots);
    header.appendChild(lang);
    pre.insertBefore(header, code);
  });
}

export function applyTheme(
  html: string,
  themeId: string,
  codeStyle: CodeStylePreset,
  headingStyles: HeadingStyleConfig,
  headingDecoration: HeadingDecorationConfig,
  customTheme?: CustomThemeConfig,
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<article class=\"md-body\">${html}</article>`, "text/html");
  const article = doc.querySelector("article");
  if (!article) {
    return html;
  }

  const theme = getTheme(themeId);
  const primary = customTheme?.enabled ? customTheme.primaryColor : theme.cssVars["--primary"];
  const palette = resolveCodeStyle(codeStyle, theme.cssVars["--code-bg"]);
  const styleMap = inlineStyleMap(primary, palette, headingStyles, headingDecoration);

  article.setAttribute(
    "style",
    [
      `background:${theme.cssVars["--panel"]}`,
      theme.backgroundImage ? `background-image:${theme.backgroundImage}` : "",
      theme.backgroundSize ? `background-size:${theme.backgroundSize}` : "",
      theme.backgroundImage ? "background-repeat:repeat" : "",
      theme.backgroundImage ? "background-blend-mode:soft-light" : "",
      `color:${theme.cssVars["--text"]}`,
      "padding:24px 28px",
      "border-radius:12px",
      "font-size:16px",
      "box-sizing:border-box",
      "word-break:break-word",
    ].join(";"),
  );

  Object.entries(styleMap).forEach(([selector, style]) => {
    article.querySelectorAll(selector).forEach((node) => {
      const old = node.getAttribute("style");
      node.setAttribute("style", old ? `${old};${style}` : style);
    });
  });

  injectHighlightStyles(article, palette);
  enhanceCodeBlocks(article, primary, palette);

  return article.outerHTML;
}

export function renderMarkdown(
  content: string,
  themeId: string,
  codeStyle: CodeStylePreset,
  headingStyles: HeadingStyleConfig,
  headingDecoration: HeadingDecorationConfig,
  customTheme?: CustomThemeConfig,
): string {
  const processed = preprocessMarkdown(content);
  const rawHtml = md.render(processed);
  return applyTheme(rawHtml, themeId, codeStyle, headingStyles, headingDecoration, customTheme);
}
