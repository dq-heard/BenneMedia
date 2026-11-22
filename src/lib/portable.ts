/** Tiny Portable Text to HTML converter for the blockContent type
 *  (paragraphs, h2-h4, quotes, lists, bold, italic, links). Images are skipped. */

interface Span {
  _type: "span";
  text: string;
  marks?: string[];
}
interface Block {
  _type: string;
  style?: string;
  listItem?: "bullet" | "number";
  children?: Span[];
  markDefs?: { _key: string; _type: string; href?: string }[];
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const safeHref = (h = "") => (/^(https?:|mailto:|\/|#)/.test(h) ? h : "");

function inline(b: Block): string {
  return (b.children ?? [])
    .map((c) => {
      let out = esc(c.text).replace(/\n/g, "<br />");
      for (const m of c.marks ?? []) {
        if (m === "strong") out = `<strong>${out}</strong>`;
        else if (m === "em") out = `<em>${out}</em>`;
        else {
          const def = b.markDefs?.find((d) => d._key === m);
          const href = safeHref(def?.href);
          if (href) {
            const ext = /^https?:/.test(href);
            out = `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${out}</a>`;
          }
        }
      }
      return out;
    })
    .join("");
}

export function toHtml(blocks?: Block[] | null): string {
  let html = "";
  let list: "bullet" | "number" | null = null;
  const close = () => {
    if (list) html += list === "bullet" ? "</ul>" : "</ol>";
    list = null;
  };
  for (const b of blocks ?? []) {
    if (b._type !== "block") continue;
    if (b.listItem) {
      if (list !== b.listItem) {
        close();
        list = b.listItem;
        html += list === "bullet" ? "<ul>" : "<ol>";
      }
      html += `<li>${inline(b)}</li>`;
      continue;
    }
    close();
    const tag = ["h2", "h3", "h4", "blockquote"].includes(b.style ?? "")
      ? b.style
      : "p";
    html += `<${tag}>${inline(b)}</${tag}>`;
  }
  close();
  return html;
}
