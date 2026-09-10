/**
 * 코드 읽기 스프린트 = 읽기 훈련 한 판.
 * 새 스프린트는 `npm run new:sprint`로 뼈대를 만들고 이 배열 맨 앞(최신 자리)에 채운다.
 * 저작 규칙은 CONTENT.md의 "코드 읽기 스프린트" 절에 정리되어 있다.
 */

/** 주석의 종류 — 툴팁 머리에 칩으로 표시된다 */
export type AnnoKind = "syntax" | "idiom" | "concept" | "std";

export const annoKindLabels: Record<AnnoKind, string> = {
  syntax: "문법",
  idiom: "관용구",
  concept: "개념",
  std: "표준",
};

/** 코드 안의 조각에 붙는 툴팁 주석 */
export type Anno = {
  /** 코드에서 찾을 정확한 문자열. 한 행 안쪽이어야 한다 */
  find: string;
  /** 툴팁 제목 — 토큰이 무엇인지 한 호흡에 */
  title: string;
  /** 툴팁 본문 — 두세 문장. 길면 읽는 흐름이 끊긴다 */
  body: string;
  kind?: AnnoKind;
  /** (선택) 1부터 세는 행 번호 — 같은 조각이 여러 행에 있을 때 위치를 좁힌다 */
  line?: number;
  /** 모든 출처에 토큰을 심는다. 기본은 처음 나온 한 곳 */
  all?: boolean;
};

