/**
 * 이 파일이 이 사이트의 저작 언어다.
 * 노트·데일리 이슈·훈련 페이지가 모두 같은 블록 타입을 쓰기 때문에,
 * 새 글을 쓸 때는 아래 형태 중 하나를 고르면 화면은 알아서 만들어진다.
 */

/** 코드 한 줄에 붙이는 해설 */
export type CodeNote = {
  /** "12" 또는 "12-15" — 1부터 세는 줄 번호 */
  lines: string;
  title: string;
  body: string;
};

export type Block =
  /** 평범한 문단. 사전에 있는 용어는 자동으로 연결된다. */
  | { type: "p"; text: string }
  /** 불릿 목록 */
  | { type: "list"; items: string[]; ordered?: boolean }
  /** 강조 상자 */
  | { type: "callout"; title: string; text: string; tone?: "note" | "warn" | "good" }
  /** 해설 없는 코드 블록 */
  | { type: "code"; language: string; caption?: string; content: string }
  /**
   * 코드 읽기 훈련용 블록. 줄을 클릭하면 해설이 열린다.
   * question을 주면 코드를 읽고 답할 질문이 위에 붙는다.
   */
  | {
      type: "codeRead";
      language: string;
      caption: string;
      code: string;
      question?: string;
      notes: CodeNote[];
    }
  /** 화살표로 이어지는 흐름 */
  | { type: "flow"; caption?: string; steps: { label: string; detail?: string }[] }
  /** 주석이 달린 파일 트리 */
  | { type: "tree"; caption?: string; rows: { path: string; note?: string; depth?: number }[] }
  /** 비교표 */
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  /** 사전 항목을 카드로 펼쳐 보여 준다 */
  | { type: "terms"; title?: string; ids: string[] }
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
