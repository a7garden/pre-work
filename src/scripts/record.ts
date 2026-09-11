/**
 * 읽기 기록 클라이언트 접착 — 페이지에 심은 목록 JSON과 localStorage의
 * 읽음 표시를 모은다. 읽음 표시가 새로 찍히면 읽기 화면의 마킹 스크립트가
 * `pw:marked` 문서 이벤트를 보내고, 다른 탭의 변화는 storage 이벤트로 온다.
 */
import type { RecordCatalog, RecordStats } from "../lib/record";
import { computeRecord } from "../lib/record";

const READ_KEYS = ["pw-read", "pw-sprint-read"];

export function catalogFromPage(): RecordCatalog | null {
  const el = document.querySelector<HTMLScriptElement>("script[data-record-catalog]");
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent) as RecordCatalog;
  } catch {
    return null;
  }
}

export function readIds(): Set<string> {
  const ids = new Set<string>();
  for (const key of READ_KEYS) {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (Array.isArray(saved)) for (const id of saved) if (typeof id === "string") ids.add(id);
    } catch {
      /* 깨진 저장소는 기록 없음으로 본다 */
    }
  }
  return ids;
}

export function currentRecord(): { catalog: RecordCatalog; stats: RecordStats } | null {
  const catalog = catalogFromPage();
  if (!catalog) return null;
  return { catalog, stats: computeRecord(catalog, readIds()) };
}

/** 읽음 표시 변화를 하나로 몰아서 알려 준다 */
export function onRecordChange(callback: () => void): void {
  document.addEventListener("pw:marked", callback);
  window.addEventListener("storage", callback);
}
