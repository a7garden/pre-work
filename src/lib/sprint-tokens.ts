import type { Anno } from "../data/sprints";

/**
 * 코드 문자열과 주석 목록을 받아 토큰이 심긴 행 단위 조각으로 나눈다.
 * 빌드 때 한 번만 돈다 — 주석을 못 찾거나 주석끼리 겹치면 빌드가 실패한다.
 */
export type Seg =
  | { text: string }
  | { text: string; anno: Anno; idx: number };

export type SegLine = Seg[];

export function annotate(code: string, annotations: readonly Anno[]): SegLine[] {
  const lines = code.split("\n");

  type Interval = { line: number; start: number; end: number; anno: Anno; idx: number };
  const intervals: Interval[] = [];

  annotations.forEach((anno, idx) => {
    const rows =
      anno.line != null
        ? [anno.line - 1]
        : lines.map((_, i) => i);
    const found: Interval[] = [];
    for (const l of rows) {
      const hay = lines[l];
      if (hay == null) continue;
      for (let at = hay.indexOf(anno.find); at !== -1; at = hay.indexOf(anno.find, at + anno.find.length)) {
        found.push({ line: l, start: at, end: at + anno.find.length, anno, idx });
        if (!anno.all) break;
      }
      if (found.length && !anno.all) break;
    }
    if (found.length === 0) {
      const where = anno.line != null ? `${anno.line}행` : "코드";
      throw new Error(`스프린트 주석 '${anno.find}'을(를) ${where}에서 찾지 못했다.`);
    }
    intervals.push(...found);
  });

  intervals.sort((a, b) => a.line - b.line || a.start - b.start || a.idx - b.idx);
  for (let i = 1; i < intervals.length; i++) {
    const prev = intervals[i - 1];
    const cur = intervals[i];
    if (prev.line === cur.line && cur.start < prev.end) {
      throw new Error(
        `스프린트 주석이 겹친다: '${prev.anno.find}'와 '${cur.anno.find}' (${cur.line + 1}행). ` +
        "line 필드로 위치를 좁혀 주세요.",
      );
    }
  }

  return lines.map((lineText, l) => {
    const mine = intervals.filter((iv) => iv.line === l);
    const segs: Seg[] = [];
    let pos = 0;
    for (const iv of mine) {
      if (iv.start > pos) segs.push({ text: lineText.slice(pos, iv.start) });
      segs.push({ text: lineText.slice(iv.start, iv.end), anno: iv.anno, idx: iv.idx });
      pos = iv.end;
    }
    if (pos < lineText.length) segs.push({ text: lineText.slice(pos) });
    return segs;
  });
}
