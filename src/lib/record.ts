/**
 * 읽기 기록 — localStorage의 읽음 표시(`pw-read`, `pw-sprint-read`)에서 파생하는
 * 가벼운 게이미피케이션 지표. 페이지 빌드(서버)와 기록 표시(클라이언트)가 함께
 * 가져다 쓴다. DOM도 스토리지도 만지지 않는 순수 계산만 있다.
 *
 * 지표는 실제 값만 쓴다(design.md): 누적 읽은 분, 연속으로 읽은 발행일, 읽은 편수.
 */

export type RecordItem = {
  /** localStorage에 저장된 id — "issue-23" / "sprint-12" */
  id: string;
  kind: "issue" | "sprint";
  no: number;
  minutes: number;
  /** YYYY.MM.DD */
  date: string;
  series?: string;
};

/** 페이지에 내장되는 축약 목록 — 읽기 기록 계산에 필요한 최소 필드만 */
export type RecordCatalog = {
  items: RecordItem[];
  /** 발행일 전체, 최신 먼저. 중복 없음, YYYY.MM.DD 문자열 정렬 */
  dates: string[];
  seriesCount: number;
};

type IssueLike = { no: number; minutes: number; date: string; series?: string };
type SprintLike = { no: number; minutes: number; date: string };

export function buildCatalog(issues: IssueLike[], sprints: SprintLike[]): RecordCatalog {
  const items: RecordItem[] = [
    ...issues.map((i) => ({ id: `issue-${i.no}`, kind: "issue" as const, no: i.no, minutes: i.minutes, date: i.date, series: i.series })),
    ...sprints.map((s) => ({ id: `sprint-${s.no}`, kind: "sprint" as const, no: s.no, minutes: s.minutes, date: s.date })),
  ];
  const dates = [...new Set(items.map((i) => i.date))].sort().reverse();
  const seriesCount = new Set(items.map((i) => i.series).filter((s): s is string => !!s)).size;
  return { items, dates, seriesCount };
}

/* ── 레벨 — 누적 읽은 분. L레벨에 필요한 누적 분 = 15·(L−1)·(L+2) ──
   60, 150, 270, 420, 600, 810, 1050, 1320 … 상한은 없다. */

export function minutesForLevel(level: number): number {
  return 15 * (level - 1) * (level + 2);
}

export type LevelInfo = {
  level: number;
  /** 현재 레벨의 시작 누적 분 */
  floor: number;
  /** 다음 레벨에 필요한 누적 분 */
  next: number;
  /** 다음 레벨까지 남은 분 */
  remaining: number;
  /** 0..1 — 현재 구간 진행 */
  progress: number;
};

export function levelInfo(minutes: number): LevelInfo {
  let level = 1;
  while (minutesForLevel(level + 1) <= minutes) level++;
  const floor = minutesForLevel(level);
  const next = minutesForLevel(level + 1);
  return { level, floor, next, remaining: next - minutes, progress: next > floor ? (minutes - floor) / (next - floor) : 1 };
}

/* ── 연속 읽기 — 최신 발행일부터 거꾸로, 하루라도 하나 이상 읽은 날의 연속 ── */

export type StreakInfo = {
  days: number;
  /** 연속이 끊긴 발행일. 전부 읽었으면 null */
  nextDate: string | null;
};

export function streakInfo(catalog: RecordCatalog, readIds: Set<string>): StreakInfo {
  const readDates = new Set(catalog.items.filter((i) => readIds.has(i.id)).map((i) => i.date));
  let days = 0;
  for (const date of catalog.dates) {
    if (!readDates.has(date)) return { days, nextDate: date };
    days++;
  }
  return { days, nextDate: null };
}

/* ── 전체 지표 ── */

export type RecordStats = {
  issuesRead: number;
  sprintsRead: number;
  itemsRead: number;
  totalIssues: number;
  seriesDone: number;
  /** 전체 시리즈 수 */
  totalSeries: number;
  /** 읽은 편의 분 누적 — 레벨의 재료 */
  minutes: number;
  level: LevelInfo;
  streak: StreakInfo;
  /** 완독한 시리즈 수 */
  seriesDone: number;
  allIssues: boolean;
  allSprints: boolean;
};

