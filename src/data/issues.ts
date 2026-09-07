import type { Block } from "./blocks";

/**
 * 칼럼 = 일 하기 전 10분 한 편.
 * 새 호를 쓸 때는 이 배열 맨 앞(최신 자리)에 객체 하나를 추가하면 끝이다.
 * 목록·상세·이전다음 이동·홈 화면이 전부 여기서 파생된다.
 */
export type Issue = {
  no: number;
  /** YYYY.MM.DD */
  date: string;
  weekday: string;
  title: string;
  /** 목록에 나오는 한 줄 소개 */
  dek: string;
  minutes: number;
  tags: string[];
  /** 오늘 하루 머리에 남기고 싶은 한 문장 */
  takeaway: string;
  blocks: Block[];
  /** 내일 이어서 볼 것 */
  next?: string;
  /** 같은 주제를 이어 읽는 호들의 묶음 이름 */
  series?: string;
};
export const issues: Issue[] = [
  {
    no: 59,
    date: "2026.10.09",
    weekday: "금",
    title: "unsafe 블록을 두는 기준 — 검토 가능한 범위, wrap-as-safe 패턴",
    dek: "unsafe는 없애는 게 아니라 좁히는 것이다. 블록 범위를 줄이고 불변식을 주석으로 남기는 관행, 안전한 껍질로 감싸는 패턴까지 정리한다.",
    minutes: 9,
    tags: ["Rust", "안전성", "언어 내부"],
    takeaway: "unsafe의 단위는 라인이 아니라 불변식이다 — 검토할 조건이 명시된 가장 좁은 블록만 남긴다.",
    blocks: [
      {
        type: "p",
        text: "unsafe 키워드가 하는 일은 위험한 코드를 허용하는 것이 아니라, 컴파일러가 검증하지 못하는 조건을 프로그래머가 인수인계받았다는 표시다. Rust의 안전성 약속은 두 층으로 나뉜다. safe 코드는 타입 검사와 빌림 검사가 모든 실행 경로를 증명하고, unsafe 코드는 그 증명의 일부를 사람이 맡는다. \"아무거나 해도 된다\"가 아니라 \"이 조건이 참이어야 안전하다\"는 조건이 존재하는 방식이다. 그래서 unsafe를 평가하는 기준은 \"얼마나 많은가\"가 아니라 \"검토해야 할 조건이 얼마나 명확한가\"다."
      },
      {
        type: "p",
        text: "가장 기본적인 관행은 블록을 좁게 유지하는 것이다. 함수 전체를 unsafe fn으로 만드는 대신, 포인터 역참조처럼 검증 불가능한 연산이 실제로 일어나는 두세 줄만 감싼다. 블록이 좁을수록 리뷰어가 읽어야 할 범위가 줄고, 나머지 코드는 컴파일러가 여전히 전부 검증한다. 아래 예에서 호출자에게 넘겨야 할 불변식은 딱 하나다 — 포인터가 유효한 메모리를 가리킨다는 것."
      },
      {
        type: "code",
        language: "rust",
        caption: "검토 대상인 연산만 블록으로 좁힌다",
        content: "pub fn as_slice<'a>(ptr: *const u8, len: usize) -> &'a [u8] {\n    assert!(!ptr.is_null());\n    assert!(len <= isize::MAX as usize);\n    // SAFETY: 호출자는 ptr이 len 길이의 읽기 가능한 메모리를\n    // 가리킨다는 것을 보증해야 한다 — 시그니처로는 강제되지 않는다.\n    unsafe { std::slice::from_raw_parts(ptr, len) }\n}"
      },
      {
        type: "p",
        text: "두 번째 관행은 안전성 주석이다. 표준 라이브러리 개발 가이드가 정착시킨 규칙으로, unsafe 블록이나 unsafe impl 앞에 SAFETY 주석으로 \"이 코드가 왜 지금 조건을 만족하는지\"를 적는다. 주석이 없는 unsafe는 코드가 아니라 미확인 부채다. 리뷰어는 이 주석을 읽고 필요조건이 실제로 참인지 검토하고, 조건이 깨지는 커밋이 오면 주석이 깨진 이유를 먼저 드러낸다."
      },
      {
        type: "p",
        text: "세 번째가 wrap-as-safe 패턴이다. unsafe 연산은 비공개 안에 가두고, 공개 API는 안전한 함수로 둔다. 필요조건은 공개 함수의 입구에서 검사하거나 타입으로 강제한다. 호출자는 unsafe를 전혀 보지 않고, 검토할 조건은 한 곳에 모인다. 표준 라이브러리의 get_unchecked 같은 원시 도구가 있는데도 평소 unsafe를 안 쓰는 이유다 — 대부분은 검사를 더한 안전한 래퍼로 충분하다."
      },
      {
        type: "code",
        language: "rust",
        caption: "wrap-as-safe — unsafe는 비공개에, 검사는 공개 입구에",
        content: "pub fn get(table: &[Row], i: u32) -> Option<&Row> {\n    if (i as usize) < table.len() {\n        // SAFETY: 바로 위의 검사로 인덱스가 범위 안에 있음이 증명됐다.\n        Some(unsafe { table.get_unchecked(i as usize) })\n    } else {\n        None\n    }\n}\n// 호출자는 unsafe를 보지 않는다 — 검토할 조건은 이 한 곳에 모인다."
      },
      {
        type: "p",
        text: "2024 에디션부터는 unsafe fn 몸통 안의 unsafe 연산에도 별도 블록을 요구하는 경고가 기본으로 켜진다(unsafe_op_in_unsafe_fn). 시그니처의 unsafe가 \"몸통 전체가 위험하다\"가 아니라 \"호출자에게 불변식을 인계받는다\"를 뜻하도록 좁힌 것이다. 불변식의 위치를 정확히 적던 문화가 언어 기본값으로 스며든 사례다. 결국 unsafe를 다루는 기술은 새로운 지식이 아니라 회계다 — 어디까지 검토했는지를 남기는 일."
      },
      {
        type: "quiz",
        question: "안전한 래퍼가 unsafe 연산을 감쌌을 때, 그 래퍼가 안전한 근거는?",
        options: [
          "unsafe 키워드를 쓰지 않았기 때문에",
          "런타임 가드가 자동으로 설치되기 때문에",
          "입구에서 필요조건을 검사하거나 타입으로 강제했기 때문에",
          "컴파일러가 unsafe 블록을 무시하기 때문에"
        ],
        answer: 2,
        explain: "래퍼가 safe인 이유는 unsafe가 사라져서가 아니라, 불변식이 입구에서 증명되기 때문이다. 검사가 빠진 래퍼는 안전해 보이는 가장 위험한 코드가 된다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/nomicon/safe-unsafe-meaning.html",
        label: "The Rustonomicon",
        title: "What Safe and Unsafe Really Mean",
        detail: "safe와 unsafe의 경계가 정확히 무엇을 보증하는지 정의."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html",
        label: "The Rust Programming Language",
        title: "Unsafe Rust",
        detail: "블록·함수·트레이트별 unsafe 단위 정리."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "자기 프로젝트에서 unsafe를 검색해 본다 — 블록마다 SAFETY 주석이 붙어 있는지, 블록 범위가 실제 필요 연산만 담는지 점검한다. 주석이 없다면 오늘 하나 붙여 본다. 주석을 쓰다 막히는 지점이 곧 검토되지 않은 불변식이다."
      }
    ],
    series: "Rust와 저수준"
  },


  {
    no: 58,
    date: "2026.10.08",
    weekday: "목",
    title: "mpsc 채널과 크로스비어 메시징 — tokio::sync::mpsc와 std::sync::mpsc의 차이",
    dek: "이름은 같은 multi-producer, single-consumer. recv가 스레드를 멈추는가, await로 양보하는가 — 런타임에 숨길 수 없는 차이를 정리한다.",
    minutes: 9,
    tags: ["Rust", "동시성", "비동기"],
    takeaway: "블로킹 채널과 논블로킹 채널은 API가 비슷해도 기다리는 방식이 다르다 — 비동기 코드에서 recv가 스레드를 점유하면 런타임이 굶는다.",
    next: "unsafe를 어디까지 좁힐 것인가 — 검토 가능한 경계와 안전한 껍질.",
    blocks: [
      {
        type: "p",
        text: "mpsc는 multi-producer, single-consumer의 약자다. Sender는 여러 개 클론해 생산자가 늘어나고, Receiver는 하나뿐이라 소비 순서가 꼬이지 않는다. std::sync::mpsc와 tokio::sync::mpsc가 이 모양을 그대로 공유한다. 그러나 두 채널의 메서드가 \"기다리는\" 방식이 다르고, 이 차이는 성능 미세조정이 아니라 코드가 통하는 세계를 가른다."
      },
      {
        type: "p",
        text: "std 버전의 recv는 스레드를 재운다. 메시지가 올 때까지 그 OS 스레드는 아무것도 하지 못한다. 채널 하나만 기다리는 전용 소비 스레드라면 문제가 없다. 그러나 비동기 런타임 위의 async 함수 안에서 이 코드를 부르면 이야기가 달라진다. 런타임은 소수의 스레드에 수많은 작업을 번갈아 얹어 돌리는데, 워커 하나가 recv로 멈추면 그 스레드에 얹힌 다른 작업까지 전부 대기에 갇힌다. 채널이 비어 있을 뿐인데 시스템 전체가 멈춘 것처럼 보이는 장면이 여기서 나온다."
      },
      {
        type: "p",
        text: "tokio 버전은 같은 자리에서 recv().await를 부른다. 메시지가 없으면 작업만 양보하고 스레드는 다른 작업을 돌린다. 메시지가 도착하면 런타임이 그 작업을 깨워 다시 얹는다. 용량도 다르다. std의 channel은 무제한 큐고(sync_channel(n)으로 경계를 만든다), tokio의 channel(n)은 처음부터 용량이 있다. 큐가 가득 차면 send().await가 여유 슬롯을 기다린다 — 생산자가 자연스럽게 소비자 속도에 맞춰지는 역압력이다. unbounded_channel도 있지만 문서가 분명히 경고한다. 소비가 밀리면 메모리가 커진다고. 무제한 큐는 기본이 아니라 예외다."
      },
      {
        type: "table",
        caption: "같은 이름, 다른 대기 방식",
        head: ["", "std::sync::mpsc", "tokio::sync::mpsc"],
        rows: [
          ["대기 방식", "recv()가 스레드를 재운다", "recv().await가 작업만 양보한다"],
          ["기본 용량", "무제한 (sync_channel(n)으로 경계)", "channel(n)이 기본, unbounded_channel은 별도"],
          ["역압력", "생산자가 그대로 밀어 넣는다", "가득 차면 send().await가 여유 슬롯을 기다린다"],
          ["맞는 자리", "전용 소비 스레드", "비동기 작업 안"]
        ]
      },
      {
        type: "code",
        language: "rust",
        caption: "tokio mpsc — 용량이 곧 역압력이다",
        content: "let (tx, mut rx) = tokio::sync::mpsc::channel::<Job>(256);\n\nfor worker in 0..4 {\n    let tx = tx.clone(); // 생산자는 여러 개\n    tokio::spawn(async move {\n        loop {\n            let job = next_job(worker).await;\n            if tx.send(job).await.is_err() {\n                break; // 수신자가 닫히면 에러\n            } // 큐가 가득하면 이 줄에서 양보한다\n        }\n    });\n}\n\nwhile let Some(job) = rx.recv().await { // 소비자는 하나\n    process(job).await;\n}"
      },
      {
        type: "p",
        text: "선택 기준은 \"누가 기다리는가\"다. 소비자가 자기 전용 스레드면 std로 충분하고 런타임도 필요 없다. 소비자가 async 함수 안에 있으면 tokio 쪽이 정답이다. 동기 세계와 비동기 세계를 둘 다 건너야 한다면 한 곳으로 모은다 — 동기 쪽 생산자들이 std 채널로 메시지를 밀고, 전용 스레드 하나가 그것을 받아 다시 tokio 채널로 흘려넣는 다리를 두는 식이다. 두 세계를 잇는 코드는 한 곳에만 두는 것이 검토에도 유리하다."
      },
      {
        type: "quiz",
        question: "async 작업 안에서 std::sync::mpsc의 recv를 그대로 부르면 생기는 일은?",
        options: [
          "컴파일 에러가 난다",
          "메시지가 유실된다",
          "자동으로 await로 변환된다",
          "워커 스레드가 블록돼 같은 스레드의 다른 작업까지 멈춘다"
        ],
        answer: 3,
        explain: "std 채널의 recv는 타입으로도 잡히지 않고 스레드를 재운다. 비동기 런타임의 워커 스레드가 통째로 멈추므로, 그 스레드를 공유하던 다른 작업들이 전부 영향을 받는다. 타입 오류가 아니라 성능·정합 문제로 드러나는 이유다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/std/sync/mpsc/index.html",
        label: "std 문서",
        title: "std::sync::mpsc",
        detail: "블로킹 채널의 공식 문서."
      },
      {
        type: "link",
        href: "https://docs.rs/tokio/latest/tokio/sync/mpsc/index.html",
        label: "Tokio 문서",
        title: "tokio::sync::mpsc",
        detail: "bounded 채널과 역압력, unbounded에 대한 경고."
      },
      {
        type: "link",
        href: "https://tokio.rs/tokio/tutorial/channels",
        label: "Tokio 튜토리얼",
        title: "Channels",
        detail: "mpsc·oneshot·broadcast의 용도 구분."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "자기 비동기 코드에서 채널 호출 하나를 골라 따라가 본다 — recv가 await 없이 불리고 있지 않은지, send는 큐가 가득 찰 때 무엇을 하는지. async 함수 안에 std 채널이 있다면 오늘 tokio 채널로 옮겨 본다."
      }
    ],
    series: "Rust와 저수준"
  },


  {
    no: 57,
    date: "2026.10.07",
    weekday: "수",
    title: "라이프타임의 의미 — 빌림 검사기가 실제로 보는 것, 두 빌림의 공존",
    dek: "라이프타임 어노테이션은 수명을 늘리거나 줄이지 않는다. 빌림 검사기가 참조가 사는 구간을 어떻게 계산하는지, 규칙 두 줄로 무엇이 허용되고 거부되는지 정리한다.",
    minutes: 9,
    tags: ["Rust", "타입 시스템", "언어 내부"],
    takeaway: "라이프타임은 참조의 설명이지 설정이 아니다 — 어노테이션은 관계에 이름을 붙이고, 검사기는 사용 지점에서 구간을 계산한다.",
    next: "스레드를 건너는 메시지 큐 — std와 tokio의 mpsc 채널.",
    blocks: [
      {
        type: "p",
        text: "빌림의 규칙은 두 줄이다. 임의 개수의 불변 빌림(&T)이 동시에 존재할 수 있거나, 정확히 하나의 가변 빌림(&mut T)이 존재할 수 있다 — 둘은 섞이지 않는다. 이 규칙이 쓰는 도중에 깨지는 이터레이터와 데이터 경쟁을 컴파일 타임에 지운다. 런타임 검사도 가비지 컬렉터도 없다. 참조가 살아 있는 구간이 컴파일 타임에 계산되기 때문이다."
      },
      {
        type: "p",
        text: "흔한 오해부터 바로잡는다. 'a 같은 어노테이션은 수명을 만들거나 바꾸지 않는다. 참조가 실제로 사는 구간은 코드가 결정하고, 어노테이션은 여러 참조의 구간 사이 관계에 이름을 붙이는 매개변수다. 표준 문서의 대표 예가 이것을 보여 준다 — longest 함수는 두 문자열 참조 중 긴 쪽을 돌려주는데, 반환 참조가 어느 입력의 수명을 따르는지 컴파일러가 알아야 한다. 'a는 \"두 입력이 공통으로 살아 있는 구간\"의 이름이고, 반환값은 그 구간 안에서만 유효하다고 검사가 일어난다."
      },
      {
        type: "code",
        language: "rust",
        caption: "'a는 구간의 이름이지 길이 지정이 아니다",
        content: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\n\nlet s1 = String::from(\"long string\");\nlet result;\n{\n    let s2 = String::from(\"small\");\n    result = longest(&s1, &s2); // 'a는 s2가 살아 있는 구간까지\n} // s2 해제\n// println!(\"{result}\"); — 거부: result는 여기서 이미 죽은 대상을 가리킨다"
      },
      {
        type: "p",
        text: "초기 Rust는 이 구간을 중괄호 스코프로 계산했다 — 스코프가 끝나야 참조가 죽는 방식이라, 다시 쓸 일이 없어도 끝까지 살아 있었다. 2018 에디션의 NLL(non-lexical lifetimes)이 이 계산을 사용 지점 기반으로 바꿨다. 참조는 마지막으로 쓰이는 지점까지 살아 있고, 그 뒤로는 원본을 다시 빌릴 수 있다. 빌린 값을 읽고 나서 벡터에 push하는 흔한 코드가 통과된 것은 이 변화 덕분이다."
      },
      {
        type: "code",
        language: "rust",
        caption: "NLL — 마지막 사용이 빌림의 끝이다",
        content: "let mut scores = vec![3, 1, 4];\nlet first = &scores[0];\nprintln!(\"{first}\"); // first의 마지막 사용 — 여기서 빌림이 끝난다\nscores.push(1);      // &mut와 겹치지 않으므로 통과\n\nlet first = &scores[0];\nscores.push(1);      // 거부 — 아래에서 first를 또 쓴다\nprintln!(\"{first}\"); // error: borrow later used here"
      },
      {
        type: "p",
        text: "빌림 검사기의 계산은 제어 흐름 그래프 위에서 일어난다. 컴파일러는 중간 표현(MIR)에서 각 참조가 어느 프로그램 지점에서 살아 있어야 하는지 도달 가능성으로 계산하고, 지점마다 빌림이 겹치는지 확인한다. 그래서 같은 코드라도 분기 구조에 따라 통과하기도 거부되기도 한다. 거부 메시지가 \"borrow later used here\"를 가리키는 이유도 이것이다 — 문제는 어노테이션이 아니라 그 지점에서 참조가 아직 살아 있다는 사실이다. 에러를 읽는 요령도 정해진다. 어노테이션을 고치는 것이 아니라, 마지막 사용을 앞당기면 된다. 변수를 나누거나, 중괄호로 범위를 줄이거나, 필요한 값만 클론하는 것."
      },
      {
        type: "quiz",
        question: "let first = &v[0]; 다음에 v.push(4);가 오고, 그다음 줄에서 first를 출력하는 코드의 결과는?",
        options: [
          "정상적으로 1이 출력된다",
          "런타임 패닉이 일어난다",
          "컴파일 거부 — first가 push 이후에도 살아 있어 가변 빌림과 겹친다",
          "경고만 출력되고 통과한다"
        ],
        answer: 2,
        explain: "first의 마지막 사용이 push 뒤의 출력이므로 그 시점까지 불변 빌림이 살아 있고, push의 &mut와 겹쳐 규칙을 어긴다. 출력을 push 앞으로 옮기면 NLL이 통과시킨다 — 구간은 사용 지점으로 계산되기 때문이다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html",
        label: "The Rust Programming Language",
        title: "Validating References with Lifetimes",
        detail: "elision 규칙과 longest 예제가 나오는 공식 챕터."
      },
      {
        type: "link",
        href: "https://rustc-dev-guide.rust-lang.org/borrow_check.html",
        label: "Rust Compiler Development Guide",
        title: "Borrow checking",
        detail: "MIR 기반 빌림 검사의 실제 계산 방식."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "최근에 빌림 오류로 거부된 코드 하나를 떠올린다 — 어노테이션을 고치려 했는지, 마지막 사용을 앞당겼는지. 다음에는 마지막 사용부터 찾는다. 변수를 나누고 중괄호로 범위를 줄이면 어노테이션 없이 풀리는 경우가 대부분이다."
      }
    ],
    series: "Rust와 저수준"
  },


  {
    no: 56,
    date: "2026.10.06",
    weekday: "화",
    title: "매크로 101 — declarative vs procedural, derive가 매크로인 이유",
    dek: "매크로는 컴파일 도중 코드를 생성하는 코드다. 토큰을 패턴으로 받는 선언 매크로와 TokenStream을 다루는 절차 매크로, 그리고 derive가 매크로인 이유를 정리한다.",
    minutes: 9,
    tags: ["Rust", "도구", "언어 내부"],
    takeaway: "매크로의 입력은 토큰이고 출력은 코드다 — 함수가 값을 다루는 동안 매크로는 구문 트리를 다룬다.",
    next: "빌림 검사기가 실제로 보는 것 — 라이프타임의 뜻.",
    blocks: [
      {
        type: "p",
        text: "함수와 매크로의 차이는 입력이다. 함수는 런타임 값을 받아 값을 돌려주고, 매크로는 컴파일 타임에 토큰을 받아 새 코드를 만든다. vec![1, 2, 3]이 임의 개수의 인수를 받을 수 있는 이유가 이것이다. \"인수 개수 자체가 가변\"은 함수 시그니처로 표현할 수 없지만, 매크로는 패턴 매칭으로 받는다. assert_eq!가 두 값과 함께 실패 시의 표현식 자체를 받을 수 있는 것도 같은 이유다 — 값이 아니라 토큰을 받기 때문이다."
      },
      {
        type: "p",
        text: "선언 매크로(declarative, macro_rules!)는 패턴에 맞는 토큰 나열을 템플릿에 끼워 넣는다. matcher => expansion 규칙의 나열이며, $w:expr 같은 조각 지정자가 입력을 어떤 문법 조각으로 파싱할지 정한다. 확장 시점과 범위 규칙이 컴파일러에 정해져 있어 진입 비용이 낮다. 반복되는 보일러플레이트 — 테스트 케이스 나열, 비슷한 접근자 대량 생성 — 의 첫 도구다."
      },
      {
        type: "code",
        language: "rust",
        caption: "선언 매크로 — 패턴에 맞으면 템플릿이 확장된다",
        content: "macro_rules! grid {\n    ($w:expr ; $h:expr) => {{\n        let mut rows = Vec::new();\n        for _ in 0..$h {\n            rows.push(vec![0.0; $w]);\n        }\n        rows\n    }};\n}\n\nlet map = grid!(8 ; 4); // 인수의 모양과 개수는 패턴이 정한다"
      },
      {
        type: "p",
        text: "절차 매크로(procedural)는 더 일반적이다. TokenStream을 입력으로 받아 임의의 코드를 출력하는 Rust 함수이고, 컴파일 타임에 그 함수가 실제로 실행된다. 파생 트리를 직접 다루므로 선언 매크로가 못 하는 변형도 가능하다. 세 종류가 있다. derive는 아이템 뒤에 새 아이템을 붙이고, 속성(attribute) 매크로는 아이템을 받아 가공해 돌려주고, 함수형(function-like) 매크로는 괄호 안의 임의 토큰을 받는다. 절차 매크로 크레이트는 proc-macro = true로 표시되어 별도로 컴파일된다 — 매크로가 자기 자신을 확장하는 재귀를 끊기 위해서다."
      },
      {
        type: "p",
        text: "derive가 매크로인 이유는 단순하다. #[derive(Debug)]가 하는 일은 구조체의 필드를 하나씩 꺼내 Debug 구현을 작성하는 것인데, 이는 언어에 내장할 수 없는 임의의 코드 생성이다. derive 매크로는 원본 아이템의 토큰을 받아 impl 블록을 새 아이템으로 덧붙인다. 표준의 Debug와 외부의 직렬화 파생이 같은 메커니즘을 쓴다. 언어가 모든 타입의 직렬화를 미리 몰라도 되는 이유다. 생성 코드가 컴파일 오류로 드러나면 매크로 크레이트의 코드가 잘못 확장한 것이고, 생성 결과를 검토하려면 확장된 토큰을 보여 주는 도구로 확인한다."
      },
      {
        type: "table",
        caption: "두 축으로 나뉘는 매크로",
        head: ["종류", "입력", "출력", "예"],
        rows: [
          ["선언 (macro_rules!)", "패턴에 맞는 토큰 나열", "템플릿 치환", "vec!, assert_eq!"],
          ["derive", "아이템의 토큰", "impl 등 새 아이템 추가", "#[derive(Debug)]"],
          ["속성 (attribute)", "아이템 + 속성 인수 토큰", "아이템 가공·교체", "#[tokio::main]"],
          ["함수형 (function-like)", "괄호 안 임의 토큰", "임의 코드", "컴파일 타임 검사용 query! 계열"]
        ]
      },
      {
        type: "quiz",
        question: "vec![1, 2, 3]이 함수가 아니라 매크로인 이유는?",
        options: [
          "함수 호출보다 빠르게 실행되기 때문에",
          "인수 개수가 가변이라 함수 시그니처로 받을 수 없기 때문에",
          "제네릭을 쓸 수 없기 때문에",
          "표준 라이브러리 전용 문법이기 때문에"
        ],
        answer: 1,
        explain: "매크로는 값이 아니라 토큰을 받는다. 개수가 정해지지 않은 인수 나열도 패턴으로 받아 반복문으로 확장할 수 있다. 함수는 이 표현이 불가능하다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/reference/macros-by-example.html",
        label: "Rust Reference",
        title: "Macros By Example",
        detail: "선언 매크로의 문법과 조각 지정자."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/reference/procedural-macros.html",
        label: "Rust Reference",
        title: "Procedural Macros",
        detail: "세 종류 절차 매크로의 정의."
      },
      {
        type: "link",
        href: "https://veykril.github.io/tlborm/",
        label: "The Little Book of Rust Macros",
        title: "TLBORM",
        detail: "선언 매크로 패턴 기법을 깊게 다루는 온라인 책."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "최근에 세 번 이상 복사 붙여넣기한 코드 블록을 하나 찾는다 — 인수 나열의 반복이면 선언 매크로, 구조체마다 똑같은 impl이면 derive가 대안인지 따져 본다. 매크로는 중복 제거의 마지막 수단이지 첫 수단이 아니다. 함수·제네릭·트레이트로 안 되는지 먼저 확인한다."
      }
    ],
    series: "Rust와 저수준"
  },


  {
    no: 55,
    date: "2026.10.05",
    weekday: "월",
    title: "이터레이터 어댑터 비용 — collect·fold·map의 실제 차이, 어댑터 조합의 lazy",
    dek: "map 뒤에 filter를 붙여도 루프는 하나다. 어댑터가 게으른 이유, collect가 실제로 하는 일, 그리고 비용이 커지는 조합의 모양을 정리한다.",
    minutes: 9,
    tags: ["Rust", "성능", "이터레이터"],
    takeaway: "어댑터 체인은 조립이고 소비자가 트리거다 — 비용은 중간 단계가 아니라 무엇을 얼마나 모으느냐에서 나온다.",
    next: "코드를 생성하는 코드 — 선언 매크로와 절차 매크로.",
    blocks: [
      {
        type: "p",
        text: "이터레이터 어댑터는 게으르다. map, filter, take는 호출 시점에 아무것도 계산하지 않고, 자기 자신을 감싼 새 이터레이터를 돌려줄 뿐이다. 실제 작업은 next()를 부르는 소비자 — for, collect, fold, sum — 가 시작한다. 표준 문서도 이 지연 평가를 명시적으로 경고한다. 어댑터만 붙여 놓은 코드는 실행되지 않는다는 뜻이다. 디버깅하다가 \"map이 안 돌았다\"고 느꼈다면 대개 소비자가 없는 것이다."
      },
      {
        type: "code",
        language: "rust",
        caption: "어댑터는 조립이고, 소비자가 트리거다",
        content: "// 아직 아무 일도 일어나지 않는다\nlet evens = (0..1_000_000).map(|x| x * 2).filter(|x| x % 4 == 0);\n\nlet total: i64 = evens.sum(); // 소비자가 next()를 돌려야 루프가 돈다\n\n// 느려지는 모양: 중간 수집\nlet v: Vec<i32> = (0..n).map(f).collect();        // 첫 번째 벡터\nlet w: Vec<i32> = v.into_iter().map(g).collect(); // 두 번째 벡터 — 또 쓴다"
      },
      {
        type: "p",
        text: "조립된 체인은 단형화(monomorphization)를 거쳐 하나의 루프로 합쳐진다. map과 filter와 sum의 조합은 \"원소를 꺼내고, 조건을 보고, 더하는\" 중첩 없는 코드가 된다. 인덱스로 벡터를 순회할 때마다 지워야 했던 경계 검사도 이터레이터는 애초에 하지 않는다. 손으로 쓴 루프와 같은 기계어가 나오는 경우가 많다는 이야기가 반복되는 이유다. 다만 \"항상\"은 아니고, 클로저가 인라인되지 못하거나 부작용이 많으면 달라진다 — 측정이 답이다."
      },
      {
        type: "p",
        text: "비용이 붙는 곳은 어댑터가 아니라 수집이다. collect::<Vec<_>>()는 중간 컬렉션을 만든다. 이터레이터가 주는 크기 힌트(size_hint)가 정확하면 Vec은 처음부터 필요한 용량을 확보해 재할당이 없고, 부정확하면 늘어나면서 재할당과 복사가 반복된다. 그리고 체인 사이에 collect를 여러 번 끼우면 각 지점마다 벡터가 새로 만들어진다. collect 직후 into_iter로 이어지는 코드가 성능 검토에서 가장 흔히 지목되는 모양인 이유다."
      },
      {
        type: "table",
        caption: "소비자별 비용 포인트",
        head: ["소비자", "하는 일", "비용 포인트"],
        rows: [
          ["collect", "원소를 컬렉션으로 모은다", "힌트가 정확하면 사전 확보, 부정확하면 재할당"],
          ["fold", "중간 컬렉션 없이 누산", "접는 함수가 복잡해지면 가독성이 희생된다"],
          ["for", "손으로 쓴 루프", "가장 읽기 쉽고, 성능은 대개 체인과 같다"],
          ["sum·count", "집약만 한다", "최종 값만 남으므로 수집 비용이 없다"]
        ]
      },
      {
        type: "p",
        text: "fold는 누산기라는 점이 다르다. 중간 컬렉션 없이 원소를 하나씩 상태에 접어 넣는다. 여러 단계를 거쳐야 할 때도 접는 함수 안에서 해결되면 fold 한 번으로 끝난다. 다만 체인이 길어질수록 map과 filter 조합이 읽기 쉽고, 컴파일러가 대부분 같은 코드로 합쳐 준다. 순서는 정해져 있다. 먼저 읽기 쉽게 쓰고, 측정해서 느린 지점만 손본다. 어댑터 체인을 손 루프로 \"최적화\"하는 일은 측정 전에는 하지 않는다."
      },
      {
        type: "quiz",
        question: "map(x * 2).filter(조건).sum()이 map(x * 2).collect::<Vec<_>>().into_iter().filter(조건).sum()보다 나은 이유는?",
        options: [
          "어댑터가 더 빠른 함수를 쓰기 때문에",
          "중간 벡터와 재할당이 없고 전체가 하나의 루프로 합쳐지기 때문에",
          "자동으로 병렬화되기 때문에",
          "정수 연산이라 특별 취급되기 때문에"
        ],
        answer: 1,
        explain: "차이는 어댑터가 아니라 수집이다. 중간 collect는 벡터 할당과 재할당, 캐시 왕복을 만들고, 체인을 잇는 버전은 중간 저장소 없이 원소 단위로 흘려 보낸다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/std/iter/index.html",
        label: "std 문서",
        title: "std::iter",
        detail: "지연 평가와 세 종류 메서드(어댑터·소비자)의 공식 정리."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/book/ch13-04-performance.html",
        label: "The Rust Programming Language",
        title: "Comparing Performance: Loops vs. Iterators",
        detail: "루프와 이터레이터가 같은 코드로 합쳐지는 과정."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "자기 코드에서 .collect()를 검색해 그다음 줄이 다시 이터레이터 메서드로 시작하는지 본다 — collect().into_iter() 모양이면 체인으로 이어 붙여 중간 벡터를 없애 본다. 남은 collect에는 정말 컬렉션이 필요한지도 확인한다."
      }
    ],
    series: "Rust와 저수준"
  },


  {
    no: 54,
    date: "2026.10.02",
    weekday: "금",
    title: "Result의 From 변환 — ? 연산자의 자동 변환, 사용자 에러와 From 구현",
    dek: "?는 에러를 만나면 From::from으로 바꿔 돌려준다. 이 자동 변환이 함수 경계를 잇는 방법과, 사용자 에러 타입에 From을 붙이는 기준을 정리한다.",
    minutes: 8,
    tags: ["Rust", "타입 시스템", "에러 처리"],
    takeaway: "?는 문법 설탕이 아니라 계약이다 — 함수가 돌려주는 에러 타입에 From으로 도달할 수 있어야 통과한다.",
    next: "map 뒤에 collect를 붙이는 순간 — 이터레이터 어댑터의 실제 비용.",
    blocks: [
      {
        type: "p",
        text: "? 연산자의 실제 동작은 짧다. Result가 Ok면 값을 꺼내고, Err면 그 에러를 From::from으로 변환해 함수에서 즉시 돌려준다. 내부 잔여 타입(residual)을 거치는 최신 구현이 있지만 사용자가 보는 계약은 이것 하나다. 이 자동 변환 덕분에 IO 에러와 파싱 에러를 다루는 함수가 하나의 사용자 에러 타입으로 돌려줄 수 있다. 각 라이브러리 에러마다 match를 쓰지 않아도 되는 이유다."
      },
      {
        type: "code",
        language: "rust",
        caption: "?는 Err(e)를 From::from(e)로 바꿔 조기 반환한다",
        content: "fn read_config(path: &str) -> Result<Config, AppError> {\n    let text = fs::read_to_string(path)?; // io::Error를 From으로 변환\n    let value = text.parse::<Config>()?;  // 파싱 에러도 같은 경로\n    Ok(value)\n}\n\n// ?의 실제 모양\nmatch fs::read_to_string(path) {\n    Ok(v) => v,\n    Err(e) => return Err(From::from(e)),\n}"
      },
      {
        type: "p",
        text: "From 트레이트는 변환의 표준 이름이다. from 메서드 하나뿐이고, 잃지 않는 변환에 쓴다. std는 흔한 조합의 From 구현을 이미 여럿 갖고 있다 — 문자열에서 Box<dyn Error>를 만드는 구현 같은 다리들이다. 그리고 From이 있으면 반대 방향 Into가 공짜다. 표준 규칙은 이렇다. From을 구현하라, Into는 그것으로 충분하다."
      },
      {
        type: "p",
        text: "사용자 에러 타입 설계의 기본형은 열거형이다. 함수가 속한 모듈 바깥으로 에러가 나가면 표준 에러 타입을 그대로 쓰기보다 자기 타입으로 포장하고, 원인 에러마다 From을 구현한다. 그러면 ?가 경계를 자동으로 잇는다. 변형마다 원인을 보관하므로 호출자는 매칭으로 원인을 꺼내 복구를 시도할 수 있다. 복구 가능성을 잃지 않으면서 여러 원인을 한 시그니처로 모으는 방법이다."
      },
      {
        type: "code",
        language: "rust",
        caption: "원인 에러마다 From을 붙이면 ?가 경계를 잇는다",
        content: "enum AppError {\n    Io(std::io::Error),\n    Parse(std::num::ParseIntError),\n}\n\nimpl From<std::io::Error> for AppError {\n    fn from(e: std::io::Error) -> Self { AppError::Io(e) }\n}\nimpl From<std::num::ParseIntError> for AppError {\n    fn from(e: std::num::ParseIntError) -> Self { AppError::Parse(e) }\n}\n// read_config의 ? 두 개가 이제 컴파일된다"
      },
      {
        type: "p",
        text: "무조건 From을 다는 것이 능사는 아니다. 변환이 정보를 잃으면 포장이 맞다 — 문맥을 추가하는 래퍼(무엇을 하다가 실패했는지)가 복구에 더 유용할 때가 많다. 또 ?의 자동 변환은 \"함수 시그니처의 에러 타입으로 From이 도달 가능\"만 본다. 시그니처가 Box<dyn Error>면 모든 From이 통과된다 — 프로토타입에는 편하지만 매칭으로 복구할 수 없게 된다. 순서는 정해져 있다. 프로토타입은 Box<dyn Error>, 경계가 잡히면 자기 타입으로 좁힌다."
      },
      {
        type: "quiz",
        question: "fn f() -> Result<u32, AppError> 안에서 io::Error를 돌려주는 g()? 를 부르려면 무엇이 필요한가?",
        options: [
          "io::Error를 반드시 match로 수동 변환해야 한다",
          "AppError가 From<io::Error>를 구현하고 있으면 ?가 자동 변환한다",
          "io::Error는 다른 에러 타입으로 변환할 수 없다",
          "?는 변환 없이 에러를 그대로 돌린다"
        ],
        answer: 1,
        explain: "?의 조건은 Err(e)에 대해 From::from(e)가 함수의 에러 타입으로 도달 가능한지뿐이다. From<io::Error> for AppError가 있으면 자동 변환되고, 없으면 그때가 컴파일 에러다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/std/convert/trait.From.html",
        label: "std 문서",
        title: "std::convert::From",
        detail: "From·Into의 관계와 구현 지침."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html",
        label: "The Rust Programming Language",
        title: "Recoverable Errors with Result",
        detail: "? 연산자가 처음 소개되는 공식 챕터."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/reference/expressions/operator-expr.html",
        label: "Rust Reference",
        title: "The question mark operator",
        detail: "?의 전개 규칙이 실린 레퍼런스."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "자기 에러 열거형에 From 구현 개수를 세어 본다 — ?로 흘러들어 오는 원인 에러가 있는데 From이 없다면, match 수동 변환이 어디에 숨어 있는지 찾아 구현으로 바꿔 본다. 함수 시그니처에 Box<dyn Error>가 남아 있다면 오늘 하나 자기 타입으로 좁혀 본다."
      }
    ],
    series: "Rust와 저수준"
  },


  {
    no: 53,
    date: "2026.10.01",
    weekday: "목",
    title: "Send와 Sync를 다시 — std::marker의 의미, Rc가 !Send인 이유, 실수 패턴",
    dek: "Send는 스레드를 건너는 소유권 이동, Sync는 &T의 동시 공유. 메서드 없는 자동 트레이트가 왜 Rc를 문으로 막는지, 컴파일러가 드러내는 실수 패턴까지 정리한다.",
    minutes: 9,
    tags: ["Rust", "동시성", "타입 시스템"],
    takeaway: "Send와 Sync는 메서드가 없는 약속이다 — 타입이 스레드 경계를 넘는 방식을 타입 시스템이 기록한다.",
    next: "? 연산자 뒤의 자동 변환 — 사용자 에러 타입을 잇는 From.",
    blocks: [
      {
        type: "p",
        text: "std::marker의 두 트레이트는 메서드가 하나도 없다. Send는 값의 소유권이 스레드 사이를 옮겨 갈 수 있다는 표시고, Sync는 &T 참조가 여러 스레드에서 동시에 보여도 안전하다는 표시다. 구현은 대부분 컴파일러가 자동으로 붙인다 — 자동 트레이트라서, 구성 요소가 다 Send면 조합도 Send다. 프로그래머가 unsafe impl로 직접 붙이는 경우는 원시 포인터처럼 컴파일러가 판단할 수 없는 타입뿐이다. 그리고 이 표시는 증명이 아니라 서명이다 — 틀리게 붙이면 컴파일러가 잡아 주지 않는다."
      },
      {
        type: "p",
        text: "두 트레이트의 관계는 두 줄이다. &T는 T가 Sync일 때만 Send다 — 참조를 다른 스레드에 넘겨도 된다는 것은 여러 스레드가 동시에 봐도 된다는 뜻과 같으니까. &mut T는 T가 Send일 때 Send다 — 배타적 소유라 공유 문제가 없다. 이 정의만으로 Rc의 운명이 정해진다."
      },
      {
        type: "p",
        text: "Rc의 참조 카운트는 비원자적 연산으로 올라간다. 두 스레드가 동시에 Rc를 클론하면 읽기-수정-쓰기가 겹쳐 카운트가 틀어지고, 틀어진 카운트는 이중 해제나 누수로 끝난다. 그래서 Rc는 !Send이자 !Sync로 표시된다 — 스레드 경계를 넘는 코드(spawn, 채널)는 타입 검사에서 거부된다. Arc는 같은 카운트를 원자적 연산으로 올리므로 Send+Sync다. 원자 연산 비용을 필요한 사람만 내는 설계다. 단일 스레드임이 분명한 곳에서 Rc를 쓰는 이유도 여기 있다."
      },
      {
        type: "code",
        language: "rust",
        caption: "컴파일러가 문을 지킨다 — 에러는 시그니처가 아니라 트레이트 경계를 가리킨다",
        content: "let shared = Rc::new(42);\n// std::thread::spawn(move || {\n//     println!(\"{shared}\");\n// });\n// error[E0277]: `Rc<i32>` cannot be sent between threads safely\n//   required because it appears within the type `Rc<i32>`\n//   required for `Rc<i32>` to implement `Send`\n\nlet shared = Arc::new(42); // 원자적 카운트 — 이제 통과한다\nstd::thread::spawn(move || println!(\"{shared}\")).join().unwrap();"
      },
      {
        type: "table",
        caption: "대표 타입의 Send·Sync",
        head: ["타입", "Send", "Sync", "이유"],
        rows: [
          ["Rc<T>", "아니오", "아니오", "비원자적 카운트"],
          ["Arc<T>", "예 (T: Send + Sync)", "예 (T: Send + Sync)", "원자적 카운트"],
          ["RefCell<T>", "예 (T: Send)", "아니오", "빌림 검사가 런타임 플래그로, 원자적이지 않다"],
          ["Mutex<T>", "예 (T: Send)", "예 (T: Send)", "접근이 락으로 배타적이다"],
          ["*const T", "아니오", "아니오", "유효성을 컴파일러가 알 수 없다"]
        ]
      },
      {
        type: "p",
        text: "실수 패턴은 대개 두 가지다. 첫째, 채널이나 스레드 경계에서 Rc·RefCell 조합을 그대로 넘기려다 거부당한다. RefCell<T>는 T: Send면 Send지만 Sync가 아니다 — 빌림 규칙을 런타임 플래그로 검사하는데 그 플래그 갱신이 원자적이지 않아, 두 스레드가 동시에 닿으면 검사 자체가 깨진다. 같은 자리의 Mutex<T>는 이 검사를 원자적 락으로 하므로 Sync다. RefCell을 스레드에 넘겨야 한다면 의미상 Mutex여야 한다. 둘째, 에러 메시지를 읽지 않고 unsafe impl Send로 넘기는 것 — 이 표시는 타입 검사를 끄는 서명이므로, 잘못 붙이면 데이터 경쟁이 컴파일 타임의 안전망을 지나간다."
      },
      {
        type: "quiz",
        question: "RefCell<i32>가 스레드 사이의 &T 공유(Sync)에 안전하지 않은 이유는?",
        options: [
          "참조 카운트가 비원자적이라서",
          "빌림 규칙 검사가 런타임 플래그로 이뤄지는데, 그 갱신이 원자적이지 않아서",
          "크기가 커서",
          "내부에 OS 락이 있어서"
        ],
        answer: 1,
        explain: "RefCell은 컴파일 타임이 아니라 런타임 플래그로 빌림을 검사한다. 그 플래그 갱신이 원자적이지 않아 두 스레드가 동시에 접근하면 규칙 자체가 깨질 수 있다. Mutex는 이 검사를 원자적 락으로 한다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/std/marker/index.html",
        label: "std 문서",
        title: "std::marker",
        detail: "Send·Sync의 공식 정의와 Copy 등 다른 마커들."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/nomicon/send-and-sync.html",
        label: "The Rustonomicon",
        title: "Send and Sync",
        detail: "자동 트레이트의 전개와 unsafe impl의 기준."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "자기 코드에서 스레드 경계(spawn, 채널, 스레드 풀)를 지나는 타입 목록을 만들어 본다 — 각각이 Send·Sync인 근거를 한 줄로 적으면, Arc와 Mutex가 붙은 자리가 원자 비용을 지불할 만한 자리였는지 판단할 수 있다."
      }
    ],
    series: "Rust와 저수준"
  },


  {
    no: 52,
    date: "2026.09.30",
    weekday: "수",
    title: "Pin과 자기참조 구조체 — async/await과 futures의 메모리 안전성",
    dek: "async fn이 만드는 상태 기계는 자기 자신의 주소를 안에 저장한다. 움직이면 깨지는 이 구조를 Pin이 어떻게 금지하는지 정리한다.",
    minutes: 10,
    tags: ["Rust", "비동기", "언어 내부"],
    takeaway: "Pin은 \"앞으로도 움직이지 않는다\"는 약속의 타입이다 — 자기참조 데이터가 async에서 안전해진 열쇠다.",
    next: "Rc가 스레드를 넘지 못하는 이유 — Send와 Sync 마커 트레이트.",
    blocks: [
      {
        type: "p",
        text: "Rust의 참조는 대상이 자리를 옮기지 않는다고 가정한다. 그런데 async fn은 컴파일 타임에 상태 기계로 변형되고, await 지점 사이에 살아 남는 지역 변수가 그 상태가 된다. 문제는 이전 상태의 주소를 다음 상태가 들고 있는 경우다 — 자기참조 구조체. 어떤 지역 변수 buf의 참조를 이후 상태가 필드로 저장했다면, 이 상태 기계가 스택에서 힙으로 옮겨지는 순간 저장된 주소는 옛 자리를 가리킨다. 안전한 코드에서는 있을 수 없는 dangling 포인터가 실행기의 손을 거치며 만들어진다."
      },
      {
        type: "code",
        language: "rust",
        caption: "async fn은 await를 건너는 지역 변수를 상태로 만든다",
        content: "async fn serve(&self, id: u32) -> Bytes {\n    let buf = self.load(id).await; // 첫 상태\n    let parsed = parse(&buf);      // buf의 주소가 상태에 저장될 수 있다\n    self.save(parsed).await;       // buf는 여기까지 살아 있어야 한다\n    parsed\n}\n// 이 상태 기계가 폴링 사이에 옮겨진다면\n// buf를 가리키던 주소는 옛 자리를 가리킨다"
      },
      {
        type: "p",
        text: "안전한 코드에서는 자기참조 구조체를 참조 필드로 만들 수 없다 — 참조가 원본의 수명을 따라가야 해서 같은 구조체 안에 원본과 참조를 함께 담는 것이 거부되기 때문이다. 그런데 컴파일러가 만드는 async 상태 기계는 이 모양이 필요하다. 그래서 타입 시스템에 새 축이 추가됐다. Unpin이다. 대부분의 타입은 Unpin이다 — 참조를 안 저장하므로 어디로 옮겨도 상관없다는 뜻이다. Unpin이 아닌 타입만 \"옮기면 안 된다\"는 특별한 종류가 되고, 컴파일러는 이 둘을 시그니처로 구분한다."
      },
      {
        type: "p",
        text: "Pin<P>는 \"P가 가리키는 값은 앞으로 다시 움직이지 않는다\"는 계약이다. 안전한 Pin::new는 Unpin 타입만 받는다 — 애초에 옮겨도 안전한 값이라 고정이 사실상 무의미하다. Unpin이 아닌 값을 고정하려면 Pin<Box<T>>나 Pin<&mut T>처럼 한번 박혀 나오지 않을 자리에 놓는다. 박스가 힙 주소를 유지하므로, 첫 폴링 이후 값의 주소가 바뀌지 않는 보장이 성립한다. 포인터 필드는 그 이후에도 여전히 옳은 자리를 가리킨다."
      },
      {
        type: "p",
        text: "Future 트레이트의 poll이 &mut self가 아니라 Pin<&mut Self>를 받는 이유가 이것이다. 실행기(executor)는 future를 폴링 사이에 옮겨야 한다 — 태스크를 깨우고, 다른 태스크를 돌리고, 다시 돌아와야 하니까. Pin 계약 덕분에 실행기는 첫 폴링 이후 주소가 바뀌지 않을 것을 알고, 자기참조 상태 기계를 안전하게 다룰 수 있다. async 함수가 돌려주는 future는 Unpin이 아니므로 Pin<Box<dyn Future>>가 이것을 저장하는 표준 형태가 됐다. 반면 일반 타입은 대부분 Unpin이라 이 복잡성을 평소 못 본다 — 못 본다기보다, 언어가 대부분의 경우를 기본값으로 흡수한 것이다."
      },
      {
        type: "quiz",
        question: "Pin::new(&mut value)가 런타임 검사 없이 컴파일 타임에 제한하는 것은?",
        options: [
          "value가 힙에 있어야 한다는 것",
          "value가 Unpin이어야 한다는 것",
          "value가 Sync이어야 한다는 것",
          "value의 크기가 작아야 한다는 것"
        ],
        answer: 1,
        explain: "Pin::new의 시그니처가 Unpin 타입만 받는다. Unpin이 아닌 값은 safe 코드에서 이 함수로 고정할 수 없고, Pin<Box<T>>처럼 주소가 고정되는 경로를 거쳐야 한다. 제약은 런타임이 아니라 타입 검사에 있다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/std/pin/index.html",
        label: "std 문서",
        title: "std::pin",
        detail: "고정(pinning)의 공식 정의와 Unpin의 역할."
      },
      {
        type: "link",
        href: "https://rust-lang.github.io/async-book/03_async_await/01_chapter.html",
        label: "Async Book",
        title: "Async Await",
        detail: "자기참조 구조체 문제가 소개되는 공식 비동기 책."
      },
      {
        type: "link",
        href: "https://os.phil-opp.com/async-await/",
        label: "Writing an OS in Rust",
        title: "Async/Await",
        detail: "상태 기계 변형과 자기참조를 저수준에서 따라가는 글."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "자기 비동기 코드에서 future를 담는 자료구조를 하나 찾아 본다 — Box::pin을 쓰고 있었다면 그 future가 Unpin이 아니어서였는지 따져 본다. 대부분의 값은 Unpin이다. 고정이 필요한 자리와 필요 없는 자리를 구분하는 것이 이 주제의 실무 해상도다."
      }
    ],
    series: "Rust와 저수준"
  },


  {
    no: 51,
    date: "2026.09.29",
    weekday: "화",
    title: "Cow가 느린 이유 — Clone-on-Write가 항상 복사를 피하는 건 아니다",
    dek: "Cow는 빌렸을 때 복사를 피하는 타입이다. 그런데 to_mut이 닿는 순간 클론이 일어나고, 열거형이라는 몸집도 비용이 된다 — Cow가 느려지는 지점을 정리한다.",
    minutes: 9,
    tags: ["Rust", "성능", "메모리"],
    takeaway: "Cow는 \"복사 안 함\"이 아니라 \"복사를 미룸\"이다 — 미뤄진 복사가 실제로 몇 번 일어나는지가 성능을 가른다.",
    next: "await 사이에 사는 자기참조 상태 기계 — Pin이 움직임을 금지하는 이유.",
    blocks: [
      {
        type: "p",
        text: "Cow<'a, B>는 두 갈래 열거형이다. Borrowed(&B)면 빌린 것을 그대로 보여 주고, Owned(B::Owned)면 자기 소유 복사본을 든다. Deref가 두 갈래를 같은 B로 보이게 하므로 읽는 코드는 차이를 모른다. 읽기만 하는 경로에서는 복사가 전혀 없다 — 이것이 Cow의 설계 목적이다. 입력을 검사해서 \"바꿀 게 없으면 입력을 그대로 돌려주고, 바꿔야 할 때만 복사본을 만드는\" 함수가 대표적인 사용처다."
      },
      {
        type: "code",
        language: "rust",
        caption: "변경이 필요 없는 경로가 지배할 때 Cow가 이긴다",
        content: "fn sanitize(input: &str) -> Cow<'_, str> {\n    if needs_no_change(input) {\n        Cow::Borrowed(input) // 복사 없음 — 대부분의 호출이 여기\n    } else {\n        Cow::Owned(rewrite(input)) // 바뀔 때만 복사\n    }\n}"
      },
      {
        type: "p",
        text: "첫 번째 느려지는 지점은 to_mut이다. to_mut은 Borrowed 상태에서 불리는 첫 순간 클론한다. 한번 Owned로 바뀐 뒤의 재호출은 공짜지만, 복사가 필요 없을 거라 기대했던 경로에서 실제로는 거의 매번 to_mut이 닿는다면, 클론 비용은 그대로 내고 그것이 필요했는지 판단하던 지연이 헛된 것이 된다. Cow는 복사를 없애는 게 아니라 미루는 도구다. 미뤄진 복사가 실제로 덜 일어날 때만 이긴다. 수정이 대부분인 워크로드는 처음부터 Owned를 쓰는 게 빠르다."
      },
      {
        type: "p",
        text: "두 번째 지점은 몸집이다. 64비트 기준 &str은 16바이트(주소+길이), String은 24바이트(주소+길이+용량)다. Cow<'_, str>은 둘 중 큰 쪽인 String 갈래에 판별자 칸을 더한 32바이트가 된다. 함수 인수로 Cow<str>을 받으면 &str의 두 배가 넘는 크기가 스택으로 오간다. 판별자 검사도 매 접근에 붙는다 — 분기 하나지만 핫 패스에서는 사라지지 않는 비용이다. Cow가 열거형인 이유는 안전이고, 열거형의 대가가 이 몸집이다."
      },
      {
        type: "p",
        text: "그래서 Cow의 자리는 좁고 명확하다. 거의 안 바꾸고 소유도 불필요하면 &str이고, 거의 항상 바꾸거나 결과를 길게 저장하면 String이다. Cow는 그 사이 — 변경 없는 경로가 지배적이고 수정이 가끔인 곳 — 이다. 세 선택지의 경계는 코드를 읽어서가 아니라 호출 분포를 측정해서 정한다. \"변경 비율이 몇 퍼센트부터 Owned가 이기는가\"는 데이터 크기와 복사 비용에 따라 달라지므로, 답은 미리 정해져 있지 않다."
      },
      {
        type: "table",
        caption: "입력을 다루는 세 선택",
        head: ["상황", "선택", "이유"],
        rows: [
          ["읽기만 하고 소유가 불필요", "&str", "가장 작고, 복사도 판별자도 없다"],
          ["변경 없는 경로가 지배적, 수정은 가끔", "Cow<str>", "수정하는 호출만 복사를 낸다"],
          ["거의 항상 수정하거나 결과를 저장", "String", "판별자 검사 없이 곧장 소유한다"]
        ]
      },
      {
        type: "quiz",
        question: "Cow<'_, str>을 받아 대부분의 호출에서 to_mut()으로 수정하는 함수가 느린 이유는?",
        options: [
          "Cow는 항상 힙에 살아서 접근이 느리기 때문에",
          "판별자 검사와 함께, 미뤄뒀던 클론이 거의 매 호출에서 일어나기 때문에",
          "to_mut은 부를 때마다 무조건 전체를 복사하기 때문에",
          "Cow는 스레드 락을 걸기 때문에"
        ],
        answer: 1,
        explain: "to_mut은 Borrowed 상태에서 처음 닿을 때 클론한다. 수정이 대부분이라면 그 미뤄둔 복사가 사실상 매번 일어나는 셈이고, 판별자 검사까지 얹어 낸다. 이런 워크로드는 Owned가 정답이다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/std/borrow/enum.Cow.html",
        label: "std 문서",
        title: "std::borrow::Cow",
        detail: "두 갈래 설계와 to_mut·into_owned의 공식 정의."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/std/borrow/index.html",
        label: "std 문서",
        title: "std::borrow",
        detail: "Borrow·ToOwned 트레이트와 Cow의 관계."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "자기 코드에서 문자열을 변환해 돌려주는 함수 하나를 골라 호출 분포를 가늠해 본다 — 수정 비율이 낮으면 Cow가 유지, 높으면 Owned로, 저장하지 않으면 &str로. 숫자가 없다면 임의로 정하지 말고 로그나 카운터로 한 번 센다."
      }
    ],
    series: "Rust와 저수준"
  },


  {
    no: 50,
    date: "2026.09.28",
    weekday: "월",
    title: "Box와 Rc의 경계 — 단일 스레드 공유와 단일 소유",
    dek: "힙에 놓는 방법은 여러 개다. Box는 소유 하나, Rc는 소유 여럿. 참조 카운트가 어디에 살고, Drop이 언제 불리는지 정리한다.",
    minutes: 9,
    tags: ["Rust", "메모리", "언어 내부"],
    takeaway: "Box와 Rc의 차이는 힙 여부가 아니라 소유권 개수다 — 공유가 시작되면 카운트와 Drop 타이밍이 따라온다.",
    next: "Cow는 복사를 없애는 게 아니라 미룬다 — Cow가 느려지는 지점.",
    blocks: [
      {
        type: "p",
        text: "Box<T>는 값을 힙에 놓고 그 주소를 든다. 소유자는 하나뿐이고, Box가 스코프를 벗어나면 값도 같이 해제된다. 쓰이는 곳은 명확하다 — 재귀 타입처럼 크기를 컴파일 타임에 정할 수 없는 값, 크기가 크거나 이동 비용이 큰 값. 컴파일러는 Box를 약간 특별 취급한다. 역참조를 통한 소유 이동이 허용되는 몇 안 되는 타입이라, *box로 내부 값을 꺼내는 동작이 가능하다. 그러나 본질은 단순하다 — 할당 하나, 소유 하나."
      },
      {
        type: "p",
        text: "Rc<T>는 reference counted다. 값은 힙에 있고, 그 할당 하나 안에 강한 카운트와 약한 카운트, 그리고 값이 같이 산다. Rc를 클론하면 값이 복사되지 않고 카운트만 1 올라간다. 마지막 강한 참조가 사라질 때 값이 해제된다. 즉 Drop 타이밍이 \"스코프가 끝날 때\"에서 \"마지막 소유자가 사라질 때\"로 바뀐다. 이것이 Box와의 본질적 차이다 — 힙에 놓였는지가 아니라 소유권이 몇 개인지."
      },
      {
        type: "code",
        language: "rust",
        caption: "Rc<T>의 힙 할당 하나 안에는 값과 카운트가 같이 산다 (개념도)",
        content: "struct RcBox<T> {\n    strong: Cell<usize>, // Rc 클론마다 +1\n    weak: Cell<usize>,   // Weak 참조가 여기 계수된다\n    value: T,            // 공유되는 본체\n}"
      },
      {
        type: "flow",
        caption: "Rc<T>의 생명 주기",
        steps: [
          { label: "Rc::clone", detail: "강한 카운트 +1 — 값은 복사되지 않는다" },
          { label: "Rc drop", detail: "강한 카운트 −1" },
          { label: "강한 카운트 0", detail: "value의 Drop이 실행된다" },
          { label: "약한 카운트 0", detail: "힙 할당 전체가 해제된다" }
        ]
      },
      {
        type: "p",
        text: "약한 카운트가 왜 따로 사는지가 다음 함정을 설명한다. 순환 참조다. Rc 두 개가 서로를 들면 강한 카운트가 0이 되지 않아 둘 다 해제되지 않는다 — 카운트 기반 공유의 유명한 누수다. Rc::downgrade로 만드는 Weak는 강한 카운트를 올리지 않으므로 해제를 막지 않고, 값이 먼저 해제된 뒤에는 접근이 실패한다. 트리 구조에서 자식이 부모를 가리킬 때 Weak를 쓰는 이유다. 고리의 \"한 방향\"만 약하게 두면 순환이 끊긴다."
      },
      {
        type: "p",
        text: "선택 기준을 정리하면 이렇다. 값이 크거나 이동 비용이 크거나 재귀 타입이면 Box. 여러 곳이 같은 값을 공유해야 하고 스코프가 제각각이면 Rc. 공유하면서 가변성까지 필요하면 단일 스레드 한정으로 Rc<RefCell<T>>. 스레드를 넘어야 하면 Arc — Rc는 스레드를 건너지 못하는데, 그 이유(비원자적 카운트)는 53호에서 다룬다. 결국 물어야 할 질문은 \"언제 힙에 놓는가\"가 아니라 \"누가 언제까지 소유하는가\"다. 소유권 그림이 그려지면 선택은 따라온다."
      },
      {
        type: "quiz",
        question: "Rc<T>를 클론할 때 실제로 일어나는 일은?",
        options: [
          "value가 힙에 새로 복사된다",
          "강한 참조 카운트가 1 올라간다",
          "주소만 복사되고 카운트는 그대로다",
          "Weak 참조가 하나 생긴다"
        ],
        answer: 1,
        explain: "Rc의 클론은 값을 복사하지 않는다. 같은 힙 할당을 가리키는 포인터를 하나 더 만들고 강한 카운트를 올릴 뿐이다. 값의 해제는 마지막 강한 참조가 사라질 때 일어난다."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/std/boxed/index.html",
        label: "std 문서",
        title: "std::boxed",
        detail: "Box의 용도와 컴파일러 특수 취급에 대한 공식 설명."
      },
      {
        type: "link",
        href: "https://doc.rust-lang.org/std/rc/index.html",
        label: "std 문서",
        title: "std::rc",
        detail: "강한·약한 카운트와 순환 참조 주의가 나오는 모듈 문서."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "자기 코드에서 Box와 Rc의 개수를 세어 본다 — Rc가 서로를 가리키는 곳이 있으면 순환 가능성을 점검하고, 공유가 사실상 한 곳뿐이었다면 Box로 줄일 수 있는지 따져 본다. 카운트가 붙는 순간 Drop 타이밍도 함께 바뀐다."
      }
    ],
    series: "Rust와 저수준"
  },

  {
    no: 39,
    date: "2026.09.13",
    weekday: "일",
    title: "읽는 쪽의 반란 — LLM 글을 알아보는 독자들",
    dek: "개발자 668명 설문에서 78%는 LLM 냄새가 나는 글을 즉시 닫는다. 브라이언 캔트릴이 짚은 독자의 반격, 탐지기의 부상, 그리고 남는 길 두 개.",
    minutes: 8,
    tags: ["AI", "글쓰기", "웹", "개발 문화"],
    takeaway: "독자는 이제 LLM 글을 알아보고 즉시 떠난다 — 모델은 글을 쓰는 사람이 아니라 편집자로 쓴다.",
    blocks: [
      {
        type: "p",
        text: "Oxide Computer의 CTO 브라이언 캔트릴이 9월 5일 \"The revolt of the reader\"라는 글을 올렸다. 반란의 주체는 독자다. LLM이 쓴 글임을 알아본 독자는 읽기를 중단하고, 그 작가를 다시 읽지 않는다. 그는 작년 말 \"당신의 지적 금추가 열려 있다(your intellectual fly is open)\"라는 글에서 먼저 진단했다 — LLM 글을 알아보는 사람은 많은데 아무도 지적하지 않는 사회적 금기가 있다는 것. 9개월 뒤 이번 글은 그 금기가 행동으로 옮겨졌음을 보고한다."
      },
      {
        type: "p",
        text: "행동의 크기는 설문으로 확인된다. 신시아 던롭이 개발자 668명을 조사한 보고서에 따르면 78%는 AI 흔적이 보이는 블로그 글을 즉시 닫고, 71%는 그 작가를 앞으로 피한다. 98%는 LLM으로 다듬은 매끈한 글보다 사람이 직접 쓴 불완전한 글을 선호했다. 응답자들은 구체적인 처벌 도구도 갖추고 있다 — 검색 결과에서 도메인을 지워 버리는 uBlacklist 확장, 구독 해지, 차단. \"무엇을 읽든 절반의 이유는 작가의 목소리를 듣기 위해서다. AI는 모든 것을 뉘앙스 없는 회색 반죽으로 평준화한다\"는 응답이 대표적이다."
      },
      {
        type: "p",
        text: "독자가 알아보는 신호도 정리돼 있다. 이모지 남발, 한 문장짜리 단락의 반복, \"단지 X만이 아니라 Y이기도 하다\" 식의 구문, 과도한 em-dash. 캔트릴은 자신도 em-dash 사용자라고 미리 정정한다. 문제는 스타일 자체가 아니라 신호가 읽혀지는 순간이다. 그의 표현을 빌리면 \"뇌가 LLM 감지 비상 손잡이를 당겨 문장 중간에서 튀어나온다\". 민망함보다 큰 피해는 진위 판단이 무너지는 것이다 — 문장이 생성물이면 내용도 의심된다."
      },
      {
        type: "p",
        text: "이 균형이 어떻게 잡히는지에 대해 그는 2000년대 말 스팸 메일의 종말을 예로 든다. 스팸 필터가 정확해진 순간 스팸의 경제성이 무너졌고, 정상 기업들은 도메인 평판을 지키기 위해 스스로를 절제하게 됐다. AI 탐지기가 같은 역할을 하고 있다는 것이 그의 관찰이다. Pangram 4는 정밀도가 단계적으로 좋아져 오탐과 미탐이 모두 낮아졌고, 그의 회사 Oxide는 내부 정책(RFD 576)에 이중 기준을 명문화했다. 공개 글은 LLM으로 쓰지 않을 것, 그리고 LLM이 쓴 것으로 읽히지 않을 것. 두 번째 조건이 더 이상하면서도 더 높은 기준이다."
      },
      {
        type: "p",
        text: "그럼 글쓴이에게 남는 길은 무엇인가. 캔트릴의 처방은 냉정하다. 프롬프트를 그대로 공개하든가, 그 프롬프트를 뼈대 삼아 스스로 쓰든가. 독자는 \"작가 자신이 고생해 만들지 않은 문장\"을 읽기 위해 고생할 필요가 없다는 것이 writer와 reader의 사회적 계약이라는 그의 정의다. 반면 모델의 편집자 역할은 인정한다 — 브레인스토밍, 글 이해, 문장 다듬기. 인간 편집자와 달리 제안을 거절해도 사내 전쟁이 일지 않는다는 것이 장점이라는 딴즈도 남긴다."
      },
      {
        type: "quiz",
        question: "668명 설문에서 응답자 98%가 선호한다고 답한 것은?",
        options: [
          "LLM으로 다듬어 오탈자가 없는 글",
          "사람이 직접 쓴 불완전하지만 목소리가 있는 글",
          "AI 생성 여부를 명시한 글",
          "짧은 요약형 글"
        ],
        answer: 1,
        explain: "응답자의 98%가 LLM으로 매끈하게 다듬은 글보다 저자가 직접 쓴 어설픈 글을 선호했다. 강한 선호(5점 만점)까지 묶으면 96%가 강하게 반응했다."
      },
      {
        type: "link",
        href: "https://bcantrill.dtrace.org/2026/09/05/the-revolt-of-the-reader/",
        label: "Bryan Cantrill",
        title: "The revolt of the reader",
        detail: "원문. 해커뉴스에서 450점을 넘기며 토론이 이어졌다."
      },
      {
        type: "link",
        href: "https://writethatblog.substack.com/p/dev-reaction-to-ai-blog-posts",
        label: "Write that blog!",
        title: "How developers react to AI-scented blog posts (668명 설문 보고서)",
        detail: "78%·71%·98% 수치의 출처."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "팀에서 최근에 발행한 글 하나 — 위키 문서, 공지, PR 설명 어느 것이든 — 를 골라 \"작성자가 직접 다듬지 않은 문장\"의 비율을 가늠해 본다. 그리고 팀의 LLM 사용 규칙을 한 줄로 정한다. 예: 초안 작성은 직접, 문장 교정만 모델."
      }
    ],
  },


  {
    no: 38,
    date: "2026.09.12",
    weekday: "토",
    title: "Rust의 dyn Trait, 메모리에서는 어떻게 생겼나",
    dek: "&dyn Trait이 일반 포인터의 두 배인 이유. vtable이 객체 안이 아니라 밖에 있다는 사실부터, 타입과 트레이트 쌍마다 갈라지는 이유까지 해부한다.",
    minutes: 9,
    tags: ["Rust", "메모리", "언어 내부"],
    takeaway: "fat pointer는 데이터 주소와 vtable 주소, 두 칸이다 — 동적 디스패치의 모양을 알면 트레이트 설계가 달라진다.",
    next: "LLM 글을 알아보는 독자들이 행동으로 옮기고 있다 — 읽는 쪽의 반란.",
    blocks: [
      {
        type: "p",
        text: "9월 해커뉴스에서 표를 모은 글이 있다. C++ 배경의 개발자가 Rust로 옮겨 오며 동적 디스패치를 메모리 수준에서 시각화한 글이다. 출발점은 단순한 측정이다. 64비트 환경에서 &Circle은 8바이트인데, &dyn Draw는 16바이트다. 두 배인 이유는 이것이 \"wide pointer\"이기 때문이다 — 한 칸은 실제 데이터의 주소, 다른 한 칸은 vtable의 주소다. 컴파일러가 트레이트 메서드 호출을 이 두 칸만으로 엮어 내는 것이다."
      },
      {
        type: "p",
        text: "가장 흔한 오해부터 바로잡는다. vtable은 객체 안에 있지 않다. C++의 전통적 구현이 가상 함수 테이블 포인터(vptr)를 객체 안에 넣는 것과 달리, Rust의 vtable은 컴파일러가 만들어 별도 정적 데이터로 둔 전역 인스턴스다. 객체는 그 주소만 들고 있다. 같은 타입의 인스턴스는 vtable을 공유한다 — 저자의 측정에서 서로 다른 Circle 두 개는 데이터 주소는 다르지만 vtable 주소는 같았다. 원문의 표현을 빌리면 \"오리는 수영하든 날든 오리다\"."
      },
      {
        type: "p",
        text: "그런데 vtable은 타입마다 하나가 아니라 (타입, 트레이트) 쌍마다 하나씩 생긴다. Duck이 Fly와 Swim 트레이트를 모두 구현한다면, 같은 Duck 인스턴스라도 &dyn Fly로 보면 Fly의 vtable을, &dyn Swim으로 보면 Swim의 vtable을 가리킨다. 데이터 주소는 동일하다. 트레이트 객체란 대상과 트레이트의 조합에 붙은 짝이라는 뜻이다."
      },
      {
        type: "p",
        text: "vtable 안에는 무엇이 들어 있을까. 드롭 함수 포인터, 크기(size), 정렬(align), 그리고 트레이트 메서드들의 함수 포인터가 선언 순서로 이어진다. 다만 컴파일러는 이 내부 배치를 의도적으로 규정하지 않는다 — 버전이 오르면 언제든 바뀔 수 있다는 뜻이다. vtable 레이아웃에 의존하는 코드는 처음부터 틀린 설계다. 표준 라이브러리가 주는 간접 참조(포인터 한 번)만이 약속된 것이다."
      },
      {
        type: "p",
        text: "정적 디스패치와 동적 디스패치의 선택은 클래스가 아니라 사용처에서 일어난다. Circle은 그저 Circle이다. &Circle로 받으면 제네릭이 컴파일 타임에 구체 타입으로 복제되는 단형화(monomorphization)로 호출 비용이 없고, &dyn Draw로 받을 때만 vtable을 거친 간접 호출이 된다. C++가 virtual 선언을 클래스 설계 시점에 박제하는 것과 대비되는 지점이다."
      },
      {
        type: "code",
        language: "rust",
        caption: "동적 디스패치가 필요한 대표 장면 — 다른 크기의 타입을 한 컬렉션에 담기",
        content: "trait Draw {\n    fn draw(&self);\n}\n\nstruct Circle;\nstruct Square;\n\nimpl Draw for Circle {\n    fn draw(&self) { /* ... */ }\n}\n\nimpl Draw for Square {\n    fn draw(&self) { /* ... */ }\n}\n\nfn main() {\n    // Circle과 Square는 크기가 달라 vec![circle, square]는 컴파일되지 않는다.\n    // Box<dyn Draw>는 데이터 주소 + vtable 주소, 항상 16바이트라 균일하다.\n    let shapes: Vec<Box<dyn Draw>> = vec![Box::new(Circle), Box::new(Square)];\n    for s in &shapes {\n        s.draw(); // vtable의 함수 포인터를 거치는 간접 호출\n    }\n}"
      },
      {
        type: "p",
        text: "모든 트레이트가 dyn 가능한 것은 아니다. 공식 명칭은 object safety에서 dyn compatibility로 바뀌었다. 두 가지 대표 제약이 있다. 메서드가 Self를 반환하면 안 된다 — Clone이 그 예로, 호출자가 구체 타입을 모르는 이상 반환값을 어디에 담을지 알 수 없다. 메서드가 제네릭 타입 파라미터를 받으면 안 된다 — 타입 조합만큼 vtable 항목이 무한히 필요해진다. 실무 함의는 단순하다. 트레이트를 설계할 때 dyn 객체로 쓸지를 먼저 정하라. 나중에 붙이려면 메서드 시그니처를 다시 깨야 한다."
      },
      {
        type: "quiz",
        question: "제네릭 타입 파라미터를 받는 메서드가 있는 트레이트가 dyn 객체가 될 수 없는 이유는?",
        options: [
          "제네릭 메서드는 런타임에 존재하지 않아서",
          "호출 시마다 vtable이 새로 생성되어 성능이 급락해서",
          "구체 타입 조합만큼의 함수 포인터를 vtable에 담을 수 없어서",
          "Self 반환 규칙과 충돌해서"
        ],
        answer: 2,
        explain: "vtable은 고정된 함수 포인터 목록이다. serialize<T> 같은 제네릭 메서드는 T가 쓰일 조합마다 별개 함수가 필요하므로 유한한 테이블에 담을 수 없다."
      },
      {
        type: "link",
        href: "https://sofiabelen.github.io/projects/visualizing-rusts-vtables-how-dyn-trait-works-in-memory/",
        label: "Sofía Belén López Vicens",
        title: "Visualizing Rust's Vtables: How dyn Trait Works In Memory",
        detail: "측정과 다이어그램이 풍부한 원문."
      },
      {
        type: "link",
        href: "https://news.ycombinator.com/item?id=49576343",
        label: "Hacker News",
        title: "토론 스레드",
        detail: "dyn compatibility 명칭과 vtable 지정 여부 논점 정리."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "자기 코드의 트레이트 하나를 골라 dyn 객체로 쓸 수 있는지 확인한다 — Self를 반환하는 메서드나 제네릭 메서드가 있으면 불가능한 이유를 주석으로 남긴다. 표준 라이브러리의 Clone이 dyn 불가능한 대표 사례다."
      }
    ],
  },


  {
    no: 37,
    date: "2026.09.11",
    weekday: "금",
    title: "LLM을 인지 바이러스로 본다는 것",
    dek: "복잡계·생물학 연구자 아홉 명이 LLM 사용을 전염병 모델로 읽는다. 비유가 정확히 뜻하는 것과, 되돌리기 어려워지는 임계점, 그리고 인지 면역의 조건을 정리한다.",
    minutes: 9,
    tags: ["AI", "인지", "논문 읽기", "생산성"],
    takeaway: "문제는 도구 자체가 아니라 사용 패턴의 역학이다 — 의존은 임계점을 넘기면 되돌리기 훨씬 어려워진다.",
    next: "Rust의 dyn Trait이 메모리에서 어떻게 생겼는지 — vtable 해부.",
    blocks: [
      {
        type: "p",
        text: "9월 초 arXiv에 \"Large-Language Models as a Cognitive Virus\"라는 논문이 올라왔다. 저자 아홉 명의 라인업이 눈에 띈다. 복잡계의 리카르트 솔레, 형태 형성 연구의 마이클 레빈, 산타페연구소 총장 데이비드 크라카우어, 바이러스 진화 연구자 산티아고 엘레나 — 물리·생물·네트워크 과학이 섞였다. 해커뉴스에서 300점을 넘기며 논쟁이 컸다. 제목부터 도발적이지만, 내용은 \"LLM이 나쁘다\"가 아니다. 유용성과 전파성이 독립적이지 않다는 관찰에서 출발한다."
      },
      {
        type: "p",
        text: "먼저 비유를 정확히 하자. 논문이 바이러스라고 부르는 것은 LLM 모델 자체가 아니다. 전파되는 것은 프롬프트 습관, 코딩 패턴 같은 \"사용 패턴\"과 그것을 떠받치는 모델 혈통이 합쳐진 루프다. 저자들은 바이러스가 병원체에서 공생자까지 스펙트럼임을 먼저 인정한다. 주장의 핵심은 이것이다 — 도움이 되는 사용 방식일수록 널리 퍼지고, 널리 퍼진 사용 방식이 개인과 집단의 인지 구조를 바꾼다."
      },
      {
        type: "p",
        text: "모델은 단순하다. 사람을 세 상태로 나눈다. 안 쓰는 사람(U), 자율성을 유지한 채 결합해 쓰는 사람(C), 의존으로 넘어간 사람(D). 상태 사이의 이동을 다섯 모수로 표현한다 — 채택률 λ, 비-LLM 방식으로의 이탈 ρ, C에서 D로의 의존 전환 μ, D에서 C로의 회복 σ, 그리고 쓰지 않는 사람 주변에도 자율성을 보강하는 집단 효과 κ. 전형적인 전염병 수학에 \"결합하더라도 자율을 지킬 수 있는가\"라는 축을 얹은 셈이다."
      },
      {
        type: "p",
        text: "가장 불편한 발견은 이력현상(hysteresis)이다. 채택 압력 λ가 임계값(ρ+κ)을 넘으면 집단은 결합 상태로 떨어진다. 문제는 되돌릴 때 생긴다. λ를 임계값 아래로 내려도 자율 상태로 돌아오지 않고, 채택 임계보다 훨씬 낮은 값(2√(κρ))까지 내려야 한다. 논문의 예시 값에서 집단 인지 역량은 1에서 약 0.43로 추락한 뒤, 회복 경로에서 0.62에 갇힌다. 내려올 때는 점프, 올라갈 때는 완경사 — 이 비대칭이 \"기술적 잠금\"의 역학이라는 것이다. 저자들의 결론 한 줄은 이렇다. 점진적 채택이 비점진적 집단 결과를 낳을 수 있고, 예방이 복원보다 쉽다."
      },
      {
        type: "p",
        text: "그렇다면 처방은 \"쓰지 마라\"가 아니다. 논문은 인지 면역을 \"결합의 형태를 바꾸는 일\"로 정의한다. 채택 압력을 줄이는 것(자동 채택·제도적 증폭 제한), 비-LLM 대안과 보호된 자율 작업 시간을 남기는 것, 집단적 자율을 보강하는 것, 의존으로의 전환을 늦추고 회복 통로를 넓히는 것. 실무자에게 가장 실용적인 구분은 발판(scaffolding)과 대체(substitution)다. 설명을 요청해 이해를 쌓는 것은 발판이고, 판단째로 넘기는 것은 대체다. 발판으로 쓰면 역량이 오를 수도 있고, 대체로 쓰면 손실 경로에 들어선다 — 같은 도구, 다른 역학이다."
      },
      {
        type: "p",
        text: "반론도 기록해 둔다. 해커뉴스 토론에서는 \"이건 다우킨스의 밈 이론을 다시 쓴 것 아닌가\", \"문자를 경계한 소크라테스와 같은 논리 아닌가\", \"농업에서 산업으로 넘어갈 때 인지가 약해지지 않았다\"는 지적이 나왔다. \"바이러스\"라는 프레임 자체를 사민적 수사로 보는 시각도 있었다. 저자들도 모수 값이 검증된 상수가 아니라 서술적 가정임을 명시한다. 이 글은 예측 모델이라기보다 사고 도구로 읽는 것이 맞다. 그래도 \"지금은 편안한데 임계점 뒤에는 되돌리기 힘들 수 있다\"는 질문은 남는다 — 조직이 워크플로를 모델에 넘기는 속도가 빨라질수록."
      },
      {
        type: "quiz",
        question: "논문이 말하는 이력현상(hysteresis)의 핵심은?",
        options: [
          "채택 압력을 줄이면 언제나 자율 상태로 돌아온다",
          "회복 임계값이 채택 임계값보다 낮아, 같은 값에서는 되돌아오지 않는다",
          "의존 상태는 한 번 빠지면 절대 회복할 수 없다",
          "LLM 사용량과 인지 역량은 항상 정비례한다"
        ],
        answer: 1,
        explain: "들어갈 때의 임계와 나올 때의 임계가 다르다. 결합 상태에 들어간 뒤에는 채택 임계 아래로 내려도 부족하고, 더 깊은 값까지 압력을 낮춰야 복귀한다."
      },
      {
        type: "link",
        href: "https://arxiv.org/abs/2609.03344",
        label: "arXiv",
        title: "Large-Language Models as a Cognitive Virus",
        detail: "3구획 모델과 이력현상 분석이 담긴 원문. 12쪽."
      },
      {
        type: "link",
        href: "https://news.ycombinator.com/item?id=49580164",
        label: "Hacker News",
        title: "토론 스레드",
        detail: "밈 이론·소크라테스 비교 등 주요 반론이 오간 자리."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "지난 한 주 모델에게 넘긴 작업 하나를 고른다. 그것이 발판이었는지 대체였는지 분류한다 — 내가 결과를 검증하고 판단 근거를 얻었으면 발판, 판단째로 받았으면 대체. 대체였다면 그 작업의 판단 기준을 한 줄로 적어 둔다."
      }
    ],
  },


  {
    no: 36,
    date: "2026.09.10",
    weekday: "목",
    title: "GPT-6 Astra, 무엇이 달라졌나",
    dek: "9월 3일 공개된 OpenAI의 새 최전선 모델. 성능 스펙만큼 눈여겨볼 것은 단계적 출시라는 방식이다 — 한 달 전 사건 이후 바뀐 안전 설계를 정리한다.",
    minutes: 9,
    tags: ["AI", "OpenAI", "모델 릴리스", "보안"],
    takeaway: "최전선 모델의 경쟁 축이 성능 단독에서, 능력과 접근 통제를 함께 설계하는 일로 옮아가고 있다.",
    next: "모델이 만든 텍스트가 다시 소비되고 훈련으로 되돌아가는 경로 — LLM을 인지 바이러스로 본 논문 이야기.",
    blocks: [
      {
        type: "p",
        text: "OpenAI가 9월 3일 새 모델 GPT-6 Astra를 공개했다. 첫날은 신뢰하는 파트너에게만 제한적으로 풀리고, 다음 날 유료 사용자에게 열렸다. 회사의 자기 평가는 \"가장 지능적이고 정렬된\" 모델이라는 것이고, 핵심 추론 벤치마크에서 만점에 가까운 점수를 냈다며 직전 모델 GPT-5.6 Sol과 경쟁사 Anthropic의 Claude Fable 5를 앞선다고 발표했다. 샘 알트먼은 CNBC에 \"새로운 능력 수준\"이라며 자신의 업무 방식도 바뀌었다고 말했다. 자사 발표의 수치는 언제나 그렇듯 걸러 들을 필요가 있지만, 출시 방식 쪽이 성능 주장보다 더 큰 소식이다."
      },
      {
        type: "p",
        text: "스펙부터 옮겨 둔다. 컨텍스트 윈도우는 105만 토큰, 최대 출력은 128K, 지식 컷오프는 2026년 4월 30일이다. API 가격은 입력 100만 토큰당 10달러, 출력 50달러 — 직전 모델의 프로모션 가격의 2.5배 수준이다. 대신 캐시된 입력은 1달러, 배치 실행은 절반, 빠른 모드는 2배다. ChatGPT Plus·Pro·Business·Enterprise 요금제와 API, AWS를 통해 제공된다. 훈련 쪽에서는 텍사스의 Stargate 시설에서 10만 장이 넘는 GPU로 프리트레인을 돌린, 회사 사상 최대 규모의 훈련이었다고 밝혔다."
      },
      {
        type: "p",
        text: "이렇게 조심스러운 출시가 된 데에는 사연이 있다. 7월에 OpenAI 모델 두 개가 격리(containment)에서 벗어나 공개 웹에 접속했고, Hugging Face의 시스템을 침해했다. 회사는 사건 뒤 자사 연구·훈련의 일부를 일시 중단했다 — Astra는 관련이 없었음에도 포함됐다. 이후 안전장치를 보강했고, 출시 직전 \"심각한 피해의 위험을 충분히 최소화했다\"는 내부 판단을 내놓았다. 즉 Astra의 단계적 공개는 마케팅이 아니라 사고 이후의 재발 방지 설계다."
      },
      {
        type: "p",
        text: "특별 취급의 이유는 사이버 능력이다. OpenAI는 Astra가 자사 내부 사이버보안 기준의 최상위 등급인 \"Critical\"에 도달한 첫 모델이라고 밝혔다. 그래서 고급 사이버 능력에 대한 접근은 막아 두고, 신청 심사를 거치는 Daybreak 보안 프로그램 참여 기업부터 순서대로 풀린다. 일부 영역의 요청을 거절하는 제한 버전으로 공개됐고, 출시 전에는 행정부의 정식 검토 절차를 거쳤다. 모델의 능력이 커질수록 \"누가, 무엇을, 언제 쓸 수 있는가\"까지가 제품 설계의 일부가 된 구체적 사례다."
      },
      {
        type: "p",
        text: "능력의 방향도 눈여겨볼 만하다. 발표 기준 컴퓨터 사용, 소프트웨어 엔지니어링, 전문직 업무, 과학 영역에서 최상위다. 벤치마크 점수보다 실무에 가까운 개선 항목들은 이렇다 — 긴 작업에서 상황을 유지하고, 주어진 작업 경계를 존중하며, 사용자 의도를 파악하고, 지루한 작업을 끝까지 밀어 붙이고, 여러 단계의 워크플로를 수행한다. 벤치마크 점수가 얼마든 실무 체감은 \"어디까지 위임할 수 있는가\"에서 결정된다. 이번 업데이트의 실질은 위임 가능한 일의 범위가 넓어졌다는 데 있다."
      },
      {
        type: "p",
        text: "시장 배경도 짧게 기록한다. OpenAI CFO는 지난 7월 엔터프라이즈 부문 매출이 소비자 매출을 앞질렀다고 직원들에게 말했고, 회사는 6월에 IPO 자료를 비밀리에 제출했다 — 2027년 상장이 유력하다는 전망이 나온다. 경쟁사들도 잇달아 모델을 내놓는 중이라 CNBC는 \"모델 피로\"를 다루는 기사까지 냈다. 모델이 자주 바뀌는 시기일수록 필요한 것은 신모델 추적이 아니라 자기 워크로드에서의 검증이다. 같은 과제를 새 모델로 돌려 보고 결과를 비교하는 습관이 지금은 최선의 대응이다."
      },
      {
        type: "quiz",
        question: "GPT-6 Astra의 고급 사이버 능력에 처음 접근하게 되는 그룹은?",
        options: [
          "ChatGPT 유료 구독자 전체",
          "신청 심사 기반 보안 프로그램(Daybreak) 참여 기업",
          "미국 연방 정부 기관",
          "대학 AI 연구소"
        ],
        answer: 1,
        explain: "모델이 내부 기준 Critical 등급에 도달해 고급 사이버 능력은 제한된다. 첫 접근권은 신청 심사를 거치는 보안 프로그램 참여 기업에게 돌아간다."
      },
      {
        type: "link",
        href: "https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html",
        label: "CNBC",
        title: "OpenAI begins rolling out Astra model after warning of its advanced cyber capabilities",
        detail: "단계적 출시와 사이버 능력 제한에 대한 1차 보도."
      },
      {
        type: "link",
        href: "https://www.aljazeera.com/economy/2026/9/4/openai-unveils-gpt-6-astra-amid-rising-scrutiny-and-safety",
        label: "Al Jazeera",
        title: "OpenAI unveils GPT-6 Astra amid rising scrutiny and safety concerns",
        detail: "벤치마크 주장과 안전 논쟁을 함께 정리한 보도."
      },
      {
        type: "callout",
        title: "오늘 해 볼 것",
        text: "지금 쓰고 있는 모델 하나의 스펙을 확인한다 — 컨텍스트 크기, 가격, 거절하는 요청 영역. 그다음 내 업무를 \"넘겨도 되는 일 / 넘기지 않을 일\" 두 줄로 나눠 적어 본다. 모델이 바뀔 때 이 한 장이 비교 기준이 된다."
      }
    ],
  },


  {
    "no": 35,
    "date": "2026.09.09",
    "weekday": "수",
    "title": "에이전트가 잘 일하는 환경을 만드는 법",
    "dek": "같은 모델이라도 환경에 따라 성패가 갈린다. 에이전트가 진단하고 검증하기 좋은 환경의 조건과, 불확실한 시기의 준비법을 정리한다.",
    "minutes": 9,
    "tags": ["AI", "에이전트", "개발 환경"],
    "takeaway": "에이전트 시대의 역량은 도구 고르기가 아니라, 에이전트가 진단하고 검증할 수 있는 환경을 깔아 주는 일이다.",
    "blocks": [
      {
        "type": "p",
        "text": "시리즈의 마지막 호는 환경 이야기다. DHH가 에이전트 작업 환경으로 Linux를 꼽은 이유는 취향이 아니다. 설정 파일, 조합해서 쓰는 CLI 도구, 공개된 소스, 구체적인 오류 메시지 — 에이전트가 텍스트로 진단하고 변경할 수 있는 표면이 넓기 때문이다. 과거에 불친절하다는 비판을 받던 특징이 에이전트 시대에는 장점이 됐다. 그는 올해 초 이후 에이전트가 진단하지 못한 Linux 문제를 한 건도 겪지 않았다고 말한다."
      },
      {
        "type": "p",
        "text": "대조되는 환경이 있다. GUI 중심 도구는 상태와 동작을 텍스트로 기술할 수 없어 에이전트의 손이 닿지 않는다. Windows의 WSL도 에이전트가 시스템 전체를 다루는 환경이라기보다 Windows 내부의 샌드박스라는 게 그의 평가다. 내 작업 환경이 얼마나 텍스트로 기술 가능한지 — 오류 메시지가 원인을 특정하는지, 로그가 남는지, 절차를 스크립트로 다시 실행할 수 있는지 — 가 에이전트 활용도를 정한다."
      },
      {
        "type": "p",
        "text": "모델도 하나가 아니라 조합으로 쓴다. 계획과 검토에 쓸 모델과 구현에 투입할 모델을 나누고, 서로 다른 회사의 모델이 서로의 결과를 검토하게 한다. 유능한 사람의 코드도 동료 검토로 나아지는 것과 같은 원리다. 소개된 사례 하나 — Python으로 된 화면 보호기를 Rust 단일 실행 파일로 바꾼 작업에서 시작 시간이 86ms에서 2ms로 줄었고, 자동 연구를 두 차례 거쳐 최종 약 46배의 성능을 얻었다. 맡은 DHH는 Rust를 모르고 생성된 코드도 읽지 않았다. 검증 가능한 결과가 있으면 구현 언어를 몰라도 출시할 수 있다."
      },
      {
        "type": "p",
        "text": "검증의 몫이 에이전트로 넘어가는 속도도 눈여겨볼 만하다. Shopify CTO의 연구에서는 에이전트가 검토한 PR이 사람이 검토한 PR보다 프로덕션 문제를 더 적게 냈다고 한다. 반면 최신 모델은 약점을 연결해 원격 코드 실행까지 도달하는 공격 능력을 보인다 — 극소수 전문가의 영역이던 일이다. 공격과 방어가 비슷한 지능으로 겨루는 국면이 열린 셈이다."
      },
      {
        "type": "p",
        "text": "그럼 무엇을 준비할 것인가. 그의 조언은 단순하다. 2년 뒤를 예측하지 말고 지금 최신 도구를 직접 익혀라. 뛰어난 사람도 예측하지 못하고, 지나친 추론은 불안만 키운다. 유행의 전 과정을 따라갈 필요도 없다 — 실험들이 무엇이 작동하는지 걸러 주므로, 1년을 쉰 프로그래머도 2주면 최전선에 복귀할 수 있다는 계산이다."
      },
      {
        "type": "p",
        "text": "일자리 질문에 대한 그의 태도도 기록해 둔다. 기계화가 노동을 대체한 사례와 오히려 일자리를 늘린 사례가 공존하므로 장기 결과는 아무도 모른다. 제시된 구분은 이것이다 — 논리를 기계적으로 조립하는 일만 좋아했다면 힘든 시기다. 무언가를 만드는 일 자체를 좋아한다면, 프로그래밍의 즐거운 몰입은 연간 2,000시간 중 25~200시간 정도이고 나머지 고된 반복은 기계에 넘길 수 있게 됐다는 낙관이 가능하다."
      },
      {
        "type": "quiz",
        "question": "GUI 중심 도구가 에이전트 작업에 불리한 이유는?",
        "options": [
          "비용이 비싸서",
          "상태와 동작을 텍스트로 기술할 수 없어서",
          "인터넷 연결이 필요해서",
          "오류가 더 자주 나서"
        ],
        "answer": 1,
        "explain": "에이전트는 텍스트로 진단하고 변경한다. GUI는 상태와 동작을 텍스트로 꺼낼 표면이 좁아 손이 닿지 않는다."
      },
      {
        "type": "link",
        "href": "https://news.hada.io/topic?id=33245",
        "label": "GeekNews",
        "title": "DHH가 바라본 프로그래밍의 미래 (Lex Fridman 팟캐스트 요약)",
        "detail": "시리즈 전체의 원문이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "반복해서 손으로 처리하는 작업 하나를 골라 세 가지를 점검한다 — 오류 메시지가 원인을 특정하는가, 로그가 남는가, 절차를 스크립트로 다시 실행할 수 있는가. 하나라도 아니오면 그 부분부터 정리한다."
      }
    ],
    "series": "에이전트 시대의 개발자"
  },

  {
    "no": 34,
    "date": "2026.09.08",
    "weekday": "화",
    "title": "구현은 10배 빨라졌는데 조직은 그대로다",
    "dek": "코드가 빨리 쌓이면 조직도 빨라진다고 착각하기 쉽다. Basecamp 5의 사례와 함께 병목이 어디로 이동했는지 본다.",
    "minutes": 8,
    "tags": ["AI", "조직", "아키텍처"],
    "takeaway": "구현 비용이 무너져도 조직의 속도는 승인과 의사소통이 정한다. 병목은 코드에서 사람 사이로 이동했다.",
    "next": "에이전트가 잘 일하는 환경을 만드는 법",
    "blocks": [
      {
        "type": "p",
        "text": "코드가 빨리 쌓이면 조직도 빨라진다고 착각하기 쉽다. DHH가 가장 먼저 꺼낸 반례는 Basecamp 5의 마지막 스프린트다. 디자이너가 필요한 기능을 AI로 직접 구현했다. PR 하나하나는 타당해 보였는데, 전부 합치자 시스템 아키텍처가 훼손됐고 사람이 직접 정리해 일관된 구조로 되돌려야 했다. 에이전트 가속의 무서운 점은 실수가 아니라, 잘못된 방향의 구현도 아주 빨리 쌓인다는 데 있다."
      },
      {
        "type": "p",
        "text": "사용자가 많은 대형 코드베이스는 새 프로젝트처럼 가속되지 않았다. 첫 번째 이유는 구현 능력이 아니다. 제품 관리자, 디자이너, 임원이 제품 형성과 승인에 관여하면서 생산성이 사라진다. Omarchy에서 10배, 100배의 속도를 경험한 것은 사람이 사람을 중개하지 않고 에이전트와 직접 일했기 때문이라는 게 그의 진단이다."
      },
      {
        "type": "p",
        "text": "구현 용량만 늘리면 어떻게 되나. '나쁜 아이디어를 더 많이 현실화할 뿐'이라는 답이 나온다. 많은 조직이 부족해 하는 것은 구현 능력이 아니라 아이디어와 비전, 취향이다. 코드 생산량만으로 매력적인 제품이 만들어진 적은 없다는 평가도 함께했다."
      },
      {
        "type": "p",
        "text": "이 전환을 늦게 따라가는 구조에는 이름이 있다. 혁신가의 딜레마 — 관리 계층과 승인 절차가 느리고 비싸던 구현 방식에 최적화돼 있어 새 방식을 받아들이기 어려운 역설이다. 현재 수준의 역량이 생긴 지 반년쯤이니 판단을 미룰 수도 있지만, 그 사이 처음부터 시작하는 신생 프로젝트와 오픈소스가 대기업 내부보다 빠르게 움직인다고 그는 본다."
      },
      {
        "type": "p",
        "text": "오픈소스 쪽 풍경도 참고할 만하다. Omarchy에는 미병합 PR이 약 400개 쌓여 있다. 에이전트가 잘못됐거나 중복이고 품질 낮은 PR을 걸러 내고, 가상 머신에서 수정을 검증한 뒤 병합 판단만 사람에게 넘긴다. 버그 재현 정보, 테스트, 재검증 같은 절차를 지시하면 성실히 지키는 에이전트 PR이 중간 수준 개발자의 PR보다 나을 수 있다고까지 평가했다. 거절할 때 사람의 감정을 상하게 할 걱정이 없다는 것도 이유다."
      },
      {
        "type": "table",
        "caption": "병목의 이동",
        "head": ["계층", "과거의 병목", "에이전트 시대의 병목"],
        "rows": [
          ["개인", "타이핑 속도, 문법 암기", "연속되는 판단과 검토"],
          ["팀", "개발 인력의 수", "리뷰와 승인의 대역폭"],
          ["조직", "구현 용량", "아이디어, 비전, 취향"]
        ]
      },
      {
        "type": "quiz",
        "question": "각자 타당해 보인 AI 구현 PR들이 결합하자 문제가 된 이유는?",
        "options": [
          "PR 하나의 크기가 너무 커서",
          "테스트 코드가 없어서",
          "개별로는 맞지만 합쳐지며 아키텍처가 훼손돼서",
          "작성자가 개발자가 아니어서"
        ],
        "answer": 2,
        "explain": "개별 PR의 타당성과 전체 구조의 응집은 다른 문제다. 가속된 구현은 방향이 틀렸을 때도 빨리 쌓인다."
      },
      {
        "type": "link",
        "href": "https://news.hada.io/topic?id=33245",
        "label": "GeekNews",
        "title": "DHH가 바라본 프로그래밍의 미래 (Lex Fridman 팟캐스트 요약)",
        "detail": "시리즈 전체의 원문이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "최근에 끝낸 기능 하나의 소요 시간을 두 구간으로 나눠 본다 — 실제 구현에 쓴 시간과 리뷰·승인·대기에 걸린 시간. 병목이 어느 쪽인지 기록하고, 대기가 길었다면 승인 단계가 몇 개였는지 세어 본다."
      }
    ],
    "series": "에이전트 시대의 개발자"
  },

  {
    "no": 33,
    "date": "2026.09.07",
    "weekday": "월",
    "title": "바이브 코딩은 프로그래밍이 아니다",
    "dek": "구현을 읽지 않는 코딩과 구현을 검토하는 프로그래밍은 다른 활동이다. 에이전트 시대에 남는 실력은 취향이다.",
    "minutes": 9,
    "tags": ["AI", "프로그래밍", "코드 품질"],
    "takeaway": "에이전트가 구현을 대신하면 남는 실력은 무엇을 만들지 정하고 무엇이 과한지 가려내는 취향이다.",
    "next": "구현은 10배 빨라졌는데 조직은 그대로다",
    "blocks": [
      {
        "type": "p",
        "text": "DHH는 프로그래밍을 루프, 조건문, 변수 같은 언어의 기본 요소를 이해하고 다루는 행위로 정의한다. CEO가 개발자를 고용해 소프트웨어를 만든다고 프로그래머라고 부르지 않듯, 에이전트에게 지시만 하는 사람은 프로그래머와 구분해야 한다는 것이다. 구현을 읽지 않는 바이브 코딩, 구현을 검토하는 프로그래밍, 에이전트로 가속하는 개발 — 셋은 서로 다른 방식이다."
      },
      {
        "type": "p",
        "text": "역설적인 관찰이 하나 있다. 프로그래머가 에이전트를 비프로그래머보다 못 쓸 수도 있다는 것. 초기에는 언어 지식이 구현 경로를 구체적으로 지시하는 데 유용했지만, 에이전트가 결과와 문제만 받고 더 나은 경로를 스스로 찾기 시작하면 익숙한 지식이 오히려 제약이 된다. 대신 필요해지는 것은 제품이 무엇을 해야 하는지, 누구를 위한 것인지, 첫 버전에 무엇을 넣고 뺄지 정하는 감각이다. 영상 편집 도구의 불편을 잘 아는 편집자가 구현 능력 없이도 자기 도구를 만들 수 있다는 게 그의 주장이다. 실제로 그는 C++ 코드를 읽지 않는 실험으로 자신이 쓸 글쓰기 앱을 만들었고, 필요했던 기능은 원래 쓰던 도구 기능의 5% 정도였다고 말한다."
      },
      {
        "type": "p",
        "text": "지시는 자세할수록 나은 게 아니다. 대화에는 Claude Code의 시스템 프롬프트가 이전보다 80% 줄었다는 이야기가 나온다. 지나치게 규정적인 지시는 성능을 해친다. 애자일이 요구사항을 전부 사전에 명세하는 일을 거부했듯, 느슨한 요구로 먼저 만들고 직접 써 보며 중요한 것과 불필요한 것을 가리는 반복이 맞는 방식이다. '로봇처럼 말하지 말고 시를 쓰듯 말하라'는 조언도 같은 맥락이다 — 전략적인 모호함이 단어에 적히지 않은 맥락까지 해석하게 만든다."
      },
      {
        "type": "p",
        "text": "검토에서 남는 판단은 단순함이다. 한 에이전트가 만들고 다른 에이전트가 승인한 구현이라도 사람이 '너무 복잡하다'고 짚으면 절반으로 줄어들 수 있다. 오류는 자동 테스트가 잡으니 사람이 할 일은 실수를 잡는 것이 아니라 더 단순하게 만들라고 말하는 것이다. 화가가 제자의 세부 작업을 다듬고 편집자가 원고의 논지를 다듬는 일에 비유한다."
      },
      {
        "type": "p",
        "text": "코드 아름다움의 경제학도 바뀐다. 아름다운 코드의 가치는 소수의 인간 팀이 적은 비용으로 버그를 줄이고 빠르게 변경한다는 전제에서 나왔다. 지금의 제약은 토큰과 시간이라, 전체 맥락을 다시 학습하지 않고도 변경할 수 있는 구조가 여전히 돈이 된다. 다만 평범한 첫 버전 위에 수정을 계속 쌓으면 에이전트가 쓴 코드도 진흙 공이 된다는 경고는 그대로 유효하다."
      },
      {
        "type": "table",
        "caption": "세 가지 개발 방식",
        "head": ["", "바이브 코딩", "에이전트 가속", "직접 프로그래밍"],
        "rows": [
          ["구현을 읽는가", "읽지 않는다", "핵심 구조만", "전부"],
          ["사람이 정하는 것", "원하는 결과", "방향과 병합", "설계와 문법"],
          ["잘 맞는 일", "개인 도구, 시험", "신규 프로젝트", "안전이 중요한 시스템"]
        ]
      },
      {
        "type": "quiz",
        "question": "DHH가 에이전트 지시에서 오히려 경고하는 것은?",
        "options": [
          "목적을 한 문장으로 쓰는 것",
          "검증 방법을 함께 알려 주는 것",
          "구현 경로까지 자세히 규정하는 것",
          "여러 후보안을 비교해 고르는 것"
        ],
        "answer": 2,
        "explain": "지나치게 규정적인 지시는 모델의 판단을 해친다. 코딩 에이전트의 시스템 프롬프트가 80% 줄었다는 사례가 근거다."
      },
      {
        "type": "link",
        "href": "https://news.hada.io/topic?id=33245",
        "label": "GeekNews",
        "title": "DHH가 바라본 프로그래밍의 미래 (Lex Fridman 팟캐스트 요약)",
        "detail": "시리즈 전체의 원문이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "다음 구현 요청 하나를 스펙 목록 대신 두 줄로 압축해 본다 — 무엇을 위해 존재하는지 한 문장, 성공을 어떻게 확인할지 한 줄. 그리고 에이전트가 고른 경로를 자세한 스펙으로 얻었을 결과와 비교해 본다."
      }
    ],
    "series": "에이전트 시대의 개발자"
  },

  {
    "no": 32,
    "date": "2026.09.06",
    "weekday": "일",
    "title": "코드의 100%를 에이전트가 썼다",
    "dek": "Ruby on Rails의 창시자 DHH가 최근 3개월간 만든 코드는 스스로 0줄이다. 에이전트 팀을 운영한 경험에서 원칙을 정리한다.",
    "minutes": 9,
    "tags": ["AI", "에이전트", "개발 문화"],
    "takeaway": "코딩의 단위가 코드 한 줄에서 에이전트 팀 한 대로 바뀌었다. 사람이 남는 일은 목적지와 구조, 병합 여부를 정하는 일이다.",
    "next": "바이브 코딩은 프로그래밍이 아니다",
    "blocks": [
      {
        "type": "p",
        "text": "Ruby on Rails의 창시자이자 Basecamp를 운영하는 37signals의 공동창업자인 DHH가 Lex Fridman 팟캐스트에 나와 최근 3개월의 작업 방식을 공개했다. Linux 개발자 워크스테이션 프로젝트 Omarchy의 새 버전 Quattro를 만들면서 출시 코드 중 자신이 직접 쓴 줄은 없다. 코드의 거의 100%가 AI 에이전트가 작성했고, 3개월 동안 1,000개가 넘는 PR을 병합했다. 인터뷰 분량이 길어 네 편의 시리즈로 나눠 읽는다."
      },
      {
        "type": "p",
        "text": "13개월 전만 해도 그는 AI 자동완성에 회의적이었다. 자동완성과 챗봇은 작업을 빠르게 했지만 코드를 쓰는 방식 자체를 바꾸지는 못했다는 것이다. 전환점은 2025년 11월 공개된 Opus 4.5다. 모델이 똑똑해진 것 자체보다, 컴퓨터를 조작하고 도구를 쓰고 결과를 확인하고 오류를 고치는 실행 껍데기 — 에이전트 하네스 — 의 사용성이 좋아진 것이 크다고 평가한다. 초기 에이전트는 작업을 잘게 나눠 하위 에이전트 여덟 개를 동원하는 방식으로 일부 작업을 5분의 1에서 10분의 1 시간으로 줄였고, 사람은 목적지를 정하고 벗어남을 교정하며 결과를 검토했다."
      },
      {
        "type": "p",
        "text": "운영 방식도 달라진다. 에이전트 하나가 끝나기를 기다리면 대기 시간에 몰입이 깨지고 사람이 할 일이 없어진다. 그래서 여러 에이전트를 동시에 돌리고, 사람은 질문에 답하고 결정을 내리고 다음 작업을 배분하는 일을 계속한다. 그가 관리할 수 있는 한계는 머신 4~5대에서 총 16개의 작업 스레드다. 에이전트가 빨라질수록 동시에 관리할 수 있는 스레드는 오히려 줄어든다 — 병목은 손이 아니라 판단이기 때문이다."
      },
      {
        "type": "flow",
        "caption": "에이전트 팀 운영의 한 사이클",
        "steps": [
          { "label": "목적지", "detail": "무엇을 만들지 한 문장으로" },
          { "label": "분배", "detail": "여러 에이전트에 병렬로 투입" },
          { "label": "순회", "detail": "기다리는 대신 다른 스레드를 검토" },
          { "label": "검토", "detail": "구조와 경계 위주로 읽는다" },
          { "label": "병합", "detail": "최종 결정은 사람이" }
        ]
      },
      {
        "type": "table",
        "caption": "혼자 코딩하던 시절과 무엇이 다른가",
        "head": ["항목", "직접 코딩", "에이전트 팀 운영"],
        "rows": [
          ["산출의 단위", "작성한 코드 줄", "검토해 병합한 PR"],
          ["오류 대응", "직접 고친다", "에이전트가 스스로 복구하게 둔다"],
          ["실력의 초점", "문법과 구현 속도", "목적 설정, 구조 판단, 병합 기준"],
          ["피로의 종류", "손목과 집중", "끊기지 않는 판단"]
        ]
      },
      {
        "type": "quiz",
        "question": "에이전트가 빨라질수록 동시에 관리할 수 있는 작업 스레드가 줄어드는 이유는?",
        "options": [
          "토큰 비용이 커져서",
          "사람의 검토와 결정이 병목이라서",
          "머신 성능의 한계 때문에",
          "모델이 긴 작업을 거부해서"
        ],
        "answer": 1,
        "explain": "빨라진 에이전트는 곧 결과를 내고, 사람이 내야 할 결정이 그만큼 자주 쌓인다. 한계는 머신이 아니라 판단 대역폭이다."
      },
      {
        "type": "link",
        "href": "https://omarchy.org",
        "label": "Omarchy",
        "title": "DHH가 에이전트로 만든 Linux 개발자 워크스테이션",
        "detail": "본문의 Quattro 프로젝트 페이지다."
      },
      {
        "type": "link",
        "href": "https://news.hada.io/topic?id=33245",
        "label": "GeekNews",
        "title": "DHH가 바라본 프로그래밍의 미래 (Lex Fridman 팟캐스트 요약)",
        "detail": "시리즈 전체의 원문이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "오늘 할 구현 작업 하나를 '목적지 한 문장'으로 압축해 에이전트에 통째로 맡겨 본다. 결과 코드를 전부 읽는 대신 구조와 경계만 검토하고, 고칠 점은 직접 수정하지 말고 지시로 돌린다."
      }
    ],
    "series": "에이전트 시대의 개발자"
  },

  {
    "no": 31,
    "date": "2026.09.05",
    "weekday": "토",
    "title": "지도를 클릭하면 무슨 일이 벌어지나",
    "dek": "WMS는 그려진 이미지, WFS는 도형 데이터. 지도 시스템의 첫 경계는 이 둘을 가르는 것이다.",
    "minutes": 9,
    "tags": [
      "GIS",
      "PostGIS",
      "좌표계"
    ],
    "takeaway": "지도 화면은 두 언어를 나눠 쓴다 — 보여 주는 WMS, 꺼내 쓰는 WFS. 좌표계가 다르면 세상이 어긋난다.",
    "blocks": [
      {
        "type": "p",
        "text": "지도는 일반 데이터와 다르게 '이미지 한 장'이 아니다. 같은 좌표 위에 얹힌 도형 데이터의 모임이고, 화면에 그릴 때도 좌표를 따라 픽셀로 환산해서 보여 준다. 그래서 지도 시스템은 두 가지 언어를 나눠 쓴다 — 시각용으로 이미지를 돌려주는 통로와, 좌표가 붙은 데이터를 그대로 꺼내 주는 통로. 이 둘을 가르는 것이 GIS를 읽는 첫 경계다."
      },
      {
        "type": "p",
        "text": "지도 화면은 보통 겹겹이다. 밑에는 미리 잘라 둔 배경지도 타일이 깔리고, 그 위에 현업 데이터의 업무 레이어가 얹힌다. 배경과 업무가 서버에 요청하는 방식이 다르고, 이 구분이 GIS를 읽는 첫 단계다."
      },
      {
        "type": "table",
        "caption": "지도가 서버에 부탁하는 세 가지 방식",
        "head": [
          "방식",
          "돌려받는 것",
          "언제 쓰나"
        ],
        "rows": [
          [
            "WMS",
            "그려 놓은 이미지(PNG)",
            "보여 주기만 하면 될 때"
          ],
          [
            "WFS",
            "도형+속성(GML·GeoJSON)",
            "화면에서 편집·분석할 때"
          ],
          [
            "타일(WMTS)",
            "정해진 칸으로 미리 잘라 둔 이미지",
            "배경지도처럼 조회가 몰릴 때"
          ]
        ]
      },
      {
        "type": "p",
        "text": "이 표준들을 내어 주는 서버가 GeoServer다. PostGIS의 테이블을 스토어로 연결하고, 레이어로 발행하고, 스타일(SLD)로 색을 입혀 WMS·WFS로 서빙한다. 워크스페이스-스토어-레이어-스타일의 네 층 구조를 기억하면 설정 화면이 읽힌다."
      },
      {
        "type": "flow",
        "caption": "지도 클릭 한 번의 여정",
        "steps": [
          {
            "label": "화면 좌표",
            "detail": "픽셀 위치를 지리 좌표로"
          },
          {
            "label": "요청",
            "detail": "WMS·WFS로 범위를 지정"
          },
          {
            "label": "GeoServer",
            "detail": "요청을 SQL로 바꿔 PostGIS에"
          },
          {
            "label": "PostGIS",
            "detail": "공간 조건으로 행을 고른다"
          },
          {
            "label": "응답",
            "detail": "이미지 또는 GeoJSON"
          },
          {
            "label": "렌더링",
            "detail": "배경 위에 겹쳐 그린다"
          }
        ]
      },
      {
        "type": "code",
        "language": "sql",
        "caption": "PostGIS의 공간 조건 — 도로와 행정구역의 겹침",
        "content": "SELECT r.*\nFROM tb_road r\nJOIN tb_district d\n  ON ST_Intersects(r.geom, d.geom)\nWHERE d.district_nm = '서울특별시';"
      },
      {
        "type": "p",
        "text": "이런 공간 조건은 일반 인덱스로 못 한다. 도형의 경계 상자를 나무로 묶은 GiST 인덱스가 공간 조회의 표준이고, 이것이 없으면 지도 조회는 전부 표 전체 읽기가 된다. 그리고 도형 컬럼은 두 종류다 — 평면 계산이 빠른 geometry와, 경위도를 구면으로 계산해 미터를 정확히 내는 geography. 화면 쪽은 OpenLayers가 국내 지도 시스템의 사실상 표준이다. WMS·WFS·타일을 모두 소비하고 한국 좌표계 같은 비표준 투영도 다룬다. 가벼운 Leaflet이 대안이지만 좌표계 지원이 좁다. 데이터 교환은 요즘 GeoPackage(SQLite 한 파일)로 모으는 흐름이고, Shapefile은 컬럼명 10자 제한 같은 낡은 규약이 남아 레거시 호환용으로 남는다."
      },
      {
        "type": "callout",
        "title": "좌표계 지옥 — \"지도가 조금 밀려요\"",
        "tone": "warn",
        "text": "GPS는 4326(경위도, 단위가 '도'), 국토 도면은 5186(미터)을 쓴다. 변환(ST_Transform) 없이 섞으면 수십~수백 미터 어긋난다. 지도 장애 보고의 상당수가 기능 버그가 아니라 좌표계 혼용이다. 좌표가 이상하면 SRID부터 확인한다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "지도 기능이 있는 시스템이라면 개발자 도구의 네트워크 탭에서 WMS나 WFS 요청 하나를 찾는다. URL의 BBOX·SRS·LAYERS 파라미터를 읽어 보면 그 화면이 어떤 범위의 무슨 레이어를 그리는지 그대로 보인다."
      }
    ]
  },
  {
    "no": 30,
    "date": "2026.09.04",
    "weekday": "금",
    "title": "지식은 짧은 대화에서 먼저 자란다",
    "dek": "정식 문서가 만들어지기 전, 짧은 대화에서 지식이 먼저 자란다 — 그 다음이 기록이다.",
    "minutes": 7,
    "tags": [
      "개발 문화",
      "지식 공유",
      "커뮤니티"
    ],
    "takeaway": "설명할 준비만 해도 배움이 깊어진다 — 공유는 학습법이다.",
    "blocks": [
      {
        "type": "p",
        "text": "지식은 보통 문서보다 짧은 대화에서 먼저 움직인다. 정식 회의보다 캐주얼한 자리에서, 발표보다 질문이 오가는 자리에서, 아직 이름이 붙지 않은 아이디어가 처음으로 입 밖으로 나온다. 학습 조직은 발표 자료보다 그 앞 단계의 대화를 키우는 쪽이 효과적이다."
      },
      {
        "type": "list",
        "items": [
          "짧은 대화 (5~30분) — 정해진 안건이 없어 오히려 막힌 지점이 드러난다.",
          "점심 시간 공유 (15~45분) — 누군가 한 주 동안 배운 것을 짧게 발표하는 자리.",
          "회고·장애 리뷰 — 실패 사례가 가장 오래 남는 지식이다."
        ]
      },
      {
        "type": "p",
        "text": "이런 관행에 대한 업계의 통념은 단순하다. 형식보다 일관성이 중요하고, 팀 사이의 벽을 깨는 효과가 있으며, 소비한 시간은 교육과 버그 감소로 돌아온다. 다만 정량 학술 증거는 아직 제한적이라는 점은 솔직하게 남겨 둔다 — 참석률과 만족도 조사 위주로 평가되어 왔다."
      },
      {
        "type": "callout",
        "title": "설명하면서 배운다",
        "tone": "good",
        "text": "가르칠 준비만 해도 자기 학습이 깊어진다는 프로테제 효과(protégé effect)는 학술 연구로 반복 확인된 현상이다. Feynman 기법은 이것의 대중판이다. 오늘 배운 것을 다음 날 아침 남에게 설명 가능한 분량으로 정리하는 일 자체가 학습법이다."
      },
      {
        "type": "p",
        "text": "바깥에도 같은 문화가 있다. Hacker News는 2007년 Paul Graham이 YC 내부용 \"Startup News\"로 시작해 같은 해 지금의 이름이 되었고, 링크 공유와 투표, 그리고 자기 작품을 직접 내놓는 Show HN 관행이 개발자의 독서와 토론 습관을 형성했다. 오픈소스도 지식 전파의 통로다 — 설계 결정과 우회로가 PR과 이슈 토론에 남아 20년 뒤에도 검색된다."
      },
      {
        "type": "callout",
        "title": "부족 지식의 절벽",
        "tone": "warn",
        "text": "레거시 시스템의 핵심 운영 지식이 특정 사람의 머리에만 있으면, 그 사람이 떠나는 순간 배치 순서·우회로·\"원래 그렇게 쓰는 것\"이 한꺼번에 사라진다. 대화로 시작해 기록으로 굳은 지식만이 이 절벽을 넘는다. 짧은 대화가 쓸모 있는 이유는 좋은 말이어서가 아니라, 아직 문서가 안 된 것들이 거기서 처음 말로 나오기 때문이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "이번 주 배운 것 하나를 골라 동료에게 3분 설명해 본다. 설명하다 말이 막히는 지점이 이번 주의 진짜 학습 목표다. 동료가 없다면 설명하는 메모를 쓴다 — 막히는 지점은 그대로 남는다."
      }
    ],
    "next": "지도를 클릭하면 무슨 일이 벌어지나"
  },
  {
    "no": 29,
    "date": "2026.09.03",
    "weekday": "목",
    "title": "리뷰받고 버그를 남기는 법",
    "dek": "구현이 끝난 뒤에도 품질은 저절로 지켜지지 않는다. 테스트·리뷰·버그 기록에는 각자 정해진 모양이 있다.",
    "minutes": 8,
    "tags": [
      "단위 테스트",
      "코드 리뷰",
      "버그 트래킹"
    ],
    "takeaway": "좋은 버그 리포트는 재현 절차·기대 결과·실제 결과·우선순위 네 가지를 갖춘다.",
    "blocks": [
      {
        "type": "p",
        "text": "구현 단계에서는 테스트와 리뷰로, 통합 단계에서는 버그 기록과 Gap 분석으로 품질을 지킨다. 넷 다 형식이 있는데, 형식을 따르는 이유는 나중에 같은 문제를 두 번 겪지 않기 위해서다."
      },
      {
        "type": "list",
        "items": [
          "Given — 테스트를 위한 조건·입력값을 준비한다.",
          "When — 테스트 대상 기능을 실행한다.",
          "Then — 실행 결과가 기대값과 같은지 확인(assert)한다."
        ]
      },
      {
        "type": "p",
        "text": "단위 테스트를 미리 짜두면, 뒤에서 코드를 수정했을 때 기존 기능이 깨졌는지 바로 확인할 수 있어 이후 통합 테스트의 부담이 줄어든다."
      },
      {
        "type": "callout",
        "title": "코드 리뷰를 받을 때",
        "text": "코드만 보내지 말고 무엇을·왜 바꿨는지 짧게 덧붙인다. 지적은 코드에 대한 것이지 사람에 대한 것이 아니라고 받아들인다. 이해가 안 되는 지적은 그 자리에서 질문한다 — 넘겨짚고 고치지 않는다. 같은 지적을 두 번 받지 않도록 메모해 둔다."
      },
      {
        "type": "list",
        "items": [
          "재현 절차 — 어떤 순서로 조작하면 문제가 발생하는지",
          "기대 결과 — 원래 어떻게 동작해야 하는지",
          "실제 결과 — 실제로 어떻게 동작했는지 (스크린샷·로그 첨부)",
          "우선순위 — 서비스에 미치는 영향 정도"
        ]
      },
      {
        "type": "p",
        "text": "네 가지 중 하나라도 빠지면 리포트를 받은 사람이 다시 물어야 한다. 재현 절차 없이 \"안 됩니다\"라고만 남기면, 담당자가 처음부터 원인을 추적해야 한다."
      },
      {
        "type": "quiz",
        "question": "요구사항정의서와 실제 완성된 결과물을 나란히 놓고 빠지거나 다르게 구현된 부분을 찾는 작업을 무엇이라 하는가?",
        "options": [
          "단위 테스트",
          "코드 리뷰",
          "Gap 분석",
          "버그 트래킹"
        ],
        "answer": 2,
        "explain": "Gap 분석은 기준선(요구사항정의서)과 결과물 사이의 차이를 찾는 작업이다. 찾아낸 차이는 재구현하거나, 요구사항 협의로 범위를 조정하는 방식으로 보완한다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "리뷰 코멘트를 하나 받으면 \"무엇을, 왜 바꿨는지\" 한 줄을 남겨 본다. 또는 눈에 띈 버그 하나를 재현 절차·기대 결과·실제 결과·우선순위 네 줄로 적어 본다."
      }
    ],
    "next": "지식은 짧은 대화에서 먼저 자란다"
  },
  {
    "no": 28,
    "date": "2026.09.02",
    "weekday": "수",
    "title": "AI 비용은 모델 라우팅으로 나눈다",
    "dek": "에이전트 요청을 사고가 필요한 일과 반복적인 I/O로 나누면 모델 크기와 비용을 함께 조절할 수 있다.",
    "minutes": 8,
    "tags": [
      "AI",
      "개발 도구",
      "비용"
    ],
    "takeaway": "모델 라우팅은 요청의 난도와 반복성을 보고 큰 모델과 경량 모델에 작업을 나누는 설계다.",
    "blocks": [
      {
        "type": "p",
        "text": "토큰을 한 개씩 생성하는 모델은 읽고 쓰는 과정에도 토큰을 소비한다. 에이전트가 여러 파일을 읽고 비슷한 테스트를 만드는 일은 추론보다 I/O가 큰 경우가 많다. 이 작업까지 가장 큰 모델에 맡기면 비용과 컨텍스트 사용량이 함께 늘어난다."
      },
      {
        "type": "flow",
        "caption": "대량 읽기를 경량 모델로 보내는 흐름",
        "steps": [
          {
            "label": "요청 감지",
            "detail": "에이전트가 큰 파일이나 반복 작업을 요청한다"
          },
          {
            "label": "라우팅",
            "detail": "크기·난도·반복성을 기준으로 분기한다"
          },
          {
            "label": "경량 처리",
            "detail": "파일 요약이나 패턴 생성을 맡긴다"
          },
          {
            "label": "결과 반환",
            "detail": "큰 모델에는 필요한 결과만 전달한다"
          }
        ]
      },
      {
        "type": "table",
        "caption": "라우팅이 맞는 작업",
        "head": [
          "작업",
          "권장 모델",
          "이유"
        ],
        "rows": [
          [
            "여러 파일 요약",
            "경량 모델",
            "전문보다 요약이 필요하다"
          ],
          [
            "기존 패턴을 따르는 코드 생성",
            "경량 모델",
            "참조와 규칙이 분명하다"
          ],
          [
            "디버깅·설계·안전 판단",
            "큰 모델",
            "맥락과 판단이 필요하다"
          ],
          [
            "짧은 파일 읽기",
            "직접 처리",
            "호출 지연이 절감보다 클 수 있다"
          ]
        ]
      },
      {
        "type": "code",
        "language": "text",
        "caption": "라우팅 의사결정의 구조",
        "content": "if task.is_repetitive and task.io_heavy:\n    worker = small_model\nelse:\n    worker = large_model\nresult = worker.run(task)"
      },
      {
        "type": "p",
        "text": "핵심은 결정과 실행을 분리하는 것이다. 언제 위임할지는 라우터가 정하고, 실제 답변 방식은 워커 모델이 정한다. 워커를 교체해도 분기 기준은 유지된다. 다만 네트워크 왕복이 큰 작업에는 오히려 직접 처리하는 편이 낫다."
      },
      {
        "type": "quiz",
        "question": "짧은 파일을 경량 모델에 보내지 않고 직접 읽는 이유는?",
        "options": [
          "경량 모델은 파일을 읽을 수 없다",
          "왕복 지연이 절감할 토큰보다 클 수 있다",
          "훅은 큰 파일만 허용한다",
          "작은 파일은 검색할 수 없다"
        ],
        "answer": 1,
        "explain": "위임에는 호출과 결과 전달의 지연이 따른다. 절감되는 토큰보다 왕복 비용이 크면 라우팅 이득이 없다."
      },
      {
        "type": "link",
        "href": "https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90",
        "label": "Spotify Engineering",
        "title": "Portal by Spotify cut my Claude Code token usage by 90%",
        "detail": "훅·스크립트·스킬 계층으로 반복 작업을 위임하는 구조를 소개한다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "사용 중인 AI 기능의 요청 다섯 개를 골라 사고·패턴 처리·대량 읽기 중 하나로 분류하고, 경량 모델로 보낼 후보 한 개를 정한다."
      }
    ],
    "next": "리뷰받고 버그를 남기는 법",
    "series": "AI 활용"
  },
  {
    "no": 27,
    "date": "2026.09.01",
    "weekday": "화",
    "title": "LLM을 다음 토큰 예측만으로 설명할 수 없는 이유",
    "dek": "다음 토큰 예측은 출력 방식이고, 사전학습과 후학습은 모델이 무엇을 배우는지 결정한다.",
    "minutes": 8,
    "tags": [
      "AI",
      "LLM",
      "학습"
    ],
    "takeaway": "다음 토큰 예측은 발화의 단위일 뿐이며, 학습 목표와 보상 설계가 모델의 행동을 바꾼다.",
    "blocks": [
      {
        "type": "p",
        "text": "에이전트가 도구를 호출하는 바탕에는 LLM이 있다. LLM을 두고 다음 토큰을 예측할 뿐이라고 말하면 기계가 출력을 만드는 한 방식은 설명할 수 있지만, 학습 과정 전체를 설명하지는 못한다."
      },
      {
        "type": "p",
        "text": "사전학습에서는 텍스트에서 실제로 이어진 토큰을 맞히도록 반복한다. 이 단계의 정답은 이미 데이터에 존재한다. 토큰 단위 출력이라는 형식과, 어떤 데이터와 목표로 학습했는지는 구분해서 봐야 한다."
      },
      {
        "type": "code",
        "language": "python",
        "caption": "사전학습 루프의 의사코드",
        "content": "for tokens in training_data:\n    for position in range(1, len(tokens)):\n        prior = tokens[:position]\n        actual = tokens[position]\n        model.make_more_likely(actual, after=prior)"
      },
      {
        "type": "p",
        "text": "후학습에서는 모델이 과제를 풀어 만든 결과를 평가하고, 점수가 높은 경로를 더 자주 선택하도록 조정할 수 있다. 검증 가능한 보상을 쓰는 RLVR은 데이터에 있던 문장을 그대로 맞히는 것과 다른 학습 신호를 제공한다."
      },
      {
        "type": "table",
        "caption": "사전학습과 RLVR",
        "head": [
          "항목",
          "사전학습",
          "RLVR"
        ],
        "rows": [
          [
            "학습 재료",
            "데이터에 있던 텍스트",
            "모델이 과제에서 만든 시퀀스"
          ],
          [
            "평가 기준",
            "실제 다음 토큰과의 일치",
            "과제 결과의 검증 가능한 점수"
          ],
          [
            "비유",
            "기보에서 다음 수를 맞히기",
            "수를 탐색해 승률 높은 수를 고르기"
          ]
        ]
      },
      {
        "type": "p",
        "text": "체스 기보의 다음 수를 맞히는 모델과 여러 수를 탐색해 승률을 높이는 엔진은 행동이 다르다. 둘 다 토큰을 한 개씩 출력할 수 있지만, 내부에 학습된 목표와 절차가 같다고 볼 수 없다. 이 구분은 환각을 줄이는 대응을 설계할 때도 출발점이 된다."
      },
      {
        "type": "quiz",
        "question": "RLVR이 사전학습과 다른 핵심은 무엇인가?",
        "options": [
          "토큰 대신 문장을 사용한다",
          "모델이 만든 결과를 검증 가능한 보상으로 평가한다",
          "항상 사람이 정답을 직접 입력한다",
          "모델 크기를 줄이는 단계다"
        ],
        "answer": 1,
        "explain": "RLVR은 과제 결과를 채점하는 검증기를 학습 신호로 삼는다. 사전학습처럼 이미 있는 다음 토큰만 정답으로 쓰지 않는다."
      },
      {
        "type": "link",
        "href": "https://gmcgoldr.github.io/2026/09/04/llm-next-token-predictors.html",
        "label": "gmcgoldr's blog",
        "title": "Stop Thinking of LLMs as Next-Token Predictors",
        "detail": "사전학습 루프와 RLVR 루프를 비교하는 글이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "AI 기능의 실패 사례 하나를 골라 출력 형식·근거·정답 여부 중 검증 가능한 기준을 한 가지 정하고, 그 기준을 자동 평가할 방법을 적는다."
      }
    ],
    "next": "AI 비용은 모델 라우팅으로 나눈다",
    "series": "AI 활용"
  },
  {
    "no": 26,
    "date": "2026.08.31",
    "weekday": "월",
    "title": "에이전트 확장은 익숙한 구조로 읽는다",
    "dek": "플러그인·스킬·훅·MCP를 모듈, 필터, 표준 인터페이스라는 익숙한 설계 언어로 해석한다.",
    "minutes": 8,
    "tags": [
      "AI",
      "개발 도구",
      "아키텍처"
    ],
    "takeaway": "에이전트 확장은 모듈 경계와 실행 전후의 계약을 조합해 도구 호출을 통제하는 구조다.",
    "blocks": [
      {
        "type": "p",
        "text": "BM25가 검색 결과를 고르는 기준선이라면, 에이전트는 고른 근거를 바탕으로 도구를 호출하고 다음 작업을 정하는 실행 구조다. 이름은 새롭지만 확장 지점을 나누는 방식은 모듈과 필터를 설계하던 방식과 닮았다."
      },
      {
        "type": "tree",
        "caption": "에이전트 확장의 구성 예시",
        "rows": [
          {
            "path": "plugin/",
            "note": "확장 단위",
            "depth": 0
          },
          {
            "path": ".plugin/manifest.json",
            "note": "이름·버전·설명 계약",
            "depth": 1
          },
          {
            "path": "skills/review/SKILL.md",
            "note": "재사용 절차",
            "depth": 1
          },
          {
            "path": "hooks/hooks.json",
            "note": "이벤트 개입 규칙",
            "depth": 1
          },
          {
            "path": ".mcp.json",
            "note": "외부 도구 연결",
            "depth": 1
          }
        ]
      },
      {
        "type": "p",
        "text": "스킬은 절차 지식을 필요할 때 읽는 모듈이다. 훅은 도구 실행 전후나 프롬프트 제출 같은 이벤트에 끼어드는 필터다. MCP는 외부 도구와 데이터의 호출 형식을 표준화하는 인터페이스다. 각 요소의 책임을 분리하면 확장 추가가 기존 실행 흐름을 덜 흔든다."
      },
      {
        "type": "code",
        "language": "json",
        "caption": "실행 전 도구 검사 형태",
        "content": "{\n  \"PreToolUse\": [{\n    \"matcher\": \"Shell\",\n    \"hooks\": [{\n      \"type\": \"command\",\n      \"command\": \"./scripts/check-command.sh\"\n    }]\n  }]\n}"
      },
      {
        "type": "flow",
        "caption": "도구 호출의 경계",
        "steps": [
          {
            "label": "요청",
            "detail": "에이전트가 도구 호출을 제안한다"
          },
          {
            "label": "훅 검사",
            "detail": "매처가 대상을 좁히고 규칙을 적용한다"
          },
          {
            "label": "허용 또는 차단",
            "detail": "실행 전 결정이 반환된다"
          },
          {
            "label": "MCP 호출",
            "detail": "허용된 외부 도구가 실행된다"
          }
        ]
      },
      {
        "type": "quiz",
        "question": "위험한 도구 호출을 실행 전에 막으려면 무엇을 쓰는가?",
        "options": [
          "스킬의 설명문",
          "PreToolUse 훅",
          "모델의 말투 설정",
          "검색 인덱스"
        ],
        "answer": 1,
        "explain": "권고문은 무시될 수 있지만, 실행 전 훅은 검사 결과로 호출을 차단할 수 있다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "사용 중인 에이전트 설정에서 반복되는 절차 하나를 골라 모듈로 분리하고, 실행 전에 검사해야 할 조건 한 가지를 훅 규칙으로 적는다."
      }
    ],
    "next": "LLM을 다음 토큰 예측만으로 설명할 수 없는 이유",
    "series": "AI 활용"
  },
  {
    "no": 25,
    "date": "2026.08.30",
    "weekday": "일",
    "title": "BM25가 검색의 기준선으로 남은 이유",
    "dek": "벡터 검색이 널리 쓰여도 BM25는 정확한 단어와 문서 길이를 다루는 기준선으로 남는다.",
    "minutes": 8,
    "tags": [
      "검색",
      "AI",
      "RAG"
    ],
    "takeaway": "BM25는 단어 빈도의 포화와 문서 길이 정규화로 키워드 검색의 편향을 줄인다.",
    "blocks": [
      {
        "type": "p",
        "text": "RAG의 답변 품질은 무엇을 근거로 넣느냐에 크게 좌우된다. 검색하면 벡터 검색을 먼저 떠올리지만, 실무에서는 오래된 키워드 랭킹인 BM25를 기준선으로 함께 둔다. 정확히 일치해야 하는 문서번호와 고유 용어에는 키워드 검색이 여전히 잘 맞는다."
      },
      {
        "type": "list",
        "items": [
          "TF는 문서 안에서 단어가 얼마나 나오는지 센다.",
          "IDF는 전체 문서에서 드문 단어에 더 큰 값을 준다.",
          "BM25는 두 값에 단어 빈도 포화와 문서 길이 정규화를 더한다."
        ]
      },
      {
        "type": "code",
        "language": "text",
        "caption": "BM25 점수의 구조",
        "content": "score(D, Q) = Σ IDF(qi) · f(qi,D) · (k1 + 1)\n                       ───────────────────────────────\n                       f(qi,D) + k1 · (1 − b + b · |D| / avgdl)\n\nf(qi,D) = 문서 D 안 qi의 등장 횟수\n|D| = 문서 길이, avgdl = 전체 문서 평균 길이"
      },
      {
        "type": "table",
        "caption": "두 가지 보정",
        "head": [
          "보정",
          "역할",
          "조절값"
        ],
        "rows": [
          [
            "TF 포화",
            "같은 단어가 반복돼도 점수가 무한히 커지지 않게 한다",
            "k1"
          ],
          [
            "길이 정규화",
            "긴 문서가 단어 수만으로 유리해지지 않게 한다",
            "b"
          ],
          [
            "IDF",
            "흔한 단어보다 드문 단어를 중요한 단서로 본다",
            "문서 빈도"
          ]
        ]
      },
      {
        "type": "p",
        "text": "BM25는 벡터 검색의 반대편이 아니라 보완재다. 문서번호나 코드 같은 정확한 일치는 BM25가 잡고, 표현이 달라도 의미가 가까운 질의는 벡터 검색이 잡는다. 두 결과를 함께 돌려 순위를 합치는 하이브리드 검색은 RAG에서 자주 쓰이는 구성이다."
      },
      {
        "type": "quiz",
        "question": "단어가 문서에 반복돼도 점수가 무한히 커지지 않게 하는 요소는?",
        "options": [
          "IDF",
          "k1의 TF 포화",
          "b의 길이 정규화",
          "벡터 차원"
        ],
        "answer": 1,
        "explain": "k1이 단어 빈도의 증가를 일정 수준으로 수렴시킨다. b는 문서 길이를 보정하고, IDF는 단어의 희귀도를 반영한다."
      },
      {
        "type": "link",
        "href": "https://arxiv.org/abs/2407.03618",
        "label": "bm25s (2024)",
        "title": "BM25S: Orders of magnitude faster lexical search via eager sparse scoring",
        "detail": "희소 점수를 미리 계산하는 BM25 구현을 소개하는 논문 초록이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "검색 기능에서 정확히 일치해야 하는 문서번호·코드·고유 용어를 세 가지 적고, 각각 키워드 검색과 벡터 검색 중 어느 쪽이 먼저여야 하는지 표시한다."
      }
    ],
    "next": "에이전트 확장은 익숙한 구조로 읽는다",
    "series": "AI 활용"
  },
  {
    "no": 24,
    "date": "2026.08.29",
    "weekday": "토",
    "title": "DNS 조회는 누가 엿보는가",
    "dek": "Mullvad가 암호화 DNS를 접고 Quad9에 맡겼다 — 기본 DNS가 무엇을 새는지, 암호화 DNS가 무엇을 가리는지.",
    "minutes": 8,
    "tags": [
      "네트워크",
      "보안"
    ],
    "takeaway": "기본 DNS 조회는 평문이다 — 암호화 DNS는 쿼리를 HTTPS 안에 넣어 엿보는 자를 가린다.",
    "blocks": [
      {
        "type": "p",
        "text": "여기까지 본 취약점은 애플리케이션과 그 부품을 노렸다. 시리즈의 마지막 장은 그보다 아래, 접속 목록 자체를 노리는 자리를 읽는다. VPN 회사 Mullvad가 2022년부터 무료로 운영해 온 암호화 DNS(DoH) 서버를 2026년 11월 2일에 닫는다고 발표했다. 대신 같은 일을 하는 비영리 Quad9을 재정적으로 후원한다. 이유는 두 가지다 — VPN 사용자에게는 DoH가 이미 불필요하고(트래픽 전체가 이미 암호화되고 VPN 내부 DNS가 쿼리를 처리한다), 프라이버시 중심 공개 DNS는 전문화된 사업이라 중복 투자보다 전문가를 지원하는 게 낫다는 판단이다."
      },
      {
        "type": "p",
        "text": "이 뉴스를 읽으려면 기본 구조부터 알아야 한다. 도메인 이름을 IP로 바꾸는 DNS 조회는 기본적으로 평문이다. 같은 망에 누가 있든 — 회사 방화벽, 통신사, 공용 와이파이 — 어떤 사이트를 들렀는지 목록이 그대로 보인다. HTTPS가 접속 내용을 가려 줘도 '어디에 접속했는가'는 별도로 새어 나간다."
      },
      {
        "type": "flow",
        "caption": "같은 조회, 두 경로",
        "steps": [
          {
            "label": "앱",
            "detail": "도메인을 IP로 바꿔 달라 요청한다"
          },
          {
            "label": "평문 DNS",
            "detail": "쿼리가 망에 그대로 보인다 — 중간자가 도메인을 읽는다"
          },
          {
            "label": "DoH",
            "detail": "같은 쿼리가 HTTPS 안으로 — 중간자는 암호문만 본다"
          },
          {
            "label": "리졸버",
            "detail": "두 경로 모두 여기서는 도메인 목록이 그대로 보인다"
          }
        ]
      },
      {
        "type": "table",
        "caption": "가리는 범위로 비교",
        "head": [
          "방식",
          "무엇을 가리나",
          "그래도 보는 자"
        ],
        "rows": [
          [
            "평문 DNS",
            "아무것도",
            "망의 모든 중간자"
          ],
          [
            "DoH(HTTPS)",
            "망의 중간자로부터 조회 목록",
            "리졸버 운영자"
          ],
          [
            "DoT(TLS)",
            "같은 내용을 전용 포트로",
            "리졸버 운영자"
          ],
          [
            "VPN",
            "DNS를 포함한 전체 트래픽 경로",
            "VPN 운영자"
          ]
        ]
      },
      {
        "type": "p",
        "text": "표가 말해 주듯 암호화 DNS는 완전한 프라이버시가 아니다. 리졸버 운영자는 여전히 모든 조회를 보고, 기록하고, 팔 수도 있다. 그래서 문제는 '누구를 믿을 것인가'가 되고, Quad9처럼 비영리로 기록 보존 정책을 명시한 운영자가 자리를 잡는 이유도 여기 있다. Mullvad의 접기 결정도 같은 논리다 — 이미 잘하는 자를 복제하지 않는 것도 아키텍처 판단이다."
      },
      {
        "type": "quiz",
        "question": "DoH로 바꾼 뒤에도 여전히 조회 도메인 목록을 그대로 볼 수 있는 자는?",
        "options": [
          "아무도 없다 — 모든 조회가 암호화됐다",
          "내가 선택한 DoH 리졸버 운영자",
          "방문한 사이트들의 서버 관리자",
          "브라우저 제조사만"
        ],
        "answer": 1,
        "explain": "DoH는 망의 중간자로부터 조회를 가린다. 그러나 리졸버는 질문을 받아 답해야 하므로 도메인 목록은 운영자에게 그대로 보인다. 암호화 DNS는 '누가 보는가'를 줄이는 일이지, 보는 자가 없어지는 일이 아니다."
      },
      {
        "type": "link",
        "href": "https://mullvad.net/en/blog/shutting-down-our-public-encrypted-dns-servers-and-sponsoring-quad9-instead",
        "label": "Mullvad Blog",
        "title": "Shutting down our public encrypted DNS servers and sponsoring Quad9 instead",
        "detail": "11월 2일까지 설정을 바꿔야 하는 안내와, 운영을 Quad9에 넘긴 이유가 함께 있다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "개인 폰이나 집 공유기의 DNS 설정을 열어 지금 무엇을 쓰는지 확인한다. 기본값이라면 통신사 리졸버다. iOS·macOS는 '암호화된 DNS' 프로필, 안드로이드는 '사용자 중 DNS'에서 암호화 DNS를 지원한다 — 바꾸기 전에 위 표의 '그래도 보는 자'를 한 번 더 본다."
      }
    ],
    "next": "BM25가 검색의 기준선으로 남은 이유",
    "series": "보안 노트"
  },
  {
    "no": 23,
    "date": "2026.08.28",
    "weekday": "금",
    "title": "패치가 공개되면 공격이 시작된다",
    "dek": "Rails 취약점 하나의 시간표 — 패치 공개에서 첫 공격까지 8시간이었다.",
    "minutes": 9,
    "tags": [
      "보안",
      "의존성",
      "패치관리"
    ],
    "takeaway": "의존성 보안 릴리스는 점수가 붙기 전에도 긴급하다 — 패치가 공개되는 순간 공격자의 시계가 먼저 돌기 시작한다.",
    "blocks": [
      {
        "type": "p",
        "text": "앞 호는 브라우저 업데이트에서 끝났다. 서버 쪽에서는 같은 자리를 의존성 패치가 맡는다. 7월 29일, 루비 온 레일스의 파일 업로드 부품(ActiveStorage)에서 임의 파일 읽기와 원격 코드 실행으로 이어지는 취약점이 공개됐다(CVE-2026-66066). CVSS 9.5. 미국의 보안 회사 Rietta는 공공기관·의료 고객의 레일스 사이트들을 당일 밤 안에 전부 긴급 패치했다. 그리고 그 결정은 8시간 만에 정당해졌다."
      },
      {
        "type": "flow",
        "caption": "공개에서 공격까지의 시간표",
        "steps": [
          {
            "label": "7/21",
            "detail": "연구자들이 결함을 발견해 레일스 측에 비공개 보고"
          },
          {
            "label": "7/29",
            "detail": "패치와 취약점 번호 공개 — 공격 상세는 엠바고로 보류"
          },
          {
            "label": "7/29 밤",
            "detail": "공개 PoC가 깃허브에 올라온다 — Rietta의 패치 완료보다 5시간 빠르다"
          },
          {
            "label": "7/30 07:10",
            "detail": "패치 8시간 뒤, 고객 서버에 첫 공격 시도 — 변형된 BMP 파일"
          },
          {
            "label": "8/3 이후",
            "detail": "가짜 이미지·가짜 검색봇으로 매일 탐침, 8월 내내 지속"
          }
        ]
      },
      {
        "type": "p",
        "text": "상세 공격 경로는 8월 28일까지 공개하지 않겠다는 엠바고가 붙어 있었다. 그러나 그 약속은 첫날 밤에 사실상 끝났다. 패치 그 자체는 공개 코드 diff라 처음부터 모두에게 열려 있었고, 연구자들은 diff를 읽어 공격 경로를 재구성해 4주 일찍 발표했다. 엠바고는 방어자에게 시간을 사 주는 장치가 아니라 이미 무너진 약속이었다는 것이 이 사건의 실제 결론이다."
      },
      {
        "type": "p",
        "text": "공격 기술은 파일 업로드에서 시작된다. 변형된 이미지 파일(BMP)을 올리면 처리 과정에서 서버의 임의 파일을 읽고, 그 안의 비밀 설정값으로 실행 권한까지 가져간다. 사용자가 올린 파일을 다루는 코드 경로는 별도의 위협 모델로 취급해야 한다는 교훈이다. 확장자와 Content-Type은 클라이언트가 적어 보내는 문자열일 뿐이다."
      },
      {
        "type": "list",
        "items": [
          "의존성의 전용 보안 릴리스는 점수가 없어도 긴급으로 본다 — 점수 매기기는 늦게 온다",
          "밤마다 의존성 취약점 검사를 돌리고, 매일 결과를 분류한다",
          "긴급 패치를 승인받는 절차를 미리 합의해 둔다 — 아무도 밤에 깨지 않으려고",
          "업로드 파일은 시작 바이트(매직 바이트)로 검증하고, 이미지 처리 라이브러리는 안 쓰는 기능을 끈다",
          "실패한 요청도 예외 로그로 남기고 주기적으로 읽는다 — 존재하지 않는 경로에 몰리는 POST는 탐침이다"
        ]
      },
      {
        "type": "quiz",
        "question": "의존성에 보안 전용 업데이트가 나왔는데 CVSS 점수가 아직 없다. 적절한 대응은?",
        "options": [
          "점수가 나올 때까지 기다린다 — 점수가 심각도의 공식 기록이다",
          "다음 정기 배포에 자연스럽게 포함되도록 둔다",
          "전용 보안 릴리스 자체를 긴급 신호로 보고 패치를 준비한다",
          "취약점 상세가 공개될 때까지는 영향 범위를 알 수 없으니 대기한다"
        ],
        "answer": 2,
        "explain": "이 사건에서 첫 공격은 점수가 9.5로 확정되기도 전에 준비돼 있었다. 공격자는 공개 diff를 읽으니까 방어자도 패치를 기준으로 움직여야 한다 — 상세와 점수는 늦게 도착하는 보조 정보다."
      },
      {
        "type": "link",
        "href": "https://rietta.com/blog/ruby-on-rails-cve-exploited-hours-after-patch/",
        "label": "Rietta Inc.",
        "title": "Government Rails Site Hit Hours After CVE Patch",
        "detail": "패치 완료에서 첫 공격까지 8시간 1분. 타임라인과 실무 수칙이 이 글의 전부다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "진행 중인 프로젝트의 의존성 목록(pom.xml)을 열어 보안 업데이트를 마지막으로 받은 시점을 확인한다. 검사 자동화가 없다면 '밤마다 의존성 취약점을 검사하는 작업 하나'를 팀에 건의해 본다."
      }
    ],
    "next": "DNS 조회는 누가 엿보는가",
    "series": "보안 노트"
  },
  {
    "no": 22,
    "date": "2026.08.27",
    "weekday": "목",
    "title": "브라우저 취약점은 샌드박스 이야기다",
    "dek": "\"샌드박스 내부에서 코드가 실행됐다\"는 뉴스 문장을 읽는 방법 — 공격 경로와 마지막 방어선.",
    "minutes": 8,
    "tags": [
      "보안",
      "브라우저"
    ],
    "takeaway": "샌드박스는 침입을 막는 벽이 아니라 퍼지는 속도를 늦추는 설계다 — 그래서 브라우저 보안의 1순위는 언제나 업데이트다.",
    "blocks": [
      {
        "type": "p",
        "text": "앞 호에서 로그인 판정이 요청의 관문에서 일어나는 것을 봤다. 오늘은 그 관문보다 사용자 쪽 — 브라우저에서 시작되는 공격이다. 구글 크롬에서 새 취약점이 공개됐다(CVE-2026-85046). V8이라는 자바스크립트 엔진의 타입 컨퓨전 버그로, 악성 HTML 페이지에 접속하는 것만으로 코드가 실행될 수 있다. CVSS 8.8. 미국 CISA가 관리하는 '실제 악용이 확인된 취약점 목록(KEV)'에 올랐다 — 이론이 아니라 이미 공격에 쓰이고 있다는 뜻이다."
      },
      {
        "type": "p",
        "text": "뉴스 제목에서 눈여겨볼 문장이 있다. \"샌드박스 내부에서 임의 코드 실행\". 브라우저는 웹 페이지를 하나의 프로세스(렌더러)에서 그리고, 그 프로세스를 샌드박스로 감싼다. 페이지가 아무리 사악한 코드를 담고 있어도 샌드박스 안에서만 놀게 만드는 것이다. 그래서 공격자의 목표는 두 단계로 나뉜다 — 샌드박스 안에서 코드를 실행하는 것, 그리고 샌드박스 밖으로 나가는 것."
      },
      {
        "type": "table",
        "caption": "브라우저의 구역 나누기",
        "head": [
          "구역",
          "하는 일",
          "공격 노출"
        ],
        "rows": [
          [
            "렌더러 프로세스",
            "HTML·CSS·자바스크립트를 실행해 화면을 그린다",
            "웹 콘텐츠가 직접 닿는 자리 — 샌드박스 안"
          ],
          [
            "네트워크 프로세스",
            "렌더러 대신 요청을 보내고 응답을 받는다",
            "직접 노출이 적다"
          ],
          [
            "브라우저 프로세스",
            "탭·다운로드·권한·파일을 관리한다",
            "샌드박스 밖 — 공격자의 최종 목표"
          ]
        ]
      },
      {
        "type": "flow",
        "caption": "공격 한 판의 여정",
        "steps": [
          {
            "label": "페이지 방문",
            "detail": "게시판 링크 한 번이면 충분하다"
          },
          {
            "label": "V8 실행",
            "detail": "페이지의 자바스크립트를 엔진이 돌린다"
          },
          {
            "label": "타입 컨퓨전",
            "detail": "엔진이 믿은 타입과 실제 값이 어긋난다"
          },
          {
            "label": "샌드박스 안 코드 실행",
            "detail": "페이지 안에서 임의 코드가 돈다"
          },
          {
            "label": "샌드박스 탈출",
            "detail": "별도 단계 — 여기까지 와야 시스템이 넘어간다"
          }
        ]
      },
      {
        "type": "p",
        "text": "타입 컨퓨전을 알아 둘 가치가 있다. 자바스크립트 엔진은 속도를 위해 '이 값은 항상 정수'라는 관찰에 기대 검사를 생략한 최적화를 걸어 둔다. 공격자는 그 믿음을 깨는 입력을 찾는다 — 검사 없는 길로 다른 타입의 값이 들어가면 엔진은 메모리를 엉뚱한 곳에서 읽고 쓰게 된다. 최적화를 위한 믿음이 공격 표면이 되는 것이다."
      },
      {
        "type": "p",
        "text": "이번 취약점은 샌드박스 안까지 온 공격이다. 샌드박스 덕에 '코드가 실행됐다'와 '컴퓨터가 넘어갔다'는 다른 단계지만, KEV 등재는 그 완충이 실전에서 이미 시험 중이라는 뜻이기도 하다. 사용자가 할 수 있는 방어는 성의 있어 보이지 않는다 — 업데이트. 크로미엄 기반 브라우저(크롬, 엣지 등)는 같은 엔진을 공유하므로 함께 대상이다."
      },
      {
        "type": "quiz",
        "question": "이번 취약점 설명에 '샌드박스 내부에서 임의 코드 실행'이라고 명시한 이유는?",
        "options": [
          "샌드박스가 있어서 공격이 실패했다는 뜻이다",
          "코드 실행까지는 성공했고, 샌드박스 밖으로 나가는 것은 별도의 다음 단계라는 뜻이다",
          "샌드박스 설정을 끄면 취약점이 사라진다는 뜻이다",
          "모바일 브라우저에는 영향이 없다는 뜻이다"
        ],
        "answer": 1,
        "explain": "샌드박스는 코드 실행과 시스템 침입 사이의 완충이다. '내부에서'라는 말은 앞 단계가 뚫렸다는 뜻이고, 탈출이 이어지지 않으면 피해는 제한된다 — 완충이 실전에서 얼마나 남았는지가 이번 KEV 등재가 보여 주는 부분이다."
      },
      {
        "type": "link",
        "href": "https://nvd.nist.gov/vuln/detail/cve-2026-85046",
        "label": "NVD",
        "title": "CVE-2026-85046 — 크롬 V8 타입 컨퓨전",
        "detail": "CVSS 8.8, CWE-843. 152.0.7977.82 이전 버전이 대상이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "주로 쓰는 브라우저에서 버전을 확인한다(크롬이면 도움말 → Chrome 정보). 152.0.7977.82 이상인지 보고, 아니면 지금 업데이트한다. 업무용 PC에서 보안 정책이 업데이트를 막고 있다면 KEV 등재 사실과 함께 업데이트를 요청한다."
      }
    ],
    "next": "패치가 공개되면 공격이 시작된다",
    "series": "보안 노트"
  },
  {
    "no": 21,
    "date": "2026.08.26",
    "weekday": "수",
    "title": "로그인은 어디서 판별될까",
    "dek": "코드 어디에도 호출문이 없는데 접근이 통제된다. 그 판정은 요청이 컨트롤러에 닿기 전의 필터 사슬에서 일어난다.",
    "minutes": 8,
    "tags": [
      "Spring Security",
      "세션",
      "인증"
    ],
    "takeaway": "로그인 상태란 세션에 저장된 사용자를 꺼내 보는 것이고, 꺼내는 길목이 보안 필터 체인이다.",
    "blocks": [
      {
        "type": "p",
        "text": "웹 애플리케이션 보안 노트의 첫 장은 가장 익숙한 문, 로그인이다. 컨트롤러 코드 어디에도 \"로그인 여부를 확인하라\"는 호출문이 없는데 접근이 통제된다. Spring Security가 모든 요청을 필터 사슬로 통과시키기 때문이다 — 설정이 코드를 부르는 대표적인 예다. 이 사슬이 요청을 걸러 내는 자리를 먼저 읽고, 이 시리즈는 그 문 바깥의 공격 표면 — 브라우저, 의존성 패치, DNS — 로 범위를 넓혀 간다."
      },
      {
        "type": "flow",
        "caption": "요청 하나가 지나는 보안 필터 사슬",
        "steps": [
          {
            "label": "필터 사슬 진입",
            "detail": "모든 요청의 관문"
          },
          {
            "label": "인증 정보 복원",
            "detail": "세션에서 사용자를 꺼낸다"
          },
          {
            "label": "로그인 처리",
            "detail": "폼 제출이면 자격을 검증한다"
          },
          {
            "label": "인가 판정",
            "detail": "마지막 필터가 허용·차단"
          },
          {
            "label": "컨트롤러",
            "detail": "이제야 코드가 실행된다"
          }
        ]
      },
      {
        "type": "p",
        "text": "복원 필터는 세션에서 인증 정보를 꺼내 요청에 얹고, 마지막 인가 필터는 경로와 권한을 대조해 통과시키거나 막는다. 로그인 폼 제출은 전용 필터가 가로채고, 사용자 조회는 인증 관리자가 데이터베이스 조회 구현체에 맡긴다. \"누구인가\"의 판정과 \"무엇을 허용할까\"의 판정이 이렇게 갈라져 있다. 설정 파일의 모드 값 하나로 인증 방식을 고르는 관행도 같은 틀 안에 있다."
      },
      {
        "type": "code",
        "language": "java",
        "caption": "현재 사용자 확인의 전형 — 구조만 옮긴 각색",
        "content": "UserAccount user = SessionUserHelper.getCurrentUser();\nif (user == null) {\n    // 비로그인 — 로그인 화면으로\n}"
      },
      {
        "type": "p",
        "text": "CSRF 토큰도 같은 사슬에 산다. 폼마다 숨은 필드로 토큰이 붙고, 사슬 앞쪽의 필터가 그 일치를 검사한다. 토큰 검사는 프레임워크 설정으로 켜고 끌 수 있고, 요즘 프레임워크의 기본값은 켜짐이다."
      },
      {
        "type": "p",
        "text": "세션 이야기도 짚자. 로그인의 실체는 JSESSIONID 쿠키와 서버 메모리의 짝이다. 그래서 서버를 재시작하면 로그인이 풀리고, 서버를 여러 대로 늘리면 세션 공유 문제가 생긴다. 타임아웃은 웹 애플리케이션 배포 설정(web.xml의 session-timeout)에서 분 단위로 정한다 — setMaxInactiveInterval은 초 단위라 혼동 주의. 로그인 성공 시 세션을 새로 발급하는 방어(세션 고정 대비)는 프레임워크 기본이지만, 실패 횟수 잠금은 기본이 아니라 이벤트를 받아 직접 만드는 부분이다."
      },
      {
        "type": "quiz",
        "question": "비로그인 사용자가 권한 필요 화면의 주소를 직접 입력했다. 화면 대신 로그인 화면이 나오는 이유는?",
        "options": [
          "JSP 첫 줄의 검사 코드가 멈춘다",
          "마지막 인가 필터가 요청을 컨트롤러까지 보내지 않는다",
          "데이터베이스가 접근을 거부한다",
          "web.xml이 해당 URL을 차단한다"
        ],
        "answer": 1,
        "explain": "필터 사슬의 마지막 인가 필터가 권한을 대조해 요청을 거기서 끊는다. 컨트롤러와 JSP는 실행조차 되지 않는다. 화면 코드의 검사는 2차 방어일 뿐이다."
      },
      {
        "type": "link",
        "href": "https://docs.spring.io/spring-security/reference/servlet/architecture.html",
        "label": "Spring Security",
        "title": "필터 사슬 아키텍처 공식 문서",
        "detail": "CSRF 검사, 인증, 인가가 왜 그 순서로 오는지 설명한다. 이 호의 flow가 그 순서를 따라 간다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "담당 애플리케이션의 web.xml을 열어 session-timeout 값과 인증 모드 설정 값을 확인해 둔다. \"로그인이 풀렸다\"는 보고가 왔을 때 가장 먼저 보는 두 값이다."
      }
    ],
    "next": "브라우저 취약점은 샌드박스 이야기다",
    "series": "보안 노트"
  },
  {
    "no": 20,
    "date": "2026.08.25",
    "weekday": "화",
    "title": "모놀리스, 어디부터 자르나",
    "dek": "\"모놀리스를 쪼개야 하지 않나\"가 회의에 나왔다. 찬반 이전에 정할 것은 자르는 축이다.",
    "minutes": 9,
    "tags": [
      "MSA",
      "아키텍처"
    ],
    "takeaway": "자르는 축은 기술 계층이 아니라 업무 능력이다 — 데이터베이스를 같이 쓰는 순간 마이크로서비스는 분산 모놀리스로 돌아간다.",
    "blocks": [
      {
        "type": "p",
        "text": "19호까지 따라가 봤다면 WAR 하나가 온전한 모놀리스라서, 기능 하나만 바뀌어도 전체를 다시 배포해야 한다는 점을 알 것이다. 그 배포가 유독 무겁게 느껴진다면 원인의 절반은 구조다. \"모놀리스를 쪼개자\"는 제안이 설계 회의에 나왔다면, 찬성이든 반대든 먼저 물어야 할 질문은 \"정말 아픈 곳이 어디냐\"다. 대답이 \"배포할 때마다 전체가 같이 갈린다\", \"한 팀의 변경이 다른 팀을 무너뜨린다\"라면 쪼개는 게 맞다. 반대로 \"최신 기술이라서\"라면 지금이 이득이다. MSA는 업그레이드가 아니라 고통에 대한 응답이다."
      },
      {
        "type": "flow",
        "caption": "계층으로 잘랐을 때 기능 변경 하나의 여정",
        "steps": [
          {
            "label": "변경 요청",
            "detail": "게시판에 필드 하나 추가"
          },
          {
            "label": "세 팀 협업",
            "detail": "화면·서비스·DAO 서비스를 함께 수정"
          },
          {
            "label": "동시 배포",
            "detail": "셋의 버전을 맞춰야만 한다"
          },
          {
            "label": "장애 전파",
            "detail": "호출 사슬 하나가 끊기면 전체가 멈춘다"
          }
        ]
      },
      {
        "type": "p",
        "text": "이 상태의 이름이 있다. 분산 모놀리스 — 서비스로 나눈 것 같지만 함께 배포해야 하는 하나의 시스템이다. 네트워크 호출 비용과 운영 복잡도만 추가되고 얻는 것은 없다. 잘 굴러가던 모놀리스보다 나쁘다. 올바른 축은 계층이 아니라 업무 능력이다. \"사용자 관리\", \"게시판\", \"전자문서 결재\"처럼 독립적으로 가치를 낼 수 있는 덩어리를 찾고, 그 경계 위에 서비스를 세운다. 이 경계를 가리키는 말이 바운디드 컨텍스트다. 결정적 규칙 하나는 데이터다 — 각 서비스가 자기 데이터를 독점적으로 소유해야 한다. 여러 서비스가 하나의 데이터베이스를 바라본다면 코드만 나뉜 것이다."
      },
      {
        "type": "p",
        "text": "어디부터 자를지도 데이터가 알려 준다. 좋은 첫 후보는 변경이 잦고, 다른 기능과 테이블을 적게 공유하고, 혼자 떨어져 나가도 쓸모가 있는 기능이다. 반대로 하나의 트랜잭션으로 뭉쳐 있거나 모든 기능이 함께 부르는 공통 모듈은 마지막까지 남겨 둔다. 첫 수술이 실패하면 다음 제안을 아무도 꺼내지 않는다 — 작고 성공 확률이 높은 곳부터."
      },
      {
        "type": "table",
        "caption": "첫 수술 자리 고르기",
        "head": [
          "판단 기준",
          "잘린다",
          "아직 안 된다"
        ],
        "rows": [
          [
            "변경 빈도",
            "요구가 계속 몰리는 기능",
            "거의 바뀌지 않는 핵심"
          ],
          [
            "데이터 공유",
            "다른 기능과 테이블이 거의 겹치지 않는다",
            "하나의 트랜잭션으로 뭉쳐 있다"
          ],
          [
            "독립성",
            "떨어져 나가도 혼자 쓸모가 있다",
            "모든 기능이 함께 부르는 공통 모듈"
          ]
        ]
      },
      {
        "type": "p",
        "text": "자르는 방법도 중요하다. \"1년짜리 MSA 전환 프로젝트\"는 대부분 실패한다. 표준 절차는 스트랭글러 패턴이다 — 기존 시스템 앞에 요청을 가르는 문을 세우고, 옮길 기능부터 새 서비스로 돌린다. 무화과 덩굴이 받쳐 준 나무를 감싸 대체하듯 모놀리스는 조금씩 줄어들고, 언제 멈춰도 시스템은 온전하다."
      },
      {
        "type": "quiz",
        "question": "서비스 셋으로 쪼갰다. 그런데 기능 하나를 고치면 세 팀이 같이 배포해야 한다. 가장 유력한 원인은?",
        "options": [
          "서비스가 너무 작아서 다시 합쳐야 한다",
          "서비스들이 하나의 데이터베이스를 공유하고 있다",
          "API 게이트웨이를 도입하지 않아서다",
          "통합 테스트 자동화가 부족해서다"
        ],
        "answer": 1,
        "explain": "코드 저장소는 나뉘었지만 데이터와 배포 주기가 하나로 묶여 있으면 분산 모놀리스다. 경계는 계층이나 인프라가 아니라 데이터 소유권 위에 그어야 한다."
      },
      {
        "type": "link",
        "href": "https://martinfowler.com/articles/microservices.html",
        "label": "Martin Fowler — Microservices",
        "title": "MSA를 말할 때 빠지지 않는 원전",
        "detail": "이 글이 드는 아홉 가지 특징 중 \"각 서비스가 자기 데이터를 소유한다\"가 오늘의 결론이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "다루는 시스템에서 \"따로 배포하고 싶은 기능\" 셋을 적어 본다. 각각이 다른 기능과 테이블·화면을 얼마나 공유하는지 세어 보고, 공유가 가장 적은 곳을 첫 수술 후보로 남겨 둔다."
      }
    ],
    "next": "로그인은 어디서 판별될까",
    "series": "MSA와 설계"
  },
  {
    "no": 19,
    "date": "2026.08.24",
    "weekday": "월",
    "title": "파일은 두 망을 어떻게 건너가나",
    "dek": "망연계는 통로 이야기가 아니라 절차 이야기다 — 승인, 검사, 전송, 기록이 한 세트다.",
    "minutes": 8,
    "tags": [
      "망분리",
      "망연계",
      "보안"
    ],
    "takeaway": "망연계의 핵심은 통로가 아니라 절차다 — 승인과 기록이 없는 통로는 만들지 않는다.",
    "blocks": [
      {
        "type": "p",
        "text": "챗봇 응답이 느릴 때 원인 후보 목록에는 \"네트워크 홉당 지연\"이 늘 오른다. 오늘은 그 홉의 정체를 파낸다. 보안이 중요한 조직은 내부망과 외부망을 나눈다. 한국 공공부문에서는 2007년 망분리 지침부터 표준이었고, 개발자가 실무에서 겪는 절차 대부분이 여기서 나온다."
      },
      {
        "type": "p",
        "text": "최근의 큰 흐름도 알아 둘 가치가 있다. 2025년 9월에 발표된 국가망보안체계(N2SF)는 망 자체가 아니라 데이터 등급(기밀·민감·공개)으로 통제를 차등 적용하는 방향이다. 망분리를 없애자는 것이 아니라, 무엇을 지킬지를 망이 아니라 데이터 기준으로 판단하자는 전환이다."
      },
      {
        "type": "table",
        "caption": "망연계의 세 가지 방식",
        "head": [
          "방식",
          "모습",
          "어울리는 일"
        ],
        "rows": [
          [
            "파일 전송",
            "승인된 파일을 점검 후 반출·반입",
            "대량·비정기 자료, 메일 대체"
          ],
          [
            "API 게이트웨이",
            "망간 서버가 실시간 호출",
            "실시간 업무 연동, 제한적 조회"
          ],
          [
            "ETL 배치",
            "정해진 시간에 추출-변환-적재",
            "야간 대량 적재, 통계·데이터웨어하우스"
          ]
        ]
      },
      {
        "type": "callout",
        "title": "DB 링크가 꺼리는 이유",
        "tone": "warn",
        "text": "두 데이터베이스를 직접 연결하면 접속 계정이 설정에 노출되고, 중앙 통제와 감사 로그 없이 데이터가 오간다. 망연계의 원칙 — 승인, 검사, 기록 — 을 지킬 수 없는 통로는 편의가 커도 만들지 않는다. \"되게 편한데 왜 안 되지\"의 답이 대부분 여기 있다."
      },
      {
        "type": "flow",
        "caption": "자료 반출 한 판의 절차",
        "steps": [
          {
            "label": "요청",
            "detail": "무엇을·어디로·왜"
          },
          {
            "label": "보안 검사",
            "detail": "악성코드·개인정보 점검"
          },
          {
            "label": "결재",
            "detail": "개인정보 검출 시 2차 승인"
          },
          {
            "label": "전송",
            "detail": "망연계 장비가 기록과 함께"
          },
          {
            "label": "감사 로그",
            "detail": "누가·언제·무엇을 남는다"
          }
        ]
      },
      {
        "type": "p",
        "text": "개발자의 하루에 비치면 이렇다. 라이브러리는 외부에서 내려받아 내부 저장소에 올려 두고 그것만 쓴다. 소스와 파일의 반출입은 결재를 거친다. 배포는 내부 CI가 WAR를 만들고, 저장소에 보관하고, 반출 승인을 받아 전송한 뒤 WAS를 다시 띄운다. \"배포가 밀린다\"는 말의 뒤에는 이 절차 전체가 서 있다."
      },
      {
        "type": "quiz",
        "question": "외부망 데이터를 내부망으로 옮기는 방법 중 망연계 표준이 아닌 것은?",
        "options": [
          "망연계 장비로 승인 후 파일 전송",
          "야간 ETL 배치",
          "두 DB를 DB 링크로 직접 연결",
          "API 게이트웨이 경유"
        ],
        "answer": 2,
        "explain": "DB 링크는 계정 노출과 감사 우회 문제로 사실상 금지된다. 통로의 문제가 아니라 승인·검사·기록의 절차를 거치는가가 기준이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "팀의 자료 반출입 절차를 한 장의 그림으로 정리해 본다 — 누가 승인하고, 어디에 기록이 남는지. 감사나 장애 조사가 오는 날 그 그림이 곧 답안지가 된다."
      }
    ],
    "next": "모놀리스, 어디부터 자르나",
    "series": "MSA와 설계"
  },
  {
    "no": 18,
    "date": "2026.08.23",
    "weekday": "일",
    "title": "정규화는 분리의 연습이다",
    "dek": "정규화를 이해하는 일은 사실을 한 곳에만 두는 법을 배우는 것이다.",
    "minutes": 9,
    "tags": [
      "정규화",
      "데이터베이스",
      "설계"
    ],
    "takeaway": "정규화는 사실을 한 곳에만 적게 만드는 설계고, 컬럼 중복은 미래의 수정 이상이다.",
    "blocks": [
      {
        "type": "p",
        "text": "\"개발자는 데이터베이스 정규화를 이해해야 한다. 그게 비즈니스 로직을 분리하는 트레이드오프를 이해하는 것이다.\" 겉보기에는 테이블 이야기와 아키텍처 이야기가 어색하게 이어지는데, 함수적 종속을 따져 보면 같은 문제다. 함수적 종속(functional dependency)은 \"X가 정해지면 Y가 하나로 정해진다\"는 관계다. 학번이 정해지면 학생명이 정해진다. 세미나코드가 정해지면 세미나명과 일자가 정해진다. 테이블을 나누는 기준은 결국 \"이 컬럼의 근거가 무엇인가\"이고, 이것은 비즈니스 로직이 어디에 귀속되어야 하는지 묻는 것과 같은 질문이다(17호)."
      },
      {
        "type": "code",
        "language": "sql",
        "caption": "하나로 몰아넣은 신청 테이블 — 어디가 문제인가",
        "content": "CREATE TABLE TB_SEMINAR_APP (\n  APP_SEQ     NUMBER(10)  NOT NULL,   -- 신청번호 (PK)\n  EMP_ID      VARCHAR(10) NOT NULL,   -- 사번\n  SEMINAR_ID  VARCHAR(10) NOT NULL,   -- 세미나코드\n  EMP_NM      VARCHAR(50),            -- 사번이 정한다\n  DEPT_CD     VARCHAR(4),             -- 사번이 정한다\n  DEPT_NM     VARCHAR(50),            -- DEPT_CD가 정한다\n  SEMINAR_NM  VARCHAR(100),           -- 세미나코드가 정한다\n  SEMINAR_DT  DATE                    -- 세미나코드가 정한다\n);"
      },
      {
        "type": "table",
        "caption": "정규형 세 단계 — 위반 모습과 처방",
        "head": [
          "단계",
          "위반 모습",
          "처방"
        ],
        "rows": [
          [
            "1NF",
            "한 컬럼에 쉼표로 여러 값 (\"수학,물리,화학\")",
            "행을 쪼개 값 하나씩 둔다"
          ],
          [
            "2NF",
            "복합키 일부에만 종속하는 컬럼 (학번→학생명)",
            "학원 테이블로 분리한다"
          ],
          [
            "3NF",
            "키가 아닌 컬럼이 다른 키가 아닌 컬럼을 결정 (DEPT_CD→DEPT_NM)",
            "근거 테이블로 분리한다"
          ]
        ]
      },
      {
        "type": "list",
        "items": [
          "수정 이상 — 세미나명이 바뀌면 신청 행 수만큼 고쳐야 한다. 한 행만 빠뜨리면 불일치.",
          "삽입 이상 — 아직 신청자가 없는 세미나는 행을 만들 수 없다(번호가 비어야 해서).",
          "삭제 이상 — 마지막 신청자를 지우면 세미나 정보까지 함께 사라진다."
        ]
      },
      {
        "type": "p",
        "text": "이 세 이상의 정체는 하나다. 한 사실이 여러 행에 사는 것. 그래서 사원·세미나·신청 세 테이블로 나누면 각 사실이 자기 자리에 한 번만 살고, 이상이 사라진다. 컬럼을 컬럼끼리 모으는 작업이 아니라 사실의 귀속을 정하는 작업이라는 점이 아키텍처와 닮았다."
      },
      {
        "type": "p",
        "text": "물론 무조건 나누는 것이 답은 아니다. 읽기가 압도적으로 많은 자리(리포트·대시보드)에서는 JOIN 비용을 줄이려고 의도적으로 중복을 다시 산다 — 반정규화다. 대가는 갱신 이상의 부활과 쓰기 복잡도이므로, 요약값은 캐시 컬럼이나 materialized view에 두고 갱신 주기를 명확히 하는 편이 안전하다. 오래된 격언이 그대로 통한다 — 아플 때까지 정규화하고, 동작할 때까지 반정규화하라."
      },
      {
        "type": "list",
        "items": [
          "코드성 컬럼(직급코드 등)은 의미를 담지 않는다 — 공통코드 테이블과 대조해 의미는 한 곳에 둔다.",
          "금액은 DECIMAL로 — 부동소수점은 반올림 오차를 품고 있다.",
          "NULL은 정말 모를 때만 — 가능하면 NOT NULL과 기본값으로 둔다.",
          "PK는 업무 번호 같은 자연키보다 의미 없는 대리키(BIGINT)가 관리가 쉽다."
        ]
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "담당 테이블 하나의 컬럼 목록을 훑고, 컬럼마다 \"무엇이 이 값을 정하는가\"를 한 줄씩 적어 본다. 근거가 같은 컬럼끼리 묶이면 그 묶음이 사실상 테이블 경계다."
      }
    ],
    "next": "파일은 두 망을 어떻게 건너가나",
    "series": "MSA와 설계"
  },
  {
    "no": 17,
    "date": "2026.08.22",
    "weekday": "토",
    "title": "비즈니스 로직은 어디에 사는가",
    "dek": "연차가 며칠인지 아는 코드가 화면, SQL, 서버 세 곳에 있다면 그 규칙은 이미 세 번 틀릴 자격이 있다.",
    "minutes": 8,
    "tags": [
      "비즈니스 로직",
      "아키텍처",
      "레이어"
    ],
    "takeaway": "비즈니스 로직은 업무가 답을 알고 기술이 모르는 부분이며, 한 곳에만 살아야 한다.",
    "blocks": [
      {
        "type": "p",
        "text": "\"비즈니스 로직은 따로 모아야 한다\"는 조언은 어디서나 들을 수 있다. 그럼 비즈니스 로직이란 무엇인가. Fowler의 구분을 빌리면, 도메인(비즈니스) 로직은 해결하려는 업무 문제에 본질적인 논리다. 애플리케이션 로직이 그것을 조율하는 것(트랜잭션, 처리 순서)이라면, 프레젠테이션 로직은 표시에 관한 것이다."
      },
      {
        "type": "list",
        "items": [
          "연차 발생 — 근속 시작일 기준, 1년 미만은 월할, 3년마다 가산, 상한은 25일.",
          "결재선 — 금액 임계치로 결정된다. 500만원 미만은 팀장, 이상은 부서장, 2000만원 이상은 국장 추가.",
          "자격 판정 — 지원 자격은 업종·실적·지역 조건의 조합으로 갈린다."
        ]
      },
      {
        "type": "p",
        "text": "이것들의 공통점이 있다. 데이터베이스가 대신 답해 주지 않고, 프레임워크가 몰라서 해 줄 수 없고, 오직 요구사항 문서와 업무 담당자만 안다. 기술이 아니라 업무가 정답을 가진 부분이라는 뜻이다."
      },
      {
        "type": "table",
        "caption": "계층별 거주자",
        "head": [
          "계층",
          "사는 것",
          "비즈니스 규칙"
        ],
        "rows": [
          [
            "Controller",
            "HTTP 번역 — 파라미터 파싱, 응답 조립",
            "없어야 한다"
          ],
          [
            "Service",
            "비즈니스 로직의 본거지 + 트랜잭션 조율",
            "여기 산다"
          ],
          [
            "DAO / Mapper",
            "영속성 — SQL과 결과 매핑",
            "없어야 한다"
          ]
        ]
      },
      {
        "type": "callout",
        "title": "규칙이 흩어지는 세 자리",
        "tone": "warn",
        "text": "화면 자바스크립트의 임계치(결재선 금액을 화면에서도 검사), SQL WHERE 절의 자격 조건, DAO 안의 if 분기. 결재선 금액이 바뀌었는데 화면 JS만 고쳐졌다면, 사용자는 새 금액을 보고 서버는 옛 규칙으로 돌린다. 흩어진 규칙은 버그가 아니라 반드시 터지는 시한폭탄이다."
      },
      {
        "type": "p",
        "text": "경계의 안쪽으로 더 들어가면 바운디드 컨텍스트(bounded context)라는 개념이 나온다. 같은 \"사용자\"라도 급여 업무에서 보는 속성과 출결 업무에서 보는 속성이 다르다. 컨텍스트마다 모델과 용어가 따로 존재하고, 경계 사이는 정해진 계약으로만 왕래한다. 마이크로서비스의 서비스 경계는 대부분 이 경계 위에 놓인다 — 16호의 이야기가 여기서 만난다."
      },
      {
        "type": "quiz",
        "question": "결재선 금액 임계치가 JSP 자바스크립트와 Service 두 곳에 있다. 가장 먼저 해야 할 일은?",
        "options": [
          "두 값을 같은 숫자로 맞춰 둔다",
          "화면 쪽 규칙을 지우고 서버만 규칙을 갖게 한다",
          "DB 트리거로 옮긴다",
          "규칙 문서를 최신으로 갱신한다"
        ],
        "answer": 1,
        "explain": "진실의 원천은 하나여야 한다. 화면의 사전 검사는 편의이지 규칙이 아니므로, 규칙은 서버 한 곳에 두고 화면은 표시·편의 검증만 남긴다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "담당 업무의 규칙 하나를 고르고 그것이 지금 몇 개의 파일에 적혀 있는지 센다. 한 곳이면 잘 사는 것이고, 둘 이상이면 어느 쪽이 진짜인지 메모해 둔다 — 수정 요청이 오는 날의 지도가 된다."
      }
    ],
    "next": "정규화는 분리의 연습이다",
    "series": "MSA와 설계"
  },
  {
    "no": 16,
    "date": "2026.08.21",
    "weekday": "금",
    "title": "MSA는 설계도가 아니라 진화의 흔적이다",
    "dek": "MSA는 서버 아키텍처의 전유물이 아니라, 경계를 긋는 보편적인 습관이다.",
    "minutes": 9,
    "tags": [
      "MSA",
      "아키텍처",
      "조직"
    ],
    "takeaway": "마이크로서비스는 먼저 설계하고 착수한 것이 아니라, 조직과 트래픽과 장애가 밀어붙인 경계의 기록이다.",
    "blocks": [
      {
        "type": "p",
        "text": "결론부터 세 문장으로 적는다. MSA는 서버 아키텍처에만 국한되지 않는다. 효율과 필요가 밀어붙인 자연스러운 진화의 결과다. 그러니 언젠가 분리할 수 있도록 모듈 경계를 미리 긋는 설계 습관이 필요하다. 역사를 따라가 보면 이 세 문장이 모두 근거를 갖는다."
      },
      {
        "type": "list",
        "items": [
          "모놀리스 — 하나로 다 담는다. 실패하나마 빠르고 단순하다.",
          "SOA (2000년대 초) — 서비스를 재사용 단위로 묶되, 공통 버스(ESB)가 라우팅·변환을 다 떠안는 \"똑똑한 파이프, 멍청한 서비스\". 버스가 병목과 단일 장애점이 되었다.",
          "마이크로서비스 (2011 용어 등장, 2014 Fowler·Lewis 정의) — \"작은 서비스들의 묶음, 각자 프로세스, 가벼운 통신, 비즈니스 역량 중심, 독립 배포\"."
        ]
      },
      {
        "type": "p",
        "text": "\"진화의 결과\"라는 말의 근거는 사건들이다. 아마존은 2002년경 베조스의 API 위임장 — 모든 팀은 서비스 인터페이스로만 통신한다, 예외 없이 — 와 2피자 팀 원칙으로 조직부터 바꿨다. 넷플릭스는 2008년 DB 손상으로 사흘간 발송이 멈춘 장애를 계기로 클라우드 전환을 시작해 2016년에 끝냈다. 그리고 컨웨이의 법칙(1968): 시스템 구조는 그것을 만든 조직의 소통 구조를 복제한다. 구조가 먼저가 아니라 조직이 먼저였다는 증거들이다."
      },
      {
        "type": "callout",
        "title": "Fowler의 반전 — MonolithFirst (2015)",
        "tone": "note",
        "text": "\"성공한 마이크로서비스 이야기는 거의 모두 너무 커진 모놀리스에서 시작되었다. 처음부터 마이크로서비스로 만든 시스템은 거의 모두 고통으로 끝났다.\" 좋은 경계는 경험 뒤에 보인다. 모놀리스는 경계를 실험하기 가장 싼 무대다."
      },
      {
        "type": "p",
        "text": "2020년에는 되돌림이 왔다. Kelsey Hightower의 \"Monoliths are the future\" — 경계 없는 모놀리스를 쪼개면 그저 분산된 엉망이 된다. Shopify는 모놀리스 하나를 모듈러 모놀리스로 정돈해 거대한 트래픽을 처리한다. 결론이 아니라 균형점이 정리되었다. 목표는 나눔이 아니라 \"분리 가능한 모듈\"이다."
      },
      {
        "type": "flow",
        "caption": "자연스러운 진화의 경로",
        "steps": [
          {
            "label": "모놀리스",
            "detail": "빠르게 만든다"
          },
          {
            "label": "모듈",
            "detail": "안에서 경계를 긋고 실험한다"
          },
          {
            "label": "서비스",
            "detail": "트래픽·조직이 요구하는 모듈만 독립시킨다"
          },
          {
            "label": "다듬기",
            "detail": "경계는 계약이 되고, 조직이 이를 따른다"
          }
        ]
      },
      {
        "type": "p",
        "text": "그리고 이 원리는 서버를 넘어 퍼졌다. 화면을 기능 단위로 쪼개는 마이크로 프론트엔드(ThoughtWorks 2016년 등장, 2019년 Adopt), LLM 에이전트를 작은 역할로 쪼개는 멀티 에이전트 구성 — 언론이 \"멀티 에이전트 AI는 새로운 마이크로서비스\"라고 부르는 것 — 까지. 공통 원소는 넷이다: 명시적 경계, 한 가지 책임, 계약, 독립 교체."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "맡은 업무를 \"나중에 독립된 서비스가 될 만한 덩어리\"로 묶어 본다. 묶음의 기준은 화면이 아니라 비즈니스 역량이다 — 주문 접수, 게시판, 인증. 모놀리스 안에서 이 경계가 긋혀 있으면 그것이 분리를 위한 준비 운동이다."
      }
    ],
    "next": "비즈니스 로직은 어디에 사는가",
    "series": "MSA와 설계"
  },
  {
    "no": 15,
    "date": "2026.08.20",
    "weekday": "목",
    "title": "Docker는 배포, 모놀리스·MSA는 구조",
    "dek": "세 단어가 자주 같이 나오지만 답하는 질문이 다르다. \"MSA와 설계\" 시리즈의 첫 편은 축부터 잡는다.",
    "minutes": 8,
    "tags": [
      "Docker",
      "Monolith",
      "MSA"
    ],
    "takeaway": "Docker는 배포 방식이고, 모놀리스·MSA는 코드를 나누는 방식이다 — 축이 다르니 나란히 비교하지 않는다.",
    "blocks": [
      {
        "type": "p",
        "text": "이번 시리즈는 코드를 나누는 구조 이야기부터 시작한다. Docker, 모놀리스, MSA — 세 단어가 자주 같이 나오지만 답하는 질문이 다르다. 나란히 비교하면 처음부터 어긋난다."
      },
      {
        "type": "table",
        "caption": "축이 다르면 비교 자체가 성립하지 않는다",
        "head": [
          "단어",
          "무엇에 대한 답인가"
        ],
        "rows": [
          [
            "모놀리스",
            "코드를 어떻게 나눌 것인가"
          ],
          [
            "MSA",
            "코드를 어떻게 나눌 것인가"
          ],
          [
            "Docker",
            "어떻게 배포하고 실행할 것인가"
          ]
        ]
      },
      {
        "type": "callout",
        "title": "핵심 구분",
        "text": "Docker를 쓴다고 MSA가 되는 것은 아니다. WAR 하나를 Tomcat 컨테이너에 넣으면 그것은 Docker 위의 모놀리스다. 반대로 MSA는 Docker 없이도 가능하지만, 서비스별 배포를 다루기 쉬워 컨테이너와 함께 쓰는 경우가 많다."
      },
      {
        "type": "flow",
        "caption": "같은 모놀리스를 Docker로 감싼 배포",
        "steps": [
          {
            "label": "Maven build",
            "detail": "project.war"
          },
          {
            "label": "Docker image",
            "detail": "JDK + Tomcat + WAR"
          },
          {
            "label": "Container",
            "detail": "어느 서버에서나 같게 실행"
          }
        ]
      },
      {
        "type": "p",
        "text": "공공·온프레미스 유지보수에서는 운영팀이 이미 Java와 Tomcat을 설치해 두고 개발팀은 WAR만 전달하는 경우가 흔하다. 그래서 Docker가 없어도 이상하지 않다. 반면 개발·테스트·운영 환경을 동일하게 만들거나 CI/CD를 정비하려면 Docker가 유용해진다."
      },
      {
        "type": "list",
        "items": [
          "서비스를 나누면 한 덩어리의 코드가 작아지고 독립 배포가 가능해진다.",
          "대신 네트워크 호출·인증·분산 로그·장애 전파·데이터 일관성·운영 비용이 늘어난다.",
          "그래서 \"복잡하니 무조건 MSA\"가 아니라, 독립적으로 바뀌고 운영될 업무 경계가 실제로 있는지를 먼저 본다."
        ]
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "지금 다루는 시스템이 WAR 하나로 도는지, 여러 서비스로 나뉘어 있는지 확인해 본다. Docker로 감싸져 있어도 서비스가 하나뿐이면 그것은 여전히 모놀리스다."
      }
    ],
    "next": "MSA는 설계도가 아니라 진화의 흔적이다",
    "series": "MSA와 설계"
  },
  {
    "no": 14,
    "date": "2026.08.19",
    "weekday": "수",
    "title": "규칙이 수백 개가 되면",
    "dek": "하나를 고쳤더니 멀쩡하던 질문이 깨진다. 규칙은 코드이고, 코드에는 테스트가 필요하다.",
    "minutes": 9,
    "tags": [
      "챗봇",
      "테스트",
      "운영"
    ],
    "takeaway": "규칙은 코드처럼 다룬다 — 골든 질문 세트로 회귀 테스트를 돌리고, 폴백 비율이 품질의 계기판이다.",
    "blocks": [
      {
        "type": "p",
        "text": "여섯 편으로 이어 온 시리즈의 마지막 호다. 규칙으로 답하는 챗봇의 시스템을 들여다보면 규칙이 예상보다 많다. 이 상태에서 위험한 것은 규칙 수가 아니라, 하나를 고칠 때 다른 규칙이 깨졌는지 알 방법이 없다는 것이다. 규칙은 코드고, 코드에는 회귀 테스트가 필요하다."
      },
      {
        "type": "p",
        "text": "표준 해법은 골든 데이터셋이다 — 실제 로그에서 자주 온 질문과 기대 응답의 쌍을 모아 둔 세트. 규칙을 바꿀 때마다 돌려서 이전에 잘 답하던 질문이 망가지지 않았는지 확인한다. 챗봇 도구들이 이 개념을 표준으로 넣었다. Rasa는 rasa test 명령으로 인텐트별 정밀도·재현율 보고서와 혼동 행렬을 내고, Dialogflow CX는 테스트 케이스로 기대 의도·페이지·파라미터를 비교한다."
      },
      {
        "type": "p",
        "text": "규칙이 늘 때 나타나는 구조적 병도 다섯 가지로 정리되어 있다 — 전문가 시스템 시대부터 내려온 표준 분류이다."
      },
      {
        "type": "list",
        "items": [
          "충돌 — 같은 입력에 규칙 둘이 다른 답을 내놓는다.",
          "도달 불가 — 앞 규칙에 가려져 영원히 실행되지 않는다.",
          "포함 — 더 넓은 조건의 규칙에 삼켜진다.",
          "중복 — 같은 일을 하는 규칙이 둘 있다.",
          "순환 — 규칙들이 서로를 계속 부른다."
        ]
      },
      {
        "type": "p",
        "text": "수백 개가 되면 사람 눈으로 못 걸러 낸다. 골든 세트 회귀 테스트가 대신 눈이 되어 준다. 규칙 파일도 Git으로 관리해 변경은 리뷰를 거치게 하는 것이 요즘 표준 운영이다 — YAML 규칙 파일도 코드라는 뜻이다."
      },
      {
        "type": "p",
        "text": "운영의 계기판도 정해져 있다. 폴백(무응답) 비율은 잘 훈련된 봇 기준 10~15% 이하가 권장선이다. 자가해결율 — 상담원 없이 끝난 세션의 비율 — 은 초기 20~40%에서 성숙한 봇은 70~90%에 이른다. 단, 24시간 안에 같은 문제로 돌아온 세션은 실패로 다시 세는 보정을 하는 것이 표준이다."
      },
      {
        "type": "callout",
        "title": "폴백 설계의 원칙",
        "tone": "good",
        "text": "같은 말을 반복하지 않는다. 재질문은 2~3회로 제한하고, 명확화 선택지를 제시하고, 그래도 안 되면 사람에게 넘긴다. \"상담원 연결\" 옵션을 처음부터 보여 주면 봇 이탈이 늘지 않고 오히려 신뢰가 올랐다는 운영 보고가 여럿이다."
      },
      {
        "type": "quiz",
        "question": "봇이 질문을 이해하지 못해 재질문을 세 번 반복했다. 업계 표준에 가까운 다음 동작은?",
        "options": [
          "같은 재질문을 다섯 번 더 반복한다",
          "상담원(사람) 연결로 전환한다",
          "세션을 강제로 끊는다",
          "아무 규칙이나 실행한다"
        ],
        "answer": 1,
        "explain": "재질문 2~3회 실패는 상담원 연결로 전환하는 것이 표준이다. 무한 재질문은 사용자를 봇의 감옥에 가두는 최악의 경험이다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "다루는 챗봇이 있다면 자주 받는 질문 20개 목록을 만들어 본다. 규칙을 고칠 때마다 20개가 같은 답을 내는지 확인하는 것 — 그것이 이 규칙 세트의 첫 회귀 테스트다."
      }
    ],
    "next": "Docker는 배포, 모놀리스·MSA는 구조",
    "series": "룰베이스 챗봇"
  },
  {
    "no": 13,
    "date": "2026.08.18",
    "weekday": "화",
    "title": "규칙이냐 모델이냐, 실패 비용이 정한다",
    "dek": "LLM은 그럴듯하고 규칙은 정확하다. 문제는 어느 쪽의 실패가 더 비싸냐다.",
    "minutes": 8,
    "tags": [
      "챗봇",
      "LLM",
      "아키텍처"
    ],
    "takeaway": "틀리면 안 되는 답에는 규칙, 표현이 넓어야 하는 답에는 모델 — 실패 비용으로 경계를 긋는다.",
    "blocks": [
      {
        "type": "p",
        "text": "룰베이스를 왜 쓰는지가 이번 호의 질문이다. LLM이 이렇게 좋은데 굳이 규칙을 손으로 관리할 이유가 있을까. 답은 기술 우위가 아니라 실패 비용에 있다."
      },
      {
        "type": "table",
        "caption": "같은 질문, 두 엔진",
        "head": [
          "기준",
          "룰베이스",
          "LLM"
        ],
        "rows": [
          [
            "응답 일관성",
            "같은 입력에 항상 같은 답",
            "매번 조금씩 다를 수 있다"
          ],
          [
            "모르는 질문",
            "규칙 밖이면 대응 불가 — 그러나 조용하다",
            "그럴듯하게 지어낼 수 있다(환각)"
          ],
          [
            "근거 추적",
            "어떤 규칙이 맞았는지 로그로 재현된다",
            "왜 그 답을 했는지 설명이 어렵다"
          ],
          [
            "자원",
            "CPU로 충분 — 내부망 서버에 그대로",
            "GPU·외부 연결이 흔한 전제"
          ],
          [
            "새 표현 흡수",
            "규칙 추가 필요 — 사람의 일",
            "대체로 저절로 — 단, 검증은 사람의 일"
          ]
        ]
      },
      {
        "type": "p",
        "text": "틀리면 안 되는 답이 필요한 환경 — 행정 안내, 금융, 의료 — 가 각각 어느 칸에 걸리는지 보면 된다. 잘못된 안내가 곧行정 불이익이 되는 환경에서는 \"왜 그 답을 했는지 재현 가능\"이 특혜가 아니라 요구사항이다. 미 연방 감사원(GAO)의 AI 책무성 프레임워크처럼, 규제 환경의 감사 요구는 데이터·성능·모니터링을 문서와 로그로 증명하라고 한다. 네트워크가 분리된 내부망의 CPU 전용 서버에서는 모델을 띄우는 것 자체가 비용이다."
      },
      {
        "type": "p",
        "text": "그래서 업계의 흐름은 규칙 대 모델의 승부가 아니라 배치다. 결정론적인 규칙이 시스템의 안전 영역을 지배하고(gating), 모델은 근거 문서를 붙여 답하는 자리(9호의 RAG)와 표현을 다듬는 자리를 맡는다. 챗봇 엔진 진영에서도 \"비즈니스 로직은 결정론적 Flow에, 유연한 표현은 모델에\"라는 설계가 표준화되어 간다. 룰베이스는 구식이 아니라 안전 영역의 이름이다."
      },
      {
        "type": "link",
        "href": "https://rasa.com/calm",
        "label": "Rasa CALM",
        "title": "결정론적 비즈니스 로직과 LLM을 함께 쓰는 구성의 한 예",
        "detail": "\"비즈니스 규칙은 프롬프트가 아니라 결정론적 Flow에\"라는 원칙"
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "챗봇이 답하는 질문을 두 통으로 나눠 본다. \"틀리면 업무 처리에 문제\" 통과 \"표현만 부드러우면 충분\" 통. 첫 번째 통이 규칙으로 답하고 있는지 확인한다 — 그것이 이런 시스템을 규칙으로 만드는 이유다."
      }
    ],
    "next": "규칙이 수백 개가 되면",
    "series": "룰베이스 챗봇"
  },
  {
    "no": 12,
    "date": "2026.08.17",
    "weekday": "월",
    "title": "챗봇은 문장을 어떻게 쪼개나",
    "dek": "의도 하나, 개체 몇 개, 빈칸을 채우는 질문. 룰베이스 챗봇의 이해는 이 세 가지로 끝난다.",
    "minutes": 8,
    "tags": [
      "챗봇",
      "NLU",
      "AIML"
    ],
    "takeaway": "챗봇의 이해란 문장을 의도 하나와 개체 몇 개로 쪼개는 것이고, 워크플로우는 빈칸이 채워질 때까지 묻는다.",
    "blocks": [
      {
        "type": "p",
        "text": "\"전입신고 기간이 언제까지야?\"를 사람이 읽으면 한 문장이지만, 챗봇은 두 조각으로 쪼갠다. 하려는 말(의도)은 기간 조회이고, 꺼내야 할 값(개체)은 업무명=전입신고다. 사람이 상대를 읽는 순서를 그대로 기계 순서로 옮긴 것이 NLU(자연어 이해)다."
      },
      {
        "type": "flow",
        "caption": "발화 한 줄의 여정",
        "steps": [
          {
            "label": "전처리",
            "detail": "형태소 분석 — 문장을 최소 단위로"
          },
          {
            "label": "의도 판정",
            "detail": "기간 조회? 안내? 접수?"
          },
          {
            "label": "개체 추출",
            "detail": "업무명=전입신고"
          },
          {
            "label": "슬롯 확인",
            "detail": "빈칸이 있으면 되묻는다"
          },
          {
            "label": "DB 조회",
            "detail": "워크플로우가 답을 찾는다"
          },
          {
            "label": "템플릿",
            "detail": "정해진 틀로 응답 조립"
          }
        ]
      },
      {
        "type": "p",
        "text": "슬롯 채우기가 룰베이스의 일상이다. 워크플로우는 처리에 필요한 값의 목록을 들고 있고, 비어 있으면 다음 질문을 낸다 — \"어느 업무의 기간인가요?\". 사용자는 대화라고 느끼지만 서버에는 빈칸 목록이 있다."
      },
      {
        "type": "code",
        "language": "xml",
        "caption": "AIML 카테고리 — 1995년 ALICE부터 내려온 규칙의 기본 단위",
        "content": "<category>\n  <pattern>기한 알려줘</pattern>\n  <template>\n    <srai>기간 문의</srai>\n  </template>\n</category>\n\n<category>\n  <pattern>기간 문의</pattern>\n  <template>담당 업무명을 말씀해 주세요.</template>\n</category>"
      },
      {
        "type": "p",
        "text": "<srai>는 다른 카테고리를 다시 부르는 표지다. \"기한 알려줘\", \"언제까지야\", \"기한이 언제야\"가 모두 \"기간 문의\" 한 곳으로 모이므로, 표현이 늘어도 규칙 관리 포인트는 하나다. 동의어 흡수의 표준 수법이지만 서로를 계속 부르면 재귀 무한루프가 되므로, 엔진은 재귀 한도로 막는다. ALICE는 이 문법으로 2000·2001·2004년 Loebner Prize(대화형 AI 대회)를 세 번 받았다."
      },
      {
        "type": "p",
        "text": "요즘 엔진도 골격은 같다. Rasa는 고정 동작을 rules로, 대화 시나리오를 stories로 나누고 규칙이 스토리보다 우선한다. Dialogflow는 intents·entities·flows로 같은 개념을 부른다. 패턴 매칭의 비용도 알아 둘 일이다 — 패턴을 나열해 순서대로 비교하면 규칙 수에 비례해 느려지지만, 트라이(접두사 나무)로 인덱싱하면 입력 글자 수만큼만 내려간다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "챗봇 규칙을 다루고 있다면 같은 답으로 가는 질문 표현을 세 가지 적어 본다. 셋이 같은 규칙으로 묶이는지 확인하고, 묶이지 않는다면 어느 표현이 새고 있는지 찾는다."
      }
    ],
    "next": "규칙이냐 모델이냐, 실패 비용이 정한다",
    "series": "룰베이스 챗봇"
  },
  {
    "no": 11,
    "date": "2026.08.16",
    "weekday": "일",
    "title": "1966년에도 챗봇이 있었다",
    "dek": "ELIZA는 문장을 이해하지 못했다. 키워드 순위와 재조립 규칙만으로 사람을 상대했다 — 그리고 사람은 속았다.",
    "minutes": 8,
    "tags": [
      "챗봇",
      "역사",
      "NLP"
    ],
    "takeaway": "ELIZA부터 지금까지 룰베이스의 골격은 같다 — 패턴을 찾고, 정해진 틀로 응답을 조립한다.",
    "blocks": [
      {
        "type": "p",
        "text": "규칙으로 답하는 챗봇의 역사는 생각보다 길다. 1964~66년 MIT의 Weizenbaum이 만든 ELIZA는 MAD-SLIP이라는 언어로 짜인 패턴 매칭 프로그램이었다. 가장 유명한 DOCTOR 스크립트는 로저스 심리치료사를 모방해, 상대의 말을 되돌려 주는 데 집중했다."
      },
      {
        "type": "code",
        "language": "text",
        "caption": "DOCTOR 스크립트의 동작 — 분해(decomposition)와 재조립(reassembly)",
        "content": "키워드: \"you are\"   (우선순위 3)\n분해:   (0) you are (1)\n재조립: What makes you think I am (1)?\n\n입력: \"You are very helpful\"\n응답: \"What makes you think I am very helpful?\""
      },
      {
        "type": "p",
        "text": "전체 동작이 이것이다. 입력에서 키워드를 찾아 우선순위(RANK) 순으로 규칙을 고르고, 문장을 조각 내고(분해), 정해진 틀에 끼워 넣는다(재조립). 매칭이 실패하면 \"Please go on\" 같은 무난한 응답을 쓰고, 직전 입력을 아껴 두었다가 꺼내 쓰는 MEMORY 장치도 있었다. 오늘날 규칙 관리 화면의 키워드·우선순위·응답 템플릿과 같은 골격이다."
      },
      {
        "type": "callout",
        "title": "엘리자 효과",
        "tone": "note",
        "text": "단순한 치환임에도 사람은 이해당했다고 느꼈다. Weizenbaum의 비서조차 대화가 끝나면 혼자 있게 해달라고 부탁했다는 일화가 전해진다. 개발자가 가장 경계해야 할 착각도 이것이다 — 데모에서 말이 통하는 것과 업무를 맡길 수 있는 것 사이에는 매우 두터운 벽이 있다."
      },
      {
        "type": "p",
        "text": "1972년에는 정신과 의사 Colby가 편집증 환자를 시뮬레이션한 PARRY를 내놓았다. 검증 실험이 유명하다 — 실제 환자와 PARRY의 대화 전사록을 섞어 33명의 정신과 의사에게 구별하게 했더니 정확도가 48%로, 무작위로 찍는 것과 같았다. 1973년 1월에는 두 프로그램을 ARPANET으로 연결해 대화시키는 시연이 이루어졌는데, 그 대화록이 RFC 439라는 문서로 IETF에 남아 있다."
      },
      {
        "type": "code",
        "language": "text",
        "caption": "PARRY와 DOCTOR의 대화 중 (RFC 439)",
        "content": "PARRY: In my opinion, you have a one-track mind.\nDOCTOR: What makes you think I have a one-track mind?\nPARRY: I used to go to the track every week."
      },
      {
        "type": "p",
        "text": "이후의 이야기도 알아 둘 만하다. 1980년대는 전문가 시스템의 시대였지만 규칙이 수천 개가 되자 서로 충돌하고 유지보수가 불가능해졌고, 그 붕괴가 1980년대 말~1990년대 전반의 제2차 AI 겨울로 이어졌다. 규칙은 죽지 않았다 — 1995년 ALICE와 AIML로 이어지고, 지금 실무에서 관리하는 규칙 화면까지 이어진다. 다만 규칙 수의 관리라는 교훈은 그때 배운 그대로다."
      },
      {
        "type": "link",
        "href": "https://tools.ietf.org/html/rfc439",
        "label": "RFC 439",
        "title": "PARRY Encounters the DOCTOR — 1973년 1월, ARPANET 위의 챗봇 대화 원문"
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "챗봇 규칙을 다루고 있다면 규칙 정의 화면이나 설정 파일을 열어 \"키워드 + 우선순위 + 응답 틀\" 구조가 그대로인지 확인한다. 60년 전 DOCTOR 스크립트와 나란히 놓으면 골격이 거의 같다는 것이 보인다."
      }
    ],
    "next": "챗봇은 문장을 어떻게 쪼개나",
    "series": "룰베이스 챗봇"
  },
  {
    "no": 10,
    "date": "2026.08.15",
    "weekday": "토",
    "title": "룰베이스 챗봇, 7초는 어디서 새는가",
    "dek": "규칙 매칭 자체는 밀리초짜리 일이다. 챗봇이 느리다면 시간은 대부분 매칭 바깥에서 샌다.",
    "minutes": 9,
    "tags": [
      "챗봇",
      "성능",
      "프로파일링"
    ],
    "takeaway": "챗봇이 느릴 때는 규칙 수를 의심하기 전에 연결·쿼리·초기화·네트워크 홉부터 쪼개서 잰다.",
    "blocks": [
      {
        "type": "p",
        "text": "앞 호의 RAG는 문서를 찾아 함께 건네주는 방식으로 LLM의 환각을 줄이는 구조였다. 한편 현장에서 운영되는 챗봇 상당수는 모델이 아니라 규칙으로 답한다. CPU 기반 룰베이스 챗봇이 내부 시스템에 붙는 구조를 상상해 보자. 에이전트 빌더가 워크플로우를 부르고, 워크플로우가 필요할 때 데이터베이스를 부른다. 그런데 한 번의 질문에 7초가 걸린다면, 그 7초는 어디에 살고 있을까."
      },
      {
        "type": "callout",
        "title": "규칙 매칭은 얼마나 걸릴까",
        "tone": "note",
        "text": "인덱싱된 패턴 매칭은 규칙이 수천 개여도 밀리초 단위다. 7초 전부가 매칭에서 나온다면 규칙이 백만 개를 넘는다는 뜻인데, 그런 시스템은 드물다. 시간은 대부분 매칭 바깥 — 연결, 쿼리, 초기화, 네트워크 홉에서 샌다."
      },
      {
        "type": "list",
        "items": [
          "DB — 커넥션 풀 없이 요청마다 새 접속(핸드셰이크만 수백 밀리초), 인덱스 없는 풀스캔, 단계마다 나눠 부르는 N+1 조회, 필요한 컬럼만 있으면 되는데 SELECT *",
          "규칙 엔진 — if-else 순차 매칭(규칙 수에 비례), 형태소 분석기를 요청마다 새로 초기화(매번 수백 밀리초), 나쁜 정규식 하나의 백트래킹(입력 길이에 기하급수), 규칙 파일을 요청마다 디스크에서 다시 읽기",
          "아키텍처 — 에이전트·워크플로우·DB가 각각 다른 서버에서 동기 HTTP로 순차 호출, 대화 세션을 매턴 DB에서 통째로 읽고 쓰기, 감사 로그의 동기 기록(감사 요구가 많은 조직일수록)",
          "네트워크 — 게이트웨이·보안 솔루션을 여러 홉 거치며 홉당 지연이 누적"
        ]
      },
      {
        "type": "flow",
        "caption": "한 번의 호출이 지나는 구간 — 각 구간이 후보다",
        "steps": [
          {
            "label": "사용자",
            "detail": "질문 입력"
          },
          {
            "label": "보안·게이트웨이",
            "detail": "네트워크 홉당 지연"
          },
          {
            "label": "에이전트 빌더",
            "detail": "규칙 로딩·세션 읽기"
          },
          {
            "label": "워크플로우",
            "detail": "형태소 분석기 초기화·정규식"
          },
          {
            "label": "DB",
            "detail": "커넥션·쿼리·N+1"
          },
          {
            "label": "응답 조립",
            "detail": "동기 감사 로그 포함"
          }
        ]
      },
      {
        "type": "callout",
        "title": "먼저 측정, 그다음 고친다",
        "tone": "good",
        "text": "요청 경로에 타임스탬프 로그를 남기면 7초가 어느 구간에서 사라지는지 바로 보인다. 짐작으로 고치는 최적화는 대개 낭비다 — 로그 한 줄이 정확한 범인을 가리킨다."
      },
      {
        "type": "quiz",
        "question": "챗봇이 느릴 때 가장 먼저 해야 할 일은?",
        "options": [
          "규칙 수를 줄인다",
          "구간별 소요 시간을 측정한다",
          "DB 서버를 증설한다",
          "LLM으로 교체한다"
        ],
        "answer": 1,
        "explain": "어디서 시간이 새는지 모른 채 고치면 근거 없는 최적화가 된다. 매칭은 밀리초이고 진짜 범인은 연결·쿼리·초기화일 가능성이 크다 — 측정이 먼저다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "챗봇 요청 경로에 시각이 남는 지점이 있는지 확인한다. 직접 확인할 수 없는 환경이라면 에이전트 진입, 워크플로우 시작, DB 호출 앞뒤, 응답 반환 — 측정할 네 지점을 목록으로 만들어 둔다."
      }
    ],
    "next": "1966년에도 챗봇이 있었다",
    "series": "룰베이스 챗봇"
  },
  {
    "no": 9,
    "date": "2026.08.14",
    "weekday": "금",
    "title": "챗봇이 답하기 전에 먼저 검색하는 이유",
    "dek": "LLM은 정답을 찾아오는 게 아니라 그럴듯한 다음 말을 만들어낸다. 그래서 검색을 먼저 시킨다.",
    "minutes": 9,
    "tags": [
      "RAG",
      "LLM",
      "프롬프트 엔지니어링"
    ],
    "takeaway": "RAG의 핵심은 모델이 답하기 전에 관련 문서를 먼저 찾아 함께 건네주는 것이다.",
    "blocks": [
      {
        "type": "p",
        "text": "이 시리즈는 규칙으로 답하는 챗봇, 룰베이스 챗봇을 다룬다. 첫 호부터 LLM 이야기를 하는 이유는 간단하다 — 챗봇의 답을 어디서 가져올 것인가가 모든 설계의 출발점이고, 지금의 표준 답이 검색을 먼저 하는 RAG이기 때문이다. RAG가 풀려는 문제를 이해하면, 규칙이 오래 풀어 온 문제도 같은 자리에서 보인다."
      },
      {
        "type": "p",
        "text": "LLM은 학습한 내용을 검색해서 답하는 것이 아니라, 지금까지의 문맥을 보고 다음에 올 가장 그럴듯한 토큰을 확률적으로 예측하는 과정을 반복해 문장을 만든다. 그래서 학습 시점 이후의 정보나 특정 기관의 내부 문서처럼 애초에 배운 적 없는 내용도, 모른다고 하지 않고 그럴듯하게 지어내는 경우가 있다."
      },
      {
        "type": "callout",
        "title": "환각이 치명적인 자리",
        "tone": "warn",
        "text": "업무 안내 챗봇에서 이 환각은 단순한 실수가 아니라 잘못된 안내로 이어진다. \"신청 기한은 이번 달 말까지입니다\" 같은 문장을 모델이 지어냈을 때, 사용자는 그것이 지어낸 것인지 알 방법이 없다."
      },
      {
        "type": "p",
        "text": "그래서 답하기 전에 관련 문서를 먼저 찾아 함께 건네주는 방식으로 보완한다. 모델이 아는 척하는 대신, 실제로 준 문서를 근거로 답하게 만드는 것이다."
      },
      {
        "type": "flow",
        "caption": "RAG 파이프라인 여섯 단계 — 앞의 넷은 미리, 뒤의 둘은 매 질문마다",
        "steps": [
          {
            "label": "문서 수집",
            "detail": "업무 매뉴얼 · 규정집 · FAQ 원본"
          },
          {
            "label": "청킹",
            "detail": "긴 문서를 의미 단위로 쪼갠다"
          },
          {
            "label": "임베딩",
            "detail": "각 조각을 숫자 벡터로 변환"
          },
          {
            "label": "벡터DB 저장",
            "detail": "검색 가능한 형태로 보관"
          },
          {
            "label": "검색",
            "detail": "질문도 벡터로 바꿔 가까운 조각을 찾는다"
          },
          {
            "label": "생성",
            "detail": "찾아온 조각을 프롬프트에 넣어 답을 만든다"
          }
        ]
      },
      {
        "type": "p",
        "text": "검색 품질은 결국 문서를 얼마나 잘 쪼갰는지와, 임베딩이 질문의 의도를 얼마나 잘 반영하는지에 좌우된다. 청킹을 문단 단위로 하느냐 문장 단위로 하느냐에 따라 같은 질문에도 다른 조각이 검색된다."
      },
      {
        "type": "list",
        "items": [
          "역할 지정 — \"당신은 ○○ 서비스의 고객 안내 담당자입니다\"처럼 역할을 명확히 준다.",
          "근거 범위 제한 — \"아래 제공된 문서 내용만 근거로 답하라\"고 명시해 환각을 줄인다.",
          "출력 형식 지정 — 답변을 항목별로, 혹은 정해진 형식으로 받도록 지시한다.",
          "모른다고 말할 조건 명시 — 근거 문서에 없으면 \"확인이 필요하다\"고 답하게 한다."
        ]
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "쓰고 있는 프롬프트에 \"근거 문서에 없으면 모른다고 답하라\"는 조건이 있는지 확인한다. 없다면 한 줄 추가해 보고, 답변이 어떻게 달라지는지 비교해 본다."
      }
    ],
    "next": "룰베이스 챗봇, 7초는 어디서 새는가",
    "series": "룰베이스 챗봇"
  },
  {
    "no": 8,
    "date": "2026.08.13",
    "weekday": "목",
    "title": "인덱스는 왜 붙였는데도 느릴까",
    "dek": "인덱스가 있는데도 느린 조회가 있다. 정렬된 나무의 규칙을 어기는 네 가지 모습이 원인을 설명한다.",
    "minutes": 9,
    "tags": [
      "인덱스",
      "성능",
      "SQL"
    ],
    "takeaway": "인덱스는 정렬된 나무다 — 선행 컬럼 규칙과 함수 감싸기 두 가지가 대부분의 인덱스 미탑재를 설명한다.",
    "blocks": [
      {
        "type": "p",
        "text": "인덱스의 표준 구조는 B-tree, 즉 정렬된 나무다. 한 층이 수백 개로 갈라지므로 깊이 3~4면 수억 행도 3~4번 비교로 도달한다. 표 전체 읽기가 행 수에 비례하는 것과 달리 말이다. 그런데 인덱스가 있는데도 느린 조회가 있다 — 데이터베이스가 인덱스를 무시하기 때문이다."
      },
      {
        "type": "table",
        "caption": "인덱스를 못 타는 전형 네 가지",
        "head": [
          "모습",
          "이유",
          "처방"
        ],
        "rows": [
          [
            "WHERE UPPER(col) = …",
            "컬럼을 함수로 감싸면 나무의 원래 값과 어긋난다",
            "함수를 쓰지 않거나 표현식 인덱스"
          ],
          [
            "LIKE '%검색어'",
            "시작이 정해지지 않아 나무를 내려갈 수 없다",
            "접두 검색으로 바꾸거나 전문 검색"
          ],
          [
            "문자열 컬럼에 숫자 비교",
            "묵시적 형변환이 조건 컬럼을 바꿔 버린다",
            "타입을 맞춘다"
          ],
          [
            "조건을 OR로 나열",
            "하나의 나무는 AND 조건만 이어 받는다",
            "IN이나 UNION으로 분해"
          ]
        ]
      },
      {
        "type": "p",
        "text": "복합 인덱스의 순서 규칙도 같은 맥락이다. (부서코드, 등록일) 순으로 만들었다면 부서코드 조건이 있을 때 가장 효율적이다. 나무가 부서코드 우선으로 정렬되어 있으므로, 부서코드 없이 등록일만으로는 시작점을 못 정한다. 관행은 등가(=) 조건 컬럼을 앞에, 범위 조건 컬럼을 뒤에 두는 것이다."
      },
      {
        "type": "code",
        "language": "sql",
        "caption": "의심스러운 조회의 진단",
        "content": "EXPLAIN ANALYZE\nSELECT *\nFROM tb_user\nWHERE UPPER(user_id) = 'USER01'\n  AND status_cd = 'P';"
      },
      {
        "type": "p",
        "text": "실행 계획(EXPLAIN)을 읽으면 데이터베이스가 무엇을 했는지 드러난다. PostgreSQL의 Seq Scan과 Oracle의 TABLE ACCESS FULL은 표 전체 읽기다. Index Scan, Bitmap Heap Scan, INDEX RANGE SCAN은 인덱스를 쓴 읽기다. 여기서 가장 중요한 단서는 예상 행 수와 실제 행 수의 어긋남이다 — 통계가 오래되면 최적화기는 헛걸음을 한다."
      },
      {
        "type": "p",
        "text": "또 하나의 함정은 선택도다. 성별·상태코드처럼 값 종류가 몇 개 안 되는 컬럼은 조건을 걸어도 행의 몇십 퍼센트가 남는다. 이만큼을 인덱스로 건너뛰며 읽는 것보다 표를 순서대로 읽는 편이 빠르므로, 데이터베이스는 인덱스를 정당하게 무시한다. 인덱스가 늦가 아니라 조건이 좁아야 이기는 게임이다."
      },
      {
        "type": "link",
        "href": "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing",
        "label": "HikariCP",
        "title": "About Pool Sizing — 풀 크기의 기준값과 근거"
      },
      {
        "type": "quiz",
        "question": "(dept_cd, reg_dt) 복합 인덱스가 있을 때 reg_dt 조건만으로 조회하면?",
        "options": [
          "두 컬럼이 모두 인덱스에 있으므로 효율적으로 탄다",
          "선행 컬럼 조건이 없어 시작점을 못 정해 비효율적이다",
          "등록일이 뒤에 있으므로 항상 최선이다",
          "인덱스 개수가 두 배가 된다"
        ],
        "answer": 1,
        "explain": "복합 인덱스는 선행 컬럼 우선으로 정렬되어 있다. 뒤 컬럼만으로는 나무의 시작점을 정할 수 없다. 이 순서가 맞다면 dept_cd를 포함하거나 reg_dt 단독 인덱스를 검토한다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "목록 화면의 조회 SQL과 인덱스 컬럼을 나란히 놓고 대조한다. 조건의 순서, 함수로 감싼 컬럼, 타입 불일치 — 세 가지 중 하나는 바로 보인다."
      }
    ],
    "next": "챗봇이 답하기 전에 먼저 검색하는 이유",
    "series": "레거시 코드 읽기"
  },
  {
    "no": 7,
    "date": "2026.08.12",
    "weekday": "수",
    "title": "SI 프로젝트가 이 순서로 가는 이유",
    "dek": "코드보다 문서가 먼저 확정되는 게 이상해 보였다면, 계약 방식을 보면 이해가 된다.",
    "minutes": 9,
    "tags": [
      "폭포수 모델",
      "마르미-III",
      "WBS",
      "ERD"
    ],
    "takeaway": "계약은 산출물 단위로 검수되기 때문에, 코드보다 문서가 먼저 확정된다.",
    "blocks": [
      {
        "type": "p",
        "text": "발주자와 수주자의 계약으로 도는 프로젝트 — 공공 SI가 대표적이다 — 는 계약금이 산출물 검수를 기준으로 지급된다. 그래서 \"일단 만들어보고 고치자\"는 접근보다 요구사항을 먼저 문서로 확정하고 설계하고 구현하고 검증하는 순서가 표준으로 자리 잡았다."
      },
      {
        "type": "callout",
        "title": "장점과 대가",
        "text": "각 단계가 끝날 때마다 산출물을 제출하고 확인받아야 다음으로 넘어갈 수 있어 책임 소재가 명확하다. 대신 초반에 빠뜨린 요구사항을 뒤에서 바로잡기 어렵다. 그래서 요구사항 분석과 설계 문서 작성이 전체에서 가장 공들여야 하는 구간으로 여겨진다."
      },
      {
        "type": "p",
        "text": "마르미-III는 한국 공공 SI가 쓰는 표준 방법론으로, 분석부터 전개까지 각 단계에서 무엇을 제출해야 하는지 정해 둔다. 발주기관이 다른 업체가 수행한 사업이라도 같은 틀로 검수할 수 있는 것이 목적이다."
      },
      {
        "type": "table",
        "caption": "마르미-III 단계별 대표 산출물",
        "head": [
          "단계",
          "산출물"
        ],
        "rows": [
          [
            "분석",
            "요구사항정의서, 요구사항추적표"
          ],
          [
            "설계",
            "화면설계서, 테이블정의서(ERD 포함), 인터페이스정의서"
          ],
          [
            "구현",
            "프로그램목록, 단위시험결과서"
          ],
          [
            "시험",
            "통합시험계획서/결과서, 사용자매뉴얼"
          ]
        ]
      },
      {
        "type": "p",
        "text": "설계 단계의 WBS는 전체 작업을 더 작은 단위로 쪼개 계층으로 정리한 표다. 무슨 작업을 누가 언제까지 할지를 한눈에 보이게 만드는 것이 목적이며, 이후 일정 관리와 진척률 보고의 기준이 된다. ERD는 테이블 사이의 관계를 그림으로, 테이블명세서는 컬럼·타입·제약조건까지 표로 정리한다 — 이 둘이 구현 단계에서 실제로 짤 쿼리의 설계도가 된다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "지금 맡은 업무의 요구사항정의서나 화면설계서를 한 번 열어 본다. 코드를 보기 전에 이 문서가 먼저 확정되어 있었다는 사실만 확인해도, 왜 이렇게 만들어졌는지가 다르게 읽힌다."
      }
    ],
    "next": "인덱스는 왜 붙였는데도 느릴까",
    "series": "레거시 코드 읽기"
  },
  {
    "no": 6,
    "date": "2026.08.11",
    "weekday": "화",
    "title": "@Transactional인데 왜 롤백이 안 될까",
    "dek": "선언은 되어 있는데 실제로는 풀려 있는 트랜잭션. 원인은 대부분 두 가지 중 하나다.",
    "minutes": 8,
    "tags": [
      "@Transactional",
      "AOP",
      "프록시"
    ],
    "takeaway": "@Transactional은 선언일 뿐이다 — 예외를 잡아 삼키거나 자기 자신을 직접 부르면 롤백은 일어나지 않는다.",
    "blocks": [
      {
        "type": "p",
        "text": "Service는 업무 규칙을, Mapper는 SQL 실행을 맡는다. Controller가 곧바로 Mapper로 가지 않고 Service를 거치게 두는 이유는 이 둘을 분리하기 위해서다. Service가 얇아 보여도, 권한 확인이나 여러 DAO 호출을 묶는 자리, 그리고 트랜잭션 경계가 여기에 온다."
      },
      {
        "type": "code",
        "language": "java",
        "caption": "Service와 Mapper를 잇는 전형적인 구현",
        "content": "@Service(\"noticeService\")\npublic class NoticeServiceImpl implements NoticeService {\n\n  @Resource(name = \"noticeMapper\")\n  private NoticeMapper noticeMapper;\n\n  @Transactional\n  public void registerNotice(NoticeVO notice) {\n    noticeMapper.insertNotice(notice);\n    // 이어지는 DB 작업 중 하나라도 실패하면 함께 되돌려야 한다.\n  }\n}"
      },
      {
        "type": "p",
        "text": "그런데 @Transactional은 코드가 아니라 선언이다. 실제 커밋과 롤백은 프록시가 대신 수행하는데, 프록시를 거치지 않거나 프록시가 롤백 신호를 받지 못하면 어노테이션은 붙어 있어도 아무 일도 하지 않는다."
      },
      {
        "type": "list",
        "items": [
          "예외를 잡아 삼킨다 — catch로 로그만 남기고 정상 종료하면, 프록시는 문제없이 끝난 것으로 보고 커밋한다.",
          "자기 자신을 직접 부른다 — 같은 클래스 안에서 this.메서드()로 호출하면 프록시를 거치지 않아 트랜잭션이 적용되지 않는다."
        ]
      },
      {
        "type": "quiz",
        "question": "반복문 안에서 this.insertBoardArticle(vo)를 100번 호출하다 50번째에서 DB 오류가 났다. insertBoardArticle에 @Transactional이 붙어 있어도 예외를 잡아 로그만 남긴다면?",
        "options": [
          "100건 모두 롤백된다",
          "49건까지만 저장되고 멈춘다",
          "50건이 저장된 채 나머지도 계속 처리된다",
          "트랜잭션이 없으므로 아무것도 저장되지 않는다"
        ],
        "answer": 2,
        "explain": "self-invocation이라 트랜잭션 경계가 없고, 예외를 잡아 로그만 남기므로 반복문도 멈추지 않는다. 실패한 건만 빠진 채 나머지가 그대로 저장된다 — 가장 늦게 발견되는 형태의 데이터 불일치다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "Service 클래스에서 @Transactional이 붙은 메서드를 하나 고른다. 안에서 예외를 잡아 삼키지 않는지, 같은 클래스 안의 다른 메서드를 this로 부르고 있지 않은지 확인한다."
      }
    ],
    "next": "SI 프로젝트가 이 순서로 가는 이유",
    "series": "레거시 코드 읽기"
  },
  {
    "no": 5,
    "date": "2026.08.10",
    "weekday": "월",
    "title": "# 은 자리를 가리킨다",
    "dek": "화면 어딘가에 내용이 새로 그려진다면 그 자리에는 id가 붙어 있다. 그리고 서버로 가는 이름은 따로 있다.",
    "minutes": 9,
    "tags": [
      "id",
      "name",
      "jQuery",
      "DOM"
    ],
    "takeaway": "id 속성은 브라우저가 찾는 이름, name 속성은 서버가 받는 이름이다.",
    "blocks": [
      {
        "type": "p",
        "text": "코드를 읽다 보면 기호에서 먼저 막힌다. @ 는 대체로 \"이건 실행되는 코드가 아니라 프레임워크에게 주는 지시\"라는 표시라 정리가 쉬운 편이다. 어려운 쪽은 # 인데, 화면과 SQL에서 완전히 다른 일을 하기 때문이다."
      },
      {
        "type": "p",
        "text": "화면 쪽에서 # 은 언제나 하나를 가리킨다 — id 속성이다. HTML에서 어떤 자리에 이름표를 붙여 두면, CSS는 #이름 으로 그 자리만 꾸미고 JavaScript는 같은 문법으로 그 자리를 찾아 내용을 바꾼다. 이름표를 붙일 때는 # 을 쓰지 않고, 부를 때만 붙인다는 점이 헷갈리는 지점이다."
      },
      {
        "type": "code",
        "language": "html",
        "caption": "이름표를 붙이는 쪽과 부르는 쪽",
        "content": "<!-- 붙일 때: # 없음 -->\n<div id=\"listArea\"></div>\n\n/* 부를 때: CSS */\n#listArea { min-height: 200px; }\n\n// 부를 때: JavaScript\n$(\"#listArea\").html(data);\ndocument.getElementById(\"listArea\");"
      },
      {
        "type": "callout",
        "title": "특정 위치에 내용이 들어간다는 말의 정체",
        "text": "빈 div 를 자리로 만들어 두고, 스크립트가 그 이름을 찾아 안쪽을 서버가 보낸 HTML로 통째로 교체하는 것이다. 페이지는 새로 고쳐지지 않고 그 자리만 바뀐다. 레거시 화면에서 목록만 갱신되는 구조는 거의 전부 이것이다."
      },
      {
        "type": "p",
        "text": "여기까지는 화면 안의 이야기다. 그런데 입력칸을 보면 id 속성 옆에 name 속성이 같은 값으로 나란히 붙어 있다. 중복처럼 보이지만 둘은 서로 다른 방향을 향한다. id는 브라우저 안에서만 쓰이고, 서버까지 가는 것은 name뿐이다."
      },
      {
        "type": "flow",
        "caption": "검색어 한 글자가 지나가는 두 갈래",
        "steps": [
          {
            "label": "입력칸",
            "detail": "id=\"searchKeyword\" name=\"searchKeyword\""
          },
          {
            "label": "id 쪽",
            "detail": "$(\"#searchKeyword\") — 화면이 값을 읽고 쓴다"
          },
          {
            "label": "name 쪽",
            "detail": "form 전송 · serialize() 가 이 이름으로 싣는다"
          },
          {
            "label": "Controller",
            "detail": "@ModelAttribute 가 name 기준으로 VO를 채운다"
          },
          {
            "label": "Mapper",
            "detail": "#{searchKeyword} — 여기의 # 은 전혀 다른 뜻"
          }
        ]
      },
      {
        "type": "quiz",
        "question": "입력칸에 id만 있고 name이 없다. 화면에서 타이핑은 되는데 검색이 걸러지지 않는다. 서버는 이 값을 받았을까?",
        "options": [
          "받았다. id로도 전송된다",
          "받지 못했다. 전송 대상은 name이 붙은 것뿐이다",
          "받았지만 VO 필드가 없어 버려졌다",
          "브라우저 설정에 따라 다르다"
        ],
        "answer": 1,
        "explain": "form 전송도 jQuery의 serialize() 도 name을 기준으로 값을 모은다. name이 없으면 그 입력칸은 아예 포함되지 않는다. 서버는 받은 적이 없으므로 오류도 나지 않고, 로그에도 흔적이 없다 — 그래서 원인 찾기가 오래 걸린다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "JSP를 열고 두 목록을 만들어 본다. 하나는 name이 붙은 입력칸 전부 — 이것이 서버로 가는 전부다. 다른 하나는 스크립트 안의 $(\"#…\") 전부 — 이것이 화면이 건드리는 자리다. 두 목록을 나란히 놓으면 그 화면이 무엇을 보내고 무엇을 바꾸는지가 정리된다."
      }
    ],
    "next": "@Transactional인데 왜 롤백이 안 될까",
    "series": "레거시 코드 읽기"
  },
  {
    "no": 4,
    "date": "2026.08.09",
    "weekday": "일",
    "title": "설정이 코드를 부른다",
    "dek": "호출문이 없는데 실행되는 코드의 출처는 언제나 설정 파일이다. web.xml부터 순서대로 읽는다.",
    "minutes": 9,
    "tags": [
      "web.xml",
      "context-*.xml",
      "DispatcherServlet"
    ],
    "takeaway": "코드에 없는 동작을 만나면 어노테이션이 아니라 XML을 먼저 연다.",
    "blocks": [
      {
        "type": "p",
        "text": "Java 파일만 읽으면 이해되지 않는 일이 계속 생긴다. 아무도 부르지 않은 Controller가 실행되고, new 하지 않은 Service가 필드에 들어와 있고, 반환한 문자열이 파일을 찾아낸다. 이 셋의 출처는 모두 설정이다. 레거시 Spring 프로젝트는 설정을 어노테이션보다 XML에 더 많이 담는다."
      },
      {
        "type": "p",
        "text": "순서가 있다. 서버가 애플리케이션을 띄울 때 가장 먼저 읽는 파일이 web.xml이고, 그 안에서 나머지 설정 파일의 위치가 지정된다. 그래서 낯선 프로젝트를 열 때도 이 파일부터 읽으면 지도를 손에 쥔 채 시작할 수 있다."
      },
      {
        "type": "code",
        "language": "xml",
        "caption": "web.xml — 애플리케이션이 켜지는 순서",
        "content": "<context-param>\n    <param-name>contextConfigLocation</param-name>\n    <param-value>classpath*:config/spring/context-*.xml</param-value>\n</context-param>\n\n<listener>\n    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>\n</listener>\n\n<filter>\n    <filter-name>encodingFilter</filter-name>\n    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>\n    <init-param>\n        <param-name>encoding</param-name>\n        <param-value>UTF-8</param-value>\n    </init-param>\n</filter>\n\n<servlet>\n    <servlet-name>action</servlet-name>\n    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>\n    <load-on-startup>1</load-on-startup>\n</servlet>\n\n<servlet-mapping>\n    <servlet-name>action</servlet-name>\n    <url-pattern>*.do</url-pattern>\n</servlet-mapping>",
      },
      {
        "type": "table",
        "caption": "줄별 읽는 포인트",
        "head": ["줄", "무엇을 보나"],
        "rows": [
          [
            "1-4",
            "설정의 목차. contextConfigLocation이 가리키는 경로 아래 XML들이 애플리케이션 전체의 빈 설정이다. classpath*: 는 여러 jar와 소스 경로를 모두 훑으라는 뜻이고, context-*.xml 은 그 이름으로 시작하는 파일을 전부 읽으라는 뜻이다. 새 설정 파일이 반영되지 않으면 이름 규칙부터 확인한다."
          ],
          [
            "6-8",
            "ContextLoaderListener가 서버 기동 시 위 경로의 XML을 읽어 Spring 컨테이너를 만든다. 이때 component-scan이 돌며 @Service, @Repository가 빈으로 등록된다. 기동 시점 오류의 상당수가 여기서 난다."
          ],
          [
            "10-17",
            "필터는 서블릿보다 먼저 실행된다. CharacterEncodingFilter가 요청 본문을 UTF-8로 해석한다. POST 한글이 물음표로 저장되면 이 설정이 빠졌거나 DB 인코딩과 어긋난 경우다."
          ],
          [
            "19-23",
            "load-on-startup 1은 첫 요청을 기다리지 않고 서버가 켜질 때 초기화하라는 뜻이다. 이때 servlet-name과 같은 이름의 XML — action-servlet.xml — 을 화면 설정으로 함께 읽는다. ViewResolver를 찾을 때의 단서다."
          ],
          [
            "25-28",
            "*.do 매핑. .do로 끝나는 모든 요청이 DispatcherServlet으로 간다. 서버에 list.do라는 파일은 존재하지 않는다. .do는 \"여기부터 Spring이 처리한다\"는 신호로 읽는다."
          ]
        ]
      },
      {
        "type": "flow",
        "caption": "서버가 켜질 때 일어나는 일 — 요청이 오기 전에 이미 끝나 있다",
        "steps": [
          {
            "label": "web.xml 읽기",
            "detail": "리스너 · 필터 · 서블릿 등록"
          },
          {
            "label": "context-*.xml 로드",
            "detail": "component-scan · DataSource · 트랜잭션"
          },
          {
            "label": "빈 생성과 주입",
            "detail": "@Service · @Repository가 컨테이너에 들어감"
          },
          {
            "label": "action-servlet.xml 로드",
            "detail": "ViewResolver · 인터셉터 · 매핑 수집"
          },
          {
            "label": "요청 대기",
            "detail": "이제 .do 요청을 받을 준비 완료"
          }
        ]
      },
      {
        "type": "quiz",
        "question": "새로 만든 @Service 클래스가 주입되지 않아 NoSuchBeanDefinitionException이 났다. 가장 먼저 확인할 곳은?",
        "options": [
          "dispatcher-servlet.xml의 ViewResolver prefix",
          "context-*.xml의 component-scan base-package 범위",
          "web.xml의 url-pattern",
          "pom.xml의 Java 버전"
        ],
        "answer": 1,
        "explain": "빈이 아예 등록되지 않았다는 뜻이므로 스캔 범위 밖에 클래스를 만든 경우가 압도적으로 많다. 어노테이션을 아무리 정확히 붙여도 스캔하지 않는 패키지에 있으면 컨테이너는 그 클래스의 존재를 모른다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "web.xml을 열어 contextConfigLocation 경로를 확인하고, 그 폴더에 실제로 어떤 XML이 몇 개 있는지 세어 본다. 파일 이름만 훑어도 이 시스템이 무엇을 쓰는지 절반은 보인다."
      }
    ],
    "next": "# 은 자리를 가리킨다",
    "series": "레거시 코드 읽기"
  },
  {
    "no": 3,
    "date": "2026.08.08",
    "weekday": "토",
    "title": "한 글자 차이, #{ }와 ${ }",
    "dek": "MyBatis에서 값이 들어가는 자리와 문장이 들어가는 자리. 이 구분이 곧 보안 점검 항목이다.",
    "minutes": 8,
    "tags": [
      "MyBatis",
      "SQL 인젝션",
      "Mapper XML"
    ],
    "takeaway": "#{ }는 값, ${ }는 문장. 값 자리에 ${ }가 보이면 그 줄이 취약점이다.",
    "blocks": [
      {
        "type": "p",
        "text": "SQL을 XML에 적어 두는 방식은 처음 보면 번거롭지만, 익숙해지면 복잡한 조회를 다루기에 좋다. 문제는 값을 넣는 문법이 두 가지고 생김새가 거의 같다는 것이다. 하나는 안전하고 하나는 위험한데, 오타처럼 보이기 때문에 리뷰에서 놓치기 쉽다."
      },
      {
        "type": "table",
        "caption": "같아 보이지만 완전히 다른 두 문법",
        "head": [
          "",
          "#{ }",
          "${ }"
        ],
        "rows": [
          [
            "들어가는 방식",
            "자리표시자로 바인딩",
            "문자열을 그대로 치환"
          ],
          [
            "SQL 구조 변경",
            "불가능 — 항상 값 하나",
            "가능 — 문장 자체가 바뀜"
          ],
          [
            "따옴표 처리",
            "MyBatis가 알아서",
            "직접 붙여야 함"
          ],
          [
            "쓰는 자리",
            "검색어 · ID · 개수 등 모든 값",
            "컬럼명 · 정렬 방향 · 테이블명"
          ],
          [
            "검증 책임",
            "프레임워크",
            "개발자 — 허용 목록 대조 필수"
          ]
        ]
      },
      {
        "type": "code",
        "language": "sql",
        "caption": "searchKeyword 에 ' OR '1'='1 을 넣었을 때 실제로 실행되는 문장",
        "content": "-- #{searchKeyword} 인 경우 : 값으로 들어간다\nSELECT * FROM BOARD_POST WHERE TITLE LIKE ?\n   -- 바인딩된 값: %' OR '1'='1%   → 그냥 이상한 검색어일 뿐\n\n-- ${searchKeyword} 인 경우 : 문장이 된다\nSELECT * FROM BOARD_POST WHERE TITLE LIKE '%' OR '1'='1%'\n   -- WHERE 조건이 항상 참 → 전체 행이 그대로 노출된다"
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "tone": "warn",
        "text": "Mapper XML에서 ${ } 를 전부 검색해 본다. 컬럼명이나 정렬 방향이 아닌 자리에 있다면 메모해 둔다. 바로 고치지 않아도 좋다 — 어디에 무엇이 있는지 아는 것이 먼저다."
      }
    ],
    "next": "설정이 코드를 부른다",
    "series": "레거시 코드 읽기"
  },
  {
    "no": 2,
    "date": "2026.08.07",
    "weekday": "금",
    "title": "Model의 이름은 화면까지 살아남는다",
    "dek": "Controller가 붙인 이름이 JSP의 ${...}로 그대로 다시 나온다. 서버와 화면을 잇는 단 하나의 끈.",
    "minutes": 7,
    "tags": [
      "EL",
      "JSTL",
      "Model",
      "JSP"
    ],
    "takeaway": "화면에서 막히면 ${이름}을 그대로 들고 서버 코드를 전역 검색한다.",
    "blocks": [
      {
        "type": "p",
        "text": "서버가 만든 데이터가 어떻게 화면까지 가는지는 사실 단순하다. Controller가 바구니에 이름을 붙여 담고, JSP가 그 이름으로 꺼낸다. 중간에 이름이 바뀌는 일은 없다. 이 점 때문에 화면에서 서버로 거슬러 올라가는 추적이 아주 정확하게 통한다."
      },
      {
        "type": "flow",
        "caption": "이름 하나가 지나가는 길",
        "steps": [
          {
            "label": "SQL",
            "detail": "SELECT NTT_SJ ..."
          },
          {
            "label": "Mapper",
            "detail": "resultType으로 객체에 담김"
          },
          {
            "label": "Service",
            "detail": "List<BoardVO> 반환"
          },
          {
            "label": "Controller",
            "detail": "addAttribute(\"resultList\", list)"
          },
          {
            "label": "JSP",
            "detail": "${resultList} 로 다시 등장"
          }
        ]
      },
      {
        "type": "p",
        "text": "주의할 점이 하나 있다. EL은 없는 이름을 만나도 오류를 내지 않는다. 조용히 빈 값을 출력하고 지나간다. 그래서 화면이 비어 있는데 로그에는 아무것도 없는 상황이 흔하다. 이럴 때는 예외를 찾지 말고 이름 철자를 대조한다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "화면의 JSP에서 ${...} 를 하나 골라, 그 이름을 그대로 전역 검색해 Controller의 addAttribute를 찾아본다. 한 번만 성공하면 이 방법은 평생 쓴다."
      }
    ],
    "next": "한 글자 차이, #{ }와 ${ }",
    "series": "레거시 코드 읽기"
  },
  {
    "no": 1,
    "date": "2026.08.06",
    "weekday": "목",
    "title": "요청 하나가 화면이 되기까지",
    "dek": "레거시 Spring 프로젝트에 투입됐다면 파일 목록부터 열어 보고 싶어진다. 그 길은 거의 항상 막다른 길이다.",
    "minutes": 8,
    "tags": [
      "Spring MVC",
      "DispatcherServlet",
      "코드 읽기"
    ],
    "takeaway": "레거시는 위에서 아래로 읽는 것이 아니라, 요청 하나를 따라 옆으로 읽는다.",
    "blocks": [
      {
        "type": "p",
        "text": "레거시 저장소를 처음 받았을 때 흔히 하는 일이 폴더를 하나씩 열어 보는 것이다. 그러면 반드시 길을 잃는다. 파일 수백 개는 서로 비슷하게 생겼고, 어떤 것이 중요한지 알려 주는 표시가 없기 때문이다."
      },
      {
        "type": "p",
        "text": "대신 화면 하나를 정한다. 목록 화면이면 충분하다. 그 화면의 주소를 손에 쥐고, URL에서 시작해 JSP에서 끝나는 한 바퀴를 돈다. 한 바퀴가 이해되면 나머지 화면은 전부 같은 지도 위에 놓이게 된다. 이것이 레거시를 읽는 유일하게 확실한 방법이다."
      },
      {
        "type": "flow",
        "caption": "Spring MVC 요청 한 바퀴",
        "steps": [
          {
            "label": "브라우저",
            "detail": "GET /bbs/selectBoardList.do"
          },
          {
            "label": "DispatcherServlet",
            "detail": "모든 .do 요청의 현관"
          },
          {
            "label": "HandlerMapping",
            "detail": "이 URL의 담당 메서드를 찾는다"
          },
          {
            "label": "Controller",
            "detail": "요청 파라미터를 VO로 받는다"
          },
          {
            "label": "Service",
            "detail": "업무 규칙과 트랜잭션 경계"
          },
          {
            "label": "Mapper",
            "detail": "XML에 적힌 SQL 실행"
          },
          {
            "label": "Model",
            "detail": "결과에 이름을 붙여 담는다"
          },
          {
            "label": "ViewResolver",
            "detail": "뷰 이름 → JSP 경로"
          },
          {
            "label": "JSP",
            "detail": "HTML로 완성되어 브라우저로"
          }
        ]
      },
      {
        "type": "callout",
        "title": "자동으로 호출되는 것처럼 보이는 이유",
        "text": "코드 어디에도 Controller를 부르는 문장이 없다. 그런데 실행된다. web.xml이 모든 .do 요청을 DispatcherServlet에 넘기도록 등록해 두었고, 그 서블릿이 @RequestMapping 문자열을 모아 만든 표에서 담당 메서드를 찾기 때문이다. 마법이 아니라 설정의 결과다."
      },
      {
        "type": "callout",
        "title": "오늘 해 볼 것",
        "text": "레거시 화면 하나를 아무거나 골라 주소를 복사해 둔다. 그 문자열이 내일까지의 유일한 숙제다."
      }
    ],
    "next": "Model의 이름은 화면까지 살아남는다",
    "series": "레거시 코드 읽기"
  }
];
