# pre-work 공개 뉴스레터 전환 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 개인 학습 플랫폼 pre-work를 공개 뉴스레터로 일괄 전환한다 — 칼럼 31편 전면 재작성, 카피 전환, 이슈 요청 파이프라인 공개 제품화.

**Architecture:** 데이터(issues.ts)는 6개 시리즈 병렬 재작성 → JSON 드래프트 → 검증·조립 스크립트로 통합. 카피·페이지·파이프라인은 세션에서 직접 수정. worktree 브랜치에서 작업 후 main 스쿼시 머지.

**Tech Stack:** Astro 7 (정적), TypeScript 데이터 파일, pagefind 검색, GitHub Pages 배포.

**Spec:** `docs/superpowers/specs/2026-09-05-public-newsletter-pivot-design.md`

## Global Constraints

- 이름은 `pre-work` 유지. 태그라인: **"일 하기 전 10분, 개발자가 꾸준히 성장하기 위한 뉴스레터."**
- 독자 = 실무 경력 0~10년 일반 개발자. 특정 회사·프로젝트("산사태정보시스템", "우리 프로젝트", "첫 출근", "입사", "커피토크") 서술 금지.
- 문체: 평서형(`~한다`) 통일, 과장 단어("혁신적·강력한·완벽한") 금지.
- `callout` 마무리: title **"오늘 해 볼 것"**, 확인 가능한 행동 하나. ("오늘 회사에서 해 볼 것" 금지)
- 기존 glossary id·drill id·태그 URL은 불변 (기존 링크 보존).
- `astro.config.mjs` 사이트 URL, 배포 워크플로, 디자인 토큰(design.md) 불변.
- 커밋: 컨벤셔널 + 한국어 요약. 브랜치: `feat/public-newsletter-pivot`, worktree에서 작업.

---

### Task 1: Worktree 격리 + 베이스라인 (inline)

- [ ] `.worktrees/` 미존재 → 생성, gitignore 확인(없으면 추가·커밋)
- [ ] `git worktree add .worktrees/feat-public-newsletter-pivot -b feat/public-newsletter-pivot`
- [ ] `npm install` (worktree)
- [ ] `npx astro build` 베이스라인 성공 확인

### Task 2: 칼럼 31편 병렬 재작성 (6 subagents, disjoint files)

각 에이전트: 원본(구호)을 `src/data/issues.ts`에서 읽고, 재작성 결과를 **JSON**으로 `src/data/rewrite/<slug>.json`에 쓴다. 상세 계약은 아래 "재작성 계약" — 모든 에이전트에 동일하게 전달.

| slug | 신번호 | 날짜(요일) | 구호 소스 | series |
| :-- | :-- | :-- | :-- | :-- |
| legacy | 1–8 | 08.06(목)~08.13(목) | 1,2,3,4,5,7,8,23 | 레거시 코드 읽기 |
| rulebot | 9–14 | 08.14(금)~08.19(수) | 10,11,12,13,14,21 | 룰베이스 챗봇 |
| msa | 15–20 | 08.20(목)~08.25(화) | 6,15,16,17,24,26 | MSA와 설계 |
| security | 21–24 | 08.26(수)~08.29(토) | 22,27,28,30 | 보안 노트 |
| ai | 25–28 | 08.30(일)~09.02(수) | 18,19,29,31 | AI 활용 |
| singles | 29–31 | 09.03(목)~09.05(토) | 9,20,25 | (없음) |

구호→신호 전체 매핑: 1→1, 2→2, 3→3, 4→4, 5→5, 7→6, 8→7, 23→8, 10→9, 11→10, 12→11, 13→12, 14→13, 21→14, 6→15, 15→16, 16→17, 17→18, 24→19, 26→20, 22→21, 27→22, 28→23, 30→24, 18→25, 19→26, 29→27, 31→28, 9→29, 20→30, 25→31.

#### 재작성 계약 (모든 재작성 에이전트 공통)

