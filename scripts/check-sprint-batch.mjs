#!/usr/bin/env node
/**
 * 스프린트 배치 검증 — 저작 계약의 합격 판정기.
 *
 *   node --experimental-strip-types scripts/check-sprint-batch.mjs src/data/sprint-batches/batch-1.ts [...]
 *
 * 배치의 모든 스프린트에 대해:
 *  - annotate()가 모든 주석 find를 코드에서 찾고 서로 겹치지 않는지
 *  - find가 한 행 안쪽인지, check.answer가 보기 안에 있는지
 *  - 필수 필드와 번호 중복이 없는지
 */
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { annotate } from "../src/lib/sprint-tokens.ts";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("검사할 배치 파일 경로를 주세요: scripts/check-sprint-batch.mjs <file.ts> [...]");
  process.exit(2);
}

const seen = new Map();
let problems = 0;

const fail = (no, msg) => {
  problems++;
  console.error(`  ✗ 스프린트 ${no}: ${msg}`);
};

for (const file of files) {
  let mod;
  try {
    mod = await import(pathToFileURL(resolve(file)).href);
  } catch (err) {
    console.error(`✗ ${file}: 불러올 수 없다 — ${err.message}`);
    problems += 1;
    continue;
  }
  const batch = mod.batch ?? mod.default;
  if (!Array.isArray(batch)) {
    console.error(`✗ ${file}: batch 배열이 없다. 'export const batch: Sprint[] = [...]' 형식이어야 한다.`);
    problems += 1;
    continue;
  }
  console.log(`${file} — 스프린트 ${batch.length}편`);

  for (const sprint of batch) {
    const no = sprint?.no ?? "?";
    for (const field of ["no", "date", "title", "dek", "minutes", "language", "prompt", "code", "takeaway"]) {
      if (sprint?.[field] == null || sprint[field] === "") fail(no, `필수 필드 ${field}가 비어 있다.`);
    }
    if (seen.has(no)) fail(no, `번호가 겹친다(${seen.get(no)}와 충돌).`);
    seen.set(no, file);

    if (!Array.isArray(sprint.annotations) || sprint.annotations.length === 0) {
      fail(no, "annotations가 비어 있다. 5~8개를 붙인다.");
      continue;
    }
    if (sprint.annotations.length > 12) fail(no, `주석이 ${sprint.annotations.length}개다. 8개 안쪽으로 줄인다.`);
    for (const anno of sprint.annotations) {
      if (!anno.find || anno.find.includes("\n")) fail(no, `주석 find는 한 행 안쪽의 비어 있지 않은 문자열이어야 한다: ${JSON.stringify(anno.find?.slice(0, 20))}`);
      if (!anno.title || !anno.body) fail(no, `주석 '${anno.find}'에 title/body가 없다.`);
    }

    try {
      annotate(sprint.code, sprint.annotations);
    } catch (err) {
      fail(no, err.message);
    }

    const check = sprint.check;
    if (check) {
      if (!Array.isArray(check.options) || check.options.length < 2) fail(no, "check.options는 보기 2개 이상.");
      if (!Number.isInteger(check.answer) || check.answer < 0 || check.answer >= (check.options?.length ?? 0)) {
        fail(no, `check.answer(${check.answer})가 보기 범위를 벗어났다.`);
      }
      if (!check.question || !check.explain) fail(no, "check에 question/explain이 없다.");
    }
  }
}

if (problems > 0) {
  console.error(`✗ 문제 ${problems}건 — 고치고 다시 검사한다.`);
  process.exit(1);
}
console.log(`✓ 통과 — 스프린트 ${seen.size}편, 문제 없음.`);
