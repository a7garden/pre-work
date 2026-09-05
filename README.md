# pre-work

일 하기 전 10분, 개발자가 꾸준히 성장하기 위한 뉴스레터.
매일 한 편, 10분 안쪽 칼럼을 읽고 오늘 남길 한 문장과 오늘 해 볼 것 하나를 가져간다.

## 이 뉴스레터가 도는 방식

1. **요청** — 누구나 [GitHub 이슈](https://github.com/a7garden/pre-work/issues/new?template=publish.yml)로 읽고 싶은 주제를 던진다.
2. **승인** — 운영자가 요청을 검토해 `publish` 라벨을 붙인다. 라벨이 곧 발행 승인이다.
3. **발행** — 매일 자정 파이프라인(launchd)이 승인된 주제를 저작 규칙에 맞는 칼럼으로 발행해 커밋·push한다. push하면 GitHub Actions가 GitHub Pages에 배포한다.

## 화면

| 경로 | 무엇 |
| :-- | :-- |
| `/` | 오늘 읽을 칼럼 + 지난 칼럼 + 레퍼런스 선반 |
| `/about/` | 뉴스레터 소개와 운영 방식 |
| `/daily/` | 데일리 아카이브 (뉴스레터 본체) |
| `/drills/` | 코드 읽기 훈련 — 줄을 눌러 해설을 열고, 객관식으로 자가 점검 |
| `/framework/` `/stack/` `/infra/` | 칼럼이 인용하는 레퍼런스 — 공공기관 SI 레거시 스택·망분리 구조 |
| `/glossary/` | 용어 사전 — 본문의 점선 밑줄과 같은 데이터 |
| `/rss.xml` | RSS 구독 |

## 칼럼 추가하기

발행 파이프라인이 매일 자정에 승인된 이슈를 처리한다. 직접 추가할 때는:

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
| `src/data/blocks.ts` | 위 셋이 공유하는 블록 타입 정의 |

블록 종류와 저작 규칙은 [CONTENT.md](CONTENT.md)에 정리되어 있다.

## 용어 자동 연결

`src/lib/annotate.ts` 가 문단 텍스트를 훑어 사전에 있는 표기를 찾아 `<Term>` 으로 감싼다.

- 긴 표기가 먼저 매칭된다 (`Spring Boot` 가 `Spring` 보다 우선).
- 영문 표기는 앞뒤 경계를 확인해 단어 중간에서는 걸리지 않는다 (`NoticeService` 안의 `Service` 는 연결되지 않는다).
- 같은 용어는 한 페이지에 한 번만 연결된다 (`seen` 집합을 페이지가 넘겨준다).
- 연결하고 싶지 않은 용어에는 `noauto: true` 를 준다.

## 개발

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # astro build + pagefind 검색 인덱스
npm run preview
```

기여는 칼럼 요청 이슈로. 코드 변경은 fork 후 PR.