- JSON 스키마: `{ "series": string|null, "issues": [{ "no", "date", "weekday", "title", "dek", "minutes", "tags": string[], "takeaway", "blocks": Block[] }] }` — 신번호 오름차순. **`next` 필드는 쓰지 않는다**(편집자가 통합 시 채움).
- Block 어휘(`src/data/blocks.ts`): `p`, `list`(items), `callout`(title,text,tone?), `code`(language,content,caption?), `codeRead`(language,caption,code,question?,notes[{lines,title,body}]), `flow`(caption?,steps[{label,detail?}]), `tree`(caption?,rows[{path,note?,depth?}]), `table`(caption?,head,rows), `terms`(title?,ids), `quiz`(question,code?,options,answer,explain), `link`(href,label,title,detail?).
- 분량: `minutes` 7~9, 블록 6~10개. 10분 안쪽.
- `takeaway` 한 문장이 축 — 본문은 이를 풀어 쓴다.
- 마지막 블록은 `callout` title "오늘 해 볼 것": 독자가 자기 실무에서 바로 확인할 행동 하나.
- 원본의 출처 `link` 블록은 URL 그대로 보존. 원본이 참조하는 `/drills/<id>/` 링크는 유지(drill id: url-to-controller, view-name-to-jsp, model-to-el, mybatis-binding, transaction-trap, generation-check, id-and-name, rulebot-bottleneck, normalization-detect, aiml-category, upload-validation).
- `terms` 블록의 id는 `src/data/glossary.ts`의 기존 id만 사용(신규 등록 금지).
- 금지 표현: "첫 출근", "우리 팀/프로젝트/회사", "커피토크", "입사", "오늘 회사에서", "다음 호에서는"(next는 편집자 몫). 호 간 참조("지난 호에서")는 바로 앞 신호가 실제 이전 호일 때만, 애매하면 제거하고 독립 서두.
- 특수 케이스: 구호 23("인덱스는 왜 붙였는데도 느릴까")의 "11호에서 시간을 재는 법을 적었다" 서두 참조를 끊고 독립적으로 연다. 구호 10(RAG)은 룰베이스 챗봇 시리즈의 첫 호로 자연스럽게 접속한다.
- 문체·공개 원칙은 `CONTENT.md` 준수(단 callout 규칙은 본 계약이 우선). 실제 소스·테이블명·접속정보 없음, 코드는 구조만 각색.
- 빌드·린트·테스트 금지. 자기 파일만 쓴다. 완료 보고: 파일 경로 + 호 수 + 자체 점검 결과.

#### 검수 (통합자 = 세션)

- [ ] JSON 파싱 + 스키마 검증 스크립트 (필수 필드, 블록 타입 화이트리스트, minutes 범위, tags 2~4)
- [ ] 금지 표현 정규식 스캔 (위 Global Constraints 목록)
- [ ] 각 시리즈 첫 호 원문 정독 품질 샘플링 + 문체·분량 확인

### Task 3: 페이지 카피 스윕 (1 subagent)

소유 파일: `src/pages/framework/index.astro`, `src/pages/infra.astro`, `src/pages/stack/index.astro`, `src/pages/stack/*.astro`(11개), `src/pages/glossary.astro`, `src/pages/search.astro`, `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro`, `src/pages/drills/index.astro`, `src/pages/drills/[id].astro`

- [ ] "산사태정보시스템", "이 프로젝트", "우리 프로젝트" 등 프로젝트 특정 서술 → 범용 공공 SI 맥락으로 일반화 (예: stack 인덱스 lede "공공기관 SI에서 널리 쓰는 Java 레거시 스택을 읽는 노트")
- [ ] `infra.astro`의 프로젝트 종속 스펙 표(networkSpec/stackSpec 행 설명) → 일반적 공공기관 망분리 구성 예시로 각색 (제목 "프로젝트 인프라 노트" → "망분리·인프라 노트" 계열)
- [ ] 자기 파일 안의 `/authoring/` 링크 → `/about/`로 교체
- [ ] 데이터 구조·블록 본문·링크(href) 불변, 카피만 수정. 빌드 금지.

