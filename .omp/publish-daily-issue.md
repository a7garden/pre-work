# 발간 파이프라인 — GitHub 이슈 → 데일리 호 자동 발간

> 실행 시점: 매일 00:05 KST (launchd: com.pre-work.publish-daily)
> 실행 모델: `zai/glm-5.3:max`
> CWD: `/Volumes/MERCURY/PROJECTS/pre-work`
> 의뢰인: 사용자

---

## 요구사항 요약

사용자가 GitHub 저장소(a7garden/pre-work)에 `publish` 라벨로 등록한 이슈는
"대충 적힌 주제"다(예: "MSA에 대한 내용"). 이 태스크는 열려 있는 발간 이슈를
전부 읽어 각각을 저작 규칙(CONTENT.md)에 맞는 완성된 데일리 호로 발간하고,
빌드 → 커밋 → push → GitHub Pages 배포까지 마친 뒤 이슈를 닫는다.

## 절대 규칙 (무엇보다 먼저 읽을 것)

1. 이 저장소는 **공개 배포**된다. CONTENT.md의 "절대 넣지 않는 것"을 엄수한다.
   회사 실제 소스·테이블명·컬럼명·계정·접속 정보·내부 문서 원문 금지.
   코드 예시는 구조만 남기고 이름을 바꿔 각색한다.
2. 기존 호를 절대 수정하지 않는다. 추가만 한다:
   `src/data/issues.ts`(배열 맨 앞), `src/data/glossary.ts`(append),
   `src/data/drills.ts`(append).
3. `.github/`, `src/pages/`, `src/components/`, `src/lib/`, `astro.config.mjs`,
   `package.json`을 건드리지 않는다.
4. 발간 이슈가 하나도 없으면 1단계에서 조용히 종료한다 — 요약 파일만 쓰고,
   커밋도 이메일도 없다.
5. 문체는 평서형(`~한다`) 통일, 과장 금지("혁신적·강력한·완벽한" 사용 금지).
   버전·수치는 공식 문서로 확인한다. 확실하지 않으면 확실하지 않다고 쓴다.
6. 사용자 확인을 구하지 않는다. 판단은 이 문서의 기본값으로 스스로 내린다.

---

## 1단계: 발간 대상 수집

```bash
gh issue list --repo a7garden/pre-work --label publish --state open \
  --json number,title,body,createdAt --jq 'sort_by(.createdAt)'
```

- 0건 → `/tmp/oxi-reports/pre-work.md`에 "발간 대상 없음" 한 줄 기록 후 종료.
- 1건 이상 → 오래된 것부터 처리. 기본은 **1 이슈 = 1 호**.
  - 첫 호는 오늘 날짜, 이어지는 호는 하루씩 물려 잡는다
    (`new:issue`는 같은 날짜 중복을 거부한다).
  - 두 이슈가 명확히 같은 주제의 연장이면 한 호로 묶어도 된다. 애매하면 나눈다.

## 2단계: 컨텍스트 적재 (발간 시작 전 1회)

1. `CONTENT.md` 전문 — 저작 규칙과 문체.
2. `src/data/issues.ts`의 최근 3편 — 분량·블록 구성·문체 감각.
3. `src/data/blocks.ts` — 쓸 수 있는 블록 타입 목록.
4. 각 이슈의 원문 = title + body. "대충 적힌 중얼거림"으로 취급하고 풍부하게 확장한다.

## 3단계: 발간 (이슈당 1회)

1. **사실 확인**: 이슈가 가리키는 개념·기술의 공식 문서를 web_search / URL read로
   확인한다. 확인한 출처는 `link` 블록이나 본문 안에서 소개로 남긴다.
2. **뼈대 생성**:
   ```bash
   npm run new:issue
   # 같은 날짜 호가 이미 있으면: npm run new:issue -- YYYY-MM-DD (다음 날)
   ```
