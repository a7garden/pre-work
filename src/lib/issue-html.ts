import type { Block } from "../data/blocks";
import type { GlossaryTerm } from "../data/glossary";
 import type { Issue } from "../data/issues";
 import { glossary } from "../data/glossary";
 import { annotate } from "./annotate";

/** 사전은 빌드 시점에 고정된 문자열 키 룩업 테이블이다. */
const termById: Record<string, GlossaryTerm> = Object.fromEntries(
  glossary.map((t) => [t.id, t]),
);

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
function abs(href: string, base: string): string {
  return href.startsWith("/") ? base.replace(/\/$/, "") + href : href;
}

/** 사이트 본문과 같은 규칙으로 용어를 사전에 연결한다. seen을 공유해 한 호에 한 번만. */
function rich(text: string, base: string, seen: Set<string>): string {
  return annotate(text, { seen })
    .map((part) =>
      part.kind === "term"
        ? `<a href="${esc(abs(`/glossary/#${part.id}`, base))}">${esc(part.value)}</a>`
        : esc(part.value),
    )
    .join("");
}

function codeHtml(language: string, content: string): string {
  return `<pre><code data-language="${esc(language)}">${esc(content)}</code></pre>`;
}

function blockToHtml(block: Block, base: string, seen: Set<string>): string {
  switch (block.type) {
    case "p":
      return `<p>${rich(block.text, base, seen)}</p>`;

    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${block.items
        .map((item) => `<li>${rich(item, base, seen)}</li>`)
        .join("")}</${tag}>`;
    }

    case "callout":
      return `<blockquote><p><strong>${esc(block.title)}</strong></p><p>${rich(
        block.text,
        base,
        seen,
      )}</p></blockquote>`;

    case "code":
      return (
        (block.caption ? `<p><em>${esc(block.caption)}</em></p>` : "") +
        codeHtml(block.language, block.content)
      );

    case "codeRead":
      return (
        `<p><em>${esc(block.caption)}</em></p>` +
        (block.question ? `<p><strong>${esc(block.question)}</strong></p>` : "") +
        codeHtml(block.language, block.code) +
        `<ul>${block.notes
          .map(
            (n) =>
              `<li><code>${esc(n.lines)}</code> <strong>${esc(n.title)}</strong> — ${esc(n.body)}</li>`,
          )
          .join("")}</ul>`
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

    case "terms":
      return (
        `<p><strong>${esc(block.title ?? "함께 읽는 용어")}</strong></p><ul>` +
        block.ids
          .map((id) => termById[id])
          .filter((t) => t !== undefined)
          .map(
            (t) =>
              `<li><a href="${esc(abs(`/glossary/#${t.id}`, base))}">${esc(t.term)}</a> — ${esc(t.short)}</li>`,
          )
          .join("") +
        `</ul>`
      );

    case "quiz":
      return (
        `<p><strong>${esc(block.question)}</strong></p>` +
        (block.code ? codeHtml(block.code.language, block.code.content) : "") +
        `<ol>${block.options.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>` +
        `<p><strong>정답 ${block.answer + 1}번</strong> — ${rich(block.explain, base, seen)}</p>`
      );

    case "link":
      return (
        `<p>→ <a href="${esc(abs(block.href, base))}"><strong>${esc(block.label)}</strong> · ${esc(
          block.title,
        )}</a></p>` +
        (block.detail ? `<p>${esc(block.detail)}</p>` : "")
      );
  }
}

/** 호 한 편을 RSS 전문 HTML로 바꾼다. takeaway를 앞세우고 본문 블록이 뒤따른다. */
export function issueToHtml(issue: Issue, base: string): string {
  const seen = new Set<string>();
  const lead = `<p><strong>오늘 남길 한 문장</strong> — ${rich(issue.takeaway, base, seen)}</p>`;
  const body = issue.blocks.map((b) => blockToHtml(b, base, seen)).join("\n");
  return lead + body;
}