### Task 4: 골격 전환 (inline, 세션)

- [ ] `Layout.astro:25` 타이틀 접미사 `실무 학습` → `pre-work`
- [ ] `NavRail.astro`: "플랫폼" 그룹 → `{ label: "소개", links: [{ href: "/about/", title: "pre-work 소개" }] }`; "프로젝트 인프라" → "망분리·인프라"
- [ ] `SiteFooter.astro`: 카피 → 태그라인, `/authoring/` 링크 → `/about/`
- [ ] `index.astro`: description 태그라인화, loop aside(낮/밤/아침) → 요청→승인→발행 3단 + GitHub 이슈 요청 링크(`https://github.com/a7garden/pre-work/issues/new?template=publish.yml`), `/authoring/` 링크 제거
- [ ] `daily/index.astro`: description 전환, note-add-guide → "원하는 칼럼을 요청하세요" + 이슈 템플릿 링크
- [ ] `rss.xml.js`: title `pre-work`, description 태그라인
- [ ] `about.astro` 신설: 소개/운영 방식(요청→승인→발행)/요청 방법/2026-09 아카이브 재편 이관 고지/RSS·검색 안내
- [ ] `authoring.astro` 삭제 (+ 남은 참조 grep 확인)
- [ ] `publish.yml`: `labels: [publish]` 제거(승인 게이트), 독자용 "칼럼 요청" 양식으로 재작성
- [ ] `.omp/publish-daily-issue.md`: 승인 게이트 전제(라벨 = 소유자 승인), callout "오늘 해 볼 것", `/authoring/` 참조 → CONTENT.md
- [ ] `new-issue.mjs`: skeleton callout "오늘 해 볼 것", authoring 참조 → CONTENT.md

### Task 5: 통합 + 데이터 정합 (inline, 세션)

- [ ] 조립 스크립트: `src/data/rewrite/*.json` → 검증 → `issues.ts` 재생성(기존 헤더+Issue 타입 보존, 배열은 JSON.stringify(…, null, 2)), `next`는 다음 신호의 제목으로 채움(31호는 생략), 이후 `src/data/rewrite/` 삭제
- [ ] glossary: `coop` 항목 제거 + `related`/`see` 역참조 정리
- [ ] README.md 전면 재작성 (공개 저장소 문서: 소개/발행 구조/개발 가이드)
- [ ] CONTENT.md 재작성 (callout 정의, 칼럼 요청 파이프라인, 블록 문법 레퍼런스 흡수, authoring 참조 제거)

### Task 6: 검증 (inline, 세션)

- [ ] `npm run build` (astro + pagefind) 성공
- [ ] dev 서버 기동(`npx astro dev --background`) → 브라우저로 `/`, `/about/`, `/daily/1/`, `/daily/31/`, `/drills/`, `/glossary/` 확인(스크린샷) → 서버 정지
- [ ] 금지 표현 사이트 전체 스캔 (`src/data/issues.ts` + pages)

### Task 7: 최종 리뷰 (1 reviewer subagent)

- [ ] 브랜치 전체 diff 리뷰 패키지 전달 — 스펙 적합성 + Global Constraints 위반 + 잔존 개인 맥락
- [ ] 발견 → 1회 수정 디스패치 → 재검토

### Task 8: 머지·배포 (inline, 세션)

- [ ] main 스쿼시 머지 + push (`feat: pre-work 공개 뉴스레터 전환`)
- [ ] GitHub Actions "Deploy to GitHub Pages" 완료 확인
- [ ] 라이브 URL 확인 후 사용자 보고

## Self-Review 결과

- 스펙 커버: §1카피→T4, §2재작성→T2·T5, §3파이프라인→T4, §4페이지→T3·T4, §5데이터→T5, §6문서→T4·T5, §7검증→T6·T8. 누락 없음.
- 플레이스홀더 없음, 매핑 합계 31 확인.
