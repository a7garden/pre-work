import type { Block } from "../data/blocks";
import type { Issue } from "../data/issues";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * RSS 전문은 사이트 밖 리더에서 읽히므로 내부 링크를 절대 주소로 바꾼다.
 * base는 site 설정(끝에 슬래시) — https://a7garden.github.io/pre-work/
 */
function blockToHtml(block: Block, base: string): string {
  switch (block.type) {
    case "p":
      return `<p>${esc(block.text)}</p>`;

    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${block.items
        .map((item) => `<li>${esc(item)}</li>`)
        .join("")}</${tag}>`;
    }

    case "callout":
      return `<blockquote><p><strong>${esc(block.title)}</strong></p><p>${esc(
        block.text,
      )}</p></blockquote>`;

    case "code":
      return (
        (block.caption ? `<p><em>${esc(block.caption)}</em></p>` : "") +
        `<pre><code data-language="${esc(block.language)}">${esc(block.content)}</code></pre>`
      );

    case "flow":
      return (
        (block.caption ? `<p><em>${esc(block.caption)}</em></p>` : "") +
        `<ol>${block.steps
          .map(
            (s) =>
              `<li><strong>${esc(s.label)}</strong>${s.detail ? ` — ${esc(s.detail)}` : ""}</li>`,
          )
          .join("")}</ol>`
      );

    case "tree":
      return (
        (block.caption ? `<p><em>${esc(block.caption)}</em></p>` : "") +
        `<pre><code>${esc(
          block.rows
            .map((r) => "  ".repeat(r.depth ?? 0) + r.path + (r.note ? `  — ${r.note}` : ""))
            .join("\n"),
        )}</code></pre>`
      );

    case "table":
      return (
        (block.caption ? `<p><em>${esc(block.caption)}</em></p>` : "") +
        `<table><thead><tr>${block.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>` +
        `<tbody>${block.rows
          .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table>`
      );

    case "quiz":
      return (
        `<p><strong>${esc(block.question)}</strong></p>` +
        (block.code
          ? `<pre><code data-language="${esc(block.code.language)}">${esc(
              block.code.content,
            )}</code></pre>`
          : "") +
        `<ol>${block.options.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>` +
        `<p><strong>정답 ${block.answer + 1}번</strong> — ${esc(block.explain)}</p>`
      );

    case "link":
      return (
        `<p>→ <a href="${esc(
          block.href.startsWith("/") ? base.replace(/\/$/, "") + block.href : block.href,
        )}"><strong>${esc(block.label)}</strong> · ${esc(block.title)}</a></p>` +
        (block.detail ? `<p>${esc(block.detail)}</p>` : "")
      );
  }
}

/** 호 한 편을 RSS 전문 HTML로 바꾼다. takeaway를 앞세우고 본문 블록이 뒤따른다. */
export function issueToHtml(issue: Issue, base: string): string {
  const lead = `<p><strong>오늘 남길 한 문장</strong> — ${esc(issue.takeaway)}</p>`;
  const body = issue.blocks.map((b) => blockToHtml(b, base)).join("\n");
  return lead + body;
}
