# Design — pre-work

이 앱은 일 하기 전 10분에 한 편을 읽는 공개 읽기 앱이다.
모든 화면은 **오늘 무엇을 읽을지** 빠르게 판단하고, 한 편을 끝까지 읽게 돕는다.

## Genre

Modern-minimal documentation workspace. 읽기 화면은 뉴스레터에 가깝게, 목록·참고 화면은 문서에 가깝게.

## Macrostructure family

- Home (`/`): Workbench — 최신 호와 시리즈 시작점을 나란히 놓는 reading desk. 그 아래 시리즈 필터를 갖춘 전체 호 목록과 주제 제안 안내.
- Read (`/read/<no>/`): Long Document — 한 편이 10분 안에 끝나는 세로 흐름. 중앙 정렬 본문, 상단 진행 막대, 접을 수 있는 시리즈 목차·이전다음 내비게이션.
- Sprints (`/sprint/`, `/sprint/<no>/`): 코드 읽기 훈련면 — 체스 퍼즐식으로 짧은
  코드 한 판을 읽는다. 인덱스는 오늘의 세트 카드와 언어 필터 목록, 상세는 점선
  토큰 코드 무대와 체크 한 문제다. 하루에 여러 판이 발간된다.
- Tags (`/tags/`, `/tags/<tag>/`) · Search (`/search/`): Index-first — 목록과 검색.
- About (`/about/`): 운영 방식과 요청 방법을 설명하는 안내 문서.

## Theme

- Paper: 차가운 무채색의 거의 흰 배경
- Ink: 청회색에 가까운 짙은 텍스트
- Accent: 절제된 코발트 블루. 현재 위치(내비게이션 활성), 키보드 포커스, 링크 호버에만 사용
- Surfaces: 카드 그림자 대신 얇은 경계와 한 단계 어두운 배경. 그림자는 쓰지 않는다

## Typography

- Display / body: 시스템 산세리프 우선
- Code: IBM Plex Mono 계열
- 제목은 짧고 기능적으로. 이탤릭 제목, 장식용 세리프, 과장된 영웅 문구는 쓰지 않는다.
- 읽기 화면의 본문 폭은 `--measure`(72ch)를 넘지 않는다.

## Spacing and motion

- 4pt 기반 토큰을 사용한다.
- 화면 진입 애니메이션은 사용하지 않는다.
- 상호작용은 색·테두리·transform만 180ms 이내로 변화시키며, reduced-motion에서는 즉시 반영한다.
- 키보드 탐색(←/→, /)과 복사 피드백은 0ms — 즉시 반영이 원칙이다.

## Component voice

- 상단 최소 헤더(N1b 계열, 모바일에서는 브랜드와 메뉴 두 줄): 브랜드 워드마크 + 아이콘 내비게이션 + 테마 토글 한 개. 좌측 레일은 쓰지 않는다.
- 버튼은 작은 사각형 또는 둥근 사각형이며, 채워진 색은 주 행동 한 개에만 사용한다.
- 콘텐츠 카드에는 실제 글의 제목, 요약, 태그, 읽는 시간을 담는다. 만들어 낸 성과 지표는 사용하지 않는다.

### 아이콘

- Lucide 단일 라이브러리. CDN·아이콘 폰트 없이 `Icon.astro`에 인라인 벤더한다.
- 크기는 16/20px 두 단계, stroke 2(16px는 2.25로 보정), `currentColor` 단색.
- 아이콘은 의미 전달(메타 정보, 상태, 행동 방향)에만 쓴다. 장식용 아이콘은 넣지 않는다.
- 상태는 색만으로 나타내지 않는다 — 정답·오답, 복사 완료는 아이콘과 함께.

### 2026-09-08 개편

- 최신 기사는 제목·요약·읽기 행동·한 문장 순으로 배치한다.
- 홈의 시리즈 패널은 첫 네 편과 첫 편으로 가는 링크를 제공한다. 전체 회차는 읽기 화면의 펼침 목차에서 확인한다.
- 전체 호 목록은 시리즈별로 필터링한다. 필터 결과 건수를 보조 기술에도 알린다.
- 기사 제목과 긴 콘텐츠 링크는 읽을 수 있게 줄바꿈한다. 메뉴·버튼·짧은 행동 링크는 한 줄을 유지한다.
- 둥근 모서리는 3/6px. 상호작용 시간은 160ms 이하. 장식 이미지와 진입 애니메이션은 두지 않는다.

