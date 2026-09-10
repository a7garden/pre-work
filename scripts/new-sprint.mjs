#!/usr/bin/env node
/**
 * 다음 스프린트의 뼈대를 src/data/sprints.ts 맨 앞에 끼워 넣는다.
 *
 *   npm run new:sprint                    오늘 날짜로 3편
 *   npm run new:sprint -- --count 5       5편
 *   npm run new:sprint -- 2026-09-11      날짜를 지정해서
 *
 * 스프린트는 하루에 여러 편이 원칙이다. 저작 규칙은 CONTENT.md,
 * 검증은 scripts/check-sprint-batch.mjs로 주석 단위로 한다.
 */
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../src/data/sprints.ts", import.meta.url);

const args = process.argv.slice(2);
const countAt = args.indexOf("--count");
const count = countAt === -1 ? 3 : Number(args[countAt + 1]);
if (!Number.isInteger(count) || count < 1 || count > 20) {
  console.error("--count는 1부터 20까지의 정수여야 합니다.");
  process.exit(1);
}
if (countAt !== -1) args.splice(countAt, 2);
const arg = args[0];
const when = arg ? new Date(`${arg}T09:00:00`) : new Date();
if (Number.isNaN(when.getTime())) {
  console.error(`날짜를 읽을 수 없습니다: ${arg} (예: 2026-09-11)`);
  process.exit(1);
}

const pad = (n) => String(n).padStart(2, "0");
const date = `${when.getFullYear()}.${pad(when.getMonth() + 1)}.${pad(when.getDate())}`;

const source = await readFile(FILE, "utf8");

const anchor = "export const sprints: Sprint[] = [";
const at = source.indexOf(anchor);
if (at < 0) {
  console.error("sprints 배열을 찾지 못했습니다. src/data/sprints.ts 를 확인하세요.");
  process.exit(1);
}

const numbers = [...source.matchAll(/^ {2}"?no"?: (\d+),$/gm)].map((m) => Number(m[1]));
const nextNo = numbers.length ? Math.max(...numbers) + 1 : 1;

const skeleton = Array.from({ length: count }, (_, index) => `
  {
    no: ${nextNo + count - 1 - index},
    date: "${date}",
    title: "제목을 쓴다",
    dek: "목록에 보일 한 줄 소개.",
    minutes: 3,
    language: "언어 표시명",
    domain: "백엔드|프론트엔드|데이터|시스템|모바일|인프라",
    prompt: "코드를 펼치기 전 던지는 읽기 과제 한 문장.",
    code: \`여기에 코드를 넣는다 — 백틱과 \\\${ 를 쓰지 않는다\`,
    annotations: [
      {
        find: "코드에 정확히 일치하는 조각",
        title: "토큰이 무엇인지 한 호흡",
        body: "두세 문장 설명. 평서형으로.",
        kind: "concept",
      },
    ],
    takeaway: "오늘 하루 머리에 남기고 싶은 한 문장.",
    check: {
      question: "읽은 코드로 묻는 질문.",
      options: ["보기", "보기", "보기"],
      answer: 0,
      explain: "정답 근거 두세 문장.",
    },
  },
`).join("");

const out =
  source.slice(0, at + anchor.length) + skeleton + source.slice(at + anchor.length);
await writeFile(FILE, out, "utf8");

console.log(`스프린트 제${nextNo}–제${nextNo + count - 1}번 (${date}) 뼈대 ${count}편을 추가했습니다.`);
console.log("  src/data/sprints.ts 맨 앞을 열어 채우세요.");
console.log("  주석 find는 코드의 정확한 한 행 조각 — 저작 규칙은 CONTENT.md.");
