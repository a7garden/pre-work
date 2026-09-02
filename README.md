# pre-work

출근길에 한 편씩 읽으며 실무 코드를 읽는 힘을 기르는 개인 학습 플랫폼.
전자정부 표준프레임워크 3.8 기반 레거시(Spring MVC · JSP · MyBatis · Tomcat)를 읽는 것이 주제다.

## 도는 방식

1. **낮** — 회사에서 막힌 것, 모르고 넘어간 단어를 메모한다.
2. **밤** — 집에서 한 편으로 정리해 다음 호로 추가한다.
3. **아침** — 출근길에 읽고, 회사에서 한 가지만 확인해 본다.

## 화면

| 경로 | 무엇 |
| :-- | :-- |
| `/` | 오늘 읽을 호 + 지난 호 + 기준 페이지 |
| `/daily/` | 데일리 아카이브 (뉴스레터 본체) |
| `/drills/` | 코드 읽기 훈련 — 줄을 눌러 해설을 열고, 객관식으로 자가 점검 |
| `/framework/` | 표준프레임워크 3.8 구조 해부 |
| `/glossary/` | 용어 사전 — 본문의 점선 밑줄과 같은 데이터 |
| `/authoring/` | 저작 방법 — 블록 종류와 실제 렌더링을 나란히 |
| `/notes/` `/stack/` `/infra/` | 길게 정리한 노트와 기술별 참고 |

## 새 글 추가하기

```bash
npm run new:issue            # 오늘 날짜로 다음 호 뼈대 생성
npm run new:issue -- 2026-09-07
```

내용은 전부 타입이 붙은 데이터 파일에 있다. 화면은 데이터에서 파생된다.

| 파일 | 무엇 |
| :-- | :-- |
| `src/data/issues.ts` | 데일리 한 편 |
| `src/data/drills.ts` | 코드 읽기 훈련 |
| `src/data/glossary.ts` | 용어 — 추가하면 사이트 전체 본문에 자동 연결 |
| `src/data/notes.ts` | 긴 노트 |
| `src/data/blocks.ts` | 위 넷이 공유하는 블록 타입 정의 |

블록 종류와 예시는 `/authoring/` 페이지에서 코드와 결과를 나란히 볼 수 있다.
자세한 저작 규칙은 [CONTENT.md](CONTENT.md)를 본다.

## 용어 자동 연결

`src/lib/annotate.ts` 가 문단 텍스트를 훑어 사전에 있는 표기를 찾아 `<Term>` 으로 감싼다.

- 긴 표기가 먼저 매칭된다 (`Spring Boot` 가 `Spring` 보다 우선).
- 영문 표기는 앞뒤 경계를 확인해 단어 중간에서는 걸리지 않는다 (`NoticeService` 안의 `Service` 는 연결되지 않는다).
- 같은 용어는 한 페이지에 한 번만 연결된다 (`seen` 집합을 페이지가 넘겨준다).
- 연결하고 싶지 않은 용어에는 `noauto: true` 를 준다.

## 개발

```bash
npm install
npm run dev
```

`CLAUDE.md` 의 안내대로 `astro dev --background` 로 띄우면 `astro dev stop` · `status` · `logs` 로 관리할 수 있다.

| 명령 | 하는 일 |
| :-- | :-- |
| `npm run dev` | localhost:4321 개발 서버 |
| `npm run build` | `./dist/` 로 정적 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run new:issue` | 다음 호 뼈대 생성 |

## 배포

`main` 에 push하면 GitHub Actions가 빌드해 GitHub Pages로 올린다
(`.github/workflows/deploy.yml`). 프로젝트 서브패스(`/pre-work/`) 대응은
빌드 후 HTML의 루트 절대경로를 치환하는 방식이다. 스크립트가 실행 시점에
만드는 링크는 좌측 레일 로고의 `href` 에서 접두어를 얻어 같은 규칙을 따른다
(`src/components/TermLayer.astro`).
