# pre-work

일 하기 전 10분, 개발자를 위한 짧은 읽기.
한 편을 읽고 오늘 남길 한 문장과 오늘 해 볼 것 하나를 가져간다.

[사이트 열기](https://a7garden.github.io/pre-work/)

2026년 9월 8일 개편: 최신 기사와 시리즈 시작점을 나란히 배치하고, 전체 호의
시리즈 필터와 접을 수 있는 본문 목차를 추가했다. ‘실패를 다루는 코드’ 특집
제140–149호 10편을 함께 발행했다. 각 편은 6–7분, 특집 전체는 62분이다.

## 화면

| 경로 | 내용 |
| :-- | :-- |
| `/` | 최신 기사, 시리즈 시작점, 시리즈별 전체 호 필터 |
| `/read/<no>/` | 기사 전문, 자가 점검, 시리즈 목차, 이전·다음 호 |
| `/tags/` | 주제별 태그 목록 |
| `/tags/<tag>/` | 해당 태그의 기사 |
| `/search/` | 제목과 본문 검색 |
| `/about/` | 소개, 주제 요청 방법, 시리즈 카탈로그 |
| `/rss.xml` | 기사 전문 RSS |

`/` 키로 검색, 기사에서 `←`·`→` 키로 이전·다음 호를 이동한다.
테마 선택과 읽은 호 표시는 해당 브라우저에 저장된다.

## 기사 추가

```bash
npm run new:issue                         # 오늘 날짜로 다음 호
npm run new:issue -- 2026-09-09           # 날짜 지정
npm run new:issue -- 2026-09-09 --count 10 # 같은 날짜에 특집 10편
```

다음 호 번호는 기존 최댓값에서 이어진다. 원고는 `src/data/issues.ts`, 블록 문법은
`src/data/blocks.ts`, 저작 규칙은 [CONTENT.md](CONTENT.md)에 있다. 저장소에 이관된
기존 기사의 날짜는 당시 연재 순서를 나타내며, 새 기사는 실제 발행 날짜를 쓴다.
목록과 이전·다음 이동은 호 번호를 기준으로 정렬한다.

주제 요청은 [GitHub 이슈](https://github.com/a7garden/pre-work/issues/new?template=publish.yml)로
받는다. 운영자가 `publish` 라벨을 붙인 요청은 발행 파이프라인이 처리한다.

## 개발과 배포

```bash
npm ci
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
npm run build                            # Astro + Pagefind 검색 색인
npm run preview
```

`main`에 push하면 GitHub Actions가 빌드, 검색 색인 생성, `/pre-work/` 하위 경로
변환을 거쳐 GitHub Pages에 배포한다. 검색 검증은 `npm run build` 후 preview에서 한다.

디자인 기준은 [design.md](design.md), 공통 토큰 원본은 [tokens.css](tokens.css)다.
`src/styles/tokens.css`가 원본을 가져오며 `src/styles/global.css`에서 사용한다.