### 읽기 편의

- `/` 키로 어디서든 검색 페이지로 이동하고 입력란에 포커스한다.
- 읽기 화면에서 `←`/`→` 키로 이전·다음 호를 이동한다.
- 읽기 화면 주소 복사 버튼은 라벨 스왑으로 피드백한다(2.5s 뒤 복귀, 토스트 없음).
- 터치 대상은 44px 이상(시각 크기와 무관하게 히트 영역으로 확보).

### 코드 읽기 스프린트 인터랙션

- 주석 토큰은 점선 밑줄과 위첨자 번호다. 호버·터치·키보드 포커스로 열고
  Esc·바깥 클릭으로 닫는다. 한 번에 하나만 열린다.
- 툴팁은 그림자 대신 1px 잉크 경계를 쓴다. 코드 상자 안에 붙어 가로 스크롤을
  따라가며, 보이는 창 안쪽에만 나타난다. 위자리가 없으면 아래로 뒤집는다.
- 코드 아래 "주석 N개 펼쳐 보기" 목록이 같은 번호의 토큰을 밝힌다 — 툴팁 없이
  훑어 보는 경로다.
- 읽음 처리는 칼럼과 같은 규칙이다. 끝까지 읽거나 체크에 답하면 읽음이고,
  저장소 키는 `pw-sprint-read`다.
- ←/→ 이동, `/` 검색, 44px 터치 대상, 모션 규칙은 읽기 화면과 동일하다.

## What every page shares

- 동일한 색·글꼴·코드 블록·포커스 링
- 동일한 상단 헤더와 간결한 footer
- 본문 건너뛰기 링크, 그리고 읽기 화면의 상단 진행 막대
- 모바일에서 헤더 내비게이션은 한 줄(내부 가로 스크롤)을 유지하고, 모든 다열 레이아웃은 한 열로 전환한다
- 넓은 요소(표·트리·코드)는 페이지가 아니라 자기 상자 안에서 가로 스크롤한다

## Exports

`tokens.css`가 원본이며 `src/styles/tokens.css`에서 가져온다. 다음 형식은 다른 프로젝트에서 사용할 때 참고한다.

### tokens.css

