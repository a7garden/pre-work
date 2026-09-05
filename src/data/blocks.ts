/**
 * 이 파일이 이 사이트의 저작 언어다.
 * 칼럼 한 편을 아래 형태 중 하나로 조립하면 화면·RSS·검색 색인이 알아서 따라온다.
 */


export type Block =
  /** 평범한 문단 */
  | { type: "p"; text: string }
  /** 불릿 목록 */
  | { type: "list"; items: string[]; ordered?: boolean }
  /** 강조 상자 */
  | { type: "callout"; title: string; text: string; tone?: "note" | "warn" | "good" }
  /** 해설 없는 코드 블록 */
  | { type: "code"; language: string; caption?: string; content: string }
  /** 화살표로 이어지는 흐름 */
  | { type: "flow"; caption?: string; steps: { label: string; detail?: string }[] }
  /** 주석이 달린 파일 트리 */
  | { type: "tree"; caption?: string; rows: { path: string; note?: string; depth?: number }[] }
  /** 비교표 */
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  /** 객관식 자가 점검 */
  | {
      type: "quiz";
      question: string;
      code?: { language: string; content: string };
      options: string[];
      answer: number;
      explain: string;
    }
  /** 다른 페이지로 넘기는 링크 카드 */
  | { type: "link"; href: string; label: string; title: string; detail?: string };