export function computeRecord(catalog: RecordCatalog, readIds: Set<string>): RecordStats {
  const read = catalog.items.filter((i) => readIds.has(i.id));
  const issuesRead = read.filter((i) => i.kind === "issue").length;
  const sprintsRead = read.length - issuesRead;
  const totalIssues = catalog.items.filter((i) => i.kind === "issue").length;
  const totalSprints = catalog.items.length - totalIssues;

  const seriesTotal = new Map<string, number>();
  const seriesRead = new Map<string, number>();
  for (const item of catalog.items) {
    if (!item.series) continue;
    seriesTotal.set(item.series, (seriesTotal.get(item.series) ?? 0) + 1);
    if (readIds.has(item.id)) seriesRead.set(item.series, (seriesRead.get(item.series) ?? 0) + 1);
  }
  let seriesDone = 0;
  for (const [name, total] of seriesTotal) if ((seriesRead.get(name) ?? 0) === total) seriesDone++;

  const minutes = read.reduce((n, i) => n + i.minutes, 0);
  return {
    issuesRead,
    sprintsRead,
    itemsRead: read.length,
    totalIssues,
    totalSprints,
    minutes,
    level: levelInfo(minutes),
    streak: streakInfo(catalog, readIds),
    seriesDone,
    totalSeries: catalog.seriesCount,
    allIssues: issuesRead === totalIssues,
    allSprints: sprintsRead === totalSprints,
  };
}

export function seriesProgress(catalog: RecordCatalog, readIds: Set<string>): Array<{ name: string; read: number; total: number }> {
  const totals = new Map<string, number>();
  const reads = new Map<string, number>();
  for (const item of catalog.items) {
    if (!item.series) continue;
    totals.set(item.series, (totals.get(item.series) ?? 0) + 1);
    if (readIds.has(item.id)) reads.set(item.series, (reads.get(item.series) ?? 0) + 1);
  }
  return [...totals.entries()]
    .map(([name, total]) => ({ name, total, read: reads.get(name) ?? 0 }))
    .sort((a, b) => b.read / b.total - a.read / a.total || b.read - a.read);
}

/* ── 배지 — 정의는 고정, 해금 여부만 지표에서 유도한다 ── */

export type BadgeDef = {
  id: string;
  title: string;
  /** 해금 조건 한 줄 */
  hint: string;
  /** Icon.astro에 있는 이름 */
  icon: string;
  test: (s: RecordStats) => boolean;
};

export const BADGES: BadgeDef[] = [
  { id: "issue-first", title: "첫 호", hint: "칼럼 1편 읽기", icon: "book-open", test: (s) => s.issuesRead >= 1 },
  { id: "issue-10", title: "10호", hint: "칼럼 10편", icon: "book-open", test: (s) => s.issuesRead >= 10 },
  { id: "issue-30", title: "30호", hint: "칼럼 30편", icon: "book-open", test: (s) => s.issuesRead >= 30 },
  { id: "issue-60", title: "60호", hint: "칼럼 60편", icon: "book-open", test: (s) => s.issuesRead >= 60 },
  { id: "issue-100", title: "100호", hint: "칼럼 100편", icon: "book-open", test: (s) => s.issuesRead >= 100 },
  { id: "issue-all", title: "칼럼 전부", hint: "발행된 칼럼 전부", icon: "trophy", test: (s) => s.allIssues },
  { id: "sprint-first", title: "첫 판", hint: "스프린트 1판", icon: "zap", test: (s) => s.sprintsRead >= 1 },
  { id: "sprint-10", title: "10판", hint: "스프린트 10판", icon: "zap", test: (s) => s.sprintsRead >= 10 },
  { id: "sprint-30", title: "30판", hint: "스프린트 30판", icon: "zap", test: (s) => s.sprintsRead >= 30 },
  { id: "sprint-all", title: "스프린트 전부", hint: "발행된 스프린트 전부", icon: "trophy", test: (s) => s.allSprints },
  { id: "streak-3", title: "3일 연속", hint: "발행일 3일 연속 읽기", icon: "flame", test: (s) => s.streak.days >= 3 },
  { id: "streak-7", title: "7일 연속", hint: "발행일 7일 연속 읽기", icon: "flame", test: (s) => s.streak.days >= 7 },
  { id: "streak-14", title: "14일 연속", hint: "발행일 14일 연속 읽기", icon: "flame", test: (s) => s.streak.days >= 14 },
  { id: "streak-30", title: "30일 연속", hint: "발행일 30일 연속 읽기", icon: "flame", test: (s) => s.streak.days >= 30 },
  { id: "series-first", title: "정주행", hint: "시리즈 한 개 완독", icon: "layers", test: (s) => s.seriesDone >= 1 },
  { id: "series-all", title: "전 시리즈", hint: "모든 시리즈 완독", icon: "layers", test: (s) => s.seriesDone >= s.totalSeries },
  { id: "level-5", title: "레벨 5", hint: "누적 420분", icon: "trending-up", test: (s) => s.level.level >= 5 },
  { id: "level-8", title: "레벨 8", hint: "누적 1,050분", icon: "trending-up", test: (s) => s.level.level >= 8 },
  { id: "all", title: "전부 읽기", hint: "칼럼과 스프린트 전부", icon: "trophy", test: (s) => s.allIssues && s.allSprints },
];

export function evaluateBadges(stats: RecordStats): Array<BadgeDef & { unlocked: boolean }> {
  return BADGES.map((badge) => ({ ...badge, unlocked: badge.test(stats) }));
}
