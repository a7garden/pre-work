#!/usr/bin/env node
/**
 * 다음 호의 뼈대를 src/data/issues.ts 맨 앞에 끼워 넣는다.
 *
 *   npm run new:issue                 오늘 날짜로
 *   npm run new:issue -- 2026-09-07   날짜를 지정해서
 *
 * 제목과 블록만 채우면 목록·상세·이전다음·홈이 전부 따라온다.
 * 쓸 수 있는 블록 종류는 /authoring/ 페이지에 예시와 함께 정리되어 있다.
 */
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../src/data/issues.ts", import.meta.url);
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const arg = process.argv[2];
const when = arg ? new Date(`${arg}T09:00:00`) : new Date();
if (Number.isNaN(when.getTime())) {
  console.error(`날짜를 읽을 수 없습니다: ${arg} (예: 2026-09-07)`);
  process.exit(1);
}

const pad = (n) => String(n).padStart(2, "0");
const date = `${when.getFullYear()}.${pad(when.getMonth() + 1)}.${pad(when.getDate())}`;
const weekday = WEEKDAYS[when.getDay()];

const source = await readFile(FILE, "utf8");

const anchor = "export const issues: Issue[] = [";
const at = source.indexOf(anchor);
if (at < 0) {
  console.error("issues 배열을 찾지 못했습니다. src/data/issues.ts 를 확인하세요.");
  process.exit(1);
}

const numbers = [...source.matchAll(/^    no: (\d+),$/gm)].map((m) => Number(m[1]));
const nextNo = numbers.length ? Math.max(...numbers) + 1 : 1;

if (source.includes(`date: "${date}"`)) {
  console.error(`${date} 자 호가 이미 있습니다. 날짜를 지정해 주세요: npm run new:issue -- 2026-09-07`);
  process.exit(1);
}

const skeleton = `
  {
    no: ${nextNo},
    date: "${date}",
    weekday: "${weekday}",
    title: "제목을 쓴다",
    dek: "목록에 보일 한 줄 소개.",
    minutes: 8,
    tags: ["태그"],
    takeaway: "오늘 하루 머리에 남기고 싶은 한 문장.",
    next: "내일 이어서 볼 것",
    blocks: [
      { type: "p", text: "여기서부터 쓴다. 사전에 있는 용어는 자동으로 연결된다." },
      { type: "terms", title: "오늘의 용어", ids: [] },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "한 가지만. 확인 가능한 것으로.",
      },
    ],
  },
`;

const out =
  source.slice(0, at + anchor.length) + skeleton + source.slice(at + anchor.length);
await writeFile(FILE, out, "utf8");

console.log(`제${nextNo}호 (${date} ${weekday}) 뼈대를 추가했습니다.`);
console.log("  src/data/issues.ts 맨 앞을 열어 제목과 블록을 채우세요.");
console.log("  블록 종류와 예시: npm run dev 후 http://localhost:4321/authoring/");