/** 마지막의 객관식 체크 — 읽은 코드로 바로 확인한다 */
export type Check = {
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Sprint = {
  no: number;
  /** YYYY.MM.DD — 하루에 여러 편이 나간다 */
  date: string;
  title: string;
  /** 목록에 나오는 한 줄 소개 */
  dek: string;
  minutes: number;
  /** 표시용 언어 이름 — "Go", "TypeScript", "SQL" */
  language: string;
  /** (선택) 프레임워크·라이브러리 — "React", "Django" */
  framework?: string;
  /** 분야 — 인덱스 필터 단위. 백엔드·프론트엔드·데이터·시스템·모바일·인프라 */
  domain: string;
  /** 코드를 펼치기 전에 던지는 읽기 과제 한 문장 */
  prompt: string;
  /** 원본 코드. 백틱과 ${는 이스케이프해야 한다 */
  code: string;
  annotations: Anno[];
  /** 오늘 하루 머리에 남기고 싶은 한 문장 */
  takeaway: string;
  check?: Check;
};

export const sprints: Sprint[] = [
  {
    no: 66,
    date: "2026.09.10",
    title: "Mojo, 파이썬 모양의 정적 세계",
    dek: "def와 fn이 나뉘는 지점. 파이썬 문법에서 시작해 타입이 정해지면 최적화가 열리는 언어다.",
    minutes: 3,
    language: "Mojo",
    domain: "시스템",
    prompt: "같은 더하기인데 두 함수의 차이는 어디서 오는가",
    code: `def add_loose(a, b):
    return a + b

fn add_strict(a: Int, b: Int) -> Int:
    return a + b

fn main():
    var n: Int = add_strict(2, 3)
    alias LIMIT = 8

    print(n, LIMIT)`,
    annotations: [
      {
        find: "def add_loose(a, b):",
        title: "느슨한 def",
        body: "파이썬과 같은 동작을 하는 느슨 모드다. 타입 선언이 없어도 되고 결정이 실행 중으로 미뤄진다 — 파이썬 코드를 옮겨 올 때의 출발점이다.",
        kind: "concept",
      },
      {
        find: "fn add_strict(a: Int, b: Int) -> Int:",
        title: "엄격한 fn",
        body: "타입이 필수이고 인자는 기본으로 불변이다. 타입이 정적으로 결정되므로 컴파일러가 검사하고 최적화할 수 있다. -> Int는 반환 타입 선언이다.",
        kind: "concept",
      },
      {
        find: "var n: Int =",
        title: "변수 선언",
        body: "var로 새 변수를 선언한다. 타입을 명시할 수도 있고 초깃값에서 추론하게 할 수도 있다.",
        kind: "syntax",
      },
      {
        find: "alias LIMIT = 8",
        title: "컴파일 시간 상수",
        body: "alias는 컴파일 때 값이 정해지는 상수다. 실행 중에 바뀌지 않고, 정적 계산과 제네릭의 재료가 된다.",
        kind: "syntax",
      },
      {
        find: "fn main():",
        title: "프로그램 진입점",
        body: "mojo run이 호출하는 진입점이다. 스크립트로 짠 def 함수들과 달리 프로그램은 fn main에서 시작한다.",
        kind: "std",
      },
    ],
    takeaway: "Mojo는 파이썬 모양으로 시작해 fn으로 정적 세계에 들어선다 — 타입이 정해지는 순간 최적화가 열린다.",
    check: {
      question: "성능이 중요한 함수를 fn으로 고쳤을 때 이득의 근거는 무엇인가?",
      options: [
        "함수 이름이 짧아져서",
        "타입이 컴파일때 결정돼 검사와 최적화가 가능해서",
        "파이썬 라이브러리를 더 쓸 수 있어서",
      ],
      answer: 1,
      explain: "타입과 불변성이 정해지면 컴파일러가 오버로드 해소·메모리 배치·인라인을 정적으로 결정한다. def는 파이썬 의미론을 유지하는 대신 이 정보가 실행까지 미뤄진다.",
    },
  },
  {
    no: 65,
    date: "2026.09.10",
    title: "터미널에서 찾아 지우기 — find·xargs",
    dek: "조건으로 파일을 찾고 곧바로 실행까지. 공백 섞인 파일명 앞에서 이 조합이 왜 안전한지 본다.",
    minutes: 3,
    language: "Shell",
    domain: "시스템",
    prompt: "파일명에 공백이 섞여 있어도 이 조합이 안전한 이유는 무엇인가",
    code: `# 30일 넘은 임시 파일 찾기
$ find . -type f -name "*.tmp" -mtime +30
./build/cache/old.tmp
./dist/legacy.tmp

# 공백 섞인 이름까지 안전하게 한 번에 지우기
$ find . -type f -name "*.tmp" -mtime +30 -print0 | xargs -0 rm

# 10MB 넘는 파일 크기와 함께 보기
$ find . -type f -size +10M -exec du -h {} +
1.5G	./data/dump.bin`,
    annotations: [
      {
        find: "find . -type f",
        title: "탐색 시작점과 대상",
        body: "첫 인자는 출발할 디렉터리다. -type f는 파일만, -type d는 디렉터리만 걸러 낸다.",
        kind: "syntax",
      },
      {
        find: "-name \"*.tmp\"",
        title: "이름 패턴",
        body: "glob 패턴으로 이름을 고른다. 따옴표는 셸이 패턴을 먼저 풀어 버리는 일을 막는다 — 붙이는 습관이 필수다.",
        kind: "syntax",
      },
      {
        find: "-mtime +30",
        title: "수정 시간 필터",
        body: "마지막 수정이 30일보다 오래된 파일이다. +는 초과, -는 미만, 숫자만 쓰면 그 기간이다.",
        kind: "syntax",
      },
      {
        find: "-print0 | xargs -0 rm",
        title: "널 문자로 잇기",
        body: "print0이 파일명을 널 문자로 구분해 내보내고 xargs -0이 같은 기준으로 받는다. 공백·줄바꿈이 섞인 이름도 하나의 인자로 지켜진다.",
        kind: "idiom",
      },
      {
        find: "-exec du -h {} +",
        title: "찾은 대상 바로 실행",
        body: "{} 자리에 경로가 들어가고 +는 여러 파일을 한 명령에 몰아 넣는다. 파일마다 프로세스를 나누는 \\;보다 경제적이다.",
        kind: "syntax",
      },
    ],
    takeaway: "찾기와 실행을 잇을 때는 널 문자로 — 공백은 언제나 방심하는 자리다.",
    check: {
      question: "-print0과 -0을 빼고 find … | xargs rm으로 넘기면 어떤 일이 벌어질 수 있는가?",
      options: [
        "공백 포함 파일명이 여러 인자로 쪼개져 엉뚱한 파일이 지워질 수 있다",
        "find가 오류를 내고 멈춘다",
        "숨은 파일만 빠뜨리고 지워진다",
      ],
      answer: 0,
      explain: "구분자가 공백인 채로 넘어가면 ./my report.tmp는 두 인자로 쪼개진다. -print0과 -0의 널 구분이 이 조합의 안전판이다.",
    },
  },
  {
    no: 64,
    date: "2026.09.10",
    title: "tar 플래그는 세트로 외운다",
    dek: "묶고·훑고·풀기. c·x·t 하나만 갈리고 z·f는 같다는 사실이 tar의 전부다.",
    minutes: 2,
    language: "Shell",
    domain: "시스템",
    prompt: "받은 묶음을 서버에 풀기 전에 무엇부터 해야 하는가",
    code: `# 디렉터리를 gzip으로 묶기
$ tar -czf release.tar.gz dist/

# 내용 확인 — 풀기 전에 반드시 훑는다
$ tar -tzf release.tar.gz
dist/
dist/index.html
dist/assets/app.js

# 지정한 디렉터리에 풀기
$ tar -xzf release.tar.gz -C /srv/app`,
    annotations: [
      {
        find: "-czf",
        title: "묶기 플래그",
        body: "c는 만들기, z는 gzip, f는 파일명이다. 붙여 쓰되 f 바로 다음에 파일명이 와야 한다.",
        kind: "syntax",
      },
      {
        find: "-tzf",
        title: "목록 보기",
        body: "t는 묶음 안을 나열한다. 풀기 전에 한 번 훑는 습관이 경로 덮어쓰기 사고를 막는다.",
        kind: "idiom",
      },
      {
        find: "-xzf",
        title: "풀기 플래그",
        body: "x가 추출이다. c와 x만 갈리고 z·f는 같다 — 세트로 외우면 된다.",
        kind: "syntax",
      },
      {
        find: "-C /srv/app",
        title: "대상 디렉터리",
        body: "지정한 디렉터리로 이동한 뒤 푼다. 경로가 없다면 mkdir이 먼저다.",
        kind: "syntax",
      },
      {
        find: "release.tar.gz",
        title: "묶음 파일명",
        body: "tar로 묶고 gzip으로 눌렀다는 뜻이 이름에 겹쳐 있다. tar만이면 .tar, gzip만이면 .gz다.",
        kind: "std",
        all: true,
      },
    ],
    takeaway: "압축 풀기의 첫 단계는 t다 — 목록을 훑어야 덮어쓰기 사고를 막는다.",
    check: {
      question: "tar -xzf를 홈 디렉터리에서 무심코 돌리면 어떤 일이 벌어질 수 있는가?",
      options: [
        "묶음 안 경로 그대로 현재 위치에 풀려 기존 파일을 덮어쓸 수 있다",
        "항상 지정한 /srv로만 풀린다",
        "형식 검사에 실패해 멈춘다",
      ],
      answer: 0,
      explain: "tar는 묶음 안의 상대 경로를 그대로 따른다. 같은 이름의 파일이 있으면 물어보지 않고 덮는다 — tzf로 목록부터 보는 것이 원칙이다.",
    },
  },
  {
    no: 63,
    date: "2026.09.10",
    title: "권한 숫자는 4·2·1의 합",
    dek: "chmod 755를 숫자로 읽는 연습. 재귀할 때의 X 대문자와 소유권 이동까지.",
    minutes: 3,
    language: "Shell",
    domain: "시스템",
    prompt: "755의 가운데 자리 5는 무엇을 더한 값인가",
    code: `# 스크립트에 실행 권한 더하기
$ chmod +x deploy.sh

# 소유자 읽기·쓰기·실행, 그룹과 나머지는 읽기만
$ chmod 755 deploy.sh

# 문서 전체를 소유자만 쓰고, 디렉터리는 들어갈 수 있게
$ chmod -R u=rwX,g=r,o= docs/

# 소유자와 그룹 옮기기
$ chown deploy:deploy /srv/app`,
    annotations: [
      {
        find: "chmod +x",
        title: "실행 권한 추가",
        body: "+x는 실행 비트를 더한다. 스크립트는 읽기만으로는 돌아가지 않는다.",
        kind: "syntax",
      },
      {
        find: "chmod 755",
        title: "숫자 권한",
        body: "r=4, w=2, x=1을 자리마다 더한다. 7=rwx, 5=r-x — 세 자리는 소유자·그룹·나머지 순서다.",
        kind: "concept",
      },
      {
        find: "chmod -R",
        title: "재귀 적용",
        body: "디렉터리 아래 전체에 적용한다. 시스템 경로에서 무심코 쓰면 권한 체계가 통째로 흔들린다 — 실행 전 경로를 다시 본다.",
        kind: "syntax",
      },
      {
        find: "u=rwX,g=r,o=",
        title: "대상별 지정",
        body: "u·g·o가 자리고 X(대문자)는 디렉터리에만 실행 권한을 준다 — 재귀 때 파일까지 실행 가능해지는 사고를 막는다. o=는 나머지 권한을 뺀다는 뜻이다.",
        kind: "idiom",
      },
      {
        find: "chown deploy:deploy",
        title: "소유권 이동",
        body: "소유자:그룹을 바꾼다. 권한(chmod)과 소유권(chown)은 별개의 일이다.",
        kind: "syntax",
      },
    ],
    takeaway: "숫자 권한은 4·2·1의 합이다 — 자리마다 더하면 읽기·쓰기·실행이 된다.",
    check: {
      question: "644는 어떤 권한인가?",
      options: [
        "소유자는 읽기·쓰기, 그룹과 나머지는 읽기만",
        "모두가 읽기·쓰기·실행",
        "소유자만 실행 가능",
      ],
      answer: 0,
      explain: "6=4+2는 읽기·쓰기, 4는 읽기만이다. 웹 서버의 정적 파일 권한으로 흔히 쓰는 조합이다.",
    },
  },
  {
    no: 62,
    date: "2026.09.10",
    title: "멀티스테이지 Dockerfile",
    dek: "빌드 도구는 버리고 산물만 옮긴다.",
    minutes: 2,
    language: "Dockerfile",
    domain: "인프라",
    prompt: "소스만 고쳐 다시 빌드하면 어느 줄부터 다시 실행될지 따라가 보자.",
    code: `FROM golang:1.23 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/app

FROM gcr.io/distroless/static-debian12
COPY --from=build /out/app /app
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/app"]`,
    annotations: [
      {
        find: "AS build",
        title: "스테이지 이름",
        body: "첫 스테이지에 build라는 이름을 붙였다. 뒤에서 --from=build로 이 스테이지의 파일을 가져온다.",
        kind: "syntax",
      },
      {
        find: "COPY go.mod go.sum ./",
        title: "캐시 분리",
        body: "의존성 정의 파일만 소스보다 먼저 복사한다. 매니페스트가 그대로면 go mod download 레이어가 캐시로 재사용된다.",
        kind: "idiom",
      },
      {
        find: "CGO_ENABLED=0",
        title: "정적 빌드",
        body: "C 라이브러리 연결을 끊고 순수 정적 바이너리를 만든다. 별도 런타임 라이브러리 없이 실행되는 산물이 나온다.",
        kind: "idiom",
      },
      {
        find: "FROM gcr.io/distroless/static-debian12",
        title: "실행 스테이지",
        body: "셸도 패키지 관리자도 없는 최소 이미지다. 컴파일러와 소스, 캐시는 최종 이미지에 포함되지 않는다.",
        kind: "concept",
      },
      {
        find: "COPY --from=build",
        title: "스테이지 간 복사",
        body: "build 스테이지에서 파일을 가져온다. 산물인 바이너리 하나만 옮기는 게 멀티스테이지의 핵심이다.",
        kind: "syntax",
      },
      {
        find: "USER nonroot:nonroot",
        title: "비특권 실행",
        body: "루트가 아닌 사용자로 프로세스를 돌린다. 컨테이너가 침해당해도 안에서 할 수 있는 일이 줄어든다.",
        kind: "concept",
      },
      {
        find: "ENTRYPOINT [\"/app\"]",
        title: "exec 형식",
        body: "배열 형태는 셸을 거치지 않고 /app를 PID 1로 띄운다. 종료 시그널이 프로세스에 곧장 전달된다.",
        kind: "syntax",
      },
    ],
    takeaway: "멀티스테이지는 빌드 환경과 실행 환경을 분리해 최종 이미지를 줄인다.",
    check: {
      question: "소스 코드만 고쳐 다시 빌드하면 어느 레이어부터 다시 실행될까?",
      options: [
        "go mod download까지는 캐시로 재사용되고 COPY . .부터 다시 실행된다",
        "모든 레이어가 처음부터 다시 실행된다",
        "RUN go build만 다시 실행된다",
      ],
      answer: 0,
      explain: "go.mod와 go.sum이 바뀌지 않았으므로 그 파일을 복사한 레이어와 go mod download 레이어는 캐시 히트다. 소스를 복사하는 COPY . .부터 레이어가 다시 만들어진다.",
    },
  },
  {
    no: 61,
    date: "2026.09.10",
    title: "GitHub Actions 잡 연결",
    dek: "needs와 if로 배포 잡의 실행 조건을 만든다.",
    minutes: 3,
    language: "YAML",
    framework: "GitHub Actions",
    domain: "인프라",
    prompt: "deploy 잡이 시작되기까지 어떤 조건을 통과해야 할지 따라가 보자.",
    code: `on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh`,
    annotations: [
      {
        find: "on:",
        title: "트리거",
        body: "어떤 이벤트에 워크플로를 실행할지 정한다. push와 pull_request가 대표적이고 schedule로 주기 실행도 붙일 수 있다.",
        kind: "syntax",
      },
      {
        find: "timeout-minutes: 10",
        title: "잡 타임아웃",
        body: "10분 안에 끝나지 않으면 잡을 실패로 끝낸다. 매달린 잡이 러너를 계속 점유하는 일을 막는다.",
        kind: "syntax",
      },
      {
        find: "actions/checkout@v4",
        title: "액션 호출",
        body: "uses는 재사용 가능한 액션을 스텝으로 실행한다. checkout은 저장소 코드를 러너 작업 디렉터리에 내려놓는 기본 액션이다.",
        kind: "std",
      },
      {
        find: "needs: test",
        title: "잡 의존",
        body: "test가 성공해야 deploy를 시작한다. needs가 없으면 잡은 서로 독립적으로 병렬 실행된다.",
        kind: "concept",
      },
      {
        find: "if: github.event_name == 'push' && github.ref == 'refs/heads/main'",
        title: "컨텍스트 조건",
        body: "github 컨텍스트에는 이벤트 종류, 브랜치, 커밋 같은 실행 정보가 담긴다. if의 조건식은 별도 문법 없이 곧바로 평가되며 거짓이면 잡을 건너뛴다.",
        kind: "concept",
      },
      {
        find: "runs-on: ubuntu-latest",
        title: "러너 지정",
        body: "잡이 돌아갈 가상 머신을 고른다. ubuntu-latest는 GitHub이 운영하는 호스팅 러너 레이블이다.",
        kind: "syntax",
      },
      {
        find: "environment: production",
        title: "배포 환경",
        body: "환경 단위로 승인자와 보호 규칙을 걸 수 있다. 이 잡에서 쓰는 시크릿도 production 환경에 묶인 것을 따른다.",
        kind: "concept",
      },
    ],
    takeaway: "needs가 순서를 만들고 if가 맥락으로 조건을 거른다.",
    check: {
      question: "deploy 잡이 실제로 시작하려면 참이어야 하는 조건은?",
      options: [
        "test 잡과 병렬로 항상 실행된다",
        "test 성공 + push 이벤트 + main 브랜치",
        "environment 승인만 있으면 된다",
      ],
      answer: 1,
      explain: "needs: test가 test 성공을 앞 조건으로 걸고, if가 push 이벤트이면서 main 브랜치일 때만 통과시킨다. 둘 중 하나라도 아니면 잡은 건너뛴다.",
    },
  },
  {
    no: 60,
    date: "2026.09.10",
    title: "Deployment 프로브",
    dek: "준비 프로브와 활성 프로브는 하는 일이 다르다.",
    minutes: 3,
    language: "YAML",
    framework: "Kubernetes",
    domain: "인프라",
    prompt: "readinessProbe 실패와 livenessProbe 실패가 파드에 주는 결과가 어떻게 다를지 보자.",
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: web:1.8.2
          readinessProbe:
            httpGet: { path: /healthz, port: 8080 }
          livenessProbe:
            httpGet: { path: /healthz, port: 8080 }
            failureThreshold: 3`,
    annotations: [
      {
        find: "kind: Deployment",
        title: "선언형 컨트롤러",
        body: "Deployment는 파드 복제본 수와 롤아웃을 관리하는 컨트롤러다. 여기 적힌 상태를 맞추는 건 매니페스트가 아니라 컨트롤러의 몫이다.",
        kind: "concept",
      },
      {
        find: "replicas: 3",
        title: "복제본 수",
        body: "유지할 파드 개수다. 파드가 사라지면 이 수를 맞추려고 새 파드를 띄운다.",
        kind: "syntax",
      },
      {
        find: "matchLabels:",
        title: "셀렉터",
        body: "이 Deployment가 관리할 파드를 라벨로 고르는 조건이다. 아래 파드 템플릿의 labels와 다르면 매니페스트 적용이 거부된다.",
        kind: "concept",
      },
      {
        find: "labels:",
        title: "파드 라벨",
        body: "이 템플릿으로 만들어지는 파드에 붙는 라벨이다. 위의 matchLabels와 짝을 이뤄 Deployment와 파드를 연결한다.",
        kind: "concept",
      },
      {
        find: "readinessProbe:",
        title: "준비 프로브",
        body: "실패해도 컨테이너를 재시작하지 않고 트래픽 대상에서만 빼낸다. Service는 이 프로브를 통과한 파드에만 요청을 보낸다.",
        kind: "concept",
      },
      {
        find: "livenessProbe:",
        title: "활성 프로브",
        body: "정해진 횟수만큼 연속 실패하면 kubelet이 컨테이너를 재시작한다. 응답하지 않는 프로세스를 되살리는 역할이다.",
        kind: "concept",
      },
      {
        find: "httpGet:",
        title: "HTTP 프로브",
        body: "지정 경로에 GET 요청을 보내 2xx나 3xx 응답을 성공으로 본다. 두 프로브가 같은 헬스 경로를 쓰는 건 흔한 구성이다.",
        kind: "std",
      },
      {
        find: "failureThreshold: 3",
        title: "실패 임계",
        body: "3회 연속 실패해야 실패로 판정한다. 일시적인 네트워크 흔들림에 바로 조치하지 않게 하는 여유다.",
        kind: "syntax",
      },
    ],
    takeaway: "readiness는 트래픽을 차단하고 liveness는 재시작한다 — 프로브 두 개는 역할이 다르다.",
    check: {
      question: "readinessProbe가 계속 실패하는 파드에 일어나는 일은?",
      options: [
        "kubelet이 컨테이너를 재시작한다",
        "트래픽 대상에서 빠지지만 컨테이너는 그대로다",
        "Deployment가 replicas를 늘려 대체 파드를 만든다",
      ],
      answer: 1,
      explain: "readiness 실패는 준비가 안 됐다는 뜻이고, Service는 이 파드로 요청을 보내지 않는다. 재시작은 livenessProbe의 역할이다. replicas는 파드 수를 유지할 뿐 프로브 결과로 바꾸지 않는다.",
    },
  },
  {
    no: 59,
    date: "2026.09.10",
    title: "Terraform 리소스 참조",
    dek: "리소스 주소로 다른 리소스의 값을 끌어온다.",
    minutes: 3,
    language: "Terraform",
    domain: "인프라",
    prompt: "aws_s3_bucket.uploads.id의 값이 언제 생기는지 상상하며 읽자.",
    code: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_s3_bucket" "uploads" {
  bucket = "app-uploads-prod"
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}`,
    annotations: [
      {
        find: "required_providers",
        title: "프로바이더 선언",
        body: "테라폼이 인프라를 다룰 때 쓰는 프로바이더 플러그인을 선언한다. 버전 제약을 함께 적어 팀마다 다른 버전으로 상태가 갈라지는 일을 막는다.",
        kind: "concept",
      },
      {
        find: "version = \"~> 5.0\"",
        title: "버전 제약",
        body: "~>는 지정한 버전 이상이면서 왼쪽 자리 숫자는 고정하는 제약이다. ~> 5.0은 5.x는 모두 받지만 6.0은 받지 않는다.",
        kind: "syntax",
      },
      {
        find: "resource \"aws_s3_bucket\" \"uploads\"",
        title: "리소스 블록",
        body: "resource 뒤의 두 라벨은 리소스 타입과 이름이다. 둘을 이어 붙인 aws_s3_bucket.uploads가 코드 안에서 이 리소스의 주소가 된다.",
        kind: "syntax",
      },
      {
        find: "bucket = \"app-uploads-prod\"",
        title: "설정 인수",
        body: "리소스가 받는 설정 값이다. 여기선 고정 문자열이지만 실무에서는 variable로 빼 환경별로 갈아 끼우는 경우가 많다.",
        kind: "concept",
      },
      {
        find: "aws_s3_bucket.uploads.id",
        title: "리소스 참조",
        body: "다른 리소스의 속성을 타입.이름.속성 형태로 끌어온다. 테라폼은 이 참조로 의존 그래프를 그려 버킷을 먼저 만들고 버저닝 설정을 나중에 적용한다.",
        kind: "idiom",
      },
      {
        find: "versioning_configuration",
        title: "중첩 블록",
        body: "리소스 블록 안에 설정을 묶는 HCL의 중첩 구조다. 하위 기능 단위로 블록을 나눠 표현한다.",
        kind: "syntax",
      },
    ],
    takeaway: "테라폼 참조는 타입.이름.속성 주소로 의존 그래프를 만들고 생성 순서까지 정한다.",
    check: {
      question: "aws_s3_bucket.uploads.id의 값은 언제 채워질까?",
      options: [
        "uploads 버킷 리소스가 실제로 만들어진 뒤, apply 과정에서",
        "terraform plan을 돌리는 즉시 로컬에서",
        "versioning_configuration 블록이 먼저 만들어진 뒤",
      ],
      answer: 0,
      explain: "참조는 다른 리소스가 실제로 만들어진 뒤에야 값이 정해진다. 테라폼이 이 참조로 의존 그래프를 그려 버킷을 먼저 만들고 버저닝 설정을 나중에 적용한다.",
    },
  },
  {
    no: 58,
    date: "2026.09.10",
    title: "워커 메시징",
    dek: "페이지와 워커가 메시지로 주고받는 흐름을 양쪽 파일로 나눠 읽는다.",
    minutes: 3,
    language: "JavaScript",
    framework: "Web Workers",
    domain: "프론트엔드",
    prompt: "reduce가 만 개짜리 목록을 만나도 클릭 반응이 멈추지 않는 이유를 두 파일이 나뉜 지점에서 찾아 보라",
    code: `// main.js — 페이지 쪽
const worker = new Worker("sum-worker.js");

button.addEventListener("click", () => {
  worker.postMessage({ type: "sum", numbers: [1, 2, 3, 4] });
});

worker.onmessage = (e) => {
  result.textContent = e.data.total;
};

// sum-worker.js — 워커 쪽
self.onmessage = (e) => {
  if (e.data.type !== "sum") return;
  const total = e.data.numbers.reduce((a, b) => a + b, 0);
  self.postMessage({ type: "result", total });
};`,
    annotations: [
      {
        find: "new Worker(\"sum-worker.js\");",
        title: "워커 생성",
        body: "별도 스레드에서 돌 스크립트를 붙인다. 워커의 계산은 페이지의 클릭·렌더링을 막지 않는다.",
        kind: "std",
      },
      {
        find: "worker.postMessage({ type: \"sum\", numbers: [1, 2, 3, 4] });",
        title: "메시지 보내기",
        body: "값을 워커로 복사해 보낸다. 객체는 구조화 복사로 전달되어 양쪽이 같은 객체를 공유하지 않는다.",
        kind: "std",
      },
      {
        find: "worker.onmessage = (e) => {",
        title: "응답 수신",
        body: "워커가 보낸 메시지가 도착하면 부른다. e.data에 복사된 본문이 담긴다.",
        kind: "std",
      },
      {
        find: "self.onmessage = (e) => {",
        title: "워커 쪽 수신",
        body: "워커의 전역인 self에 리스너를 건다. 페이지에서 보낸 메시지가 여기로 도착한다.",
        kind: "std",
      },
      {
        find: "if (e.data.type !== \"sum\") return;",
        title: "종류 분기",
        body: "type 태그로 메시지 종류를 가르는 관용구다. 한 워커가 여러 작업을 맡을 때 갈래를 나눈다.",
        kind: "idiom",
      },
      {
        find: "e.data.numbers.reduce((a, b) => a + b, 0);",
        title: "워커 안의 계산",
        body: "이 코드는 메인 스레드와 다른 스레드에서 돈다. 목록이 길어도 페이지 입력은 멈추지 않는다.",
        kind: "concept",
      },
      {
        find: "self.postMessage({ type: \"result\", total });",
        title: "결과 되돌리기",
        body: "계산 결과를 페이지로 돌려보낸다. 워커에는 DOM이 없으므로 값만 보내고 그리기는 페이지가 맡는다.",
        kind: "std",
      },
    ],
    takeaway: "워커와 페이지는 복사된 메시지로만 대화한다 — 계산은 워커에, DOM은 메인에.",
    check: {
      question: "워커의 postMessage로 numbers 배열을 보냈을 때 옳은 설명은?",
      options: [
        "워커가 받은 배열은 복사본이라 원본과 영향을 주고받지 않는다",
        "같은 참조라 워커가 고치면 페이지 배열도 바뀐다",
        "배열은 문자열로 바뀌어 전달된다",
      ],
      answer: 0,
      explain: "postMessage는 구조화 복사로 값을 복사해 전달한다. 복사본이 도착하므로 한쪽이 고쳐도 다른 쪽은 그대로다.",
    },
  },
  {
    no: 57,
    date: "2026.09.10",
    title: "fetch와 중단",
    dek: "ok 확인, abort 취소, AbortError 구별까지 요청 하나의 온전한 흐름을 읽는다.",
    minutes: 3,
    language: "JavaScript",
    domain: "프론트엔드",
    prompt: "취소 버튼이 눌린 순간 대기 중인 요청과 이어지는 코드들이 각각 어떻게 되는지 따라 가 보라",
    code: `const controller = new AbortController();

document.querySelector("#cancel").addEventListener("click", () => {
  controller.abort();
});

async function loadSummary(id) {
  const res = await fetch("/api/summaries/" + id, {
    signal: controller.signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error("요약을 불러오지 못했다: " + res.status);
  }
  return res.json();
}

loadSummary(42).catch((err) => {
  if (err.name === "AbortError") return;
  console.error(err);
});`,
    annotations: [
      {
        find: "new AbortController();",
        title: "중단 컨트롤러",
        body: "요청을 도중에 끊게 해 주는 컨트롤러다. 컨트롤러 하나로 여러 요청을 함께 중단할 수도 있다.",
        kind: "std",
      },
      {
        find: "controller.abort();",
        title: "중단 신호",
        body: "signal에 연결된 동작을 끊는다. 진행 중이던 fetch는 AbortError라는 이름의 예외로 거절된다.",
        kind: "std",
      },
      {
        find: "signal: controller.signal,",
        title: "신호 연결",
        body: "이 요청을 컨트롤러에 묶는다. 신호를 건 요청만 abort의 영향을 받는다.",
        kind: "concept",
      },
      {
        find: "if (!res.ok)",
        title: "상태 확인",
        body: "fetch는 404·500도 예외로 만들지 않는다. ok는 2xx일 때만 참이라 직접 확인해야 한다.",
        kind: "idiom",
      },
      {
        find: "throw new Error(\"요약을 불러오지 못했다: \" + res.status);",
        title: "실패 승격",
        body: "상태 코드를 붙여 예외로 던진다. 실패 판정을 한곳에 모아 호출 쪽 catch가 처리하게 한다.",
        kind: "idiom",
      },
      {
        find: "res.json();",
        title: "본문 해석",
        body: "본문을 읽어 JSON으로 해석하는 약속을 돌려준다. 응답 본문은 한 번만 읽을 수 있다.",
        kind: "std",
      },
      {
        find: "err.name === \"AbortError\"",
        title: "중단과 실패 구별",
        body: "취소로 끝난 요청과 진짜 오류를 이름으로 가른다. 취소는 조용히 넘기고 오류만 기록한다.",
        kind: "idiom",
      },
    ],
    takeaway: "fetch는 상태 코드를 예외로 만들지 않는다 — ok 확인과 AbortError 구별이 기본이다.",
    check: {
      question: "요청이 진행 중일 때 취소 버튼을 누르면 loadSummary 쪽에서 무엇이 일어나는가?",
      options: [
        "AbortError로 거절되어 catch에서 조용히 무시된다",
        "res.ok가 거짓이 되어 Error를 던진다",
        "빈 응답을 돌려받아 json이 null이 된다",
      ],
      answer: 0,
      explain: "abort는 요청을 AbortError라는 이름의 예외로 거절시킨다. 코드는 이 이름을 확인해 취소는 무시하고 다른 오류만 기록한다.",
    },
  },
  {
    no: 56,
    date: "2026.09.10",
    title: "최소 렌더 루프",
    dek: "지우고 그리고 예약하는 세 동작이 프레임마다 도는 최소 렌더 루프다.",
    minutes: 2,
    language: "JavaScript",
    domain: "프론트엔드",
    prompt: "루프가 이어지는 지점이 어디인지, 그리고 없다면 몇 프레임 만에 끝날지 따져 보라",
    code: `const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let x = 0;

function frame(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#2563eb";
  ctx.beginPath();
  ctx.arc(x, 40, 12, 0, Math.PI * 2);
  ctx.fill();

  x = (x + 2) % canvas.width;
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);`,
    annotations: [
      {
        find: "canvas.getContext(\"2d\")",
        title: "드로잉 컨텍스트",
        body: "그리기 명령을 받는 2D 컨텍스트를 꺼낸다. 이후 fillStyle·beginPath 등은 모두 이 객체의 메서드다.",
        kind: "std",
      },
      {
        find: "function frame(now)",
        title: "프레임 콜백",
        body: "화면 한 장을 그리는 함수다. now는 호출 시각 타임스탬프라 시간 기반 움직임에 쓸 수 있다.",
        kind: "concept",
      },
      {
        find: "ctx.clearRect(0, 0, canvas.width, canvas.height);",
        title: "화면 지우기",
        body: "캔버스 전체를 투명하게 지운다. 지우지 않으면 이전 프레임 위에 계속 겹쳐 그려진다.",
        kind: "idiom",
      },
      {
        find: "ctx.beginPath();",
        title: "경로 열기",
        body: "새 경로를 시작한다. 이 호출이 없으면 이전에 만든 경로에 도형이 계속 쌓인다.",
        kind: "std",
      },
      {
        find: "ctx.arc(x, 40, 12, 0, Math.PI * 2);",
        title: "원 추가",
        body: "중심과 반지름, 시작과 끝 각도로 호를 경로에 추가한다. 각도 단위는 라디안이고 2파이면 완전한 원이다.",
        kind: "syntax",
      },
      {
        find: "x = (x + 2) % canvas.width;",
        title: "위치 갱신",
        body: "매 프레임 2px씩 옮기고 너비를 넘으면 나머지로 처음으로 되돌린다. 프레임 간격이 달라지면 실제 속도도 달라진다.",
        kind: "idiom",
      },
      {
        find: "requestAnimationFrame(frame);",
        title: "다음 프레임 예약",
        body: "다음 화면 갱신 시점에 frame을 다시 부르도록 예약한다. 이 예약이 프레임마다 이어지며 루프가 된다.",
        kind: "concept",
      },
    ],
    takeaway: "렌더 루프는 지우고, 그리고, 다음 프레임을 예약하는 세 동작의 반복이다.",
    check: {
      question: "requestAnimationFrame(frame) 줄을 지우면 이 애니메이션은 어떻게 되는가?",
      options: [
        "한 프레임만 그리고 끝난다",
        "지금 속도로 계속 달린다",
        "브라우저가 알아서 루프를 돌린다",
      ],
      answer: 0,
      explain: "루프는 다음 프레임 예약이 매번 이어질 때만 유지된다. 예약이 없으면 frame은 한 번 부른 뒤 끝난다.",
    },
  },
  {
    no: 55,
    date: "2026.09.10",
    title: "viewBox와 path",
    dek: "viewBox 좌표계와 path 명령, defs 재료 참조로 아이콘 한 장을 읽는다.",
    minutes: 2,
    language: "SVG",
    domain: "프론트엔드",
    prompt: "같은 좌표 그림을 width 96으로 키우면 무엇이 함께 커지는지 viewBox와 좌표의 관계에서 찾아 보라",
    code: `<svg viewBox="0 0 24 24" width="48" height="48"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="앞으로">
  <title>앞으로 가기</title>

  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f8fafc" />
      <stop offset="1" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>

  <circle cx="12" cy="12" r="11" fill="url(#bg)" stroke="#475569" stroke-width="1" />
  <path d="M8 12 H16 M16 12 L12.5 8.5 M16 12 L12.5 15.5"
        fill="none" stroke="#475569" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>`,
    annotations: [
      {
        find: "viewBox=\"0 0 24 24\"",
        title: "내부 좌표계",
        body: "그림을 그리는 좌표 공간을 min-x min-y 폭 높이로 정한다. 화면 크기와 달라도 비율에 맞춰 늘어나 그려진다.",
        kind: "concept",
      },
      {
        find: "width=\"48\" height=\"48\"",
        title: "화면 크기",
        body: "요소가 차지하는 실제 크기다. 좌표계 24칸을 48px에 그리니 좌표 하나가 2px가 된다.",
        kind: "syntax",
      },
      {
        find: "<defs>",
        title: "재료 보관",
        body: "직접 그리지 않는 정의를 모아 둔다. 그라디언트 같은 재료를 만들어 두고 id로 꺼내 쓴다.",
        kind: "std",
      },
      {
        find: "url(#bg)",
        title: "재료 참조",
        body: "defs에 만든 그라디언트를 id로 가져와 채운다. url(#아이디) 형태가 문서 안 참조의 관용이다.",
        kind: "idiom",
      },
      {
        find: "d=\"M8 12 H16 M16 12 L12.5 8.5 M16 12 L12.5 15.5\"",
        title: "경로 명령",
        body: "M은 펜을 옮기고 L은 직선, H는 수평선이다. M이 다시 나오면 선을 끊고 새 점에서 시작하는 별도 갈래다.",
        kind: "concept",
      },
      {
        find: "stroke-width=\"2\"",
        title: "선 굵기",
        body: "경로를 그릴 선의 두께다. fill=\"none\"과 함께 써 윤곽선만 남긴다.",
        kind: "syntax",
      },
      {
        find: "stroke-linecap=\"round\"",
        title: "선 끝 마감",
        body: "선의 끝을 둥글게 마감한다. butt·round·square 가운데 아이콘에서는 round가 흔하다.",
        kind: "std",
      },
    ],
    takeaway: "viewBox는 내부 좌표계이고 width·height는 화면 크기 — 둘의 비율이 스케일을 정한다.",
    check: {
      question: "viewBox를 0 0 48 48로 바꾸고 width·height는 48로 두면 어떻게 되는가?",
      options: [
        "같은 좌표의 그림이 절반 크기로 그려진다",
        "그림은 그대로고 선만 두 배가 된다",
        "좌표가 두 배로 늘어난다",
      ],
      answer: 0,
      explain: "viewBox는 내부 좌표계의 크기다. 좌표계가 넓어지면 같은 좌표가 차지하는 화면 비율이 줄어 절반 크기로 보인다.",
    },
  },
  {
    no: 54,
    date: "2026.09.10",
    title: "커스텀 엘리먼트 콜백",
    dek: "속성 변화와 문서 삽입에 반응하는 콜백이 같은 render로 모이는 구조다.",
    minutes: 3,
    language: "JavaScript",
    framework: "Web Components",
    domain: "프론트엔드",
    prompt: "value 속성이 바뀌면 화면은 누가 다시 그리는지 콜백의 호출 경로를 따라 가 보라",
    code: `class CountBadge extends HTMLElement {
  static observedAttributes = ["value"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  render() {
    const n = this.getAttribute("value") ?? "0";
    this.shadowRoot.textContent = "답변 " + n + "개";
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }
}
customElements.define("count-badge", CountBadge);`,
    annotations: [
      {
        find: "extends HTMLElement",
        title: "커스텀 요소 상속",
        body: "모든 사용자 정의 요소는 HTMLElement를 상속한다. 이 클래스가 count-badge 태그의 몸이 된다.",
        kind: "concept",
      },
      {
        find: "static observedAttributes = [\"value\"];",
        title: "감시 속성 목록",
        body: "변화를 감시할 속성 이름들이다. 여기 없는 속성은 바뀌어도 attributeChangedCallback이 부르지 않는다.",
        kind: "std",
      },
      {
        find: "this.attachShadow({ mode: \"open\" });",
        title: "섀도 루트 만들기",
        body: "문서와 분리된 하위 트리를 요소 안에 만든다. mode가 open이면 this.shadowRoot로 접근할 수 있다.",
        kind: "concept",
      },
      {
        find: "render() {",
        title: "그리기 모음",
        body: "이 태그의 화면을 만드는 일을 한 메서드에 모은다. 두 콜백이 같은 이 메서드를 부르므로 갱신 경로가 하나뿐이다.",
        kind: "idiom",
      },
      {
        find: "const n = this.getAttribute(\"value\") ?? \"0\";",
        title: "속성 읽기",
        body: "속성 값은 언제나 문자열로 나온다. 값이 아직 없으면 ??로 기본값을 택한다.",
        kind: "idiom",
      },
      {
        find: "connectedCallback() {",
        title: "문서 삽입 시점",
        body: "요소가 문서에 삽입될 때 부른다. 처음 그리기와 이벤트 걸기 같은 준비가 여기서 이뤄진다.",
        kind: "std",
      },
      {
        find: "attributeChangedCallback() {",
        title: "속성 변화 시점",
        body: "감시 중인 속성이 새겨지거나 바뀌거나 지워질 때 부른다. 요소를 다시 만들지 않고 화면만 고친다.",
        kind: "std",
      },
      {
        find: "customElements.define(\"count-badge\", CountBadge);",
        title: "태그 등록",
        body: "태그 이름과 클래스를 연결해 등록한다. 이름에 하이픈이 반드시 있어야 내장 태그와 구별된다.",
        kind: "syntax",
      },
    ],
    takeaway: "커스텀 엘리먼트는 생명주기 콜백에 반응하고, 갱신은 한 메서드로 모은다.",
    check: {
      question: "value 속성이 이미 붙은 채 문서에 등장한 요소는 어떤 콜백을 거치는가?",
      options: [
        "attributeChangedCallback과 connectedCallback을 모두 거친다",
        "connectedCallback만 거친다",
        "attributeChangedCallback은 두 번째 변경부터만 부른다",
      ],
      answer: 0,
      explain: "업그레이드 때 감시 중인 속성이 이미 있으면 attributeChangedCallback이 부르고, 문서에 삽입되며 connectedCallback도 부른다. 둘 다 render를 부르지만 같은 결과를 다시 쓸 뿐이다.",
    },
  },
  {
    no: 53,
    date: "2026.09.10",
    title: "탭 위젯의 ARIA",
    dek: "role과 aria-* 속성이 탭 위젯의 구조와 선택 상태를 어떻게 알리는지 읽는다.",
    minutes: 3,
    language: "HTML",
    domain: "프론트엔드",
    prompt: "화면에는 강조색뿐이다 — 스크린 리더는 무엇을 근거로 주간 탭이 선택된 상태임을 아는지 찾아 보라",
    code: `<div class="tabs" role="tablist" aria-label="통계 기간">
  <button role="tab" id="tab-week" aria-selected="true"
          aria-controls="panel-week">주간</button>
  <button role="tab" id="tab-month" aria-selected="false"
          aria-controls="panel-month" tabindex="-1">월간</button>
</div>

<div role="tabpanel" id="panel-week" aria-labelledby="tab-week">
  <p>이번 주 방문자 수 추이다.</p>
</div>

<div role="tabpanel" id="panel-month" aria-labelledby="tab-month" hidden>
  <p>이번 달 방문자 수 추이다.</p>
</div>`,
    annotations: [
      {
        find: "role=\"tablist\"",
        title: "위젯 역할",
        body: "이 요소가 탭 목록 위젯임을 보조 기술에 알린다. 역할을 선언했으면 그 위젯의 키보드 동작도 따라 해야 한다.",
        kind: "concept",
      },
      {
        find: "aria-selected=\"true\"",
        title: "선택 상태",
        body: "탭들 가운데 지금 선택된 것을 표시한다. 눈에 보이는 강조와 별개로 상태를 문자로 전달한다.",
        kind: "std",
      },
      {
        find: "aria-controls=\"panel-week\"",
        title: "제어 대상",
        body: "이 탭이 여는 패널을 id로 연결한다. 보조 기술이 탭에서 패널로 건너뛰는 길이 생긴다.",
        kind: "std",
      },
      {
        find: "tabindex=\"-1\"",
        title: "탭 순환 제외",
        body: "Tab 키 순환에서 빼고 프로그램으로만 포커스를 준다. 탭 위젯은 방향키로 항목을 옮기는 관용을 쓴다.",
        kind: "idiom",
      },
      {
        find: "role=\"tabpanel\"",
        title: "패널 역할",
        body: "탭이 제어하는 내용 영역임을 알린다. tablist·tab·tabpanel이 한 위젯의 세 부분이다.",
        kind: "std",
      },
      {
        find: "aria-labelledby=\"tab-week\"",
        title: "이름 빌려 오기",
        body: "패널의 접근 가능한 이름을 해당 탭의 텍스트에서 가져온다. id로 다른 요소를 참조하는 관용구다.",
        kind: "std",
      },
      {
        find: "hidden",
        title: "완전 숨김",
        body: "요소를 렌더링에서 뺀다. 화면에서뿐 아니라 보조 기술에도 읽히지 않는다.",
        kind: "syntax",
      },
    ],
    takeaway: "ARIA는 눈에 보이는 위젯의 구조와 상태를 보조 기술이 읽을 형태로 옮기는 계층이다.",
    check: {
      question: "월간 탭이 선택으로 바뀌면 함께 갱신해야 할 속성 짝은 무엇인가?",
      options: [
        "월간 탭의 aria-selected와 월간 패널의 hidden",
        "월간 탭의 tabindex만",
        "tablist의 aria-label만",
      ],
      answer: 0,
      explain: "선택이 옮기면 새 탭의 aria-selected가 true가 되고 열리는 패널에서 hidden을 뺀다. tabindex는 방향키 이동 패턴에서 함께 옮겨 주면 더 좋다.",
    },
  },
  {
    no: 52,
    date: "2026.09.10",
    title: "유틸리티 조합 패턴",
    dek: "목록 행, 가격 열, 버튼 상태 변형으로 자주 쓰는 유틸리티 조합을 읽는다.",
    minutes: 3,
    language: "HTML",
    framework: "Tailwind CSS",
    domain: "프론트엔드",
    prompt: "가격 열이 자릿수가 달라져도 흔들리지 않는 이유를 클래스 이름에서 찾아 보라",
    code: `<div class="mx-auto max-w-3xl px-4">
  <h2 class="text-xl font-semibold text-slate-900">주문 내역</h2>
  <ul class="mt-4 divide-y divide-slate-200">
    <li class="flex items-center justify-between py-3">
      <span class="truncate text-sm text-slate-700">키보드</span>
      <span class="tabular-nums text-sm font-medium">39,000원</span>
    </li>
    <li class="flex items-center justify-between py-3">
      <span class="truncate text-sm text-slate-700">마우스</span>
      <span class="tabular-nums text-sm font-medium">21,000원</span>
    </li>
  </ul>
  <button class="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2
                 text-white transition hover:bg-blue-700 active:bg-blue-800
                 focus-visible:ring-2 focus-visible:ring-blue-500">
    결제하기
  </button>
</div>`,
    annotations: [
      {
        find: "mx-auto max-w-3xl",
        title: "가운데 틀",
        body: "최대 폭을 정하고 좌우 마진을 자동으로 줘 화면 가운데에 놓는다. 읽기 폭을 제한하는 페이지 틀의 관용구다.",
        kind: "idiom",
      },
      {
        find: "divide-y divide-slate-200",
        title: "자식 사이 구분선",
        body: "자식 항목 사이에 경계선을 긋고 색을 정한다. 항목마다 border를 쓰던 일을 선언 하나로 바꾼다.",
        kind: "std",
      },
      {
        find: "flex items-center justify-between py-3",
        title: "목록 행 조합",
        body: "가로 배치, 세로 중앙 정렬, 양끝 밀기를 한 줄로 조합했다. 정돈된 목록 행의 가장 흔한 조합이다.",
        kind: "idiom",
      },
      {
        find: "truncate",
        title: "한 줄 말줄임",
        body: "넘치는 텍스트를 한 줄로 잘라 말줄임표를 붙인다. 여러 선언을 묶어 둔 유틸리티다.",
        kind: "std",
      },
      {
        find: "tabular-nums",
        title: "숫자 폭 고정",
        body: "숫자를 폭이 같은 글리프로 그린다. 자릿수가 달라져도 가격 열이 흔들리지 않는다.",
        kind: "std",
      },
      {
        find: "hover:bg-blue-700",
        title: "상태 변형",
        body: "콜론 앞은 상태 이름, 뒤는 스타일이다. hover 변형은 빌드 때 :hover 가상 클래스 선택자로 번역된다.",
        kind: "concept",
      },
      {
        find: "focus-visible:ring-2",
        title: "키보드 포커스 링",
        body: "키보드로 포커스를 받았을 때만 외곽 링을 그린다. 마우스 클릭에는 링이 없어 소음을 줄인다.",
        kind: "idiom",
      },
    ],
    takeaway: "유틸리티 클래스는 자주 쓰는 선언 묶음에 붙인 이름이다 — 조합을 읽으면 CSS가 읽힌다.",
    check: {
      question: "truncate와 tabular-nums가 각각 맡은 일로 옳은 것은?",
      options: [
        "넘친 텍스트 말줄임과 숫자 폭 고정",
        "자동 줄바꿈과 천 단위 쉼표",
        "테두리 그리기와 자간 조정",
      ],
      answer: 0,
      explain: "truncate는 넘치는 텍스트를 한 줄로 잘라 말줄임표를 붙인다. tabular-nums는 숫자를 같은 폭으로 그려 가격 열이 흔들리지 않게 한다.",
    },
  },
  {
    no: 51,
    date: "2026.09.10",
    title: "전환과 키프레임",
    dek: "hover 전환과 무한 pulse를 나란히 놓고 두 애니메이션 수단의 경계를 읽는다.",
    minutes: 2,
    language: "CSS",
    domain: "프론트엔드",
    prompt: "버튼은 마우스를 올릴 때만 움직이고 배지는 멈추지 않는다 — 이 차이를 만드는 줄을 각각 찾아 보라",
    code: `.button {
  background: #2563eb;
  transition: background 150ms ease, transform 150ms ease;
}

.button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.badge {
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}`,
    annotations: [
      {
        find: "transition: background 150ms ease, transform 150ms ease;",
        title: "전환 선언",
        body: "적어 둔 속성이 값이 바뀔 때 150ms에 걸쳐 움직인다. 쉼표로 여러 속성을 한 번에 지정했다.",
        kind: "syntax",
      },
      {
        find: ".button:hover",
        title: "가상 클래스",
        body: "포인터가 요소 위에 있는 동안에만 적용되는 규칙이다. 전환이 있어 이 값으로 부드럽게 미끄러진다.",
        kind: "syntax",
      },
      {
        find: "transform: translateY(-2px);",
        title: "변형",
        body: "레이아웃을 다시 계산하지 않고 그려지는 자리만 옮긴다. 합성 단계에서 처리되어 자주 바뀌기에 알맞다.",
        kind: "concept",
      },
      {
        find: "animation: pulse 1.6s ease-in-out infinite;",
        title: "애니메이션 재생",
        body: "이름이 pulse인 키프레임을 1.6초 주기로 무한히 재생한다. 전환과 달리 상태 변화 없이 스스로 진행한다.",
        kind: "syntax",
      },
      {
        find: "@keyframes pulse",
        title: "키프레임 정의",
        body: "진행률 0%부터 100%까지 중간 모습을 정의한다. animation이 이 이름을 참조해 재생한다.",
        kind: "syntax",
      },
      {
        find: "50%  { opacity: 0.4; }",
        title: "중간 지점",
        body: "주기의 절반에서 투명도가 0.4까지 내려갔다 돌아온다. 0%와 100%가 같은 값이라 반복이 이어져도 끊기지 않는다.",
        kind: "idiom",
      },
    ],
    takeaway: "transition은 상태 변화에 반응하고 animation은 선언만으로 스스로 반복한다.",
    check: {
      question: "이 코드에서 transition과 animation의 차이로 옳은 것은?",
      options: [
        "transition은 값 변화에 반응하고 animation은 선언만으로 스스로 진행한다",
        "transition이 더 오래 걸린다",
        "animation은 hover가 끝나면 멈춘다",
      ],
      answer: 0,
      explain: "전환은 background·transform 값이 바뀌는 순간에만 움직인다. 배지의 pulse는 키프레임 선언만으로 주기와 관계없이 계속 재생된다.",
    },
  },
  {
    no: 50,
    date: "2026.09.10",
    title: "그리드와 컨테이너 쿼리",
    dek: "auto-fill 그리드 위에 컨테이너 쿼리를 얹어 카드 안쪽 배치가 너비를 따라 바뀌게 한다.",
    minutes: 3,
    language: "CSS",
    domain: "프론트엔드",
    prompt: "카드 자체 너비가 420px를 넘는 순간 어느 규칙이 끼어들어 무엇을 덮어쓰는지 따라 가 보라",
    code: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.card {
  container-type: inline-size;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.card-body {
  padding: 0.75rem;
}

@container (min-width: 420px) {
  .card-body {
    display: grid;
    grid-template-columns: 96px 1fr;
  }
}`,
    annotations: [
      {
        find: "display: grid;",
        title: "외곽 그리드",
        body: "요소를 그리드 컨테이너로 선언한다. 카드들이 자식 항목으로 트랙에 놓인다.",
        kind: "syntax",
      },
      {
        find: "repeat(auto-fill, minmax(220px, 1fr))",
        title: "자동 채움 트랙",
        body: "220px 이상인 열을 너비가 허락하는 만큼 자동으로 만든다. 카드 개수를 몰라도 열 수가 정해진다.",
        kind: "idiom",
      },
      {
        find: "gap: 1rem;",
        title: "트랙 간격",
        body: "열과 행 사이 간격을 한 번에 정한다. 항목마다 마진을 재지 않아도 틀이 일정하게 벌어진다.",
        kind: "syntax",
      },
      {
        find: "container-type: inline-size;",
        title: "쿼리 컨테이너 선언",
        body: "이 요소를 인라인 크기 기준의 쿼리 컨테이너로 만든다. 안쪽에서 묻는 @container 질문은 이 요소의 너비로 답한다.",
        kind: "concept",
      },
      {
        find: ".card-body {",
        title: "조건 밖 기본 규칙",
        body: "컨테이너 너비와 무관하게 항상 적용되는 기본 모습이다. 아래 쿼리 조건이 만족되면 그 규칙이 이어서 덮어쓴다.",
        kind: "syntax",
        line: 13,
      },
      {
        find: "@container (min-width: 420px)",
        title: "컨테이너 쿼리",
        body: "가장 가까운 조상 컨테이너의 너비가 420px 이상일 때 안쪽 규칙을 적용한다. 미디어 쿼리가 화면을 보는 것과 대비된다.",
        kind: "syntax",
      },
      {
        find: "grid-template-columns: 96px 1fr;",
        title: "넓은 카드의 두 열",
        body: "썸네일 자리 96px와 나머지 전부로 두 열을 만든다. 좁을 때의 세로 쌓임과 별개의 배치다.",
        kind: "idiom",
      },
    ],
    takeaway: "미디어 쿼리가 화면을 본다면 컨테이너 쿼리는 컴포넌트 자신의 너비를 본다.",
    check: {
      question: "뷰포트가 800px로 넓어도 각 카드가 300px라면 .card-body의 배치는 어떻게 되는가?",
      options: [
        "padding만 있는 기본 세로 쌓임을 유지한다",
        "96px 1fr 두 열 그리드로 바뀐다",
        "카드가 외곽 그리드에서 빠진다",
      ],
      answer: 0,
      explain: "@container는 .card-body의 조상 컨테이너인 .card의 너비를 보지 뷰포트를 보지 않는다. 카드가 300px면 조건이 거짓이라 기본 규칙이 그대로 남는다.",
    },
  },
  {
    no: 49,
    date: "2026.09.10",
    title: "플러터 목록과 위젯 트리",
    dek: "ListView.builder가 필요한 항목만 만드는 방식과 const 위젯을 본다.",
    minutes: 3,
    language: "Dart",
    framework: "Flutter",
    domain: "모바일",
    prompt: "items가 만 개여도 이 목록이 가벼운 이유를 builder에서 찾아 보라",
    code: `class TodoList extends StatelessWidget {
  const TodoList({super.key, required this.items});

  final List<String> items;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return ListTile(
          leading: const Icon(Icons.check_circle_outline),
          title: Text(item),
          onTap: () => ScaffoldMessenger.of(context)
              .showSnackBar(SnackBar(content: Text(item))),
        );
      },
    );
  }
}`,
    annotations: [
      {
        find: "extends StatelessWidget",
        title: "무상태 위젯",
        body: "build 한 번으로 그려지고 스스로 바뀌는 값을 갖지 않는 위젯이다. 바뀌는 것은 부모가 새 인자로 넘겨준다.",
        kind: "concept",
      },
      {
        find: "const TodoList({super.key, required this.items})",
        title: "생성자와 키",
        body: "key는 트리에서 위젯의 자리를 구분하고 required this.items는 명명 인자를 필수로 묶는다. final 필드와 짝을 이루는 관용 선언이다.",
        kind: "syntax",
      },
      {
        find: "ListView.builder(",
        title: "게으른 목록",
        body: "화면에 보이는 항목만 만드는 목록 빌더다. 항목 수가 커져도 스크롤 범위만큼만 위젯을 만든다.",
        kind: "std",
      },
      {
        find: "itemBuilder: (context, index)",
        title: "항목 빌더",
        body: "index번째 항목이 필요할 때만 불리는 콜백이다. 돌려준 위젯이 그 자리에 놓인다.",
        kind: "std",
      },
      {
        find: "const Icon(Icons.check_circle_outline)",
        title: "const 위젯",
        body: "컴파일 때 정해지는 위젯은 const로 인스턴스를 하나만 만든다. build가 자주 돌아도 이 조각은 다시 만들지 않는다.",
        kind: "idiom",
      },
      {
        find: "ScaffoldMessenger.of(context)",
        title: "스캐폴드 메신저",
        body: "위로 올라가 가장 가까운 Scaffold를 찾아 알림을 띄울 통로를 얻는다. context는 위젯 트리에서 자기 자리를 가리키는 좌표다.",
        kind: "std",
      },
    ],
    takeaway: "Flutter의 UI는 위젯 트리고 build는 현재 상태를 그리는 순수 함수에 가깝다.",
    check: {
      question: "ListView.builder의 itemBuilder는 언제 불리는가?",
      options: [
        "build가 도는 동안 모든 항목에 대해 한 번씩",
        "해당 index의 항목이 화면에 필요해질 때",
        "사용자가 항목을 탭할 때",
      ],
      answer: 1,
      explain: "builder 목록은 보이는 영역 주변 항목만 만들고, 스크롤하면 필요해진 index만 새로 빌드한다. 처음에 children 전체를 만드는 목록과의 차이가 이 관용구의 요점이다.",
    },
  },
  {
    no: 48,
    date: "2026.09.10",
    title: "컴포즈 상태 호이스팅",
    dek: "상태는 위에 두고 값만 내리며, 변경은 콜백으로 받는 구조를 본다.",
    minutes: 3,
    language: "Kotlin",
    framework: "Jetpack Compose",
    domain: "모바일",
    prompt: "count의 원본은 어디에 있고 하위 Counter는 무엇만 받는지 따져 보라",
    code: `@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }

    Counter(
        count = count,
        onIncrement = { count += 1 },
    )
}