```css
/* Hallmark · macrostructure: Workbench / Long Document / Index-first
 * tone: reading desk · anchor hue: 258 · design-system: design.md
 * pre-emit critique: P5 H5 E4 S5 R5 V4 */
:root {
  color-scheme: light;

  /* ---- color: cool neutral paper with a restrained cobalt signal ---- */
  --color-paper:      oklch(98.5% 0.003 255);
  --color-paper-2:    oklch(96.5% 0.006 255);
  --color-paper-3:    oklch(93.5% 0.009 255);
  --color-rule:       oklch(88% 0.009 255);
  --color-neutral:    oklch(52% 0.016 255);
  --color-muted:      oklch(43% 0.014 255);
  --color-ink:        oklch(22% 0.018 255);
  --color-accent:     oklch(49% 0.180 258);
  --color-accent-ink: oklch(99% 0.003 255);
  --color-focus:      oklch(58% 0.190 258);
  --color-good:       oklch(52%  0.130 148);
  --color-warn:       oklch(52%  0.130 75);

  /* ---- type ---- */
  --font-display: -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  --font-body:    -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  --font-mono:    "IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, monospace;

  --text-xs:      0.75rem;
  --text-sm:      0.875rem;
  --text-base:    1rem;
  --text-md:      1.125rem;
  --text-lg:      1.375rem;
  --text-xl:      1.75rem;
  --text-2xl:     2.125rem;
  --text-3xl:     2.625rem;
  --text-4xl:     3.25rem;
  --text-display: clamp(2.25rem, 1.4rem + 2.4vw, 3.5rem);

  /* ---- space: 4pt scale ---- */
  --space-3xs: 0.125rem;
  --space-2xs: 0.25rem;
  --space-xs:  0.5rem;
  --space-sm:  0.75rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xl:  2.5rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;
  --space-4xl: 9rem;

  /* ---- motion: Almanac scale 0.85x ---- */
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 102ms;
  --dur-short: 160ms;
  --dur-long:  357ms;

  /* ---- misc ---- */
  --radius-sm: 3px;
  --radius-md: 6px;
  --rule-hair: 1px;

  --z-base:     1;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-modal:    400;
  --z-toast:    500;
  --z-tooltip:  600;

  --measure: 72ch;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;

    --color-paper:      oklch(16% 0.012 255);
    --color-paper-2:    oklch(20% 0.014 255);
    --color-paper-3:    oklch(25% 0.016 255);
    --color-rule:       oklch(33% 0.016 255);
    --color-neutral:    oklch(65% 0.014 255);
    --color-muted:      oklch(76% 0.012 255);
    --color-ink:        oklch(95% 0.006 255);
    --color-accent:     oklch(70% 0.160 258);
    --color-accent-ink: oklch(16% 0.012 255);
    --color-focus:      oklch(76% 0.170 258);
    --color-good:       oklch(68% 0.130 148);
    --color-warn:       oklch(72% 0.140 75);
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;

  --color-paper:      oklch(16% 0.012 255);
  --color-paper-2:    oklch(20% 0.014 255);
  --color-paper-3:    oklch(25% 0.016 255);
  --color-rule:       oklch(33% 0.016 255);
  --color-neutral:    oklch(65% 0.014 255);
  --color-muted:      oklch(76% 0.012 255);
  --color-ink:        oklch(95% 0.006 255);
  --color-accent:     oklch(70% 0.160 258);
  --color-accent-ink: oklch(16% 0.012 255);
  --color-focus:      oklch(76% 0.170 258);
  --color-good:       oklch(68% 0.130 148);
  --color-warn:       oklch(72% 0.140 75);
}
```

### Tailwind v4 @theme

```css
@theme {
  --color-paper: oklch(98.5% 0.003 255);
  --color-paper-2: oklch(96.5% 0.006 255);
  --color-paper-3: oklch(93.5% 0.009 255);
  --color-rule: oklch(88% 0.009 255);
  --color-neutral: oklch(52% 0.016 255);
  --color-muted: oklch(43% 0.014 255);
  --color-ink: oklch(22% 0.018 255);
  --color-accent: oklch(49% 0.180 258);
  --color-accent-ink: oklch(99% 0.003 255);
  --color-focus: oklch(58% 0.190 258);
  --color-good: oklch(52%  0.130 148);
  --color-warn: oklch(52%  0.130 75);
  --font-display: -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.125rem;
  --text-lg: 1.375rem;
  --text-xl: 1.75rem;
  --text-2xl: 2.125rem;
  --text-3xl: 2.625rem;
  --text-4xl: 3.25rem;
  --text-display: clamp(2.25rem, 1.4rem + 2.4vw, 3.5rem);
  --spacing-3xs: 0.125rem;
  --spacing-2xs: 0.25rem;
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2.5rem;
  --spacing-2xl: 4rem;
  --spacing-3xl: 6rem;
  --spacing-4xl: 9rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 102ms;
  --dur-short: 160ms;
  --dur-long: 357ms;
  --radius-sm: 3px;
  --radius-md: 6px;
  --rule-hair: 1px;
}
```

### DTCG tokens.json

