function flattenLi(li: Element): void {
  const wrappers = li.querySelectorAll("p,div,section");
  wrappers.forEach((wrapper) => {
    if (wrapper.childNodes.length === 1 && wrapper.firstChild?.nodeType === Node.TEXT_NODE) {
      wrapper.replaceWith(wrapper.textContent ?? "");
    }
  });
}

function convertImageGridToTable(doc: Document): void {
  const grids = doc.querySelectorAll(".image-grid");
  grids.forEach((grid) => {
    const images = Array.from(grid.querySelectorAll("img"));
    if (images.length === 0) {
      return;
    }

    const table = doc.createElement("table");
    table.setAttribute("style", "width:100%;border-collapse:collapse;");
    const tbody = doc.createElement("tbody");
    const tr = doc.createElement("tr");

    images.forEach((img) => {
      const td = doc.createElement("td");
      td.setAttribute("style", "padding:4px;vertical-align:top;");
      const cloned = img.cloneNode(true) as HTMLImageElement;
      cloned.style.width = "100%";
      cloned.style.height = "auto";
      td.appendChild(cloned);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
    table.appendChild(tbody);
    grid.replaceWith(table);
  });
}

export async function makeWeChatCompatible(html: string): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  convertImageGridToTable(doc);

  doc.querySelectorAll("li").forEach((li) => flattenLi(li));

  doc.querySelectorAll("*").forEach((node) => {
    const el = node as HTMLElement;
    if (el.style.display === "flex") {
      el.style.display = "block";
    }
  });

  const root = doc.body.firstElementChild;
  if (!root) {
    return "";
  }

  const section = doc.createElement("section");
  Array.from(root.attributes).forEach((attr) => {
    section.setAttribute(attr.name, attr.value);
  });
  section.innerHTML = root.innerHTML;

  return section.outerHTML;
}