@Composable
fun Counter(count: Int, onIncrement: () -> Unit) {
    Column {
        Text("횟수: $count")
        Button(onClick = onIncrement) {
            Text("올리기")
        }
    }
}`,
    annotations: [
      {
        find: "@Composable",
        title: "컴포저블 표시",
        body: "이 함수가 UI를 기술한다는 표시다. 컴파일러가 재구성 추적용 코드를 더해 일반 함수와는 다르게 다룬다.",
        kind: "syntax",
      },
      {
        find: "var count by remember { mutableStateOf(0) }",
        title: "상태 기억",
        body: "remember는 재구성 사이에 값을 보관하고 mutableStateOf가 그 값을 읽는 곳에 변경을 알린다. by 덕분에 count를 일반 변수처럼 쓴다.",
        kind: "syntax",
      },
      {
        find: "onIncrement = { count += 1 }",
        title: "쓰기 담당 콜백",
        body: "상태는 아래로 내리고 쓰기는 위로 올리는 상태 호이스팅의 절반짜리 계약이다. 하위는 값만 받고 바꾸는 방법은 받지 않는다.",
        kind: "idiom",
      },
      {
        find: "fun Counter(count: Int, onIncrement: () -> Unit)",
        title: "무상태 컴포저블",
        body: "상태를 갖지 않고 인자로 받은 값만 그리는 함수다. 같은 인자면 같은 UI를 만들므로 미리보기와 테스트가 쉬워진다.",
        kind: "concept",
      },
      {
        find: "Text(\"횟수: $count\")",
        title: "선언적 갱신",
        body: "이 문장은 count의 함수다. count가 바뀌면 이 컴포저블만 다시 실행되고 화면이 맞춰진다.",
        kind: "concept",
      },
      {
        find: "Button(onClick = onIncrement)",
        title: "이벤트 전달",
        body: "버튼은 눌렸을 때 무엇을 할지 몰라 onClick에 맡긴다. 상태를 쓰는 주체는 호출자 쪽에 남는다.",
        kind: "std",
      },
    ],
    takeaway: "상태는 내리고 이벤트는 올린다 — 무상태 컴포저블이 재사용 가능하다.",
    check: {
      question: "Counter 안에서 count 값을 직접 바꾸고 싶다면 어떻게 해야 하는가?",
      options: [
        "Counter 안에 var count를 다시 선언하면 된다",
        "호출 쪽에서 onIncrement에 쓰기 로직을 넘기는 지금 구조를 유지해야 한다",
        "count 인자를 var로 선언하면 된다",
      ],
      answer: 1,
      explain: "컴포저블 인자는 읽기 전용 값이고 재구성 때마다 새로 들어온다. 상태의 원본은 remember가 있는 호출자에 두고, 하위는 이벤트 콜백으로 바꿔 달라고 요청하는 것이 상태 호이스팅이다.",
    },
  },
  {
    no: 47,
    date: "2026.09.10",
    title: "코루틴으로 겹쳐 기다리기",
    dek: "async와 await의 위치가 요청을 겹치는지, 하나씩 기다리는지를 가른다.",
    minutes: 3,
    language: "Kotlin",
    framework: "Kotlin Coroutines",
    domain: "모바일",
    prompt: "async와 await의 위치가 요청을 어떻게 겹치게 하는지 따라 가 보라",
    code: `suspend fun loadDashboard(api: Api): Dashboard =
    coroutineScope {
        val news = async { api.fetch("news") }
        val unread = async { api.fetch("unread") }
        val trend = withTimeoutOrNull(2_000) { api.fetch("trend") } ?: "없음"
        Dashboard(news.await(), unread.await(), trend)
    }

fun main() = runBlocking {
    val dash = loadDashboard(FakeApi())
    withContext(Dispatchers.Default) {
        render(dash)
    }
}`,
    annotations: [
      {
        find: "suspend fun",
        title: "중단 함수",
        body: "도중에 멈췄다가 나중에 이어서 돌 수 있다는 표시다. suspend 함수는 다른 suspend 함수 안이나 코루틴 안에서만 부를 수 있다.",
        kind: "syntax",
      },
      {
        find: "coroutineScope {",
        title: "구조적 동시성",
        body: "이 블록 안에서 연 코루틴은 블록이 끝나기 전에 모두 끝난다. 하나가 실패하면 나머지도 함께 취소된다.",
        kind: "concept",
      },
      {
        find: "async {",
        title: "동시 시작",
        body: "호출을 즉시 시작하고 결과 약속인 Deferred를 돌려준다. 두 요청이 겹쳐 실행되므로 순서대로 기다리는 것보다 빠르다.",
        kind: "std",
      },
      {
        find: ".await()",
        title: "결과 기다리기",
        body: "Deferred의 결과가 준비될 때까지 이 코루틴만 멈춘다. 스레드를 막지 않고 중단점으로 기다린다.",
        kind: "std",
      },
      {
        find: "withTimeoutOrNull",
        title: "시간 제한",
        body: "지정한 시간 안에 끝나지 않으면 코루틴을 취소하고 null을 돌려준다. 실패를 예외 대신 값으로 받는 관용구다.",
        kind: "std",
      },
      {
        find: "runBlocking",
        title: "블로킹 다리",
        body: "일반 함수 세계에서 최초의 코루틴을 열 때 쓴다. 호출한 스레드를 실제로 막으므로 main이나 테스트에서만 쓴다.",
        kind: "concept",
      },
    ],
    takeaway: "async는 겹치기, await는 기다리기 — 시작과 대기의 위치가 전체 시간을 정한다.",
    check: {
      question: "async 두 개를 각각 바로 await하도록 순서를 바꾸면 어떻게 되는가?",
      options: [
        "결과도 같고 걸리는 시간도 같다",
        "두 요청이 겹치지 않아 전체 시간이 두 요청의 합에 가까워진다",
        "컴파일되지 않는다",
      ],
      answer: 1,
      explain: "async는 불리는 즉시 코루틴을 시작한다. await를 먼저 하면 두 번째 async는 첫 응답이 올 때까지 시작조차 하지 못해 대기가 겹치지 않는다. coroutineScope는 종료를 보장할 뿐 시작 순서를 바꿔 주지 않는다.",
    },
  },
  {
    no: 46,
    date: "2026.09.10",
    title: "SwiftUI 상태와 바인딩",
    dek: "@State의 원본과 $로 꺼낸 바인딩이 하위 버튼까지 이어지는 흐름을 본다.",
    minutes: 3,
    language: "Swift",
    framework: "SwiftUI",
    domain: "모바일",
    prompt: "하위 버튼의 count += 1이 상위 화면 갱신까지 이어지는 경로를 따라 가 보라",
    code: `struct CounterRow: View {
    @Binding var count: Int

    var body: some View {
        Button(count == 0 ? "시작" : "더하기") {
            count += 1
        }
    }
}

struct CounterScreen: View {
    @State private var count = 0

    var body: some View {
        VStack {
            Text("횟수: " + String(count))
            CounterRow(count: $count)
        }
    }
}`,
    annotations: [
      {
        find: "@Binding",
        title: "바인딩 래퍼",
        body: "값을 소유하지 않고 상위 뷰가 가진 상태를 읽고 쓰는 연결이다. 하위 뷰 안에서는 일반 변수처럼 쓴다.",
        kind: "syntax",
      },
      {
        find: "count == 0 ? \"시작\" : \"더하기\"",
        title: "라벨 삼항식",
        body: "상태에 따라 버튼 이름을 갈아끼운다. 뷰는 body가 다시 계산될 때마다 이 식을 새로 읽는다.",
        kind: "syntax",
      },
      {
        find: "count += 1",
        title: "상태 쓰기",
        body: "바인딩 변수에 대한 대입은 연결된 원본 저장소의 값을 바꾼다. 값이 바뀌면 이를 읽던 뷰가 다시 그려진다.",
        kind: "idiom",
      },
      {
        find: "@State private var count = 0",
        title: "지역 상태",
        body: "뷰가 소유하는 단일 진실 원본이다. private로 뷰 안에 닫아 두는 것이 관용이다.",
        kind: "syntax",
      },
      {
        find: "$count",
        title: "바인딩 꺼내기",
        body: "달러 표시는 @State 래퍼에서 Binding 값을 꺼내는 문법이다. 하위의 @Binding과 맞물려 같은 저장소를 가리킨다.",
        kind: "idiom",
      },
      {
        find: "VStack {",
        title: "수직 스택",
        body: "하위 뷰를 세로로 쌓는 컨테이너다. body에서 뷰 계층을 선언하면 배치는 SwiftUI가 계산한다.",
        kind: "std",
      },
    ],
    takeaway: "@State는 소유이고 $는 그 저장소의 연결이다 — 쓰기는 연결을 타고 원본까지 간다.",
    check: {
      question: "하위 CounterRow의 count += 1이 상위 Text 갱신까지 이어지는 이유는 무엇인가?",
      options: [
        "Button이 눌릴 때마다 앱 전체를 다시 그리기 때문",
        "$count로 만든 바인딩이 상위 @State 저장소에 쓰고, 그 값을 읽는 뷰의 body가 다시 계산되기 때문",
        "count는 하위에 복사본이 생기고 상위는 타이머로 동기화되기 때문",
      ],
      answer: 1,
      explain: "카운터의 원본은 상위의 @State 저장소에 있고 하위는 $count로 만든 연결만 받는다. 하위의 대입은 원본을 바꾸고, SwiftUI는 그 값을 읽던 뷰를 무효화해 body를 다시 계산한다.",
    },
  },
  {
    no: 45,
    date: "2026.09.10",
    title: "옵셔널과 프로토콜 확장",
    dek: "프로토콜 기본 구현과 ??·옵셔널 체이닝으로 nil을 다루는 짧은 계정 코드다.",
    minutes: 3,
    language: "Swift",
    domain: "모바일",
    prompt: "nickname이 nil인 계정에서 label과 마지막 print의 값은 각각 무엇인가",
    code: `protocol Named {
    var displayName: String? { get }
}

extension Named {
    var label: String {
        displayName ?? "이름 없음"
    }
}

struct Account: Named {
    let id: Int
    var nickname: String?
    var displayName: String? { nickname }
}

let a = Account(id: 7, nickname: nil)
print(a.label)
print(a.nickname?.count ?? 0)`,
    annotations: [
      {
        find: "protocol Named",
        title: "프로토콜 선언",
        body: "따를 타입이 지켜야 할 요구를 나열한 계약이다. 이 프로토콜을 채택하는 타입은 나열된 요구를 모두 구현해야 한다.",
        kind: "syntax",
      },
      {
        find: "var displayName: String? { get }",
        title: "옵셔널 요구",
        body: "String?는 값이 없을 수 있음을 타입으로 드러낸다. { get }은 읽을 수만 있으면 된다는 최소 요구다.",
        kind: "syntax",
      },
      {
        find: "extension Named",
        title: "프로토콜 확장",
        body: "프로토콜에 기본 구현을 얹는 관용구다. 채택한 타입이 따로 쓰지 않으면 이 구현이 그대로 쓰인다.",
        kind: "idiom",
      },
      {
        find: "displayName ?? \"이름 없음\"",
        title: "nil 병합 연산자",
        body: "왼쪽이 nil이면 오른쪽 값을 쓴다. 옵셔널을 일반 값으로 풀어 내는 가장 짧은 방법이다.",
        kind: "syntax",
      },
      {
        find: "struct Account: Named",
        title: "채택과 준수",
        body: "콜론 뒤에 프로토콜을 적어 채택한다. 요구를 모두 구현했는지는 컴파일러가 검사하므로 누락되면 빌드가 막힌다.",
        kind: "concept",
      },
      {
        find: "var nickname: String?",
        title: "옵셔널 저장 프로퍼티",
        body: "닉네임이 아직 없을 수 있다는 도메인 사실을 타입에 담는다. 값을 쓰려면 언래핑이 강제된다.",
        kind: "syntax",
      },
      {
        find: "a.nickname?.count",
        title: "옵셔널 체이닝",
        body: "nickname이 nil이면 뒤쪽 전체가 nil이 되고, 값이 있으면 이어서 접근한다. 결과도 옵셔널이라 ?? 0으로 마무리한다.",
        kind: "idiom",
      },
    ],
    takeaway: "옵셔널은 값의 부재를 타입으로 밀어 올리고, ??와 체이닝으로 안전하게 내려 받는다.",
    check: {
      question: "Account(id: 7, nickname: nil)일 때 a.label과 a.nickname?.count ?? 0의 값은 각각 무엇인가?",
      options: [
        "이름 없음과 0",
        "nil과 nil",
        "이름 없음과 nil",
      ],
      answer: 0,
      explain: "nickname이 nil이므로 displayName도 nil이고, 확장의 기본 label은 ??로 이름 없음을 택한다. 체이닝은 nil을 만들고 ?? 0이 이를 0으로 바꾼다. 같은 병합 연산자가 두 자리에서 각각 쓰인 결과다.",
    },
  },
  {
    no: 44,
    date: "2026.09.10",
    title: "Prisma로 관계 걸러 불러오기",
    dek: "some 조건으로 사용자를 고르고 include의 where로 함께 실어 온 게시물을 자른다.",
    minutes: 3,
    language: "TypeScript",
    framework: "Prisma",
    domain: "데이터",
    prompt: "사용자를 거르는 조건과 게시물 목록을 자르는 조건이 어디 나뉘는지 본다",
    code: `// schema.prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}

// 발행 글을 하나라도 쓴 사용자와, 그 발행 글만
const users = await prisma.user.findMany({
  where: { posts: { some: { published: true } } },
  include: {
    posts: { where: { published: true }, orderBy: { title: "asc" } },
  },
});`,
    annotations: [
      {
        find: "posts Post[]",
        title: "일대다 관계",
        body: "한 사용자에 게시물 여러 개다. Prisma는 관계를 모델 양쪽에 모두 적어야 하며 한쪽만 있으면 스키마 검사가 실패한다.",
        kind: "syntax",
      },
      {
        find: "@relation(fields: [authorId], references: [id])",
        title: "외래 키 지정",
        body: "이 모델의 authorId 열이 상대의 id 열을 가리킨다. fields는 내 열 목록, references는 상대 열 목록이다.",
        kind: "syntax",
      },
      {
        find: "@default(autoincrement())",
        title: "기본 키 관용 구성",
        body: "@id와 함께 써 새 행에 자동 증가 번호를 채운다. Prisma 스키마에서 가장 흔한 기본 키 모양이다.",
        kind: "std",
        line: 3,
      },
      {
        find: "posts: { some: { published: true } }",
        title: "관계 필터",
        body: "where 안에서 관계 필드로 상대 모델을 조건에 쓴다. some은 조건을 만족하는 게시물이 하나라도 있는 사용자를 남긴다.",
        kind: "idiom",
      },
      {
        find: "include: {",
        title: "관계 로드",
        body: "관계 데이터를 결과에 함께 실어 온다. select는 필드를 하나씩 고르는 것과 달리 스칼라는 전부 가져오고 관계만 지정해 더한다.",
        kind: "std",
      },
      {
        find: "where: { published: true }",
        title: "중첩 필터",
        body: "include 안의 where는 함께 실려 오는 게시물 목록을 거른다. 사용자를 거르는 바깥 where와는 다른 단계다.",
        kind: "concept",
      },
      {
        find: "orderBy: { title: \"asc\" }",
        title: "정렬 지정",
        body: "실려 오는 목록의 순서를 정한다. asc가 오름차순이다.",
        kind: "std",
      },
    ],
    takeaway: "Prisma는 사용자를 거르는 where와 함께 실어 온 목록을 거르는 where가 따로 있다 — 두 필터는 다른 단계다.",
    check: {
      question: "발행하지 않은 게시물만 쓴 사용자가 이 결과에 들어가는가?",
      options: [
        "들어간다 — include의 where는 로드 설정일 뿐 사용자를 거르지 않는다",
        "들지 않는다 — 통과시킬 발행 게시물이 없어 바깥 where의 some 조건에 걸리기 때문이다",
        "들어간다 — 발행 여부는 게시물 목록에만 영향을 준다",
      ],
      answer: 1,
      explain: "사용자 통과 여부는 바깥 where의 some 조건이 결정한다. 발행 게시물이 하나도 없으면 그 사용자는 결과에서 제외된다. include 안의 where는 통과한 사용자에게 실려 오는 게시물 목록만 자른다.",
    },
  },
  {
    no: 43,
    date: "2026.09.10",
    title: "GraphQL 스키마와 질의",
    dek: "스키마가 가능한 질문의 모양을 정의하고 쿼리가 필요한 필드만 고른다.",
    minutes: 2,
    language: "GraphQL",
    domain: "데이터",
    prompt: "서버가 응답으로 돌려줄 필드를 어디서 고르는지 읽어 본다",
    code: `# schema
type Query {
  author(id: ID!): Author
}

type Author {
  name: String!
  posts(limit: Int): [Post!]!
}

type Post {
  title: String!
  author: Author!
}

# query
query {
  author(id: "a1") {
    name
    posts(limit: 3) { title }
  }
}`,
    annotations: [
      {
        find: "type Query {",
        title: "질의 진입점",
        body: "클라이언트가 호출할 수 있는 최상위 필드들을 모아 둔 타입이다. 스키마의 출구 목록이라고 읽으면 된다.",
        kind: "syntax",
      },
      {
        find: "author(id: ID!): Author",
        title: "인자 받는 필드",
        body: "필드도 함수처럼 인자를 받는다. ID!는 생략할 수 없는 식별자, Author는 돌려줄 형태다.",
        kind: "std",
      },
      {
        find: "[Post!]!",
        title: "리스트 널 표기",
        body: "안쪽 !는 요소에 null이 섞이지 않는다는 뜻이고 바깥 !는 필드 자체가 null이 아님을 뜻한다. 빈 목록은 가능하지만 null 요소는 없다.",
        kind: "syntax",
      },
      {
        find: "author: Author!",
        title: "역방향 관계",
        body: "Post에서 Author로 돌아가는 길도 스키마에 열려 있다. 관계를 양쪽에 적어 두면 쿼리가 그래프를 어느 방향으로든 걸어 간다.",
        kind: "concept",
      },
      {
        find: "query {",
        title: "질의 문서",
        body: "읽고 싶은 모양을 클라이언트가 직접 적는 부분이다. 서버는 문서에 나타난 필드만 골라 같은 모양의 응답을 만든다.",
        kind: "syntax",
      },
      {
        find: "author(id: \"a1\")",
        title: "진입점 호출",
        body: "스키마의 Query.author를 실제 값으로 부른다. 반환 형태가 Author로 정해져 있으므로 아래 중괄호에서 그 타입의 필드를 고른다.",
        kind: "std",
      },
      {
        find: "posts(limit: 3) { title }",
        title: "리스트 자르기",
        body: "스키마가 선언한 인자 limit을 그대로 넘겨 목록을 줄인다. 중괄호 안은 각 Post에서 읽어 올 필드다.",
        kind: "std",
      },
    ],
    takeaway: "스키마는 가능한 질문의 모양을 정하고 쿼리는 그중 필요한 필드만 고른다 — 응답 모양은 쿼리를 따라간다.",
    check: {
      question: "이 query 문서에 대한 응답에는 어떤 필드가 실리는가?",
      options: [
        "Author와 Post가 가진 모든 필드",
        "author의 name과, limit 3으로 잘린 posts 각각의 title",
        "author의 전체 posts 목록과 각 게시물의 author까지",
      ],
      answer: 1,
      explain: "GraphQL 응답의 모양은 쿼리 문서를 따라간다. 문서에 적힌 name과 title만 골라 같은 구조로 돌려준다. limit 같은 인자의 해석은 서버 구현이 맡는다.",
    },
  },
  {
    no: 42,
    date: "2026.09.10",
    title: "해제는 할당 바로 아래에",
    dek: "defer와 에러 유니온으로 실패 경로를 정리한다.",
    minutes: 3,
    language: "Zig",
    domain: "시스템",
    prompt: "함수가 여러 지점에서 실패할 때 메모리는 누수되지 않을까, defer 위치에 주목하라.",
    code: "const std = @import(\"std\");\n\nfn loadLimit(alloc: std.mem.Allocator, text: []const u8) !u16 {\n    const copy = try alloc.dupe(u8, text);\n    defer alloc.free(copy);\n\n    const limit = try std.fmt.parseInt(u16, copy, 10);\n    if (limit < 1024) return error.PrivilegedPort;\n    return limit;\n}\n\npub fn main() !void {\n    const alloc = std.heap.page_allocator;\n    const limit = loadLimit(alloc, \"8080\") catch |err| switch (err) {\n        error.PrivilegedPort => 3000,\n        else => return err,\n    };\n    std.debug.print(\"limit={d}\\n\", .{limit});\n}",
    annotations: [
      {
        find: "!u16",
        title: "에러 유니온 반환",
        body: "!는 u16이거나 에러 집합이라는 뜻이다. 예외 대신 실패가 반환 타입에 적혀 있어 호출부가 실패를 무시하기 어렵다.",
        kind: "syntax",
      },
      {
        find: "try alloc.dupe(u8, text)",
        title: "try로 오류 전파",
        body: "dupe는 실패할 수 있는 함수다. try는 에러면 그대로 되돌리고 성공이면 값을 꺼내는 catch의 축약이다.",
        kind: "syntax",
      },
      {
        find: "defer alloc.free(copy);",
        title: "스코프 끝에서 해제",
        body: "defer는 현재 스코프를 벗어나는 모든 경로에서 실행된다. 에러로 중간 반환해도 해제가 보장되어 뒷정리 코드가 흩어지지 않는다.",
        kind: "concept",
      },
      {
        find: "return error.PrivilegedPort;",
        title: "에러 값 반환",
        body: "error.이름은 컴파일 타임에 에러 집합에 추가되는 값이다. 함수는 실패를 예외가 아니라 값으로 돌려준다.",
        kind: "concept",
      },
      {
        find: "catch |err| switch (err)",
        title: "에러별 분기",
        body: "catch로 에러를 잡아 err 이름을 붙이고 switch로 취급을 나눈다. 어떤 에러는 기본값으로, 어떤 에러는 위로 넘긴다.",
        kind: "idiom",
      },
      {
        find: "error.PrivilegedPort => 3000,",
        title: "기본값으로 대체",
        body: "1024 미만 포트는 특권이 필요하다는 실패를 3000으로 대체해 계속 진행한다. 정책을 호출부에 두는 모양이다.",
        kind: "idiom",
      },
      {
        find: "std.debug.print",
        title: "디버그 출력",
        body: "stderr로 형식 출력을 내보낸다. {d}가 정수 자리를 대신한다.",
        kind: "std",
      },
    ],
    takeaway: "defer가 해제를 할당 옆에 붙여두고, 에러 유니온이 실패를 반환값으로 만든다.",
    check: {
      question: "parseInt가 실패해 함수를 중간에 빠져나가면 copy는?",
      options: [
        "성공 경로에서만 free되므로 누수된다",
        "defer 덕에 실패 경로에서도 free된다",
        "Zig에는 GC가 있어 자동 회수된다",
      ],
      answer: 1,
      explain: "defer는 스코프를 벗어나는 모든 경로에서 실행된다. 에러 반환도 경로의 하나라 해제가 보장된다. 할당 바로 아래 해제를 두는 습관이 실패 경로를 단순하게 만든다.",
    },
  },
  {
    no: 41,
    date: "2026.09.10",
    title: "updated_at을 채우는 트리거",
    dek: "BEFORE UPDATE 트리거 함수가 행을 고쳐 저장한다. WHEN 절로 값이 그대로인 행의 발동을 막는다.",
    minutes: 2,
    language: "PL/pgSQL",
    domain: "데이터",
    prompt: "UPDATE가 값을 하나도 바꾸지 않았을 때 이 트리거가 도는지 읽어 본다",
    code: `CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