```json
{
  "color": {
    "paper": {
      "$value": "oklch(98.5% 0.003 255)",
      "$type": "color"
    },
    "paper-2": {
      "$value": "oklch(96.5% 0.006 255)",
      "$type": "color"
    },
    "paper-3": {
      "$value": "oklch(93.5% 0.009 255)",
      "$type": "color"
    },
    "rule": {
      "$value": "oklch(88% 0.009 255)",
      "$type": "color"
    },
    "neutral": {
      "$value": "oklch(52% 0.016 255)",
      "$type": "color"
    },
    "muted": {
      "$value": "oklch(43% 0.014 255)",
      "$type": "color"
    },
    "ink": {
      "$value": "oklch(22% 0.018 255)",
      "$type": "color"
    },
    "accent": {
      "$value": "oklch(49% 0.180 258)",
      "$type": "color"
    },
    "accent-ink": {
      "$value": "oklch(99% 0.003 255)",
      "$type": "color"
    },
    "focus": {
      "$value": "oklch(58% 0.190 258)",
      "$type": "color"
    },
    "good": {
      "$value": "oklch(52%  0.130 148)",
      "$type": "color"
    },
    "warn": {
      "$value": "oklch(52%  0.130 75)",
      "$type": "color"
    }
  },
  "font": {
    "display": {
      "$value": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\", \"Malgun Gothic\", sans-serif",
      "$type": "fontFamily"
    },
    "body": {
      "$value": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\", \"Malgun Gothic\", sans-serif",
      "$type": "fontFamily"
    },
    "mono": {
      "$value": "\"IBM Plex Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
      "$type": "fontFamily"
    }
  },
  "text": {
    "xs": {
      "$value": "0.75rem",
      "$type": "dimension"
    },
    "sm": {
      "$value": "0.875rem",
      "$type": "dimension"
    },
    "base": {
      "$value": "1rem",
      "$type": "dimension"
    },
    "md": {
      "$value": "1.125rem",
      "$type": "dimension"
    },
    "lg": {
      "$value": "1.375rem",
      "$type": "dimension"
    },
    "xl": {
      "$value": "1.75rem",
      "$type": "dimension"
    },
    "2xl": {
      "$value": "2.125rem",
      "$type": "dimension"
    },
    "3xl": {
      "$value": "2.625rem",
      "$type": "dimension"
    },
    "4xl": {
      "$value": "3.25rem",
      "$type": "dimension"
    },
    "display": {
      "$value": "clamp(2.25rem, 1.4rem + 2.4vw, 3.5rem)",
      "$type": "dimension"
    }
  },
  "space": {
    "3xs": {
      "$value": "0.125rem",
      "$type": "dimension"
    },
    "2xs": {
      "$value": "0.25rem",
      "$type": "dimension"
    },
    "xs": {
      "$value": "0.5rem",
      "$type": "dimension"
    },
    "sm": {
      "$value": "0.75rem",
      "$type": "dimension"
    },
    "md": {
      "$value": "1rem",
      "$type": "dimension"
    },
    "lg": {
      "$value": "1.5rem",
      "$type": "dimension"
    },
    "xl": {
      "$value": "2.5rem",
      "$type": "dimension"
    },
    "2xl": {
      "$value": "4rem",
      "$type": "dimension"
    },
    "3xl": {
      "$value": "6rem",
      "$type": "dimension"
    },
    "4xl": {
      "$value": "9rem",
      "$type": "dimension"
    }
  },
  "ease": {
    "out": {
      "$value": "cubic-bezier(0.16, 1, 0.3, 1)",
      "$type": "cubicBezier"
    },
    "in": {
      "$value": "cubic-bezier(0.7, 0, 0.84, 0)",
      "$type": "cubicBezier"
    },
    "in-out": {
      "$value": "cubic-bezier(0.65, 0, 0.35, 1)",
      "$type": "cubicBezier"
    }
  },
  "dur": {
    "micro": {
      "$value": "102ms",
      "$type": "duration"
    },
    "short": {
      "$value": "160ms",
      "$type": "duration"
    },
    "long": {
      "$value": "357ms",
      "$type": "duration"
    }
  },
  "radius": {
    "sm": {
      "$value": "3px",
      "$type": "dimension"
    },
    "md": {
      "$value": "6px",
      "$type": "dimension"
    }
  },
  "rule": {
    "hair": {
      "$value": "1px",
      "$type": "dimension"
    }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: var(--color-paper);
  --foreground: var(--color-ink);
  --primary: var(--color-accent);
  --primary-foreground: var(--color-accent-ink);
  --muted: var(--color-paper-2);
  --muted-foreground: var(--color-muted);
  --border: var(--color-rule);
  --input: var(--color-rule);
  --ring: var(--color-focus);
  --radius: var(--radius-sm);
}
```
