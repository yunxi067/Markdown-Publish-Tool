import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
});

turndownService.use(gfm);

turndownService.addRule("removeFileLinks", {
  filter: (node: HTMLElement) => node.nodeName === "A" && (node as HTMLAnchorElement).href.startsWith("file://"),
  replacement: (content: string) => content,
});

export async function clipboardImageToMarkdown(file: File): Promise<string> {
  const base64 = await fileToDataUrl(file);
  return `![pasted-image](${base64})`;
}

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function richTextToMarkdown(event: ClipboardEvent): Promise<string | null> {
  const data = event.clipboardData;
  if (!data) {
    return null;
  }

  const items = Array.from(data.items ?? []);
  const imageItem = items.find((item) => item.type.startsWith("image/"));
  if (imageItem) {
    const image = imageItem.getAsFile();
    if (image) {
      return clipboardImageToMarkdown(image);
    }
  }

  const plain = data.getData("text/plain");
  const html = data.getData("text/html");

  const looksLikeMarkdown = /^\s{0,3}(#{1,6}\s|[-*+]\s|>\s|```|\d+\.\s)/m.test(plain);
  if (looksLikeMarkdown) {
    return plain;
  }

  if (html) {
    return turndownService.turndown(html).trim();
  }

  return plain || null;
}