WHEN (OLD IS DISTINCT FROM NEW)
EXECUTE FUNCTION touch_updated_at();`,
    annotations: [
      {
        find: "RETURNS trigger",
        title: "트리거 함수",
        body: "트리거에서 호출할 함수는 반환 타입으로 trigger를 선언한다. 인자는 받지 않고, 발동 시점에 시스템이 채워 주는 NEW·OLD 행 변수를 읽고 쓴다.",
        kind: "syntax",
      },
      {
        find: "AS $$",
        title: "달러 인용",
        body: "두 $$ 사이의 문자열이 함수 몸통이 된다. 몸통 안의 작은따옴표를 매번 이스케이프하지 않으려는 PostgreSQL 관용이다.",
        kind: "syntax",
      },
      {
        find: "NEW.updated_at := now();",
        title: "행 변수 대입",
        body: "NEW는 이제 저장될 행 전체다. PL/pgSQL의 대입 연산자는 :=이고 SQL 비교의 =와는 다른 자리에 쓴다.",
        kind: "idiom",
      },
      {
        find: "RETURN NEW;",
        title: "바뀐 행 반환",
        body: "BEFORE 트리거가 반환한 행이 실제로 저장된다. NEW를 고쳐 돌려주면 그 값이, NULL을 돌려주면 이 행의 변경이 취소된다.",
        kind: "concept",
      },
      {
        find: "BEFORE UPDATE ON tasks",
        title: "발동 시점",
        body: "UPDATE가 tasks에 실행되기 직전에 함수가 먼저 돈다. BEFORE라서 저장 직전에 행을 고칠 수 있다.",
        kind: "syntax",
      },
      {
        find: "FOR EACH ROW",
        title: "행 단위 발동",
        body: "영향을 받는 행마다 한 번씩 함수를 부른다. FOR EACH STATEMENT로 바꾸면 문장 전체에 한 번만 돈다.",
        kind: "syntax",
      },
      {
        find: "WHEN (OLD IS DISTINCT FROM NEW)",
        title: "무변화 거르기",
        body: "OLD(원래 행)와 NEW(새 행)가 다를 때만 트리거를 발동한다. IS DISTINCT FROM은 NULL을 값처럼 비교해 = 비교의 함정을 피한다.",
        kind: "idiom",
      },
      {
        find: "EXECUTE FUNCTION touch_updated_at();",
        title: "함수 연결",
        body: "이 트리거가 발동할 때 실행할 함수를 지정한다. 함수는 트리거를 만들기 전에 존재해야 한다.",
        kind: "syntax",
      },
    ],
    takeaway: "BEFORE 트리거가 돌려준 NEW가 곧 저장값이다 — WHEN 절은 값이 그대로인 행의 무의미한 발동을 막는다.",
    check: {
      question: "WHEN 절을 지우고 아무 열 값도 바뀌지 않는 UPDATE를 실행하면 updated_at은 어떻게 되는가?",
      options: [
        "그대로 유지된다 — 트리거가 발동하지 않는다",
        "now()로 바뀐다 — 영향받은 행마다 트리거가 무조건 발동한다",
        "저장이 거부된다 — OLD와 NEW가 같으면 오류이다",
      ],
      answer: 1,
      explain: "FOR EACH ROW는 값이 바뀌었는지와 무관하게 영향받은 행마다 함수를 부른다. 발동 여부를 가르는 것이 WHEN 절이다. 이 절이 없으면 값이 그대로인 UPDATE도 updated_at을 새로 찍는다.",
    },
  },
  {
    no: 40,
    date: "2026.09.10",
    title: "윈도우 프레임으로 이동합계",
    dek: "PARTITION과 ROWS 프레임으로 상품별 최근 3행 합계를 만든다. 창이 나뉘는 두 층을 본다.",
    minutes: 3,
    language: "SQL",
    domain: "데이터",
    prompt: "같은 행에서 rolling_sum을 만드는 창이 몇 행인지 세어 본다",
    code: `SELECT
    product,
    sold_at,
    units,
    SUM(units) OVER (
        PARTITION BY product
        ORDER BY sold_at
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS rolling_sum,
    RANK() OVER (
        ORDER BY units DESC
    ) AS units_rank
FROM daily_sales
ORDER BY product, sold_at;`,
    annotations: [
      {
        find: "SUM(units) OVER (",
        title: "윈도우 함수",
        body: "행을 그룹으로 접지 않고 행마다 계산 값을 옆에 붙인다. OVER 안의 정의가 각 행에서 계산할 창을 정한다.",
        kind: "std",
      },
      {
        find: "PARTITION BY product",
        title: "파티션",
        body: "창 계산이 상품별로 따로 돌게 나눈다. 파티션 경계를 넘어 다른 상품의 행이 합해지는 일은 없다.",
        kind: "syntax",
      },
      {
        find: "ORDER BY sold_at",
        title: "창 안의 순서",
        body: "파티션 안에서 행이 나열되는 순서를 정한다. 출력 정렬이 아니라 프레임이 흘러가는 방향이다.",
        kind: "syntax",
      },
      {
        find: "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW",
        title: "프레임",
        body: "현재 행과 바로 앞 두 행, 총 세 행을 합의 대상으로 삼는다. ROWS는 행 수를 세고 RANGE는 값이 같은 행을 묶는다 — 날짜 간격이 아니라 행 기준이다.",
        kind: "concept",
      },
      {
        find: "RANK() OVER (",
        title: "순위 함수",
        body: "파티션 없이 전체 행을 하나의 창으로 본다. 같은 값에는 같은 순위를 주고 다음 순위를 건너뛴다.",
        kind: "std",
      },
      {
        find: "ORDER BY units DESC",
        title: "순위 기준",
        body: "units가 많은 행부터 1위로 매긴다. 이 ORDER BY도 순위 계산용이며, 출력 순서는 마지막 ORDER BY가 정한다.",
        kind: "syntax",
      },
    ],
    takeaway: "PARTITION은 창을 나누고 프레임은 그 창 안에서 행을 고른다 — 둘이 나뉘어 있어야 이동합계를 정확히 읽는다.",
    check: {
      question: "파티션의 맨 앞 행에서 rolling_sum은 몇 개 행의 합인가?",
      options: [
        "맨 앞 행이므로 현재 행 하나의 합이다",
        "앞에 두 행이 없어 0으로 계산된다",
        "프레임 규칙대로 항상 3행의 합이다",
      ],
      answer: 0,
      explain: "프레임은 파티션에 있는 행 안에서만 잡힌다. 맨 앞 행에는 PRECEDING 쪽 행이 없으므로 현재 행 하나만 창에 들어가 자기 값이 그대로 나온다. 두 번째 행은 두 행, 세 번째 행부터 세 행의 합이 된다.",
    },
  },
  {
    no: 39,
    date: "2026.09.10",
    title: "재귀 CTE로 계층 펼치기",
    dek: "직원-상사 테이블을 한 쿼리로 위에서 아래로 펼친다. 앵커와 재귀 멤버가 번갈아 도는 구조를 본다.",
    minutes: 3,
    language: "SQL",
    domain: "데이터",
    prompt: "재귀 멤버가 새 행을 만들지 못해 반복이 끝나는 순간이 언제인지 읽어 본다",
    code: `WITH RECURSIVE subordinates AS (
    SELECT id, name, manager_id, 1 AS depth
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.name, e.manager_id, s.depth + 1
    FROM employees e
    JOIN subordinates s ON e.manager_id = s.id
)
SELECT name, depth
FROM subordinates
ORDER BY depth, name;`,
    annotations: [
      {
        find: "WITH RECURSIVE",
        title: "재귀 CTE",
        body: "이름 붙인 임시 결과가 자기 자신을 다시 참조할 수 있음을 선언한다. 계층·그래프 순회를 한 쿼리로 푸는 표준 방식이다.",
        kind: "syntax",
      },
      {
        find: "SELECT id, name, manager_id, 1 AS depth",
        title: "앵커 멤버",
        body: "재귀의 시작점이 되는 행을 뽑는 부분이다. 여기서는 상사가 없는 루트 직원들을 깊이 1로 내보낸다.",
        kind: "concept",
      },
      {
        find: "WHERE manager_id IS NULL",
        title: "루트 조건",
        body: "manager_id가 NULL인 행, 즉 최상위 직원만 앵커로 고른다. NULL 비교는 =가 아니라 IS로 한다.",
        kind: "syntax",
      },
      {
        find: "UNION ALL",
        title: "두 멤버 결합",
        body: "앵커의 결과와 재귀 멤버의 결과를 이어 붙인다. 재귀 CTE에서는 중복 검사 비용이 드는 UNION 대신 UNION ALL을 쓰는 게 보통이다.",
        kind: "syntax",
      },
      {
        find: "JOIN subordinates s ON e.manager_id = s.id",
        title: "자기 참조",
        body: "재귀 멤버가 CTE 자신을 조인한다. 입력은 직전 라운드에서 새로 만들어진 행뿐이고, 그 자식들이 다음 라운드의 행이 된다.",
        kind: "concept",
      },
      {
        find: "s.depth + 1",
        title: "깊이 누적",
        body: "부모의 깊이에 1을 더해 자식의 깊이를 만든다. 라운드마다 상태를 누적하면 최종 결과에서 각자의 층위를 알 수 있다.",
        kind: "idiom",
      },
    ],
    takeaway: "재귀 CTE는 앵커에서 시작해 직전 라운드의 행만 입력으로 삼고, 한 라운드가 빈 결과를 내면 끝난다.",
    check: {
      question: "재귀 멤버가 더 이상 새 행을 만들지 못해 반복이 끝나는 순간은 언제인가?",
      options: [
        "depth가 정한 상한에 도달했을 때",
        "직전 라운드의 행과 조인해 맞는 자식이 하나도 없을 때",
        "UNION ALL이 중복 행을 다 제거했을 때",
      ],
      answer: 1,
      explain: "재귀 멤버의 입력은 직전 라운드에서 새로 만들어진 행뿐이다. 이 행들에서 자식을 찾는 조인이 빈 결과를 내면 다음 라운드가 없어 종료한다. 코드 어디에도 depth 상한이나 중복 제거는 없다.",
    },
  },
  {
    no: 38,
    date: "2026.09.10",
    title: "어떻게 끝나도 청소되게",
    dek: "trap과 프로세스 치환으로 임시 자원을 다룬다.",
    minutes: 3,
    language: "Bash",
    domain: "시스템",
    prompt: "스크립트가 중간에 죽어도 임시 디렉터리가 남지 않는 이유를 찾아 보라.",
    code: `#!/usr/bin/env bash
set -euo pipefail

tmpdir=$(mktemp -d)
cleanup() { rm -rf "$tmpdir"; }
trap cleanup EXIT INT TERM

grep -Rn "TODO" src/ > "$tmpdir/hits.txt" || true

while read -r path; do
  echo "TODO in $path"
done < <(cut -d: -f1 "$tmpdir/hits.txt" | sort -u)

echo "scanned $(wc -l < "$tmpdir/hits.txt") lines of hits"`,
    annotations: [
      {
        find: "set -euo pipefail",
        title: "엄격 모드",
        body: "-e는 명령이 실패하면 즉시 끝내고, -u는 정의되지 않은 변수 사용을 막고, pipefail은 파이프 중간의 실패도 실패로 센다. 스크립트 안전장치의 기본 세트다.",
        kind: "idiom",
      },
      {
        find: "mktemp -d",
        title: "임시 디렉터리",
        body: "이름이 겹치지 않는 임시 디렉터리를 만들고 그 경로를 출력한다. 명령 치환으로 경로를 변수에 담는다.",
        kind: "std",
      },
      {
        find: "trap cleanup EXIT INT TERM",
        title: "종료 때 청소 예약",
        body: "trap은 지정한 신호나 종료 상황에서 명령을 실행한다. 정상 종료뿐 아니라 Ctrl-C, set -e 중단에도 cleanup이 불려 임시 디렉터리가 남지 않는다.",
        kind: "concept",
      },
      {
        find: "|| true",
        title: "실패 허용",
        body: "grep은 하나도 못 찾으면 상태 1로 끝난다. set -e에 걸리는 것을 true로 덮어 빈 결과도 정상임을 표현한다.",
        kind: "idiom",
      },
      {
        find: "read -r path",
        title: "한 행씩 읽기",
        body: "-r은 백슬래시를 그대로 읽는 옵션이다. 표준입력에서 한 행을 path에 담고 더 읽을 행이 없으면 루프가 끝난다.",
        kind: "syntax",
      },
      {
        find: "done < <(cut -d: -f1 \"$tmpdir/hits.txt\" | sort -u)",
        title: "출력을 파일처럼",
        body: "프로세스 치환 <(명령)은 명령의 출력을 파일로 만들어 넘긴다. 파이프로 while을 먹이면 루프가 서브셸에서 돌아 변수가 남지 않지만, 이 모양은 현재 셸에서 돈다.",
        kind: "syntax",
      },
      {
        find: "$(wc -l < \"$tmpdir/hits.txt\")",
        title: "명령 치환",
        body: "명령의 표준 출력을 문자열로 끼워 넣는다. 여기선 파일의 행 수를 세어 문장에 붙인다.",
        kind: "syntax",
      },
    ],
    takeaway: "trap으로 모든 종료 경로의 청소를 보장하고, 프로세스 치환으로 임시 파일을 줄인다.",
    check: {
      question: "trap cleanup EXIT INT TERM에서 EXIT를 함께 넣은 이유는?",
      options: [
        "정상 종료 때도 cleanup이 불려 임시 디렉터리가 남지 않게 하려고",
        "EXIT가 INT와 TERM을 자동으로 포함하기 때문에",
        "cleanup 함수는 EXIT 상황에서만 동작하기 때문에",
      ],
      answer: 0,
      explain: "trap은 지정한 각 신호·종료 상황마다 등록된 함수를 실행한다. set -e로 중단되거나 Ctrl-C를 받아도 임시 디렉터리가 지워진다. 청소 보장은 종료 경로 전부를 아우를 때 완성된다.",
    },
  },
  {
    no: 37,
    date: "2026.09.10",
    title: "지우기 전에 모아 두기",
    dek: "erase-remove 관용구와 반복자 범위를 읽는다.",
    minutes: 3,
    language: "C++",
    domain: "시스템",
    prompt: "remove_if가 돌려주는 반복자는 어디를 가리킬까, 그 뒤의 erase와 이어서 읽어 보라.",
    code: `#include <algorithm>
#include <numeric>
#include <vector>

int adjustedTotal(std::vector<int> loads, int capacity) {
    auto it = std::remove_if(loads.begin(), loads.end(),
                             [capacity](int v) { return v >= capacity; });
    loads.erase(it, loads.end());

    std::sort(loads.begin(), loads.end());
    int total = std::accumulate(loads.begin(), loads.end(), 0);
    int biggest = loads.empty() ? 0 : loads.back();
    return total - biggest;
}`,
    annotations: [
      {
        find: "std::vector<int> loads",
        title: "값으로 받은 벡터",
        body: "값으로 복사해 받으므로 함수 안에서 마음껏 고칠 수 있다. 호출자의 벡터는 그대로 남는다.",
        kind: "concept",
      },
      {
        find: "std::remove_if",
        title: "조건을 뒤로 밀기",
        body: "조건을 만족하는 원소를 지우는 게 아니라, 만족하지 않는 원소를 앞쪽으로 몰아넣는다. 돌려주는 반복자가 새 논리적 끝이다.",
        kind: "std",
      },
      {
        find: "[capacity](int v) { return v >= capacity; }",
        title: "값을 복사한 람다",
        body: "[ ] 안에 이름을 쓰면 그 변수를 복사해 람다가 갖는다. remove_if가 조건자로 호출하는 함수 객체다.",
        kind: "syntax",
      },
      {
        find: "loads.erase(it, loads.end());",
        title: "지운 자리 정리",
        body: "remove_if의 반환 위치부터 끝까지 실제로 지운다. 두 단계가 합쳐져 erase-remove 관용구라 부른다.",
        kind: "idiom",
      },
      {
        find: "std::sort(loads.begin(), loads.end())",
        title: "반복자 쌍으로 정렬",
        body: "STL 알고리즘은 컨테이너가 아니라 반복자 쌍을 받는다. 그래서 배열·벡터·직접 만든 구조에도 같은 함수가 동작한다.",
        kind: "std",
      },
      {
        find: "std::accumulate(loads.begin(), loads.end(), 0)",
        title: "초깃값 0으로 합산",
        body: "세 번째 인자가 합의 시작값이다. 0을 주면 전체 합이 된다.",
        kind: "std",
      },
      {
        find: "loads.empty() ? 0 : loads.back()",
        title: "빈 벡터 방어",
        body: "back()은 빈 컨테이너에서 미정의 동작이므로 먼저 검사한다. 걸러진 원소가 하나뿐인 경우도 안전하게 처리된다.",
        kind: "idiom",
      },
    ],
    takeaway: "remove_if는 재배치일 뿐 삭제가 아니며, erase와 짝이 되어야 완성된다.",
    check: {
      question: "erase를 빼고 remove_if만 부르면?",
      options: [
        "벡터 크기는 그대로고 뒤쪽에 옮겨진 원소들이 남는다",
        "조건에 맞는 원소만 즉시 사라진다",
        "컴파일이 거부된다",
      ],
      answer: 0,
      explain: "remove_if는 조건을 만족하지 않는 원소를 앞쪽으로 옮기고 새 논리적 끝을 돌려줄 뿐이다. 실제 크기 줄이기는 erase의 몫이다. 둘이 짝이 되어야 erase-remove 관용구가 완성된다.",
    },
  },
  {
    no: 36,
    date: "2026.09.10",
    title: "파일 핸들을 소유하는 클래스",
    dek: "복사는 지우고 이동으로 소유권을 넘긴다.",
    minutes: 3,
    language: "C++",
    domain: "시스템",
    prompt: "복사를 막아둔 클래스를 대입하면 무슨 일이 일어날까, 이동의 흐름을 따라 읽어 보라.",
    code: `#include <cstdio>
#include <utility>

class LogFile {
public:
    explicit LogFile(const char* path) : file_(std::fopen(path, "w")) {}
    ~LogFile() { if (file_) std::fclose(file_); }
    LogFile(const LogFile&) = delete;
    LogFile& operator=(const LogFile&) = delete;
    LogFile(LogFile&& other) noexcept : file_(other.file_) {
        other.file_ = nullptr;
    }
    LogFile& operator=(LogFile&& other) noexcept {
        if (this != &other) {
            if (file_) std::fclose(file_);
            file_ = std::exchange(other.file_, nullptr);
        }
        return *this;
    }
private:
    std::FILE* file_;
};`,
    annotations: [
      {
        find: "~LogFile()",
        title: "소멸자가 자원을 닫는다",
        body: "객체가 죽는 모든 경로에서 파일을 닫는다. 예외가 던져져 스택이 풀려도 소멸자는 불린다. 이것이 RAII의 핵심 약속이다.",
        kind: "concept",
      },
      {
        find: "= delete;",
        title: "복사 금지",
        body: "복사 생성과 복사 대입을 지워 두 객체가 하나의 핸들을 함께 갖는 일을 막는다. 복사 시도는 컴파일 오류로 잡힌다.",
        kind: "syntax",
      },
      {
        find: "LogFile(LogFile&& other) noexcept",
        title: "이동 생성자",
        body: "&&는 임시값이나 명시적으로 넘겨진 객체에서 소유권을 가져온다. noexcept 표기는 컨테이너가 늘어날 때 이동을 선택받는 조건이다.",
        kind: "syntax",
      },
      {
        find: "other.file_ = nullptr;",
        title: "넘겨준 쪽은 비운다",
        body: "이동 후 원본은 널을 가리켜 소멸 때 fclose하지 않는다. 핸들이 두 곳에서 닫히는 사고를 이 한 줄이 막는다.",
        kind: "idiom",
      },
      {
        find: "if (this != &other)",
        title: "자기 대입 검사",
        body: "x = x 형태의 자기 대입에서 자기 핸들을 먼저 닫아버리는 사고를 막는다. 대입 연산자의 상투적인 첫 수다.",
        kind: "idiom",
      },
      {
        find: "std::exchange(other.file_, nullptr)",
        title: "값을 바꿔 치환",
        body: "other.file_을 nullptr로 바꾸면서 이전 값을 돌려준다. 가져오기와 비우기가 한 식으로 끝난다.",
        kind: "std",
      },
      {
        find: "std::FILE* file_;",
        title: "유일한 소유자",
        body: "이 클래스 인스턴스가 핸들의 생사를 책임진다. 소유자가 하나뿐이므로 닫는 시점이 모호해지지 않는다.",
        kind: "concept",
      },
    ],
    takeaway: "RAII는 해제를 소멸자에 맡기고, 이동은 소유권을 옮겨 이중 해제를 막는다.",
    check: {
      question: "LogFile 객체를 함수에서 값으로 돌려주면 어떤 생성자가 쓰이는가?",
      options: [
        "복사 생성자 — 핸들을 복사해 두 객체가 함께 소유한다",
        "아무 생성자도 불리지 않고 포인터만 전달된다",
        "이동 생성자 — 파일 핸들 소유권이 새 객체로 넘어간다",
      ],
      answer: 2,
      explain: "복사는 = delete로 지워져 컴파일 오류이고, 임시값에서는 이동 생성자가 선택된다. 이동 후 원본은 nullptr을 가져 소멸 때 close하지 않는다.",
    },
  },
  {
    no: 35,
    date: "2026.09.10",
    title: "파일 한 줄씩 읽어 세기",
    dek: "fgets와 strtol로 텍스트 파일을 처리한다.",
    minutes: 2,
    language: "C",
    domain: "시스템",
    prompt: "열기·읽기·닫기 각 단계에서 실패를 어떻게 알아채는지 추적해 보라.",
    code: "#include <stdio.h>\n\nint count_large(FILE *fp, long limit) {\n    char line[256];\n    int hits = 0;\n    while (fgets(line, sizeof line, fp) != NULL) {\n        long value = strtol(line, NULL, 10);\n        if (value > limit) hits++;\n    }\n    return hits;\n}\n\nint main(void) {\n    FILE *fp = fopen(\"samples.txt\", \"r\");\n    if (fp == NULL) {\n        perror(\"samples.txt\");\n        return 1;\n    }\n    int hits = count_large(fp, 100);\n    fclose(fp);\n    printf(\"%d hits\\n\", hits);\n}",
    annotations: [
      {
        find: "char line[256];",
        title: "줄을 담을 버퍼",
        body: "스택에 256바이트 배열을 깐다. fgets는 최대 255자에 NUL까지 담으므로 긴 줄은 여러 번에 나눠 읽힌다.",
        kind: "concept",
      },
      {
        find: "fgets(line, sizeof line, fp)",
        title: "한 줄씩 읽기",
        body: "개행이나 파일 끝을 만날 때까지 한 줄을 읽는다. 더 읽을 게 없으면 NULL을 돌려 루프가 끝난다.",
        kind: "std",
      },
      {
        find: "strtol(line, NULL, 10)",
        title: "문자열을 정수로",
        body: "문자열 앞부분을 10진수로 해석한다. 두 번째 인자에 NULL을 넘기면 어디까지 읽었는지는 버린다.",
        kind: "std",
      },
      {
        find: "fopen(\"samples.txt\", \"r\")",
        title: "읽기 모드로 열기",
        body: "파일을 열어 스트림 핸들을 돌려준다. 실패하면 NULL이고 오류 내용은 errno에 남는다.",
        kind: "std",
      },
      {
        find: "perror(\"samples.txt\")",
        title: "오류 메시지 출력",
        body: "errno를 사람이 읽는 메시지로 바꿔 stderr에 출력한다. 접두사로 파일 이름을 붙여 무엇이 실패했는지 알린다.",
        kind: "std",
      },
      {
        find: "fclose(fp);",
        title: "스트림 닫기",
        body: "RAII가 없는 C는 성공 경로에서 직접 닫아야 한다. 닫기 전에 함수를 빠져나가면 자원이 샌다.",
        kind: "concept",
      },
      {
        find: "int main(void)",
        title: "인자 없는 진입점",
        body: "void는 매개변수가 없음을 명시한다. main의 반환값은 프로세스 종료 코드가 된다.",
        kind: "syntax",
      },
    ],
    takeaway: "C의 파일 IO는 반환값으로 성패를 확인하고, 연 스트림은 성공 경로에서 직접 닫는다.",
    check: {
      question: "fgets가 NULL을 돌려주는 시점은?",
      options: [
        "더 읽을 줄이 없거나 읽기 오류가 났을 때",
        "한 줄이 버퍼 크기 256을 넘겼을 때",
        "fopen이 실패했을 때만",
      ],
      answer: 0,
      explain: "긴 줄은 잘려서 여러 번에 나눠 반환되고, NULL은 끝이나 오류의 신호다. fopen 실패는 이미 앞에서 검사했다. 루프 조건이 바로 그 종료 신호를 쓴다.",
    },
  },
  {
    no: 34,
    date: "2026.09.10",
    title: "노드를 머리에 끼우기",
    dek: "malloc과 이중 포인터로 리스트 앞단을 고친다.",
    minutes: 2,
    language: "C",
    domain: "시스템",
    prompt: "head를 왜 포인터의 포인터로 받았을까, 호출자 쪽 변수와 함께 읽어 보라.",
    code: `#include <stdlib.h>
#include <string.h>

typedef struct Node {
    char *name;
    struct Node *next;
} Node;

Node *node_new(const char *name) {
    Node *n = malloc(sizeof(Node));
    if (n == NULL) return NULL;
    n->name = strdup(name);
    n->next = NULL;
    return n;
}

void push_front(Node **head, const char *name) {
    Node *n = node_new(name);
    if (n == NULL) return;
    n->next = *head;
    *head = n;
}`,
    annotations: [
      {
        find: "char *name;",
        title: "문자열 필드",
        body: "C에서 문자열은 char의 연속을 가리키는 포인터다. 노드가 복사본을 소유하므로 해제 책임도 노드에 있다.",
        kind: "concept",
      },
      {
        find: "malloc(sizeof(Node))",
        title: "힙에 구조체 할당",
        body: "sizeof로 구조체 크기를 구해 힙에 자리를 낸다. 성공하면 그 주소를, 실패하면 NULL을 돌려준다.",
        kind: "std",
      },
      {
        find: "if (n == NULL) return NULL;",
        title: "할당 실패 검사",
        body: "malloc은 실패를 NULL로 알린다. 검사 없이 멤버에 접근하면 미정의 동작이 된다.",
        kind: "idiom",
      },
      {
        find: "strdup(name)",
        title: "문자열 복사해 소유",
        body: "인자로 받은 문자열을 새 힙 메모리에 복사한다. 호출자 버퍼가 사라져도 노드가 갖고 있을 수 있다.",
        kind: "std",
      },
      {
        find: "Node **head",
        title: "포인터의 포인터",
        body: "리스트가 비었을 때는 head 변수 자체를 바꿔야 한다. C에는 참조 전달이 없어 변수의 주소를 받는다.",
        kind: "concept",
      },
      {
        find: "n->next = *head;",
        title: "이전 머리를 다음으로",
        body: "새 노드의 next가 지금의 머리를 가리키게 한다. 기존 리스트가 뒤에 그대로 붙는다.",
        kind: "idiom",
      },
      {
        find: "*head = n;",
        title: "머리 교체",
        body: "이중 포인터를 풀어 호출자의 head 변수에 새 노드를 쓴다. 함수가 돌아온 뒤에도 변경이 남는다.",
        kind: "idiom",
      },
    ],
    takeaway: "호출자의 포인터를 고치려면 그 주소를 받는다 — 이중 포인터는 C의 참조 전달이다.",
    check: {
      question: "push_front가 head를 Node **로 받은 이유는?",
      options: [
        "노드가 두 겹으로 중첩된 구조라서",
        "const char*와 구분하기 위한 이름 관습이라서",
        "빈 리스트일 때도 호출자의 head 변수 값을 직접 바꾸기 위해",
      ],
      answer: 2,
      explain: "C는 참조 전달이 없어 함수 안에서 호출자의 변수를 고치려면 그 주소를 받아야 한다. head가 Node* 값 하나였다면 *head = n은 함수가 끝나며 사라진다. 이중 포인터는 포인터를 고친다는 의도를 드러내는 관용구다.",
    },
  },
  {
    no: 33,
    date: "2026.09.10",
    title: "작업 띄워 결과 받기",
    dek: "tokio spawn과 mpsc 채널로 비동기 흐름을 읽는다.",
    minutes: 3,
    language: "Rust",
    framework: "tokio",
    domain: "시스템",
    prompt: "수신 루프는 언제 끝날까 — 채널이 닫히는 시점에 주목해 읽어 보라.",
    code: `use std::time::Duration;
use tokio::sync::mpsc;
use tokio::time::sleep;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel(8);
    let worker = tokio::spawn(async move {
        for i in 0..3 {
            sleep(Duration::from_millis(50)).await;
            let _ = tx.send(format!("job {i} done")).await;
        }
    });
    while let Some(msg) = rx.recv().await {
        println!("got: {msg}");
    }
    worker.await.unwrap();
}`,
    annotations: [
      {
        find: "#[tokio::main]",
        title: "비동기 진입점",
        body: "async fn main을 그냥 실행할 수는 없어 이 매크로가 런타임을 세팅한다. 스레드 풀과 이벤트 루프를 만들고 main을 그 위에서 돌린다.",
        kind: "syntax",
      },
      {
        find: "mpsc::channel(8)",
        title: "버퍼 8짜리 채널",
        body: "생산자와 소비자 사이에 메시지 큐를 놓는다. 버퍼가 가득 차면 send가 대기해 생산 속도가 소비를 앞지르지 않는다.",
        kind: "std",
      },
      {
        find: "tokio::spawn",
        title: "작업 맡기기",
        body: "future를 런타임에 등록해 독립적으로 실행한다. 반환된 JoinHandle을 await하면 작업 종료를 기다릴 수 있다.",
        kind: "std",
      },
      {
        find: "async move",
        title: "소유권 이동 클로저",
        body: "tx를 future 안으로 move해 소유한다. future가 끝나는 순간 tx가 drop되고 채널이 닫힌다.",
        kind: "idiom",
      },
      {
        find: ".await;",
        title: "완료까지 양보",
        body: "await 지점에서 현재 작업이 잠시 멈추고 런타임이 다른 작업을 실행한다. 스레드를 막지 않으므로 소수 스레드로 많은 작업이 돈다.",
        kind: "syntax",
      },
      {
        find: "tx.send(",
        title: "결과 보내기",
        body: "send도 await하는 비동기 함수다. let _로 반환값을 무시하는데, 수신자가 살아 있는 동안엔 실패하지 않는다.",
        kind: "std",
      },
      {
        find: "rx.recv().await",
        title: "수신 대기",
        body: "메시지가 오면 그것을, 모든 송신자가 끝나면 None을 돌려준다. while let은 None을 받으면 루프를 닫는다.",
        kind: "std",
      },
    ],
    takeaway: "await는 스레드를 막지 않고 작업을 양보하며, 채널이 닫히는 시점은 곧 송신자의 수명이다.",
    check: {
      question: "while let 수신 루프가 정상적으로 끝나는 조건은?",
      options: [
        "버퍼 용량 8이 가득 차서 send가 막힐 때",
        "worker가 끝나면서 tx가 drop되어 recv가 None을 돌려줄 때",
        "sleep 50ms가 세 번 끝나는 순간",
      ],
      answer: 1,
      explain: "recv는 채널이 닫히고 버퍼가 비면 None을 돌려준다. tx를 유일하게 소유한 worker 작업이 끝나는 것이 곧 채널 닫힘이다. main은 recv가 None을 받은 뒤 worker.await로 종료를 확인한다.",
    },
  },
  {
    no: 32,
    date: "2026.09.10",
    title: "두 슬라이스 중 긴 쪽",
    dek: "라이프타임 매개변수로 빌린 값의 관계를 표기한다.",
    minutes: 3,
    language: "Rust",
    domain: "시스템",
    prompt: "반환 참조는 두 입력 중 누구의 수명을 따르게 될까, 표기만 보고 예상해 보라.",
    code: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() {
        x
    } else {
        y
    }
}

struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn announce(&self, msg: &str) -> String {
        format!("{}: {}", msg, self.part)
    }
}

fn main() {
    let novel = String::from("오래 읽는 이야기");
    let first = novel.split(' ').next().unwrap();
    let ex = Excerpt { part: longest(novel.as_str(), first) };
    println!("{}", ex.announce("발췌"));
}`,
    annotations: [
      {
        find: "<'a>",
        title: "라이프타임 매개변수",
        body: "'a는 참조가 유효한 범위를 붙이는 이름일 뿐이며 실행 때 아무 코드도 남지 않는다. 함수가 참조를 돌려줄 때 입력과 출력의 관계를 이 매개변수로 선언한다.",
        kind: "syntax",
      },
      {
        find: "-> &'a str",
        title: "수명이 묶인 반환값",
        body: "돌려주는 슬라이스는 x나 y가 가리키는 데이터 그 자체다. 'a로 묶어 두었기 때문에 컴파일러가 반환 참조를 두 입력 중 짧은 수명으로 제한해 검사한다.",
        kind: "concept",
      },
      {
        find: "struct Excerpt<'a>",
        title: "참조를 담는 구조체",
        body: "구조체가 참조를 필드로 가지면 인스턴스마다 수명 매개변수가 필요하다. 선언의 'a가 필드가 빌리는 원본의 수명을 가리킨다.",
        kind: "syntax",
      },
      {
        find: "part: &'a str,",
        title: "빌린 문자열 보관",
        body: "Excerpt는 문자열을 소유하지 않고 빌려만 둔다. 그래서 Excerpt 값은 원본이 살아 있는 동안만 존재할 수 있다.",
        kind: "concept",
      },
      {
        find: "novel.split(' ')",
        title: "공백으로 자르기",
        body: "split은 원본을 자른 조각(&str)을 하나씩 내주는 반복자다. 조각은 원본을 참조할 뿐 새 문자열을 만들지 않는다.",
        kind: "std",
      },
      {
        find: "&self",
        title: "빌린 자기 자신",
        body: "메서드는 소유권을 가져오지 않고 &self로 인스턴스를 빌려 읽기만 한다. 인자 msg도 빌린 문자열 슬라이스다.",
        kind: "syntax",
      },
    ],
    takeaway: "라이프타임 표기는 수명을 늘리는 게 아니라 빌린 참조의 관계를 컴파일러에게 알리는 선언이다.",
    check: {
      question: "first가 novel보다 먼저 스코프를 벗어나면 어떻게 되는가?",
      options: [
        "Excerpt가 빌린 참조를 갖고 있으므로 컴파일러가 거부한다",
        "실행 중에 세그폴트가 날 뿐 컴파일은 통과한다",
        "longest가 novel 쪽을 돌려줬으니 문제없이 컴파일된다",
      ],
      answer: 0,
      explain: "Excerpt의 part는 'a 수명의 참조라 두 원본 중 짧은 쪽보다 오래 살 수 없다. first를 먼저 벗어나면 참조 대상이 사라질 수 있어 컴파일이 막는다. longest가 실제로 무엇을 돌려주는지와 무관하게 표기만으로 판단한다.",
    },
  },
  {
    no: 31,
    date: "2026.09.10",
    title: "기다림은 단언이 한다",
    dek: "sleep 없이 로그인 플로우를 검사한다. locator와 웹 우선 단언의 기다림을 본다.",
    minutes: 2,
    language: "TypeScript",
    framework: "Playwright",
    domain: "프론트엔드",
    prompt: "이 테스트에는 sleep이 없다 — 대신 무엇이 기다리는가",
    code: `import { test, expect } from "@playwright/test";

test("로그인하면 대시보드로 넘어간다", async ({ page }) => {
  await page.goto("/login");

  const email = page.getByLabel("이메일");
  await email.fill("ada@example.com");
  await page.getByLabel("비밀번호").fill("secret123");
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page.getByRole("heading", { name: "대시보드" })).toBeVisible();

  const rows = page.getByRole("row");
  await expect(rows).toHaveCount(5);

  await expect(page).toHaveURL("/dashboard");
});`,
    annotations: [
      {
        find: "page.getByLabel(\"이메일\")",
        title: "레이블로 찾기",
        body: "폼 컨트롤을 접근성 레이블로 찾는다. CSS 선택자보다 화면 구조가 바뀌어도 덜 깨진다.",
        kind: "std",
      },
      {
        find: "getByRole(\"button\", { name: \"로그인\" })",
        title: "역할과 접근 이름",
        body: "역할과 접근 가능한 이름으로 찾는다. 접근성 트리 기준이므로 실제 사용자가 요소를 부르는 방식과 같다.",
        kind: "std",
      },
      {
        find: ".click();",
        title: "행동은 자동 대기",
        body: "locator의 행동은 요소가 보이고 가능해질 때까지 기다렸다가 실행된다. 재시도 코드를 직접 쓰지 않아도 된다.",
        kind: "concept",
      },
      {
        find: "expect(page.getByRole(\"heading\", { name: \"대시보드\" })).toBeVisible()",
        title: "웹 우선 단언",
        body: "조건이 만족될 때까지 제한 시간 안에 계속 다시 검사한다. 화면 전환을 기다리는 표준 방법이다.",
        kind: "std",
      },
      {
        find: "const rows = page.getByRole(\"row\");",
        title: "locator는 주소다",
        body: "locator는 만든 시점의 요소가 아니라 찾는 방법을 담는다. DOM이 다시 그려져도 접근할 때마다 새로 찾는다.",
        kind: "concept",
      },
      {
        find: "await expect(rows).toHaveCount(5);",
        title: "개수 단언",
        body: "행 개수가 정확히 다섯이 될 때까지 재검사한다. 목록 로딩이 끝나기를 기다리는 데 자주 쓴다.",
        kind: "std",
      },
      {
        find: "await expect(page).toHaveURL(\"/dashboard\");",
        title: "주소 단언",
        body: "URL이 기대와 같아질 때까지 기다린다. 클릭 뒤의 라우팅 이동이 끝났음을 확인할 때 쓴다.",
        kind: "std",
      },
    ],
    takeaway: "locator는 찾는 방법이고 웹 우선 단언이 기다림을 대신한다 — sleep은 느리고 불안정하다.",
    check: {
      question: "toBeVisible을 sleep(3000)으로 대체하면 이 테스트는 어떻게 되는가",
      options: [
        "같은 동작을 조금 더 느리게 한다",
        "전환이 3초보다 늦으면 여전히 실패하고, 빠르면 항상 3초를 기다린다",
        "Playwright가 sleep을 자동으로 단축한다",
      ],
      answer: 1,
      explain: "웹 우선 단언은 조건이 생기는 즉시 통과하지만 고정 sleep은 항상 그 시간만큼 흐른다. 그리고 정해 둔 시간보다 화면이 늦으면 실패한다. 기다림은 단언의 재검사로 처리하는 편이 안정적이고 빠르다.",
    },
  },
  {
    no: 30,
    date: "2026.09.10",
    title: "queryKey가 캐시다",
    dek: "할 일 추가 뒤 목록을 다시 읽게 만든다. queryKey와 무효화의 관계를 본다.",
    minutes: 3,
    language: "TypeScript",
    framework: "TanStack Query",
    domain: "프론트엔드",
    prompt: "할 일이 추가된 뒤 목록 캐시는 어떻게 다시 읽히는가",
    code: `import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: () => api.get("/todos"),
  });
}

export function useAddTodo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => api.post("/todos", { text }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}`,
    annotations: [
      {
        find: "queryKey: [\"todos\"],",
        title: "캐시 주소",
        body: "같은 키를 쓰는 useQuery끼리 같은 캐시 항목을 공유한다. 키는 배열로 쓰고, 앞 원소부터 내려가며 계층을 이룬다.",
        kind: "concept",
      },
      {
        find: "queryFn: () => api.get(\"/todos\"),",
        title: "값을 가져오는 함수",
        body: "캐시에 없거나 낡았을 때만 불린다. 이 함수가 거절하면 query 상태가 error가 된다.",
        kind: "std",
      },
      {
        find: "useQueryClient()",
        title: "캐시 손잡이",
        body: "캐시를 읽고 무효화하는 클라이언트를 꺼낸다. 변이 뒤에 데이터를 다시 읽게 만드는 통로다.",
        kind: "std",
      },
      {
        find: "mutationFn: (text: string) => api.post(\"/todos\", { text }),",
        title: "변이 함수",
        body: "서버 상태를 바꾸는 요청을 담는다. useQuery와 달리 자동으로 불리지 않고 mutate를 부를 때만 실행된다.",
        kind: "std",
      },
      {
        find: "onSuccess: () => {",
        title: "성공 뒤처리",
        body: "변이가 성공한 뒤에 도는 자리다. 여기서 캐시를 정리하지 않으면 목록이 추가 전 값을 계속 보여 준다.",
        kind: "std",
      },
      {
        find: "qc.invalidateQueries({ queryKey: [\"todos\"] });",
        title: "키 접두 무효화",
        body: "'todos'로 시작하는 모든 키를 낡은 표시로 바꾼다. ['todos', 3] 같은 자식 키도 함께 다시 읽힌다.",
        kind: "idiom",
      },
    ],
    takeaway: "queryKey가 캐시 주소다 — 변이 뒤에는 invalidateQueries가 낡은 표시를 붙이고 refetch가 따라온다.",
    check: {
      question: "useAddTodo가 성공하면 queryKey가 ['todos', id]인 다른 쿼리는 어떻게 되는가",
      options: [
        "키가 정확히 같지 않으므로 그대로 낡은 값을 보여 준다",
        "무효화되어 마운트돼 있으면 곧바로 다시 읽는다",
        "useTodos만 다시 읽고 나머지는 수동으로 고쳐야 한다",
      ],
      answer: 1,
      explain: "invalidateQueries는 배열 키를 접두사처럼 비교한다. ['todos']로 무효화하면 ['todos', 3] 같은 자식 키까지 모두 낡은 표시가 된다. 화면에 마운트된 쿼리는 즉시 refetch되고, 아니면 다음 마운트 때 새로 읽는다.",
    },
  },
  {
    no: 29,
    date: "2026.09.10",
    title: "버퍼로 파일 머리 검사하기",
    dek: "파일 앞머리의 바이트를 검사한다. Buffer의 비교·자르기·잇기를 본다.",
    minutes: 2,
    language: "JavaScript",
    framework: "Node.js",
    domain: "백엔드",
    prompt: "head는 원본 버퍼와 무엇을 공유하는가",
    code: "import { readFile, writeFile, stat } from \"node:fs/promises\";\n\nconst marker = Buffer.from([0xff, 0xd8, 0xff]); // JPEG 시그니처\n\nconst info = await stat(\"sample.bin\");\nconst head = (await readFile(\"sample.bin\")).subarray(0, marker.length);\n\nif (!head.equals(marker)) {\n  const note = Buffer.from(\"not a jpeg: \" + head.toString(\"hex\") + \"\\n\");\n  await writeFile(\"sample.report\", Buffer.concat([note, head]));\n  process.exit(1);\n}\n\nconsole.log(info.size, \"바이트 — JPEG 맞다\");",
    annotations: [
      {
        find: "Buffer.from([0xff, 0xd8, 0xff])",
        title: "바이트열 만들기",
        body: "바이트 값 배열로 Buffer를 만든다. JPEG 파일은 이 순서의 바이트로 시작하므로 서명 검사에 쓴다.",
        kind: "std",
      },
      {
        find: "stat(\"sample.bin\")",
        title: "파일 정보",
        body: "내용을 읽기 전에 크기·수정 시각 같은 메타데이터를 본다. promise 기반 API라 await과 함께 쓴다.",
        kind: "std",
      },
      {
        find: "subarray(0, marker.length)",
        title: "버퍼 잘라 보기",
        body: "복사가 아니라 같은 메모리를 가리키는 작은 창을 만든다. 앞 몇 바이트만 볼 때 전체를 다루지 않아도 된다.",
        kind: "std",
      },
      {
        find: "head.equals(marker)",
        title: "바이트 비교",
        body: "Buffer끼리 ===로 비교하면 참조가 같은지를 본다. 내용이 같은지는 equals가 바이트 단위로 비교한다.",
        kind: "std",
      },
      {
        find: "head.toString(\"hex\")",
        title: "인코딩 바꿔 보기",
        body: "바이트를 지정한 인코딩의 문자열로 바꾼다. hex는 한 바이트가 두 글자가 되므로 로그로 남기기 좋다.",
        kind: "std",
      },
      {
        find: "Buffer.concat([note, head])",
        title: "버퍼 잇기",
        body: "버퍼 여러 개를 이어 붙인 새 버퍼를 만든다. + 연산자는 문자열용이므로 바이트열에는 concat을 쓴다.",
        kind: "std",
      },
      {
        find: "process.exit(1)",
        title: "실패 코드로 끝내기",
        body: "0이 아닌 종료 코드는 비정상 종료를 뜻한다. 이 스크립트를 잇는 상위 단계가 실패를 알 수 있게 한다.",
        kind: "std",
      },
    ],
    takeaway: "Buffer의 조작은 전부 바이트 단위다 — 비교는 equals, 잘라 보기는 subarray, 잇기는 concat.",
    check: {
      question: "subarray로 잘라 둔 head의 앞 바이트를 고치면 원본 버퍼는 어떻게 되는가",
      options: [
        "그대로다 — subarray는 복사본이라",
        "readFile을 다시 불러야 알 수 있다",
        "같이 바뀐다 — subarray는 같은 메모리를 가리킨다",
      ],
      answer: 2,
      explain: "subarray는 새 Buffer 객체를 만들지만 복사는 하지 않는다. 원본과 같은 메모리를 바라보므로 한쪽을 고치면 다른 쪽도 바뀐다. 진짜 복사가 필요하면 Buffer.from(head)처럼 복사본을 만들어야 한다.",
    },
  },
  {
    no: 28,
    date: "2026.09.10",
    title: "파이프라인으로 파일 복사하기",
    dek: "파일을 조각으로 읽어 세면서 복사한다. Transform과 pipeline의 역할 분담을 본다.",
    minutes: 3,
    language: "JavaScript",
    framework: "Node.js",
    domain: "백엔드",
    prompt: "복사 도중에 오류가 나면 누가 무엇을 정리하는가",
    code: `import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

const tap = new Transform({
  transform(chunk, enc, done) {
    this.seen = (this.seen ?? 0) + chunk.length;
    done(null, chunk);
  },
  flush(done) {
    console.error("지나간 바이트:", this.seen);
    done();
  },
});

await pipeline(
  createReadStream("access.log"),
  tap,
  createWriteStream("copy.log"),
);

console.log("복사가 끝났다");`,
    annotations: [
      {
        find: "new Transform({",
        title: "변환 스트림",
        body: "읽은 청크를 바꾸거나 그대로 통과시켜 내보내는 이중 스트림이다. 읽기와 쓰기를 한 객체로 연결한다.",
        kind: "std",
      },
      {
        find: "transform(chunk, enc, done) {",
        title: "청크마다 도는 콜백",
        body: "조각(chunk) 단위로 불린다. done(null, 값)으로 다음 스트림에 흘려보낼 내용을 넘긴다.",
        kind: "std",
      },
      {
        find: "chunk.length",
        title: "청크는 Buffer다",
        body: "기본으로 chunk는 Buffer라 length는 바이트 수다. 문자열 길이가 아니므로 멀티바이트 문자에서는 다를 수 있다.",
        kind: "concept",
      },
      {
        find: "done(null, chunk);",
        title: "그대로 흘려보내기",
        body: "첫 인자는 오류, 둘째는 다음으로 흘려보낼 값이다. 여기서는 센 원본 청크를 그대로 넘긴다.",
        kind: "std",
      },
      {
        find: "flush(done) {",
        title: "끝에서 한 번",
        body: "입력이 모두 끝난 뒤 한 번 불린다. 여기서도 done을 불러야 스트림이 정상적으로 닫힌다.",
        kind: "std",
      },
      {
        find: "await pipeline(",
        title: "파이프라인",
        body: "스트림들을 이어 주고 오류와 뒷마무리를 한 곳에서 처리한다. promise로 귀결되므로 await과 함께 쓴다.",
        kind: "std",
      },
      {
        find: "createReadStream(\"access.log\"),",
        title: "읽기 스트림",
        body: "파일을 통째로 메모리에 올리지 않고 조각으로 읽는다. 큰 파일도 일정한 메모리로 처리할 수 있는 이유다.",
        kind: "std",
      },
    ],
    takeaway: "스트림은 조각 단위로 일하고 pipeline이 이어 주어야 오류와 종료가 한 번에 정리된다.",
    check: {
      question: "pipeline 대신 source.pipe(tap).pipe(target)으로 바꾸면 무엇이 문제인가",
      options: [
        "속도가 절반으로 떨어진다",
        "중간에서 오류가 나도 나머지 스트림이 자동으로 닫히지 않는다",
        "chunk가 문자열로 바뀐다",
      ],
      answer: 1,
      explain: "pipe는 오류를 다음 스트림으로 전파하지 않는다. 중간 스트림이 실패하면 다른 스트림이 열린 채 남는다. pipeline은 어느 조각이 실패해도 전부 정리하고 promise를 기각한다.",
    },
  },
  {
    no: 27,
    date: "2026.09.10",
    title: "검색창 하나로 보는 연산자 체인",
    dek: "입력창 하나에 debounceTime부터 switchMap까지. 체인의 순서가 만드는 동작을 본다.",
    minutes: 3,
    language: "TypeScript",
    framework: "RxJS",
    domain: "프론트엔드",
    prompt: "타이핑이 이어지는 동안 search는 몇 번 불리는가",
    code: `import {
  fromEvent, of,
  map, filter, debounceTime, distinctUntilChanged, switchMap, catchError,
} from "rxjs";

const input = document.querySelector<HTMLInputElement>("#q")!;

fromEvent(input, "input")
  .pipe(
    map((event) => (event.target as HTMLInputElement).value.trim()),
    filter((q) => q.length >= 2),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((q) => search(q).pipe(catchError(() => of([])))),
  )
  .subscribe((hits) => showResults(hits));`,
    annotations: [
      {
        find: "fromEvent(input, \"input\")",
        title: "이벤트를 스트림으로",
        body: "DOM 이벤트를 무한히 흐르는 옵서버블로 만든다. addEventListener 대신 연산자를 얹어 흐름을 다룬다.",
        kind: "std",
      },
      {
        find: ".pipe(",
        title: "연산자 조립대",
        body: "연산자를 나열해 흐름을 단계로 엮는다. 값이 위에서 아래로 지나가며 각 단계를 거치고 subscribe에 도달한다.",
        kind: "concept",
      },
      {
        find: "map((event) =>",
        title: "값 바꾸기",
        body: "값을 다른 모양으로 바꾸는 단계다. 여기서는 이벤트 객체에서 검색어 문자열만 꺼내고 다듬는다.",
        kind: "std",
      },
      {
        find: "filter((q) => q.length >= 2),",
        title: "짧은 입력 거르기",
        body: "조건을 통과하지 못하면 다음 단계로 흘러가지 않는다. 한 글자 입력으로는 요청이 만들어지지 않는다.",
        kind: "std",
      },
      {
        find: "debounceTime(300),",
        title: "입력 뭉치기",
        body: "300ms 안에 새 값이 오면 앞 값을 버리고 다시 센다. 타이핑이 멈춰야 다음 단계로 흘러가므로 글자마다 요청이 나가지 않는다.",
        kind: "std",
      },
      {
        find: "distinctUntilChanged(),",
        title: "같은 값 걸러내기",
        body: "직전 값과 같으면 흘려보내지 않는다. 같은 검색어로 다시 도착한 입력이 요청을 유발하지 않게 한다.",
        kind: "std",
      },
      {
        find: "switchMap((q) => search(q)",
        title: "최신 요청만 살린다",
        body: "새 값이 오면 지금 구독 중인 내부 옵서버블을 버리고 새것으로 갈아탄다. 늦게 도착한 옛 응답이 새 결과를 덮는 경합을 막는 표준 조합이다.",
        kind: "idiom",
      },
      {
        find: "catchError(() => of([]))",
        title: "실패를 값으로",
        body: "요청이 실패하면 빈 배열을 하나 흘려 보내는 옵서버블로 갈아낀다. 오류가 구독을 끊지 않게 하는 장치다.",
        kind: "std",
      },
    ],
    takeaway: "체인 순서가 곧 동작이다 — 거르고, 뭉치고, 최신 요청으로 갈아타는 것까지 연산자가 한다.",
    check: {
      question: "사용자가 'react'를 빠르게 이어 타이핑하면 search는 언제 몇 번 불리는가",
      options: [
        "글자가 들어올 때마다 다섯 번",
        "타이핑이 300ms 멈춘 뒤, 마지막 검색어로 한 번",
        "길이가 2를 넘은 시점부터 매 글자마다",
      ],
      answer: 1,
      explain: "debounceTime은 입력이 멈춰야 값을 다음 단계로 흘려보낸다. 이어지는 입력은 앞 값을 계속 버리므로 최종 검색어 하나로 요청이 한 번 나간다. filter의 길이 조건은 흐름을 거를 뿐 요청을 늘리지 않는다.",
    },
  },
  {
    no: 26,
    date: "2026.09.10",
    title: "서버 컴포넌트와 캐시 태그",
    dek: "서버에서 데이터를 읽어 그리는 페이지. fetch 캐시 옵션과 태그 무효화가 만나는 지점을 본다.",
    minutes: 3,
    language: "TypeScript",
    framework: "Next.js",
    domain: "프론트엔드",
    prompt: "다시 읽기 버튼을 누르면 방문자 숫자는 언제 새 값으로 바뀌는가",
    code: `import { revalidateTag } from "next/cache";

async function getStats() {
  const res = await fetch("https://api.example.com/stats", {
    next: { tags: ["stats"], revalidate: 300 },
  });
  return res.json() as Promise<{ visitors: number }>;
}

export default async function Dashboard() {
  const stats = await getStats();
  async function refresh() {
    "use server";
    revalidateTag("stats");
  }
  return (
    <form action={refresh}>
      <p>방문자 {stats.visitors}</p>
      <button>다시 읽기</button>
    </form>
  );
}`,
    annotations: [
      {
        find: "next: { tags: [\"stats\"], revalidate: 300 },",
        title: "페치 캐시 옵션",
        body: "이 요청의 응답을 데이터 캐시에 넣고 300초 뒤까지 재사용하도록 표시한다. tags는 나중에 무효화할 때 부르는 이름표다.",
        kind: "std",
      },
      {
        find: "await getStats();",
        title: "렌더 때 읽기",
        body: "서버 컴포넌트는 렌더 시점에 데이터를 직접 읽는다. useState와 useEffect로 받아 오는 클라이언트 패턴이 여기서는 필요 없다.",
        kind: "concept",
      },
      {
        find: "\"use server\";",
        title: "서버 액션 선언",
        body: "이 함수가 클라이언트에서 호출 가능한 서버 액션임을 표시한다. 폼 제출을 서버에서 처리하는 함수가 된다.",
        kind: "syntax",
      },
      {
        find: "revalidateTag(\"stats\")",
        title: "태그로 캐시 무효화",
        body: "stats 태그를 단 캐시 항목을 전부 무효화한다. 서버 액션이나 라우트 핸들러 안에서만 부를 수 있다.",
        kind: "std",
      },
      {
        find: "<form action={refresh}>",
        title: "액션 연결 폼",
        body: "action에 함수를 넘기면 폼 제출이 그 서버 함수로 향한다. 자바스크립트가 꺼진 상태에서도 제출 자체는 동작한다.",
        kind: "idiom",
      },
      {
        find: "stats.visitors",
        title: "미리 채워진 값",
        body: "서버에서 계산이 끝난 값이 자리에 찍혀 내려온다. 브라우저는 이 자리를 채우려고 데이터를 다시 요청하지 않는다.",
        kind: "concept",
      },
    ],
    takeaway: "서버 컴포넌트는 렌더 때 데이터를 읽고, fetch 옵션이 캐시를, revalidateTag가 무효화 시점을 정한다.",
    check: {
      question: "다시 읽기 버튼으로 refresh가 돌면 화면의 방문자 숫자는 언제 새 값이 되는가",
      options: [
        "revalidateTag를 부른 즉시 응답 안에서",
        "stats 태그가 무효화되고, 다음 요청에서 페이지가 다시 렌더될 때",
        "revalidate 300초가 지나기 전에는 절대 안 바뀐다",
      ],
      answer: 1,
      explain: "revalidateTag는 태그가 붙은 캐시를 무효화한다. 무효화는 다음에 데이터를 읽을 때 새로 가져오라는 표시이고, 이미 그려진 화면은 다음 요청에서 다시 렌더돼야 새 값을 보여 준다.",
    },
  },
  {
    no: 25,
    date: "2026.09.10",
    title: "스토어와 달러 자동 구독",
    dek: "할 일 목록을 스토어로. writable·derived와 마크업의 $ 자동 구독을 본다.",
    minutes: 3,
    language: "JavaScript",
    framework: "Svelte",
    domain: "프론트엔드",
    prompt: "$remaining의 달러는 무엇을 하고, derived의 $todos는 무엇인가",
    code: `<script>
  import { writable, derived } from "svelte/store";

  const todos = writable([
    { id: 1, text: "우유 사기", done: false },
    { id: 2, text: "메일 답장", done: true },
  ]);
  const remaining = derived(todos, ($todos) => $todos.filter((t) => !t.done).length);
  function toggle(id) {
    todos.update((list) =>
      list.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }
</script>

<p>남은 할 일: {$remaining}</p>
{#each $todos as todo (todo.id)}
  <label>
    <input type="checkbox" checked={todo.done} on:change={() => toggle(todo.id)} />
    {todo.text}
  </label>
{/each}`,
    annotations: [
      {
        find: "writable([",
        title: "쓸 수 있는 스토어",
        body: "구독 가능한 상태 그릇을 만든다. set과 update로 값을 바꾸면 구독 중인 모든 곳에 알린다.",
        kind: "std",
      },
      {
        find: "derived(todos, ($todos) =>",
        title: "파생 스토어",
        body: "원본 스토어가 바뀔 때만 다시 계산되는 읽기 전용 스토어다. 첫 인자를 배열로 넘기면 여러 스토어를 조합할 수도 있다.",
        kind: "std",
      },
      {
        find: "$todos.filter((t) => !t.done).length",
        title: "달러 프리픽스 관례",
        body: "콜백 인자 이름을 $todos로 지어 원본 todos와 구분하는 관례다. 이 자체는 보통 변수일 뿐 자동 구독과는 다르다.",
        kind: "concept",
      },
      {
        find: "todos.update((list) =>",
        title: "갱신 함수",
        body: "현재 값을 인자로 받아 다음 값을 돌려준다. 원본 배열을 고치지 않고 새 배열을 만들어 넘기는 불변 갱신 모양이다.",
        kind: "std",
      },
      {
        find: "$remaining",
        title: "자동 구독",
        body: "마크업에서 $를 붙이면 컴포넌트가 스토어를 구독해 값만 꺼내 쓴다. 구독 해제는 컴포넌트가 사라질 때 자동이다.",
        kind: "syntax",
      },
      {
        find: "$todos as todo (todo.id)",
        title: "키가 있는 each",
        body: "(todo.id)로 각 항목의 키를 알려 준다. 목록이 재정렬돼도 DOM 노드를 알맞게 옮겨 항목 상태가 섞이지 않게 한다.",
        kind: "idiom",
      },
      {
        find: "on:change={() => toggle(todo.id)}",
        title: "이벤트 지시자",
        body: "on: 이벤트 이름으로 핸들러를 연결한다. 토글은 스토어만 바꾸고, 화면은 스토어 변경을 따라 다시 그려진다.",
        kind: "syntax",
      },
    ],
    takeaway: "스토어는 컴포넌트 밖 상태 그릇이고 $는 자동 구독 문법이다 — 계산으로 구할 값은 derived로 둔다.",
    check: {
      question: "remaining을 writable로 만들고 toggle마다 손으로 갱신하면 어떤 위험이 생기는가",
      options: [
        "toggle을 지나는 갱신 경로가 하나라도 빠지면 remaining이 낡은 값을 유지한다",
        "값이 조금 늦게 화면에 반영된다",
        "스토어가 컴포넌트 안에 있으면 안 되므로 오류가 난다",
      ],
      answer: 0,
      explain: "derived는 원본이 바뀌면 항상 따라 계산된다. writable을 손으로 갱신하면 모든 변경 경로에서 개수를 같이 고쳐야 하고, 한 곳이라도 빠지면 파생 값이 원본과 어긋난다. 계산으로 구할 수 있는 값은 derived로 두는 편이 안전하다.",
    },
  },
  {
    no: 24,
    date: "2026.09.10",
    title: "ref·computed·watch의 역할 나누기",
    dek: "채팅 메시지를 불러와 거르는 컴포넌트. ref·computed·watch·onMounted가 각자 맡는 구간을 본다.",
    minutes: 3,
    language: "JavaScript",
    framework: "Vue 3",
    domain: "프론트엔드",
    prompt: "filter 입력이 바뀌면 visible은 언제 다시 계산되는가",
    code: `<script setup>
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  channelId: { type: String, required: true },
});
const messages = ref([]);
const filter = ref("");
const visible = computed(() =>
  messages.value.filter((m) => m.text.includes(filter.value))
);

watch(filter, (next) => {
  console.log("filter:", next);
});

onMounted(async () => {
  const url = "/api/messages?channel=" + props.channelId;
  const res = await fetch(url);
  messages.value = await res.json();
});
</script>`,
    annotations: [
      {
        find: "<script setup>",
        title: "싱글 파일 컴포넌트의 스크립트",
        body: "setup 속성은 이 블록 전체가 setup() 함수 몸통임을 뜻한다. 여기서 선언한 이름은 템플릿에 그대로 노출된다.",
        kind: "syntax",
      },
      {
        find: "ref([])",
        title: "반응형 상자",
        body: "값을 반응형으로 감싼다. 스크립트에서는 .value로 읽고 쓰고, 템플릿에서는 벗겨진 채로 쓴다.",
        kind: "std",
      },
      {
        find: "computed(() =>",
        title: "계산된 참조",
        body: "의존하는 반응형 값이 바뀔 때만 다시 계산하고 결과를 캐시한다. 템플릿에서는 .value 없이 이름만으로 읽는다.",
        kind: "std",
      },
      {
        find: "filter.value",
        title: "value로 접근",
        body: "computed 몸통에서 다른 ref를 읽을 때도 .value가 필요하다. 이 참조가 추적되어 filter가 바뀌면 visible이 다시 계산된다.",
        kind: "concept",
      },
      {
        find: "watch(filter, (next) => {",
        title: "부수 효과 분리",
        body: "computed는 값을 만들지만 watch는 값을 콜백으로 넘긴다. 기록·요청 같은 부수 효과는 watch 쪽에 둔다.",
        kind: "std",
      },
      {
        find: "onMounted(async () => {",
        title: "마운트 훅",
        body: "컴포넌트가 DOM에 붙은 뒤에 실행된다. 초기 데이터 요청은 보통 여기서 시작한다.",
        kind: "std",
      },
      {
        find: "props.channelId",
        title: "반응형 props",
        body: "props 객체는 반응형이다. 부모가 channelId를 바꾸면 이를 쓰는 계산과 화면이 따라 다시 돈다.",
        kind: "concept",
      },
    ],
    takeaway: "상태는 ref, 파생 값은 computed, 부수 효과는 watch에 둔다 — 문법이 곧 역할의 경계다.",
    check: {
      question: "computed 몸통에서 filter를 filter.value가 아니라 filter로 바로 쓰면 어떻게 되는가",
      options: [
        "같게 동작한다 — 템플릿과 똑같이 자동으로 벗겨 준다",
        "filter는 Ref 객체라 includes 비교가 늘 실패해 visible이 빈 배열이 된다",
        "컴파일 오류가 난다",
      ],
      answer: 1,
      explain: "script 블록에서는 ref 벗기기가 자동이 아니다. filter는 Ref 객체 자체라 includes의 인자로 넘어가고, 어떤 문자열과도 같지 않아 필터가 전부 걸러진다. .value를 붙여야 문자열이 나온다.",
    },
  },
  {
    no: 23,
    date: "2026.09.10",
    title: "커스텀 훅의 메모이제이션 경계",
    dek: "검색 필터 훅. useMemo와 useCallback이 무엇을 사고 무엇을 사지 않는지 본다.",
    minutes: 3,
    language: "TypeScript",
    framework: "React",
    domain: "프론트엔드",
    prompt: "matches와 reload는 각각 언제 새로 만들어지는가",
    code: `function useUserSearch(initial: User[]) {
  const [users, setUsers] = useState(initial);
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();

  const matches = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(trimmed)),
    [users, trimmed],
  );

  const reload = useCallback(async () => {
    const fresh = await api.fetchUsers();
    setUsers(fresh);
  }, []);

  return { query, setQuery, matches, reload };
}`,
    annotations: [
      {
        find: "useState(initial)",
        title: "상태 초기값",
        body: "훅 안에서도 useState를 그대로 쓴다. initial은 첫 렌더에서만 사용되고, 이후 부모가 새 배열을 넘겨도 이 상태는 바뀌지 않는다.",
        kind: "std",
      },
      {
        find: "const trimmed = query.trim().toLowerCase();",
        title: "파생 값은 그냥 계산",
        body: "매 렌더 다시 계산해도 값만 같다면 useMemo 없이 변수로 충분하다. 메모이제이션은 비용이 크거나 참조 안정이 필요할 때 쓴다.",
        kind: "idiom",
      },
      {
        find: "useMemo(",
        title: "계산 결과 캐시",
        body: "의존성이 바뀌지 않으면 이전 계산을 재사용한다. users나 trimmed가 바뀐 렌더에서만 filter를 다시 돌린다.",
        kind: "std",
      },
      {
        find: "[users, trimmed],",
        title: "의존성 배열",
        body: "이 값들이 얕게 같은 동안은 캐시를 유지하라는 약속이다. 빠뜨리면 낡은 값을, 넣으면 필요 이상으로 다시 계산한다.",
        kind: "concept",
      },
      {
        find: "useCallback(async () => {",
        title: "함수 정체 고정",
        body: "렌더마다 새로 만들어지는 함수 대신 같은 참조를 돌려준다. 자식에 내려 주거나 다른 이펙트의 의존성으로 쓸 때 불필요한 재실행을 막는다.",
        kind: "std",
      },
      {
        find: "}, []);",
        title: "빈 의존성 배열",
        body: "[]는 마운트 시점에 한 번 만든 함수를 평생 쓴다는 뜻이다. setUsers 같은 세터 함수는 언제나 참조가 안정적이라 넣지 않는다.",
        kind: "concept",
      },
      {
        find: "return { query, setQuery, matches, reload };",
        title: "커스텀 훅의 반환",
        body: "상태·세터·파생 값·명령을 한 객체로 묶어 내보낸다. 컴포넌트는 훅 내부를 몰라도 이 인터페이스만 보면 된다.",
        kind: "concept",
      },
    ],
    takeaway: "값은 useMemo, 핸들러는 useCallback, 참조 안정이 필요 없는 파생 값은 그냥 계산한다.",
    check: {
      question: "trimmed를 useMemo로 감싸지 않고 그냥 변수로 두면 무엇이 달라지는가",
      options: [
        "아무 일도 달라지지 않는다 — 의존성 비교는 값으로 한다",
        "matches의 filter가 매 렌더마다 다시 돈다",
        "useMemo의 의존성 배열이 문자열을 받지 못하게 된다",
      ],
      answer: 0,
      explain: "의존성 배열의 비교는 Object.is로 값끼리 이뤄진다. trimmed가 매 렌더 새 문자열이어도 값이 같으면 matches의 캐시가 유지된다. 새 객체나 새 함수처럼 참조가 매번 바뀌는 값일 때만 매번 다시 계산된다.",
    },
  },
  {
    no: 22,
    date: "2026.09.10",
    title: "유틸리티 타입으로 입력 좁히기",
    dek: "일부 필드만 바꾸는 초안 타입과 키를 따라가는 제네릭 함수. 유틸리티 타입을 겹쳐 쓰고 매개변수를 제약하는 모양을 본다.",
    minutes: 3,
    language: "TypeScript",
    domain: "프론트엔드",
    prompt: "draft에 done을 넘기지 않으면 무엇이 남는지, pluck의 반환 타입은 어디서 정해지는지 따라 읽어 보라",
    code: `type Task = {
  id: string;
  title: string;
  done: boolean;
};

type TaskDraft = Partial<Pick<Task, "title" | "done">>;
type TaskList = Record<string, Task>;

const tasks: TaskList = {};

function addTask(id: string, draft: TaskDraft): Task {
  const base: Task = { id, title: "(제목 없음)", done: false };
  tasks[id] = { ...base, ...draft };
  return tasks[id];
}

function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

const titles = pluck(Object.values(tasks), "title");`,
    annotations: [
      {
        find: "Partial<Pick<Task, \"title\" | \"done\">>",
        title: "유틸리티 타입 겹치기",
        body: "Pick으로 Task에서 두 필드만 고르고, Partial로 그 필드를 전부 선택으로 바꾼다. 겹쳐 쓰는 유틸리티 타입은 '일부만 바꾸는 입력'을 정의하는 표준 조합이다.",
        kind: "std",
      },
      {
        find: "Record<string, Task>",
        title: "키→값 지도 타입",
        body: "string 키에 Task 값을 대응시키는 타입이다. 유틸리티 타입도 결국 제네릭으로, 타입 인자를 받아 새 타입을 돌려주는 함수다.",
        kind: "std",
      },
      {
        find: "draft: TaskDraft",
        title: "좁은 입력 타입",
        body: "함수 겉면은 만들어 둔 좁은 타입을 내민다. 호출자는 Task 전체를 알 필요 없이 바꿀 필드만 넘기면 된다.",
        kind: "concept",
      },
      {
        find: "{ ...base, ...draft };",
        title: "스프레드 병합",
        body: "뒤에 오는 객체가 이긴다. draft에서 값을 넘긴 필드만 base를 덮어쓰고, 넘기지 않은 필드는 그대로 남는다.",
        kind: "idiom",
      },
      {
        find: "<T, K extends keyof T>",
        title: "타입 매개변수 제약",
        body: "T는 임의의 타입이고, K는 extends로 T의 키만 받도록 좁혔다. 덕분에 item[key]의 타입이 T[K]로 정확히 따라 나온다.",
        kind: "syntax",
      },
      {
        find: "T[K][]",
        title: "인덱스 접근 타입",
        body: "'T의 K번 필드 타입'을 뜻한다. K가 \"title\"이면 string이 되어 반환 타입이 호출할 때마다 따라 계산된다.",
        kind: "syntax",
      },
      {
        find: "Object.values(tasks)",
        title: "객체를 배열로",
        body: "지도 타입 객체에서 값을 꺼내 Task 배열로 만든다. 배열을 받는 함수에 넘기려면 이렇게 한 번 펴 주는 게 필요하다.",
        kind: "std",
      },
    ],
    takeaway: "유틸리티 타입은 타입을 받아 타입을 돌려주는 함수다 — 새 별칭을 선언하기 전에 겹쳐 쓰는 조합부터 찾는다.",
    check: {
      question: "pluck(Object.values(tasks), 'title')의 반환 타입은 무엇인가",
      options: [
        "Task[]",
        "string[]",
        "string",
      ],
      answer: 1,
      explain: "K는 keyof Task 중 'title'로 고정되고 인덱스 타입 T[K]는 string이 된다. pluck은 map 결과를 배열로 돌려주므로 string[]이다. Task[]는 입력 타입이고, string은 원소 하나의 타입이다.",
    },
  },
  {
    no: 21,
    date: "2026.09.10",
    title: "픽스처 주입, 사례 복제",
    dek: "장바구니 합계 테스트에 준비물 주입과 사례 복제를 붙인다. 테스트 함수 하나가 여러 번 돌아가는 구조를 본다.",
    minutes: 3,
    language: "Python",
    framework: "pytest",
    domain: "백엔드",
    prompt: "이 테스트 함수는 실제로 몇 번 실행되는가",
    code: `import pytest

@pytest.fixture
def cart():
    c = Cart()
    c.add("pen", 1000)
    return c

@pytest.mark.parametrize(
    ("name", "price", "expected"),
    [
        ("book", 4500, 5500),
        ("pen", 1000, 2000),
    ],
)
def test_total(cart, name, price, expected):
    cart.add(name, price)
    assert cart.total() == expected

def test_empty(cart):
    cart.clear()
    assert cart.total() == 0`,
    annotations: [
      {
        find: "@pytest.fixture",
        title: "픽스처",
        body: "테스트가 필요로 하는 준비물을 만들어 주는 함수다. 테스트가 매개변수로 이름을 선언하면 pytest가 알아서 호출해 결과를 넣어 준다.",
        kind: "std",
      },
      {
        find: "def cart():",
        title: "준비 단계",
        body: "테스트마다 새 카트를 만들어 돌려준다. 테스트 함수가 서로 다른 카트를 받으므로 하나의 테스트가 다른 테스트를 오염시키지 않는다.",
        kind: "idiom",
      },
      {
        find: "@pytest.mark.parametrize(",
        title: "테스트 여러 벌",
        body: "하나의 테스트 함수를 입력·기댓값 조합 수만큼 복제해 돌린다. 비슷한 테스트를 복붙하지 않는 표준 방법이다.",
        kind: "std",
      },
      {
        find: "(\"name\", \"price\", \"expected\"),",
        title: "인자 이름 행",
        body: "첫 원소는 매개변수 이름 목록이다. 밑의 각 튜플이 한 벌의 실행이 되고 이름 순서대로 함수 인자에 들어간다.",
        kind: "syntax",
      },
      {
        find: "(\"book\", 4500, 5500),",
        title: "한 벌의 사례",
        body: "pen 1000원이 담긴 카트에 book 4500원을 더하면 5500원이라는 독립 사례다. 어느 줄이 실패했는지 보고서에 그대로 나온다.",
        kind: "idiom",
      },
      {
        find: "def test_total(cart, name, price, expected):",
        title: "두 장치의 만남",
        body: "cart는 픽스처에서, 나머지는 파라미터라이즈에서 온다. pytest는 매개변수 이름을 보고 어디서 값을 가져올지 판단한다.",
        kind: "concept",
      },
      {
        find: "assert cart.total() == expected",
        title: "검증문",
        body: "pytest는 assert가 실패하면 좌우 값을 그대로 보고서에 출력한다. 별도 단언 API 없이 보통의 assert를 쓴다.",
        kind: "syntax",
      },
    ],
    takeaway: "픽스처는 준비물을 이름으로 주입하고 파라미터라이즈는 하나의 테스트를 여러 사례로 펼친다.",
    check: {
      question: "이 파일에서 test_total은 실제로 몇 번 실행되는가?",
      options: [
        "한 번 — 함수는 하나뿐이다",
        "두 번 — 사례 두 개마다 한 번씩, 매번 새 픽스처 카트를 받는다",
        "네 번 — 사례 두 개에 픽스처 실행 두 번을 곱한다",
      ],
      answer: 1,
      explain: "파라미터라이즈는 사례 개수만큼 테스트를 펼친다. 각 실행은 독립적이고 cart 픽스처도 실행마다 새로 만들어진다. 한 실행이 다른 실행의 카트를 볼 방법이 없다.",
    },
  },
  {
    no: 20,
    date: "2026.09.10",
    title: "세션이 지켜보는 동안",
    dek: "유료 주문 다섯 건을 관계까지 한 번에 읽고 상태를 바꾼다. 질의가 나가는 시점과 커밋의 역할을 본다.",
    minutes: 3,
    language: "Python",
    framework: "SQLAlchemy",
    domain: "백엔드",
    prompt: "order.items를 읽는 순간에도 질의가 또 나갈까",
    code: `from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, joinedload

engine = create_engine("sqlite:///shop.db")

with Session(engine) as session:
    stmt = (
        select(Order)
        .options(joinedload(Order.items))
        .where(Order.status == "paid")
        .order_by(Order.created_at.desc())
        .limit(5)
    )
    orders = session.scalars(stmt).all()

    for order in orders:
        total = sum(item.price for item in order.items)
        print(order.id, total)
        order.status = "shipped"

    session.commit()`,
    annotations: [
      {
        find: "with Session(engine) as session:",
        title: "세션 열기",
        body: "세션은 작업 단위를 담는 접점이다. with를 나가면 세션이 닫히고 연결이 풀로 돌아간다. 질의와 변경은 이 세션 안에서 이뤄진다.",
        kind: "concept",
      },
      {
        find: "select(Order)",
        title: "질의 조립",
        body: "2.0 스타일의 질의 만들기다. where·order_by·limit을 이어 붙여 완성하며 이 단계에서는 SQL이 실행되지 않는다.",
        kind: "std",
      },
      {
        find: ".options(joinedload(Order.items))",
        title: "관계 미리 당기기",
        body: "items 관계를 JOIN으로 같이 읽어 온다. 이렇게 하지 않으면 order.items를 만날 때마다 주문마다 질의 하나씩 더 돈다.",
        kind: "idiom",
      },
      {
        find: "session.scalars(stmt).all()",
        title: "질의 실행",
        body: "여기서 처음으로 SQL이 나간다. scalars는 행의 첫 열(여기서는 Order 객체)만 꺼내 주고 all()은 목록으로 받는다.",
        kind: "std",
      },
      {
        find: "for item in order.items",
        title: "관계 접근",
        body: "joinedload 덕분에 이 순회는 이미 읽어 둔 값을 쓴다. 미리 당겨 오지 않았다면 세션이 살아 있는 동안 접근 시점에 질의가 나갔을 것이다.",
        kind: "concept",
      },
      {
        find: "order.status = \"shipped\"",
        title: "변경 감지",
        body: "세션은 객체를 계속 지켜보다가 커밋 시점에 무엇이 바뀌었는지 스스로 안다. UPDATE 문을 직접 쓰지 않아도 된다.",
        kind: "concept",
      },
      {
        find: "session.commit()",
        title: "작업 확정",
        body: "지금까지의 변경을 한 트랜잭션으로 데이터베이스에 확정한다. commit을 빼면 with 블록이 끝나며 변경이 버려진다.",
        kind: "std",
      },
    ],
    takeaway: "세션은 질의와 변경을 모아 두었다가 commit에 확정한다 — 관계를 미리 당겨 오면 N+1이 사라진다.",
    check: {
      question: "joinedload 줄을 지우면 주문 다섯 건의 items를 읽을 때 질의는 몇 번 나가는가?",
      options: [
        "여전히 한 번 — 관계는 자동으로 JOIN된다",
        "첫 질의 한 번에 주문마다 한 번씩 더해 최대 여섯 번",
        "세션이 닫혀 있어 items 접근이 예외가 된다",
      ],
      answer: 1,
      explain: "관계 속성은 처음 접근하는 시점에 그 순간의 질의로 채워진다(지연 로딩). 주문마다 한 번씩이라 5건이면 5번 더 나간다. joinedload는 이 추가 질의를 JOIN 하나로 미리 끝내 둔다.",
    },
  },
  {
    no: 19,
    date: "2026.09.10",
    title: "loc로 고르고 체인으로 접기",
    dek: "판매 표에서 4월 행을 골라 도시별 집계표를 만든다. loc와 iloc가 고르는 기준, 체인이 원본을 안 건드리는 이유를 본다.",
    minutes: 3,
    language: "Python",
    framework: "pandas",
    domain: "데이터",
    prompt: "loc 괄호 안의 비교식은 무엇을 돌려주는가",
    code: `import pandas as pd

df = pd.DataFrame({
    "city": ["서울", "부산", "서울", "대구", "부산"],
    "month": [3, 3, 4, 4, 4],
    "sales": [320, 210, 280, 150, 90],
})

april = df.loc[df["month"] == 4, ["city", "sales"]]
first = df.iloc[0]["sales"]

report = (
    df.assign(sales_k=lambda d: d["sales"] / 1000)
      .groupby("city")["sales_k"]
      .agg(["sum", "mean"])
      .sort_values("sum", ascending=False)
)
print(report)`,
    annotations: [
      {
        find: "pd.DataFrame({",
        title: "표 만들기",
        body: "딕셔너리의 키가 열 이름, 값이 열 데이터가 된다. 이 DataFrame이 이후 모든 연산의 원본이다.",
        kind: "std",
      },
      {
        find: "df.loc[df[\"month\"] == 4, [\"city\", \"sales\"]]",
        title: "라벨 인덱서",
        body: "loc는 행 조건과 열 목록을 쉼표로 나눠 한 번에 적는다. 왼쪽은 마스크, 오른쪽은 가져올 열 이름이고 조건에 맞는 행만 남은 새 DataFrame을 돌려준다.",
        kind: "concept",
      },
      {
        find: "df.iloc[0][\"sales\"]",
        title: "위치 인덱서",
        body: "iloc는 라벨이 아니라 정수 위치로 고른다. 인덱스에 날짜 같은 라벨이 붙어 있어도 0번째 행은 0번째 행이다.",
        kind: "concept",
      },
      {
        find: ".assign(sales_k=lambda d: d[\"sales\"] / 1000)",
        title: "파생 열 추가",
        body: "새 열을 만들어 체인에 이어 붙인다. 원본 df를 고치지 않고 중간 단계에서만 필요한 열을 넣는 관용구다.",
        kind: "idiom",
      },
      {
        find: ".groupby(\"city\")[\"sales_k\"]",
        title: "그룹 나누기",
        body: "city 값별로 묶어 sales_k 열만 고른다. 이어지는 agg가 그룹마다 한 행씩 요약 표를 만든다.",
        kind: "std",
      },
      {
        find: ".agg([\"sum\", \"mean\"])",
        title: "그룹 집계",
        body: "그룹별로 여러 집계를 한 번에 적용한다. 결과 표에는 sum, mean라는 이름의 두 열이 생긴다.",
        kind: "std",
      },
      {
        find: ".sort_values(\"sum\", ascending=False)",
        title: "정렬 마무리",
        body: "집계 결과를 sum 열 기준 내림차순으로 정렬해 체인을 끝낸다. 각 단계는 새 DataFrame을 돌려주므로 원본은 변하지 않는다.",
        kind: "std",
      },
    ],
    takeaway: "loc는 이름으로, iloc는 위치로 고른다 — 체인의 각 단계는 새 DataFrame이라 원본은 늘 안전하다.",
    check: {
      question: "df[\"month\"] == 4라는 비교식이 만드는 것은?",
      options: [
        "행마다 참·거짓을 담은 Series — 참인 행만 남는다",
        "4월 데이터만 담긴 새 DataFrame",
        "행 번호 목록 하나",
      ],
      answer: 0,
      explain: "열 Series와 값의 비교는 같은 길이의 불리언 Series(마스크)를 만든다. loc는 True인 자리의 행을 골라 오른쪽에 적은 열과 함께 새 DataFrame을 돌려준다.",
    },
  },
  {
    no: 18,
    date: "2026.09.10",
    title: "무한 수열을 잘라 쓰는 사슬",
    dek: "lru_cache로 재귀를 살리고 count와 takewhile로 무한 수열을 잘라 쓴다. 값이 만들어지는 시점이 필요해지는 시점임을 본다.",
    minutes: 2,
    language: "Python",
    framework: "functools·itertools",
    domain: "백엔드",
    prompt: "list()를 지우면 무한 루프에 빠지는가",
    code: `from functools import lru_cache
from itertools import count, takewhile

@lru_cache(maxsize=256)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

def even_squares():
    for n in count(1):
        sq = n * n
        if sq % 2 == 0:
            yield sq

limited = list(takewhile(lambda x: x < 1_000_000, even_squares()))
print(len(limited), fib(90))`,
    annotations: [
      {
        find: "@lru_cache(maxsize=256)",
        title: "결과 캐시",
        body: "함수 호출과 반환 값을 딕셔너리에 적어 둔다. 같은 인자로 다시 부르면 계산하지 않고 저장해 둔 값을 돌려준다.",
        kind: "std",
      },
      {
        find: "fib(n - 1) + fib(n - 2)",
        title: "재귀와 캐시",
        body: "캐시가 없으면 같은 값을 몇 번이고 다시 계산해 기하급수적으로 느려진다. 데코레이터 하나로 각 n이 한 번씩만 계산된다.",
        kind: "idiom",
      },
      {
        find: "count(1)",
        title: "무한 이터레이터",
        body: "끝없이 1씩 늘어나는 숫자를 흘려 보낸다. 값을 미리 만들지 않고 요청받을 때 하나씩 만드므로 무한해도 메모리가 늘지 않는다.",
        kind: "std",
      },
      {
        find: "sq = n * n",
        title: "요청받을 때만 계산",
        body: "이 계산은 제너레이터가 다음 값을 요청받았을 때만 실행된다. 필요 없는 수는 아예 계산되지 않는다.",
        kind: "concept",
      },
      {
        find: "yield sq",
        title: "제너레이터",
        body: "yield를 만나 값을 하나 내보고 다음 요청까지 잠시 멈춘다. 함수 전체가 아니라 다음 값 하나가 필요할 때만 진행된다.",
        kind: "syntax",
      },
      {
        find: "list(takewhile(lambda x: x < 1_000_000, even_squares()))",
        title: "사슬의 끝에서 당기기",
        body: "takewhile은 조건이 처음 거짓이 되는 순간 멈춘다. 그러나 list가 값을 요구하기 전까지는 count부터 계산이 시작되지도 않는다.",
        kind: "std",
      },
      {
        find: "fib(90)",
        title: "캐시의 이득",
        body: "lru_cache 덕에 90번째 항도 순식간이다. 캐시 없이는 같은 하위 문제를 수없이 반복 계산해야 한다.",
        kind: "std",
      },
    ],
    takeaway: "게으른 사슬은 소비하는 순간에만 돈다 — list()를 지우면 무한 수열도 아무 일도 일으키지 않는다.",
    check: {
      question: "limited = takewhile(...)처럼 list()를 빼고 그냥 두면 어떻게 되는가?",
      options: [
        "아무것도 계산되지 않고 프로그램도 그대로 끝난다",
        "count가 무한히 돌아 프로그램이 멈춘다",
        "백만 이상의 값들이 변수에 미리 담긴다",
      ],
      answer: 0,
      explain: "제너레이터와 takewhile은 게으르다. list가 값을 하나씩 요구하기 전에는 사슬이 시작조차 되지 않는다. 요청이 없으면 계산도, 무한 순회도 일어나지 않는다.",
    },
  },
  {
    no: 17,
    date: "2026.09.10",
    title: "모델 선언이 곧 입력 규격",
    dek: "가입 폼 딕셔너리를 검증 모델에 통과시킨다. 타입 변환·범위·정규식·커스텀 검증기가 한 번에 돈다.",
    minutes: 3,
    language: "Python",
    framework: "pydantic",
    domain: "백엔드",
    prompt: "문자열로 온 나이는 어느 시점에 숫자가 되는가",
    code: "from pydantic import BaseModel, Field, ValidationError, field_validator\n\nclass SignupForm(BaseModel):\n    email: str = Field(pattern=r\"^[^@\\s]+@[^@\\s]+$\")\n    age: int = Field(ge=14, le=120)\n    nickname: str = Field(min_length=2, max_length=20)\n    marketing: bool = False\n\n    @field_validator(\"nickname\")\n    @classmethod\n    def strip_spaces(cls, v: str) -> str:\n        return v.strip()\n\nraw = {\"email\": \"mina@example.com\", \"age\": \"19\", \"nickname\": \"  민아  \"}\n\ntry:\n    form = SignupForm.model_validate(raw)\n    print(form.nickname, form.age, form.marketing)\nexcept ValidationError as e:\n    print(e.errors())",
    annotations: [
      {
        find: "class SignupForm(BaseModel):",
        title: "검증 모델",
        body: "BaseModel을 상속하면 클래스 선언이 곧 입력 규격이 된다. 타입 힌트와 Field 제약을 읽어 값을 검증하고 맞는 값으로 인스턴스를 만든다.",
        kind: "concept",
      },
      {
        find: "Field(pattern=r\"^[^@\\s]+@[^@\\s]+$\")",
        title: "형식 제약",
        body: "정규식 패턴을 문자열 필드에 붙인다. 이메일처럼 겉모양만 검사하면 되는 경우에 비교적 간단한 규칙으로 쓴다.",
        kind: "std",
      },
      {
        find: "age: int = Field(ge=14, le=120)",
        title: "범위 제약",
        body: "숫자 필드에 하한과 상한을 건다. raw에는 문자열 '19'가 들어 있지만 int 선언이 먼저 변환을 처리한다. 변환된 값이 범위를 벗어나면 그때 검증이 실패한다.",
        kind: "std",
      },
      {
        find: "marketing: bool = False",
        title: "기본값",
        body: "값이 없어도 되는 필드는 기본값을 두면 된다. raw에 marketing이 없어도 모델은 만들어진다.",
        kind: "syntax",
      },
      {
        find: "@field_validator(\"nickname\")",
        title: "필드 검증기",
        body: "여러 제약으로 못 막는 규칙을 함수로 붙인다. 데코레이터에 필드 이름을 적으면 해당 필드의 기본 검증 뒤에 이어서 돈다.",
        kind: "std",
      },
      {
        find: "SignupForm.model_validate(raw)",
        title: "검증 입구",
        body: "딕셔너리 같은 날 값을 규격에 맞춰 해석한다. 타입 변환도 여기서 일어나고, 실패하면 ValidationError 하나로 모은다.",
        kind: "concept",
      },
      {
        find: "except ValidationError as e:",
        title: "오류 일괄 수집",
        body: "첫 오류에서 멈추지 않고 모든 필드의 문제를 모아 보고한다. e.errors()는 필드 위치와 이유가 담긴 목록이다.",
        kind: "idiom",
      },
    ],
    takeaway: "선언이 곧 검증이다 — 타입 힌트와 Field 제약을 읽는 것만으로 입력 규격이 읽힌다.",
    check: {
      question: "age에 문자열 '10'이 들어오면 어떻게 되는가?",
      options: [
        "'10'을 10으로 바꿔 넣는다",
        "int 변환은 통과하지만 ge=14에 걸려 ValidationError가 나고 errors()에 age가 적힌다",
        "기본값이 없으므로 None이 들어간다",
      ],
      answer: 1,
      explain: "문자열 '10'은 int 선언에 따라 숫자로 변환된다. 그러나 변환된 값이 ge=14 범위를 벗어나므로 검증은 실패한다. 실패는 필드별로 모여 한 번의 ValidationError로 보고된다.",
    },
  },
  {
    no: 16,
    date: "2026.09.10",
    title: "코루틴을 겹쳐 돌리기",
    dek: "느린 작업 두 개를 태스크로 만들어 한 번에 기다린다. 만드는 순간 돌기 시작하는 시점과 실패가 섞일 때를 본다.",
    minutes: 2,
    language: "Python",
    framework: "asyncio",
    domain: "백엔드",
    prompt: "작업 하나가 실패하면 나머지 결과는 어떻게 되는가",
    code: `import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return f"{name}: {delay}s"

async def main():
    jobs = [
        asyncio.create_task(fetch("cache", 0.1)),
        asyncio.create_task(fetch("db", 0.3)),
    ]
    results = await asyncio.gather(*jobs, return_exceptions=True)
    for item in results:
        if isinstance(item, Exception):
            print("실패:", item)
        else:
            print("성공:", item)

asyncio.run(main())`,
    annotations: [
      {
        find: "async def fetch(name, delay):",
        title: "코루틴 함수",
        body: "async def로 만든 함수를 부르면 실행되는 게 아니라 코루틴 객체가 돌아온다. await를 만나야 비로소 돈다.",
        kind: "syntax",
      },
      {
        find: "await asyncio.sleep(delay)",
        title: "스레드를 막지 않는 대기",
        body: "time.sleep이 아니라 asyncio.sleep을 쓴다. 이벤트 루프에 자리를 내어 주는 대기라 그 사이 다른 코루틴이 돈다.",
        kind: "std",
      },
      {
        find: "asyncio.create_task(fetch(\"cache\", 0.1))",
        title: "태스크 예약",
        body: "코루틴을 태스크로 감싸 실행을 예약한다. 예약만 하고 await하지 않아도 이미 돌기 시작한다.",
        kind: "concept",
      },
      {
        find: "asyncio.create_task(fetch(\"db\", 0.3))",
        title: "예약은 곧 시작",
        body: "두 번째 태스크를 만드는 순간 첫 작업과 겹쳐 진행된다. 순서대로 await하면 겹치지 않으므로 일부러 만들어 둔다.",
        kind: "concept",
      },
      {
        find: "results = await asyncio.gather(*jobs, return_exceptions=True)",
        title: "한 자리에서 전부 기다리기",
        body: "*jobs로 목록의 태스크를 별개 인자로 펼쳐 넘긴다. return_exceptions=True면 예외를 결과 목록에 섞어 돌려주므로 한 작업이 실패해도 다른 결과를 잃지 않는다.",
        kind: "std",
      },
      {
        find: "isinstance(item, Exception)",
        title: "실패 판별",
        body: "return_exceptions=True 옵션의 결과는 성공 값과 예외 객체가 섞여 있다. 순회하면서 타입으로 갈라 낸다.",
        kind: "idiom",
      },
      {
        find: "asyncio.run(main())",
        title: "이벤트 루프 진입",
        body: "프로그램당 한 번 루프를 열고 main 코루틴이 끝날 때까지 돌린다. 이 안에서 만든 코루틴만 await로 기다릴 수 있다.",
        kind: "std",
      },
    ],
    takeaway: "create_task가 예약하고 gather가 기다린다 — return_exceptions 하나로 실패를 던질지 받을지가 갈린다.",
    check: {
      question: "return_exceptions=True를 빼면 실패한 작업이 하나 있을 때 어떻게 되는가?",
      options: [
        "성공한 나머지 결과만 목록으로 돌아온다",
        "첫 예외가 await 자리에서 그대로 던져진다",
        "실패한 작업만 자동으로 다시 시도한다",
      ],
      answer: 1,
      explain: "gather는 기본적으로 첫 예외를 밖으로 던진다. 이미 끝난 다른 작업의 결과도 받지 못한다. return_exceptions=True는 예외를 값처럼 목록에 섞어 돌려주므로 직접 판별해 나눌 수 있다.",
    },
  },
  {
    no: 15,
    date: "2026.09.10",
    title: "의존성 주입으로 검증 분리",
    dek: "페이지 인자와 API 키 검사를 함수로 떼어 내 주입한다. 뷰 시그니처가 곧 요청 규격이 되는 구조를 본다.",
    minutes: 3,
    language: "Python",
    framework: "FastAPI",
    domain: "백엔드",
    prompt: "size=150 요청은 뷰 본문까지 도달할까",
    code: `from fastapi import Depends, FastAPI, Header, HTTPException, Query

app = FastAPI()

def paging(page: int = Query(1, ge=1), size: int = Query(20, le=100)):
    return {"skip": (page - 1) * size, "limit": size}

def require_api_key(x_api_key: str = Header()):
    if x_api_key not in KNOWN_KEYS:
        raise HTTPException(status_code=401, detail="invalid api key")

@app.get("/articles")
async def list_articles(
    pg: dict = Depends(paging),
    _: None = Depends(require_api_key),
):
    items = await ArticleRepo.list(**pg)
    return {"items": items, "count": len(items)}`,
    annotations: [
      {
        find: "Query(1, ge=1)",
        title: "하한 검증",
        body: "page는 쿼리스트링에서 오고 1 이상이어야 한다는 규칙이다. 범위를 벗어나면 뷰 대신 검증 오류 응답이 나간다.",
        kind: "std",
      },
      {
        find: "Query(20, le=100)",
        title: "상한 검증",
        body: "기본값 20, 최댓값 100이라는 선언이다. 규칙이 시그니처에 붙으니 본문에 검사 코드가 필요 없다.",
        kind: "std",
      },
      {
        find: "x_api_key: str = Header()",
        title: "헤더 매개변수",
        body: "밑줄 이름은 하이픈으로 바뀌어 X-Api-Key 헤더를 찾는다. 함수 인자가 곧 요청 문서가 된다.",
        kind: "std",
      },
      {
        find: "HTTPException(status_code=401",
        title: "검증 실패",
        body: "의존성에서 HTTPException을 던지면 뷰 본문은 실행되지 않고 해당 상태 코드로 응답이 끝난다.",
        kind: "std",
      },
      {
        find: "@app.get(\"/articles\")",
        title: "경로 데코레이터",
        body: "함수를 경로와 메서드에 연결한다. 시그니처를 읽어 요청 검증과 API 문서를 자동으로 만든다.",
        kind: "std",
      },
      {
        find: "pg: dict = Depends(paging)",
        title: "의존성 주입",
        body: "일반 함수를 매개변수로 선언하면 FastAPI가 호출해 결과를 넣어 준다. 뷰는 준비 절차를 모르고 결과만 받는다.",
        kind: "concept",
      },
      {
        find: "_: None = Depends(require_api_key)",
        title: "결과 대신 확인",
        body: "반환 값을 쓰지 않는 의존성도 유효하다. 예외를 던지지 않고 지나가면 통과라는 뜻이고, 인증·권한 검사를 이렇게 붙인다.",
        kind: "idiom",
      },
      {
        find: "**pg",
        title: "딕셔너리 언패킹",
        body: "의존성이 돌려준 딕셔너리를 키워드 인자로 펼쳐 넘긴다. 의존성의 반환 형태가 저장소 함수의 시그니처와 맞물린다.",
        kind: "syntax",
      },
    ],
    takeaway: "검증과 준비는 Depends로 뷰 밖에 선언한다 — 뷰는 규격을 맞춘 입력만 받고 본문만 책임진다.",
    check: {
      question: "size=150을 넘겨 요청하면 어떻게 되는가?",
      options: [
        "le=100 위반이므로 뷰는 불리지 않고 422로 끝난다",
        "100으로 잘라내고 나머지는 조용히 버린다",
        "뷰가 그대로 불리고 size가 150으로 전달된다",
      ],
      answer: 0,
      explain: "Query(20, le=100)는 최댓값 100이라는 검증 규칙이다. 벗어난 요청은 뷰에 도달하기 전에 검증 오류로 끝난다. 규칙이 시그니처에 선언되어 있으니 본문에 검사 코드가 필요 없다.",
    },
  },
  {
    no: 14,
    date: "2026.09.10",
    title: "블루프린트와 요청 컨텍스트",
    dek: "주문 라우트를 블루프린트로 묶고 요청마다 장바구니를 준비한다. request와 g가 전역처럼 보이는 이유를 본다.",
    minutes: 3,
    language: "Python",
    framework: "Flask",
    domain: "백엔드",
    prompt: "request와 g는 진짜 전역 변수일까",
    code: `from flask import Blueprint, abort, current_app, g, jsonify, request

bp = Blueprint("orders", __name__, url_prefix="/orders")

@bp.before_request
def load_cart():
    cart_id = request.cookies.get("cart")
    g.cart = Cart.get(cart_id) if cart_id else Cart.empty()

@bp.get("/")
def list_orders():
    limit = request.args.get("limit", default=20, type=int)
    rows = g.cart.recent_orders(limit)
    current_app.logger.info("cart=%s orders=%d", g.cart.id, len(rows))
    return jsonify(items=[r.to_dict() for r in rows])

@bp.get("/<int:order_id>")
def order_detail(order_id):
    order = Order.query.filter_by(id=order_id).first()
    if order is None:
        abort(404)
    return jsonify(order.to_dict())`,
    annotations: [
      {
        find: "Blueprint(\"orders\", __name__, url_prefix=\"/orders\")",
        title: "블루프린트",
        body: "라우트를 기능별로 묶는 그릇이다. url_prefix를 두면 이 안의 모든 경로가 /orders 아래로 들어가고, 앱 팩토리에서 register_blueprint(bp)로 한꺼번에 붙인다.",
        kind: "concept",
      },
      {
        find: "@bp.before_request",
        title: "요청 전 훅",
        body: "이 블루프린트로 들어온 요청마다 뷰보다 먼저 돈다. 인증·공통 준비를 뷰마다 복사하지 않고 한곳에 모은다.",
        kind: "std",
      },
      {
        find: "request.cookies.get(\"cart\")",
        title: "요청 프록시",
        body: "request는 전역처럼 보이지만 실제로는 현재 요청을 가리키는 프록시다. 요청마다 다른 값을 보고, 요청 밖에서 꺼내면 에러가 난다.",
        kind: "concept",
      },
      {
        find: "g.cart = Cart.get(cart_id) if cart_id else Cart.empty()",
        title: "요청 저장소",
        body: "g는 한 요청 안에서만 사는 이름표 꾸러미다. before_request에서 넣어 두면 같은 요청의 모든 뷰에서 꺼내 쓰고, 요청이 끝나면 함께 사라진다.",
        kind: "idiom",
      },
      {
        find: "@bp.get(\"/\")",
        title: "축약 라우트",
        body: "methods=[\"GET\"]을 get()으로 줄여 쓴 형태다. 경로가 블루프린트 접두사와 합쳐져 /orders/가 된다.",
        kind: "std",
      },
      {
        find: "request.args.get(\"limit\", default=20, type=int)",
        title: "쿼리스트링 읽기",
        body: "쿼리스트링 값은 언제나 문자열로 들어온다. type=int로 넘기면 변환까지 해 주고, 변환에 실패하면 기본값을 쓴다.",
        kind: "std",
      },
      {
        find: "current_app.logger",
        title: "앱 프록시",
        body: "current_app은 지금 요청을 처리 중인 애플리케이션 객체를 가리키는 프록시다. 모듈 수준에서 앱을 import하지 않고도 설정과 로거에 닿게 해 준다.",
        kind: "concept",
      },
      {
        find: "abort(404)",
        title: "요청 중단",
        body: "HTTP 상태 코드로 즉시 응답을 끝낸다. 404를 넘기면 해당 오류 응답을 돌려주고 이후 코드는 실행되지 않는다.",
        kind: "std",
      },
    ],
    takeaway: "request와 g는 전역이 아니라 현재 요청을 가리키는 프록시다 — 요청이 끝나면 함께 사라진다.",
    check: {
      question: "요청이 끝난 뒤 백그라운드 작업에서 g.cart를 꺼내 쓰면 어떻게 되는가?",
      options: [
        "직전 요청의 장바구니가 그대로 나온다",
        "요청 컨텍스트가 없어 에러가 난다",
        "g가 자동으로 빈 장바구니를 만들어 준다",
      ],
      answer: 1,
      explain: "g와 request는 현재 요청 컨텍스트에 묶인 프록시다. 컨텍스트 밖에서 접근하면 컨텍스트가 없다는 RuntimeError가 난다. g는 한 요청 안에서 값을 전달하는 용도다.",
    },
  },
  {
    no: 13,
    date: "2026.09.10",
    title: "게으른 QuerySet 체인",
    dek: "예약 목록을 조건 걸어 상위 10건을 뽑는다. 체인이 길어도 데이터베이스에 나가는 질의는 마지막 한 번이다.",
    minutes: 3,
    language: "Python",
    framework: "Django",
    domain: "백엔드",
    prompt: "이 함수에서 SQL이 실제로 나가는 문장은 어디인가",
    code: `from django.db.models import Count, Q

def busy_bookings(week):
    qs = (
        Booking.objects
        .filter(starts_at__week=week)
        .exclude(status=Booking.CANCELLED)
        .select_related("room", "host")
    )

    crowded = (
        qs.filter(Q(attendees__gte=8) | Q(is_public=True))
        .annotate(headcount=Count("attendees"))
        .order_by("-headcount")
    )

    return list(crowded.values_list("title", "headcount")[:10])`,
    annotations: [
      {
        find: "Booking.objects",
        title: "기본 매니저",
        body: "objects는 모델마다 하나 있는 기본 매니저다. 이 시점에는 조건 없는 전체 QuerySet이며 데이터베이스에 아무 질의도 보내지 않았다.",
        kind: "concept",
      },
      {
        find: ".filter(starts_at__week=week)",
        title: "룩업 필터",
        body: "필드이름__조건 형태로 검색 조건을 적는다. filter는 자기 자신이 아니라 새 QuerySet을 돌려주므로 이어 붙일 수 있다.",
        kind: "std",
      },
      {
        find: ".exclude(status=Booking.CANCELLED)",
        title: "조건 제외",
        body: "filter의 반대로 조건에 맞는 행을 걷어낸 새 QuerySet을 만든다. 여기서도 데이터베이스 접근은 없다.",
        kind: "std",
      },
      {
        find: ".select_related(\"room\", \"host\")",
        title: "관계 미리 당기기",
        body: "외래키·일대일 관계를 JOIN으로 한 번에 읽어 온다. 나중에 booking.room을 꺼낼 때마다 질의가 하나씩 더 도는 N+1을 막는다.",
        kind: "idiom",
      },
      {
        find: "Q(attendees__gte=8) | Q(is_public=True)",
        title: "OR 조건",
        body: "filter의 키워드 인자는 기본이 AND다. OR를 쓰려면 Q 객체를 만들어 |로 묶는다. ~Q()는 부정이 된다.",
        kind: "std",
      },
      {
        find: ".annotate(headcount=Count(\"attendees\"))",
        title: "집계 붙이기",
        body: "GROUP BY와 COUNT를 붙여 각 행에 계산 값을 달아 준다. 모델 필드가 아니라 이 QuerySet에서만 보이는 이름이다.",
        kind: "std",
      },
      {
        find: "list(crowded.values_list(\"title\", \"headcount\")[:10])",
        title: "여기서 질의 실행",
        body: "values_list는 모델 인스턴스 대신 튜플을 돌려준다. list()가 불리는 이 순간에야 SQL이 나가고, 슬라이스는 SQL의 LIMIT으로 번역된다.",
        kind: "concept",
      },
    ],
    takeaway: "QuerySet 조립은 계획이고 list()가 실행이다 — 체인을 얼마나 길게 붙여도 질의는 소비할 때 한 번 나간다.",
    check: {
      question: "qs와 crowded를 만드는 동안 데이터베이스에 나가는 SQL은 몇 번인가?",
      options: [
        "0번 — 조립은 계획을 만들 뿐 실행이 아니다",
        "1번 — objects에서 이미 전체를 불러 온다",
        "filter를 붙일 때마다 한 번씩, 총 다섯 번",
      ],
      answer: 0,
      explain: "QuerySet은 소비 전까지 SQL을 만들지도 실행하지도 않는다. 이 함수에서 유일한 실행은 마지막 list() 안에서 일어난다. 슬라이스까지 SQL의 LIMIT으로 번역되므로 질의도 한 번이다.",
    },
  },
  {
    no: 12,
    date: "2026.09.10",
    title: "컴프리헨션으로 걸러 모으기",
    dek: "접근 로그에서 느린 요청만 걸러 낸다. 리스트·셋·제너레이터 세 형태의 축약 문법이 한 함수에 나란히 온다.",
    minutes: 2,
    language: "Python",
    domain: "백엔드",
    prompt: "sum의 인자에서 대괄호를 빼면 무엇이 달라지는가",
    code: `def parse_access_log(path, slow_ms):
    entries = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            page, _, ms_part = line.rpartition(" ")
            entries.append((page, int(ms_part)))

    slow = [(p, ms) for p, ms in entries if ms >= slow_ms]
    worst = max(slow, key=lambda e: e[1], default=("", 0))
    total = sum(ms for _, ms in slow)
    pages = {p for p, _ in slow}

    print(f"슬로우 {len(slow)}건, 합계 {total}ms")
    print(f"가장 느린 요청: {worst[0]}")
    return pages`,
    annotations: [
      {
        find: "for line in f",
        title: "파일 객체 순회",
        body: "파일 객체를 for에 직접 넘기면 한 행씩 내주는 이터레이터가 된다. readlines()처럼 전체를 메모리에 올리지 않으니 큰 로그도 안전하다.",
        kind: "idiom",
      },
      {
        find: "page, _, ms_part = line.rpartition(\" \")",
        title: "튜플 언패킹",
        body: "rpartition은 (앞, 구분자, 뒤) 세 조각을 돌려준다. 밑줄 _는 쓰지 않을 자리를 표시하는 관용적 이름이다.",
        kind: "syntax",
      },
      {
        find: "[(p, ms) for p, ms in entries if ms >= slow_ms]",
        title: "리스트 컴프리헨션",
        body: "for와 if를 한 줄에 놓고 새 리스트를 만든다. filter+map 조합보다 짧고, 무엇을 모으는지가 앞에 보이므로 읽는 순서가 명확하다.",
        kind: "syntax",
      },
      {
        find: "key=lambda e: e[1]",
        title: "비교 기준 함수",
        body: "max는 key 함수가 돌려준 값으로 비교한다. 요소 전체가 아니라 ms 자리만 보고 최댓값을 고른다.",
        kind: "std",
      },
      {
        find: "default=(\"\", 0)",
        title: "빈 시퀀스 대비",
        body: "slow가 비어 있으면 max는 ValueError를 던진다. default를 두면 빈 입력도 예외 없이 통과한다.",
        kind: "idiom",
      },
      {
        find: "sum(ms for _, ms in slow)",
        title: "제너레이터 식",
        body: "대괄호 없는 컴프리헨션은 리스트를 만들지 않고 값을 하나씩 넘긴다. sum 같은 소비 함수에 바로 꽂아 중간 리스트가 생기지 않는다.",
        kind: "syntax",
      },
      {
        find: "{p for p, _ in slow}",
        title: "셋 컴프리헨션",
        body: "중괄호로 만들면 집합이다. 같은 경로가 여러 번 나와도 하나로 모이고 포함 검사가 빠르다.",
        kind: "syntax",
      },
    ],
    takeaway: "컴프리헨션은 무엇을 모을지 선언하는 문법이다 — 대괄호 유무가 중간 리스트의 생사를 가른다.",
    check: {
      question: "sum(ms for _, ms in slow)를 sum([ms for _, ms in slow])처럼 바꾸면 무엇이 달라지는가?",
      options: [
        "중간 리스트가 하나 더 만들어질 뿐 결과는 같다",
        "slow를 두 번 순회해 합계가 두 배가 된다",
        "제너레이터가 소진되지 않아 합계가 0이 된다",
      ],
      answer: 0,
      explain: "대괄호를 붙이면 먼저 ms 값 전체의 리스트를 만든 뒤 sum이 순회한다. 결과는 같지만 리스트만큼 메모리를 더 쓴다. sum은 이터러블이면 무엇이든 받으므로 괄호 없는 제너레이터 식을 바로 넘기는 편이 낫다.",
    },
  },
  {
    no: 11,
    date: "2026.09.10",
    title: "널일 수도 있는 값에 이름 붙이기",
    dek: "널 가능 수신자의 확장 함수와 안전 호출 사슬. 컴파일러가 널을 좁혀 주는 지점을 본다.",
    minutes: 3,
    language: "Kotlin",
    domain: "백엔드",
    prompt: "nickname이 널인 회원의 자리에는 무엇이 표시될까 — 널 검사는 어디서 끝나는가",
    code: `fun String?.orDash(): String = if (isNullOrBlank()) "-" else this

data class Member(val id: Long, val nickname: String?, val email: String?)

fun display(m: Member): String {
    val name = m.nickname.orDash()
    val mail = m.email?.substringBefore("@")?.lowercase() ?: "no-mail"
    return "$name ($mail)"
}

fun badgeWall(members: List<Member>): List<String> =
    members.filter { it.nickname != null }
        .map { display(it) }
        .take(5)`,
    annotations: [
      {
        find: "fun String?.orDash()",
        title: "널 가능 수신자 확장",
        body: "String? 타입에 메서드를 붙였다. 수신자가 널 가능 타입이라 널인 값에서도 안전하게 불리고, 내부에서 널 여부를 스스로 다룬다.",
        kind: "concept",
      },
      {
        find: "isNullOrBlank()",
        title: "널까지 검사",
        body: "널이거나 빈 문자열·공백뿐인 문자열일 때 참을 돌려준다. 표준 라이브러리의 이 함수는 널이 아니라는 약속을 컴파일러에 알려 주는 계약을 갖고 있다.",
        kind: "std",
      },
      {
        find: "else this",
        title: "스마트 캐스트",
        body: "계약 덕분에 else 쪽에서는 수신자가 널이 아니라고 컴파일러가 확신한다. this가 String?이 아니라 String으로 다뤄진다.",
        kind: "syntax",
      },
      {
        find: "val nickname: String?",
        title: "널 가능 타입",
        body: "타입 뒤의 물음표가 널이 들어올 수 있음을 선언한다. 물음표 없는 String과는 다른 타입이라 널 검사 없이는 섞이지 않는다.",
        kind: "syntax",
      },
      {
        find: "m.email?.substringBefore(\"@\")?.lowercase()",
        title: "안전 호출 사슬",
        body: "?.는 널이면 그 뒤를 실행하지 않고 널을 돌려준다. 사슬이 길어도 널이 섞이는 순간 전체가 널이 되어 중간 검사가 필요 없다.",
        kind: "idiom",
      },
      {
        find: "?: \"no-mail\"",
        title: "엘비스 연산자",
        body: "왼쪽이 널일 때 오른쪽 값으로 갈아탄다. 널 가능 사슬의 끝에서 기본값을 붙이는 관용이다.",
        kind: "syntax",
      },
      {
        find: "fun badgeWall(members: List<Member>): List<String> =",
        title: "식 본문 함수",
        body: "중괄호 대신 = 뒤에 식 하나로 본문을 적는다. 돌려줄 값이 곧 본문이라는 뜻이다.",
        kind: "syntax",
      },
      {
        find: "it.nickname != null",
        title: "널 걸러 내기",
        body: "별명이 있는 회원만 남긴다. 타입은 여전히 String?지만 값 수준에서 널을 거두는 관용이다.",
        kind: "idiom",
      },
    ],
    takeaway: "널 가능성은 타입이 안다 — 수신자가 String?면 널도 받고, String이면 컴파일이 막는다.",
    check: {
      question: "orDash의 수신자 타입을 String?에서 String으로 바꾸면 무엇이 달라지는가?",
      options: [
        "그대로 동작한다 — 널 검사만 사라진다",
        "m.nickname.orDash() 호출이 컴파일되지 않는다",
        "실행 중에 널 예외가 터진다",
      ],
      answer: 1,
      explain: "nickname의 타입은 String?이라 널이 들어올 수 있고, String 수신자의 메서드는 널 가능 값에 호출할 수 없다. 지금처럼 수신자를 String?로 받으면 널까지 함수 안에서 처리한다. 널 안전성은 실행 시 검사가 아니라 타입과 컴파일의 일이다.",
    },
  },
  {
    no: 10,
    date: "2026.09.10",
    title: "스코프로 질의에 이름 붙이기",
    dek: "연관 선언과 스코프로 배송 질의를 조립한다. 자리표 바인딩과 배치 순회가 나오는 지점을 본다.",
    minutes: 3,
    language: "Ruby",
    framework: "Rails",
    domain: "백엔드",
    prompt: "물음표 하나에 날짜 값이 알아서 들어간다 — 이 값은 SQL 문자열에 어떻게 섞이는가",
    code: `class Shipment < ApplicationRecord
  belongs_to :order
  has_many :events, dependent: :destroy

  scope :recent, -> { where("created_at >= ?", 7.days.ago) }
  scope :stuck, -> { recent.where(status: :in_transit) }

  def self.mark_arrived
    stuck.find_each do |shipment|
      shipment.update!(status: :delivered)
      shipment.events.create!(kind: "arrived")
    end
  end
end`,
    annotations: [
      {
        find: "belongs_to :order",
        title: "소속 관계",
        body: "이 모델이 order의 외래 키를 갖는다고 선언한다. shipment.order처럼 짧은 메서드로 상대 레코드를 읽어 온다.",
        kind: "std",
      },
      {
        find: "has_many :events, dependent: :destroy",
        title: "종속 삭제",
        body: "배송 하나에 이벤트 여럿이 달린 관계다. dependent: :destroy는 배송이 지워질 때 이벤트도 같이 지우도록 정한다.",
        kind: "std",
      },
      {
        find: "scope :recent, -> {",
        title: "이름 붙은 질의",
        body: "자주 쓰는 조건을 클래스 메서드로 남긴다. scope 본문은 호출될 때 평가되므로 7.days.ago 같은 시점 의존 값이 안전하다.",
        kind: "idiom",
      },
      {
        find: "where(\"created_at >= ?\", 7.days.ago)",
        title: "자리표 바인딩",
        body: "물음표 자리에 두 번째 인자가 드라이버를 거쳐 안전하게 들어간다. 문자열을 더해 SQL을 조립하는 방식과 달리 인젝션 여지가 없다.",
        kind: "std",
      },
      {
        find: "recent.where(status: :in_transit)",
        title: "스코프 합성",
        body: "scope는 다른 조건과 이어 붙일 수 있는 관계를 돌려준다. recent에 조건을 얹어 stuck이라는 새 질의를 만들었다.",
        kind: "idiom",
      },
      {
        find: "find_each",
        title: "배치 순회",
        body: "레코드를 일정 덩어리로 나눠 메모리에 조금씩만 올리고 순회한다. 수만 행을 each로 훑으면 전부를 한 번에 읽어 버린다.",
        kind: "std",
      },
      {
        find: "update!(status: :delivered)",
        title: "느낌표 저장",
        body: "검증에 실패하면 예외를 던지는 저장이다. 느낌표 없는 update는 참·거짓만 돌려주어 실패가 조용히 지나칠 수 있다.",
        kind: "syntax",
      },
      {
        find: "shipment.events.create!(kind: \"arrived\")",
        title: "관계를 통한 생성",
        body: "외래 키를 손으로 채우지 않고 관계 메서드가 shipment에 연결된 이벤트를 만들어 준다. has_many 선언이 이 메서드를 만든 것이다.",
        kind: "idiom",
      },
    ],
    takeaway: "scope는 질의에 이름을 붙인다 — 값은 이어 붙이지 않고 물음표에 바인딩한다.",
    check: {
      question: "물음표 대신 날짜를 문자열에 직접 이어 붙인 SQL을 만들면 어떤 문제가 생기는가?",
      options: [
        "속도가 조금 빨라진다",
        "값이 SQL 문법에 그대로 섞여 문법 오류와 인젝션 위험이 생긴다",
        "쿼리 캐시가 동작하지 않는다",
      ],
      answer: 1,
      explain: "자리표 방식은 값을 드라이버가 따로 묶어 보내므로 문법과 데이터가 섞이지 않는다. 문자열을 직접 이어 붙이면 날짜 서식 하나로 SQL이 깨지고, 값이 외부 입력이라면 인젝션으로 번진다.",
    },
  },
  {
    no: 9,
    date: "2026.09.10",
    title: "LINQ로 상위 고객 뽑기",
    dek: "Where부터 ToList까지 이어지는 질의 사슬. 지연 실행이 어디서 끝나는지 본다.",
    minutes: 3,
    language: "C#",
    domain: "백엔드",
    prompt: "이 사슬에는 orders를 훑는 코드가 없어 보인다 — 목록 순회는 실제로 언제 일어날까",
    code: `public record Order(long Id, long CustomerId, decimal Amount, DateTime PlacedAt);

var cutoff = DateTime.UtcNow.AddDays(-30);

var top = orders
    .Where(o => o.PlacedAt >= cutoff)
    .GroupBy(o => o.CustomerId)
    .Select(g => new
    {
        CustomerId = g.Key,
        Total = g.Sum(o => o.Amount),
        Count = g.Count()
    })
    .OrderByDescending(x => x.Total)
    .Take(5)
    .ToList();

foreach (var x in top)
    Console.WriteLine(x.CustomerId + ": " + x.Total);`,
    annotations: [
      {
        find: ".Where(o => o.PlacedAt >= cutoff)",
        title: "중간 연산",
        body: "조건을 통과한 요소만 흐름에 남긴다. IEnumerable 사슬은 설계도를 쌓을 뿐이고 이 줄에서 원본을 훑지 않는다.",
        kind: "std",
      },
      {
        find: ".GroupBy(o => o.CustomerId)",
        title: "그룹화",
        body: "키별로 요소를 묶어 그룹의 흐름을 만든다. 각 그룹에서 Key로 묶음 기준을 꺼내고, 그룹 자체도 열거 가능하다.",
        kind: "std",
      },
      {
        find: ".Select(g => new",
        title: "무명 형식으로 투영",
        body: "이름 없는 형태로 필요한 필드만 골라 담는다. 이 스코프 안에서만 쓸 중간 결과에 클래스를 새로 정의하는 수고를 덜어 준다.",
        kind: "syntax",
      },
      {
        find: "g.Sum(o => o.Amount)",
        title: "그룹 집계",
        body: "그룹에 속한 요소에서 Amount를 모두 더한다. Count·Min·Max 같은 집계도 같은 자리에 붙는다.",
        kind: "std",
      },
      {
        find: ".OrderByDescending(x => x.Total)",
        title: "내림차순 정렬",
        body: "키 기준으로 큰 것부터 늘어놓는다. 안정 정렬이라 같은 키면 원래 순서가 유지된다.",
        kind: "std",
      },
      {
        find: ".Take(5)",
        title: "앞에서 자르기",
        body: "흐름에서 앞 n개만 남긴다. 정렬 뒤에 두면 상위 5개가 된다.",
        kind: "std",
      },
      {
        find: ".ToList()",
        title: "실행 지점",
        body: "여기까지가 설계도라는 뜻이다. ToList가 불리는 순간 위 사슬이 실제로 orders를 훑어 결과 목록을 만든다.",
        kind: "concept",
      },
    ],
    takeaway: "LINQ 사슬은 설계도이고 열거가 실행이다 — ToList는 그 실행을 당겨 오는 지점이다.",
    check: {
      question: "ToList()를 지우고 top을 IEnumerable로 두면, orders를 실제로 훑는 시점은 언제인가?",
      options: [
        "Where를 만나는 즉시",
        "그대로 즉시 실행 — 차이가 없다",
        "foreach가 top을 열거하는 그때",
      ],
      answer: 2,
      explain: "Where부터 Take까지는 무엇을 할지만 적어 둔 지연 실행 흐름이다. 열거자가 끌어당길 때(여기서는 foreach) 비로소 원본을 훑는다. ToList는 그 실행을 즉시 강제해 결과를 목록으로 고정한다.",
    },
  },
  {
    no: 8,
    date: "2026.09.10",
    title: "스프링이 생성자를 채우는 순간",
    dek: "생성자 주입으로 의존성을 받는 주문 서비스. 단일 생성자에서 @Autowired가 생략되는 이유를 본다.",
    minutes: 3,
    language: "Java",
    framework: "Spring",
    domain: "백엔드",
    prompt: "이 클래스 어디에도 new OrderRepository(...)가 없다 — 생성자의 인자는 누가 채워 넣는가",
    code: `@Service
public class OrderService {

    private final OrderRepository orders;
    private final Clock clock;

    public OrderService(OrderRepository orders, Clock clock) {
        this.orders = orders;
        this.clock = clock;
    }

    @Transactional
    public Order place(String customerId, List<Long> productIds) {
        Order order = Order.of(customerId, productIds, clock.now());
        orders.save(order);
        return order;
    }
}`,
    annotations: [
      {
        find: "@Service",
        title: "컴포넌트 탐지 대상",
        body: "이 클래스를 스프링이 빈으로 만들어 관리하라는 표시다. 애플리케이션 시작 시 컴포넌트 탐지가 이 어노테이션을 읽어 인스턴스를 하나 만든다.",
        kind: "std",
      },
      {
        find: "private final OrderRepository orders;",
        title: "불변 의존성 필드",
        body: "의존성을 final 필드에 담아 생성 이후에 바뀌지 않게 한다. 필드에 @Autowired를 붙이는 방식도 있지만 final을 못 쓰고 테스트가 번거로워 권장되지 않는다.",
        kind: "idiom",
      },
      {
        find: "public OrderService(OrderRepository orders, Clock clock)",
        title: "생성자 주입",
        body: "스프링이 빈을 만들 때 이 생성자에 필요한 의존성을 넣어 준다. 생성자가 하나뿐이면 @Autowired를 붙이지 않아도 이 생성자가 주입 지점이 된다.",
        kind: "concept",
      },
      {
        find: "private final Clock clock;",
        title: "시계도 주입",
        body: "현재 시각을 직접 구하지 않고 Clock을 주입받는다. 테스트에서 고정된 시계를 넣으면 지정 시각 기준 로직을 재현할 수 있다.",
        kind: "idiom",
      },
      {
        find: "@Transactional",
        title: "트랜잭션 경계",
        body: "메서드에 들어올 때 트랜잭션을 열고 정상 반환에 커밋, 예외에는 롤백한다. 프록시가 메서드 앞뒤를 감싸는 방식으로 동작한다.",
        kind: "std",
      },
      {
        find: "Order.of(customerId, productIds, clock.now())",
        title: "정적 팩토리",
        body: "생성자를 직접 부르지 않고 의도가 드러나는 이름의 팩토리 메서드로 만든다. 생성 규칙이 Order 쪽에 모여 있어 호출부는 간단해진다.",
        kind: "idiom",
      },
    ],
    takeaway: "의존성은 필드가 아니라 생성자 시그니처에 드러낸다 — 스프링이 그 시그니처를 읽고 채워 준다.",
    check: {
      question: "생성자가 이 하나뿐인데 @Autowired를 생략해도 되는 이유는 무엇인가?",
      options: [
        "생성자가 하나면 스프링이 그 생성자를 주입 지점으로 쓴다",
        "final 필드에는 항상 값이 저절로 채워진다",
        "@Service가 리플렉션으로 필드에 직접 값을 넣는다",
      ],
      answer: 0,
      explain: "생성자가 여럿이면 어느 것을 쓸지 @Autowired로 알려야 하지만, 하나뿐이면 스프링이 유일한 생성자를 주입 지점으로 택한다. 필드 주입과 달리 생성자 주입은 의존성 없이는 객체 자체를 만들 수 없어 빠뜨림이 컴파일과 테스트에 드러난다.",
    },
  },
  {
    no: 7,
    date: "2026.09.10",
    title: "고루틴을 띄우고 채널로 모으기",
    dek: "작업마다 고루틴을 띄워 결과를 버퍼드 채널에 모은다. WaitGroup이 기다리고 close가 순회를 끝내는 지점을 본다.",
    minutes: 3,
    language: "Go",
    domain: "백엔드",
    prompt: "열 개짜리 목록을 동시에 긁어 온다고 할 때, 이 함수가 돌아오는 시점은 누가 정하는가",
    code: `func fetchAll(urls []string) []page {
	pages := make(chan page, len(urls))
	var wg sync.WaitGroup

	for _, u := range urls {
		wg.Add(1)
		go func(u string) {
			defer wg.Done()
			pages <- newPage(u)
		}(u)
	}

	wg.Wait()
	close(pages)

	got := make([]page, 0, len(urls))
	for p := range pages {
		got = append(got, p)
	}
	return got
}`,
    annotations: [
      {
        find: "make(chan page, len(urls))",
        title: "버퍼드 채널",
        body: "송신이 수신을 기다리지 않고 값이 쌓이는 채널이다. 길이를 보낼 개수와 같게 잡아 각 고루틴이 막히지 않고 결과를 내려놓게 한다.",
        kind: "std",
      },
      {
        find: "sync.WaitGroup",
        title: "대기 그룹",
        body: "비슷한 작업 여럿이 끝나기를 기다리는 카운터다. Add로 올리고 Done으로 내려 0이 되면 Wait가 풀린다.",
        kind: "std",
      },
      {
        find: "wg.Add(1)",
        title: "카운터 올리기",
        body: "고루틴을 띄우기 전에 카운터를 하나 올린다. 띄운 뒤에 올리면 Done이 먼저 도는 경합이 생겨 카운터가 음수가 될 수 있다.",
        kind: "idiom",
      },
      {
        find: "go func(u string) {",
        title: "고루틴 시작",
        body: "go 키워드가 함수를 별도 실행 흐름으로 돌린다. u를 매개변수로 받아 고정하면 루프 변수가 바뀌어도 각 고루틴이 자기 값을 쓴다.",
        kind: "concept",
      },
      {
        find: "defer wg.Done()",
        title: "완료 통보",
        body: "함수가 어떤 경로로 끝나든 Done이 도는 것을 defer가 보장한다. 패닉으로 빠져나가는 경로에서도 defer는 돈다.",
        kind: "idiom",
      },
      {
        find: "pages <- newPage(u)",
        title: "채널로 결과 보내기",
        body: "송신 연산자 <-로 값을 채널에 내려놓는다. 공유 슬라이스에 락을 걸고 쓰는 대신 소유권을 채널 너머로 넘기는 방식이 Go의 관용이다.",
        kind: "syntax",
      },
      {
        find: "close(pages)",
        title: "채널 닫기",
        body: "더 이상 보낼 값이 없다는 신호다. 닫힌 채널은 남은 값을 다 읽은 뒤 수신을 끝내고, 다시 닫거나 보내면 패닉이 난다.",
        kind: "idiom",
      },
      {
        find: "for p := range pages",
        title: "채널 순회",
        body: "range는 채널이 닫히고 버퍼가 비었을 때 반복을 끝낸다. close를 빼먹으면 버퍼를 다 읽은 뒤에도 다음 송신을 계속 기다린다.",
        kind: "idiom",
      },
    ],
    takeaway: "기다림은 WaitGroup이, 끝맺음은 close가 담당한다 — range는 닫힌 채널에서 저절로 끝난다.",
    check: {
      question: "close(pages)를 빼먹으면 프로그램은 어떻게 되는가?",
      options: [
        "got에는 빈 슬라이스가 담긴다",
        "버퍼를 다 읽은 뒤 range가 다음 송신을 영원히 기다려 데드락이 난다",
        "컴파일이 실패한다",
      ],
      answer: 1,
      explain: "버퍼가 보낼 개수만큼 커서 wg.Wait는 정상적으로 풀린다. 그러나 range는 닫힘 신호 없이는 반복을 끝내지 못해 마지막 for가 멈춘다. Go 런타임은 모든 고루틴이 막힌 것을 감지해 데드락을 보고한다.",
    },
  },
  {
    no: 6,
    date: "2026.09.10",
    title: "자바 스트림은 언제 도는가",
    dek: "필터와 그룹화로 부서별 인원수를 세는 파이프라인. 중간 연산과 종단 연산이 나뉘는 지점을 본다.",
    minutes: 3,
    language: "Java",
    domain: "백엔드",
    prompt: "이 파이프라인이 실제로 도는 시점은 언제인가",
    code: `Map<String, Long> countByDept = employees.stream()
    .filter(e -> e.isActive())
    .collect(Collectors.groupingBy(
        Employee::dept,
        Collectors.counting()));

countByDept.entrySet().stream()
    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
    .limit(3)
    .forEach(e -> log.info("{} = {}", e.getKey(), e.getValue()));`,
    annotations: [
      {
        find: ".stream()",
        title: "스트림 열기",
        body: "컬렉션을 파이프라인 소스로 연다. 원본 리스트는 그대로이고, 흐름 위에서 만들어진 결과만 새 값이 된다.",
        kind: "concept",
      },
      {
        find: ".filter(e -> e.isActive())",
        title: "중간 연산",
        body: "조건을 통과한 요소만 남긴다. 중간 연산은 무엇을 할지만 적어 두고, 종단 연산이 오기 전까지는 실행되지 않는다.",
        kind: "std",
      },
      {
        find: "Collectors.groupingBy(",
        title: "그룹화 컬렉터",
        body: "분류 기준으로 묶어 Map을 만든다. 두 번째 인자로 하위 컬렉터를 받아 각 그룹을 무엇으로 접을지 정한다.",
        kind: "std",
      },
      {
        find: "Employee::dept",
        title: "메서드 참조",
        body: "람다 e -> e.dept()와 같은 뜻을 줄여 쓴 형태다. 인자를 그대로 한 메서드에 넘길 때 가장 읽기 좋다.",
        kind: "syntax",
      },
      {
        find: "Collectors.counting()",
        title: "하위 컬렉터",
        body: "그룹별 개수를 세는 하위 컬렉터다. groupingBy와 짝을 이뤄 Map<부서, 인원 수>를 완성한다.",
        kind: "std",
      },
      {
        find: "Map.Entry.<String, Long>comparingByValue()",
        title: "타입 목격자",
        body: "comparingByValue는 제네릭 정적 메서드라 체인 뒤에서 타입을 추론하지 못한다. <String, Long>을 찍어 주지 않으면 이 줄은 컴파일되지 않는다.",
        kind: "idiom",
      },
      {
        find: ".limit(3)",
        title: "상위 자르기",
        body: "앞에서 n개만 남기는 중간 연산이다. 정렬 뒤에 두면 상위 3개가 된다.",
        kind: "std",
      },
    ],
    takeaway: "중간 연산은 설계도이고 종단 연산이 실행이다 — forEach를 지우면 아무 일도 일어나지 않는다.",
    check: {
      question: "filter를 지나 collect·forEach에 도달하기 전에 스트림이 멈춰 있으면, employees를 훑는 일은 언제 일어나는가?",
      options: [
        "stream()을 여는 순간 즉시",
        "filter를 통과하는 즉시",
        "forEach 같은 종단 연산이 불릴 때",
      ],
      answer: 2,
      explain: "중간 연산은 파이프라인을 조립할 뿐이다. 종단 연산이 불려야 소스를 훑으며 실제로 돈다. forEach를 지운 채 실행하면 출력도, 순회도 없다 — 흔한 무출력 버그의 원인이다.",
    },
  },
  {
    no: 5,
    date: "2026.09.10",
    title: "러스트에서 빌리기와 가져가기",
    dek: "iter()로 이름 목록을 외침 목록으로 바꾼다. 소유권이 움직이는 순간과 남는 순간을 본다.",
    minutes: 3,
    language: "Rust",
    domain: "시스템",
    prompt: "iter()를 into_iter()로 바꾸면 이 코드는 무엇이 되는가",
    code: `fn main() {
    let names = vec![String::from("연"), String::from("도"), String::from("승")];

    let shouts: Vec<String> = names
        .iter()
        .map(|name| format!("{name}!"))
        .collect();

    println!("{shouts:?}");
    println!("{}", names.len());
}`,
    annotations: [
      {
        find: "vec![",
        title: "매크로 호출",
        body: "벡터(가변 길이 배열)를 만드는 매크로다. 이름 뒤의 느낌표는 함수가 아니라 컴파일 때 코드를 만드는 매크로라는 표시다.",
        kind: "std",
      },
      {
        find: ".iter()",
        title: "빌려 순회하기",
        body: "요소를 소유하지 않고 빌려 순회하는 이터레이터를 만든다. 각 요소는 &String으로 들어오므로 루프 뒤에도 names를 그대로 쓸 수 있다.",
        kind: "concept",
      },
      {
        find: "|name| ",
        title: "클로저",
        body: "주변 변수를 빌리거나 가져올 수 있는 익명 함수다. 이터레이터 어댑터의 표준 재료다.",
        kind: "syntax",
      },
      {
        find: ".map(",
        title: "지연 변환",
        body: "요소를 하나씩 바꾸는 어댑터다. 여기서는 아직 아무 일도 하지 않고, 소비되는 순간에야 실행된다.",
        kind: "std",
      },
      {
        find: ".collect();",
        title: "소비해서 모으기",
        body: "이터레이터를 소비해 컬렉션으로 모은다. 목표 타입이 변수의 타입 표기(Vec<String>)에서 정해지므로 터보피시(::<>) 없이도 추론이 끝난다.",
        kind: "concept",
      },
      {
        find: "{shouts:?}",
        title: "Debug 포맷",
        body: "개발자용 표현으로 출력하는 서식 지정자다. {:?}는 Debug 트레잇을, {}는 사람이 읽는 Display를 요구한다.",
        kind: "syntax",
      },
      {
        find: "names.len()",
        title: "소유권의 증거",
        body: "이 줄이 컴파일된다는 사실이 곧 증거다. iter()가 요소를 빌렸기 때문에 names는 여전히 main이 소유하고 있다.",
        kind: "concept",
      },
    ],
    takeaway: "빌리기(iter)와 가져가기(into_iter)의 차이가 루프 뒤 코드의 운명을 정한다.",
    check: {
      question: "iter()를 into_iter()로 바꾸면 어떻게 되는가?",
      options: [
        "그대로 컴파일되고 실행된다",
        "names가 이동해 마지막 줄에서 컴파일 오류가 난다",
        "names가 비어 len()이 0을 돌려 준다",
      ],
      answer: 1,
      explain: "into_iter()는 요소를 소유권째로 넘긴다. names의 소유권은 map 체인으로 이동했으므로 이후 names.len()은 use of moved value 오류가 된다. 빌리느냐 가져가느냐가 루프 뒤를 정한다.",
    },
  },
  {
    no: 4,
    date: "2026.09.10",
    title: "SQL 윈도우 함수, 행을 접지 않고 더하기",
    dek: "사용자별 합계와 최신 주문 순번을 주문 행 옆에 붙인다. GROUP BY와의 경계를 본다.",
    minutes: 3,
    language: "SQL",
    domain: "데이터",
    prompt: "GROUP BY user_id로 바꾸면 무엇이 사라지는가",
    code: `SELECT
  user_id,
  created_at,
  amount,
  SUM(amount) OVER (PARTITION BY user_id) AS user_total,
  ROW_NUMBER() OVER (
    PARTITION BY user_id
    ORDER BY created_at DESC
  ) AS recent_rank
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';`,
    annotations: [
      {
        find: "SUM(amount) OVER",
        title: "행 옆에 붙는 집계",
        body: "GROUP BY와 달리 행을 줄이지 않고 집계 값을 곁들인다. 각 주문 행이 그대로 남으면서 사용자별 합계가 옆에 붙는다.",
        kind: "concept",
      },
      {
        find: "PARTITION BY user_id",
        title: "창의 경계",
        body: "윈도우의 그룹 경계를 긋는다. user_id가 같은 행끼리 하나의 창이 되고, 창마다 집계와 순번이 따로 계산된다.",
        kind: "syntax",
        all: true,
      },
      {
        find: "ROW_NUMBER()",
        title: "창 안의 순번",
        body: "창 안에서 정렬 기준으로 매긴 순번이다. 최신 한 건만 남기는 쿼리의 정석 재료다.",
        kind: "std",
      },
      {
        find: "ORDER BY created_at DESC",
        title: "순번의 기준",
        body: "순번·랭킹 함수가 따르는 기준이다. 내림차순이므로 가장 최근 주문이 1번을 받는다.",
        kind: "syntax",
      },
      {
        find: "AS user_total",
        title: "열 별명",
        body: "식에 이름을 붙인다. 윈도우 함수 결과는 식이므로 별명이 있어야 클라이언트와 하위 쿼리에서 다룰 수 있다.",
        kind: "syntax",
      },
      {
        find: "INTERVAL '30 days'",
        title: "기간 상수",
        body: "날짜에서 빼면 그만큼 과거 시점이 된다. 표기는 방언마다 다르다 — PostgreSQL은 '30 days', MySQL은 INTERVAL 30 DAY다.",
        kind: "syntax",
      },
    ],
    takeaway: "윈도우 함수는 행을 유지한 채 집계를 곁들인다 — 개별 행과 요약이 동시에 필요할 때 쓴다.",
    check: {
      question: "같은 데이터를 GROUP BY user_id로 다시 쓰면 무엇이 달라지는가?",
      options: [
        "사용자별 합계가 사라진다",
        "행이 사용자별 한 행으로 줄어 개별 주문 내역을 잃는다",
        "30일 필터가 더 이상 적용되지 않는다",
      ],
      answer: 1,
      explain: "GROUP BY는 집합을 대표 행으로 접는다. 합계는 얻지만 주문 단위의 created_at과 amount는 잃는다. '개별 행 + 요약'이 동시에 필요하면 윈도우 함수가 답이다.",
    },
  },
  {
    no: 3,
    date: "2026.09.10",
    title: "파이썬 제너레이터로 큰 파일 쪼개 읽기",
    dek: "CSV를 덩어리로 내보내는 제너레이터. 함수 상태가 어떻게 남아 있는지 본다.",
    minutes: 3,
    language: "Python",
    domain: "백엔드",
    prompt: "이 함수를 for문으로 돌리면 메모리에는 무엇이 남는가",
    code: `def read_rows(path, chunk=1000):
    with open(path, newline="") as f:
        rows = csv.reader(f)
        header = next(rows)
        buf = []
        for row in rows:
            buf.append(dict(zip(header, row)))
            if len(buf) == chunk:
                yield buf
                buf = []
        if buf:
            yield buf`,
    annotations: [
      {
        find: "def read_rows(path, chunk=1000):",
        title: "제너레이터 함수",
        body: "본문에 yield가 있는 함수는 제너레이터다. 호출해도 본문이 실행되지 않고 이터레이터 하나가 돌아온다.",
        kind: "concept",
      },
      {
        find: "with open(",
        title: "컨텍스트 매니저",
        body: "파일을 열고 블록이 끝나면 예외 여부와 관계없이 닫는다. close()를 직접 부르는 방식은 예외 경로에서 누수되기 쉽다.",
        kind: "idiom",
      },
      {
        find: "next(rows)",
        title: "하나 꺼내기",
        body: "이터레이터에서 원소 하나를 꺼낸다. 첫 행이 데이터가 아니라 헤더임을 이용해 미리 건너뛴다.",
        kind: "std",
      },
      {
        find: "dict(zip(header, row))",
        title: "헤더-행 짝짓기",
        body: "zip이 두 시퀀스를 같은 자리끼리 짝짓고 dict가 그 짝을 키-값으로 받는다. 행을 레코드로 바꾸는 파이썬의 정형구다.",
        kind: "idiom",
      },
      {
        find: "yield buf",
        title: "값을 내보내고 멈춤",
        body: "값을 호출자에게 내보내고 실행을 멈춘다. 다음 값을 달라고 하면 이 자리부터 이어서 실행된다 — 함수 상태가 그 사이에 유지된다.",
        kind: "syntax",
        line: 9,
      },
      {
        find: "if buf:",
        title: "빈 시퀀스는 거짓",
        body: "빈 목록은 거짓으로 취급된다. 마지막 덩어리가 실제로 남아 있을 때만 내보내라는 뜻이다.",
        kind: "idiom",
      },
    ],
    takeaway: "제너레이터는 요청받을 때만 다음 값을 만든다 — 메모리에는 지금 가공 중인 덩어리 하나만 남는다.",
    check: {
      question: "이 함수의 덩어리를 전부 소진할 때 메모리 사용량은 어떤 그림인가?",
      options: [
        "파일 전체가 레코드 목록으로 올라간다",
        "chunk 크기의 덩어리 하나만 유지되고, 파일은 필요할 때 조금씩 읽힌다",
        "yield를 만나기 전까지는 아무것도 읽지 않는다",
      ],
      answer: 1,
      explain: "제너레이터는 요청받을 때만 다음 덩어리를 만들고, 호출자는 덩어리를 쓰고 버린다. 파일이 아무리 커도 남는 것은 chunk 크기의 버퍼 하나다. 전체 목록이 필요하면 list(read_rows(...))로 명시적으로 모은다.",
    },
  },
  {
    no: 2,
    date: "2026.09.10",
    title: "리액트 이펙트 정리는 어디서 도는가",
    dek: "토글로 심장박동 폴링을 켜고 끄는 훅. 의존성 배열이 정리 함수를 부르는 지점을 본다.",
    minutes: 3,
    language: "TypeScript",
    framework: "React",
    domain: "프론트엔드",
    prompt: "버튼을 눌렀을 때 이펙트와 정리 함수는 각각 언제 도는가",
    code: `function useHeartbeat(beats: () => void, ms: number) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!on) return;
    const id = setInterval(beats, ms);
    return () => clearInterval(id);
  }, [on, beats, ms]);

  return (
    <button type="button" onClick={() => setOn(v => !v)}>
      {on ? "끄기" : "켜기"}
    </button>
  );
}`,
    annotations: [
      {
        find: "useState(false)",
        title: "상태 만들기",
        body: "컴포넌트 안에서 시간이 지나도 유지되는 값을 만든다. 두 번째 요소는 값을 바꾸고 다시 렌더링을 요청하는 설정 함수다.",
        kind: "std",
      },
      {
        find: "useEffect(",
        title: "부수 효과 훅",
        body: "렌더가 화면에 반영된 뒤에 실행되는 작업을 다룬다. 의존성 배열이 이번 렌더와 다를 때만 이전 효과를 정리하고 다시 실행한다.",
        kind: "concept",
      },
      {
        find: "if (!on) return;",
        title: "조기 종료",
        body: "정리 함수 없이 이펙트를 끝내는 패턴이다. 꺼져 있으면 구독 자체를 만들지 않는다.",
        kind: "idiom",
      },
      {
        find: "return () => clearInterval(id);",
        title: "정리 함수",
        body: "이펙트의 뒷정리다. 다음 이펙트가 실행되기 직전과 언마운트 때 호출되므로 타이머·구독은 반드시 여기서 거둔다.",
        kind: "concept",
      },
      {
        find: "[on, beats, ms]",
        title: "의존성 배열",
        body: "React는 각 원소를 Object.is로 비교해 재실행 여부를 정한다. 배열을 생략하면 매 렌더마다, 비우면 마운트 때 한 번만 실행된다.",
        kind: "concept",
      },
      {
        find: "setOn(v => !v)",
        title: "함수형 업데이트",
        body: "이전 값을 인자로 받는 업데이트다. 같은 흐름에서 여러 번 바뀌어도 값이 서로 덮이지 않는다.",
        kind: "idiom",
      },
    ],
    takeaway: "의존성 비교는 값이 아니라 참조다 — 매 렌더 새 함수는 매 렌더 정리·재실행을 부른다.",
    check: {
      question: "부모가 beats를 매 렌더마다 새 함수 리터럴로 넘기면 어떻게 되는가?",
      options: [
        "아무 차이가 없다 — 함수 내용이 같기 때문",
        "매 렌더마다 인터벌이 해제됐다가 다시 설정된다",
        "컴파일 오류가 난다",
      ],
      answer: 1,
      explain: "의존성 비교는 참조로 이뤄진다. 내용이 같은 함수라도 매 렌더 새 참조면 매번 정리·재실행이 일어나고 주기는 계속 리셋된다. 부모는 useCallback으로 참조를 고정하거나, 훅 쪽에서 ref로 최신 함수를 가려 준다.",
    },
  },
  {
    no: 1,
    date: "2026.09.10",
    title: "고 컨텍스트 타임아웃 따라가기",
    dek: "2초짜리 데드라인을 걸고 원격 자원을 가져온다. cancel이 왜 반드시 defer여야 하는지 본다.",
    minutes: 3,
    language: "Go",
    domain: "백엔드",
    prompt: "이 함수가 실패하는 경로를 세 개 찾아 보라",
    code: `func Fetch(ctx context.Context, url string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("request: %w", err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("do: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("status: %s", resp.Status)
	}
	return io.ReadAll(resp.Body)
}`,
    annotations: [
      {
        find: "cancel :=",
        title: "짧은 선언의 재선언",
        body: "왼쪽에 새 변수가 하나 이상 섞여 있으면 기존 변수를 재사용한다. ctx는 이미 매개변수로 있으므로 재할당, cancel만 새로 선언된다.",
        kind: "syntax",
      },
      {
        find: "context.WithTimeout",
        title: "데드라인 파생",
        body: "부모 컨텍스트보다 빨리 끝나는 데드라인을 가진 자식 컨텍스트를 만든다. 돌려받은 cancel은 그 자원을 즉시 거두는 해제 함수다.",
        kind: "std",
      },
      {
        find: "defer cancel()",
        title: "해제를 미루기",
        body: "함수가 반환되는 모든 경로의 직전에 cancel이 도는다. 이 한 줄이 없으면 컨텍스트는 데드라인까지 살아 있고 go vet의 lostcancel이 경고한다.",
        kind: "idiom",
      },
      {
        find: "http.NewRequestWithContext",
        title: "요청에 컨텍스트 붙이기",
        body: "전송과 응답 대기 전체가 취소 신호를 따르게 한다. 컨텍스트 없는 요청은 타임아웃 제어가 클라이언트 설정에만 의존한다.",
        kind: "std",
      },
      {
        find: "if err != nil {",
        title: "오류는 값이다",
        body: "Go는 예외 대신 오류를 반환값으로 다룬다. 호출 직후 바로 확인하는 이 패턴이 Go 코드의 뼈대다.",
        kind: "idiom",
      },
      {
        find: "%w",
        title: "오류 감싸기",
        body: "원인 오류를 감싸는 서식 지정자다. errors.Is·errors.As로 감싼 원인을 벗겨 판별할 수 있다.",
        kind: "syntax",
      },
      {
        find: "defer resp.Body.Close()",
        title: "본문 닫기",
        body: "응답 본문을 다 읽지 않아도 연결이 재사용되도록 닫는다. 쓰는 자리가 아니라 열린 직후에 defer로 선언하는 것이 관용이다.",
        kind: "std",
      },
    ],
    takeaway: "컨텍스트는 요청의 수명이다 — 데드라인을 걸었다면 해제 함수를 돌려 주는 것까지가 한 세트다.",
    check: {
      question: "defer cancel()을 빼먹으면 어떻게 되는가?",
      options: [
        "컴파일이 실패한다",
        "아무 문제가 없다 — 타이머는 즉시 반납된다",
        "데드라인 전까지 컨텍스트가 살아 있어 타이머와 자원이 그대로 남는다",
      ],
      answer: 2,
      explain: "컴파일은 그대로 통과한다. cancel을 부르지 않으면 컨텍스트는 데드라인이 지날 때까지 살아 있고 그동안 타이머가 자원을 점유한다. 요청마다 이런 컨텍스트를 만드는 서버에서는 누적으로 이어진다 — go vet의 lostcancel이 이 실수를 찾아 준다.",
    },
  },
];
