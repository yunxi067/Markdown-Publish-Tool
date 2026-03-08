function safeNamePart(input: string): string {
  return input.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "-").slice(0, 48);
}

export function createExportFilename(prefix: string, ext: string): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  return `${safeNamePart(prefix)}-${stamp}.${ext}`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function buildHtmlDoc(contentHtml: string, title: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${contentHtml}</body></html>`;
}

export function exportHtml(contentHtml: string, title = "article"): void {
  const html = buildHtmlDoc(contentHtml, title);
  downloadBlob(new Blob([html], { type: "text/html;charset=utf-8" }), createExportFilename(title, "html"));
}

export function exportDoc(contentHtml: string, title = "article"): void {
  const html = `<!doctype html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'></head><body>${contentHtml}</body></html>`;
  downloadBlob(new Blob([html], { type: "application/msword" }), createExportFilename(title, "doc"));
}

export function exportDocxLite(contentHtml: string, title = "article"): void {
  const html = buildHtmlDoc(contentHtml, title);
  downloadBlob(new Blob([html], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), createExportFilename(title, "docx"));
}

async function loadHtml2Pdf(): Promise<(...args: unknown[]) => any> {
  const mod = await import("html2pdf.js");
  const candidate = (mod as any).default ?? mod;
  if (typeof candidate === "function") {
    return candidate;
  }

  await import("html2pdf.js/dist/html2pdf.bundle.min.js");
  const globalCandidate = (window as any).html2pdf;
  if (typeof globalCandidate === "function") {
    return globalCandidate;
  }

  throw new Error("html2pdf loader unavailable");
}

export async function exportPdfByNode(domNode: HTMLElement, title = "article"): Promise<void> {
  const html2pdf = await loadHtml2Pdf();
  const mount = document.createElement("div");
  const clone = domNode.cloneNode(true) as HTMLElement;

  mount.style.position = "fixed";
  mount.style.left = "0";
  mount.style.top = "0";
  mount.style.zIndex = "2147483647";
  mount.style.opacity = "1";
  mount.style.pointerEvents = "none";
  mount.style.width = "820px";
  mount.style.padding = "0";
  mount.style.background = "#ffffff";
  mount.style.overflow = "visible";
  mount.appendChild(clone);
  document.body.appendChild(mount);

  clone.style.width = "100%";
  clone.style.maxWidth = "820px";
  clone.style.maxHeight = "none";
  clone.style.overflow = "visible";

  try {
    await html2pdf()
      .set({
        margin: 12,
        filename: createExportFilename(title, "pdf"),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          windowWidth: 820,
        },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(clone)
      .save();
  } finally {
    mount.remove();
  }
}
