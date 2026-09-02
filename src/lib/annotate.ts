import { autoPhrases } from "../data/glossary";

export type TextPart =
  | { kind: "text"; value: string }
  | { kind: "term"; value: string; id: string };

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const phraseToId = new Map<string, string>();
for (const { phrase, id } of autoPhrases) {
  const key = phrase.toLocaleLowerCase();
  if (!phraseToId.has(key)) phraseToId.set(key, id);
}

/**
 * 하나의 정규식으로 모든 표기를 찾는다. autoPhrases가 길이 내림차순이라
 * 교대(|) 중 가장 긴 표기가 먼저 매칭된다 — "Spring Boot"가 "Spring"보다 우선.
 * ASCII로 시작·끝나는 표기에는 경계를 붙여 단어 중간 매칭을 막는다.
 */
const pattern = new RegExp(
  autoPhrases
    .map(({ phrase }) => {
      let p = escapeRe(phrase);
      if (/^[A-Za-z0-9]/.test(phrase)) p = `(?<![A-Za-z0-9_.])${p}`;
      if (/[A-Za-z0-9]$/.test(phrase)) p = `${p}(?![A-Za-z0-9_])`;
      return p;
    })
    .join("|"),
  "g",
);

export type AnnotateOptions = {
  /**
   * 이미 연결한 용어 id를 기억하는 집합. 페이지 하나에 같은 용어가
   * 반복해서 링크되지 않도록 호출자가 하나를 만들어 돌려 쓴다.
   */
  seen?: Set<string>;
  /** 이 용어들은 연결하지 않는다 (예: 지금 보고 있는 용어 자신) */
  exclude?: Iterable<string>;
  /** 한 문단에서 연결할 최대 개수 */
  max?: number;
};

/** 평문을 받아 용어가 연결된 조각 배열로 바꾼다. */
export function annotate(text: string, options: AnnotateOptions = {}): TextPart[] {
  const { seen, max = 4 } = options;
  const exclude = new Set(options.exclude ?? []);
  const parts: TextPart[] = [];
  let cursor = 0;
  let linked = 0;

  pattern.lastIndex = 0;
  for (let m = pattern.exec(text); m !== null; m = pattern.exec(text)) {
    const id = phraseToId.get(m[0].toLocaleLowerCase());
    if (!id || exclude.has(id) || linked >= max || (seen && seen.has(id))) continue;

    if (m.index > cursor) parts.push({ kind: "text", value: text.slice(cursor, m.index) });
    parts.push({ kind: "term", value: m[0], id });
    cursor = m.index + m[0].length;
    linked += 1;
    seen?.add(id);
  }

  if (cursor < text.length) parts.push({ kind: "text", value: text.slice(cursor) });
  return parts;
}