3. **본문 완성** — `src/data/issues.ts` 맨 앞의 뼈대를 채운다:
   - `title`: 짧고 기능적으로. 이탤릭·장식 문구 금지.
   - `dek`: 목록에 보일 한 줄 소개. 주제의 갈래를 한 문장으로.
   - `minutes`: 실제 분량 감으로 8~12.
   - `tags`: 기존 호의 태그 재사용 우선(태그 아카이브 일관성). 새 태그는 꼭 필요할 때만.
   - `takeaway` 한 문장부터 정하고 본문을 채운다.
   - `blocks`: p / list / callout / code / codeRead / flow / tree / table / terms /
     quiz / link 중 골라 **10분 안쪽** 분량으로. 표·흐름·퀴즈를 적재적소에.
   - `callout`은 반드시 "오늘 회사에서 해 볼 것" 한 가지, 확인 가능한 행동으로 끝낸다.
   - `next`: 내일 이어서 볼 것 한 줄.
   - `series`: 기존 호와 같은 흐름이면 기존 series 이름을 그대로 재사용한다.
     새 시리즈 이름은 주제가 명확히 이어질 때만.
4. **용어**: 본문의 핵심 개념이 `glossary.ts`에 없으면 추가한다.
   - `short`는 정의 한 줄(툴팁용). "왜 중요한가"는 `long`으로.
   - 두 글자 미만 등록 금지. 흔한 단어는 `noauto: true`.
   - 관련 훈련을 만들었다면 `see`로 연결.
5. **훈련**: 코드를 다루는 주제면 `drills.ts`에 훈련 1개 추가를 검토한다.
   level 1~3, `quiz`는 한두 개, 보기는 실제로 헷갈릴 만한 것으로.

## 4단계: 검증

```bash
npm run build   # astro build && pagefind
```

- 실패 → 데이터 파일의 타입/구문 오류를 고쳐 재빌드한다.
- 구조 문제로 고칠 수 없으면 **발간 중단**: 변경을 되돌린다
  (`git checkout -- src/data`), 이슈는 열어 둔다(다음 자정 재시도), 요약 파일에
  실패 원인을 기록하고 이메일로 보고한다.

## 5단계: 배포

```bash
git pull --rebase
git add src/data
git commit -m "feat: {no}호 발간 — {제목}"
git push origin main
```

- `pull --rebase` 충돌 시 발간 중단: 로컬 변경을 남기고 이슈를 열어 둔 채 보고한다.
- 배포 확인 (성공/실패 판정까지 최대 10분 폴링):
  ```bash
  gh run list --repo a7garden/pre-work --limit 1 --json status,conclusion,url
  ```
  실패로 끝나면 Actions 로그를 읽고 원인을 요약 파일과 이메일에 남긴다.
  (push는 되돌리지 않는다 — 원인 파악이 다음 수정의 입력이다.)

## 6단계: 이슈 종결

라이브 URL: `https://a7garden.github.io/pre-work/daily/{no}/`

```bash
gh issue close {N} --repo a7garden/pre-work \
  --comment "제{no}호로 발간했습니다: https://a7garden.github.io/pre-work/daily/{no}/"
```

## 7단계: 요약 파일 출력

```bash
mkdir -p /tmp/oxi-reports
cat > /tmp/oxi-reports/pre-work.md << 'ENDOFSUMMARY'
# pre-work — 발간 요약

## 발간한 호
- 제{no}호 {제목} (이슈 #{N})

## 추가된 용어/훈련
- glossary: {추가한 용어 id 목록 or 없음}
- drills: {추가한 훈련 id 목록 or 없음}

## 커밋 / 배포 상태
- {커밋 해시} / 배포 {성공|실패: 원인}
ENDOFSUMMARY
```

발간이 없던 날:

```bash
mkdir -p /tmp/oxi-reports
printf '# pre-work — 발간 요약\n\n발간 대상 없음 (%s)\n' "$(date +%F)" \
  > /tmp/oxi-reports/pre-work.md
```

## 8단계: 이메일 보고 (발간이 있었을 때만)

`send-email` 스킬을 로드하고 그 지침에 따라 보낸다.

- **수신:** `a7garden@icloud.com` (사용자 확인 완료, 2026-09-04)
- **제목:** `[pre-work] 제{no}호 발간 — {제목}`
- **본문:** 요약 파일 내용 + 라이브 URL

발간이 없던 날은 이메일을 보내지 않는다. 발간에 실패했을 때는 보낸다(원인 포함).
