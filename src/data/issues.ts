import type { Block } from "./blocks";

/**
 * 데일리 이슈 = 출근길 한 편.
 * 새 호를 쓸 때는 이 배열 맨 앞에 객체 하나를 추가하면 끝이다.
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
};

export const issues: Issue[] = [
  {
    no: 10,
    date: "2026.09.14",
    weekday: "월",
    title: "챗봇이 답하기 전에 먼저 검색하는 이유",
    dek: "LLM은 정답을 찾아오는 게 아니라 그럴듯한 다음 말을 만들어낸다. 그래서 검색을 먼저 시킨다.",
    minutes: 9,
    tags: ["RAG", "LLM", "프롬프트 엔지니어링"],
    takeaway: "RAG의 핵심은 모델이 답하기 전에 관련 문서를 먼저 찾아 함께 건네주는 것이다.",
    blocks: [
      {
        type: "p",
        text: "LLM은 학습한 내용을 검색해서 답하는 것이 아니라, 지금까지의 문맥을 보고 다음에 올 가장 그럴듯한 토큰을 확률적으로 예측하는 과정을 반복해 문장을 만든다. 그래서 학습 시점 이후의 정보나 특정 기관의 내부 문서처럼 애초에 배운 적 없는 내용도, 모른다고 하지 않고 그럴듯하게 지어내는 경우가 있다.",
      },
      {
        type: "callout",
        title: "환각이 치명적인 자리",
        tone: "warn",
        text: "공공기관 업무 안내 챗봇에서 이 환각은 단순한 실수가 아니라 잘못된 안내로 이어진다. \"신청 기한은 이번 달 말까지입니다\" 같은 문장을 모델이 지어냈을 때, 사용자는 그것이 지어낸 것인지 알 방법이 없다.",
      },
      {
        type: "p",
        text: "그래서 답하기 전에 관련 문서를 먼저 찾아 함께 건네주는 방식으로 보완한다. 모델이 아는 척하는 대신, 실제로 준 문서를 근거로 답하게 만드는 것이다.",
      },
      {
        type: "flow",
        caption: "RAG 파이프라인 여섯 단계 — 앞의 넷은 미리, 뒤의 둘은 매 질문마다",
        steps: [
          { label: "문서 수집", detail: "업무 매뉴얼 · 규정집 · FAQ 원본" },
          { label: "청킹", detail: "긴 문서를 의미 단위로 쪼갠다" },
          { label: "임베딩", detail: "각 조각을 숫자 벡터로 변환" },
          { label: "벡터DB 저장", detail: "검색 가능한 형태로 보관" },
          { label: "검색", detail: "질문도 벡터로 바꿔 가까운 조각을 찾는다" },
          { label: "생성", detail: "찾아온 조각을 프롬프트에 넣어 답을 만든다" },
        ],
      },
      {
        type: "p",
        text: "검색 품질은 결국 문서를 얼마나 잘 쪼갰는지와, 임베딩이 질문의 의도를 얼마나 잘 반영하는지에 좌우된다. 청킹을 문단 단위로 하느냐 문장 단위로 하느냐에 따라 같은 질문에도 다른 조각이 검색된다.",
      },
      {
        type: "list",
        items: [
          "역할 지정 — \"당신은 ○○ 기관의 민원 안내 담당자입니다\"처럼 역할을 명확히 준다.",
          "근거 범위 제한 — \"아래 제공된 문서 내용만 근거로 답하라\"고 명시해 환각을 줄인다.",
          "출력 형식 지정 — 답변을 항목별로, 혹은 정해진 형식으로 받도록 지시한다.",
          "모른다고 말할 조건 명시 — 근거 문서에 없으면 \"확인이 필요하다\"고 답하게 한다.",
        ],
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["hallucination", "rag", "vector-db", "token", "prompt-engineering"],
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "지금 쓰는 프롬프트에 \"근거 문서에 없으면 모른다고 답하라\"는 조건이 있는지 확인한다. 없다면 한 줄 추가해 보고, 답변이 어떻게 달라지는지 본다.",
      },
    ],
  },

  {
    no: 9,
    date: "2026.09.11",
    weekday: "금",
    title: "리뷰받고 버그를 남기는 법",
    dek: "구현이 끝난 뒤에도 품질은 저절로 지켜지지 않는다. 테스트·리뷰·버그 기록에는 각자 정해진 모양이 있다.",
    minutes: 8,
    tags: ["단위 테스트", "코드 리뷰", "버그 트래킹"],
    takeaway: "좋은 버그 리포트는 재현 절차·기대 결과·실제 결과·우선순위 네 가지를 갖춘다.",
    next: "챗봇이 답하기 전에 먼저 검색하는 이유",
    blocks: [
      {
        type: "p",
        text: "구현 단계에서는 테스트와 리뷰로, 통합 단계에서는 버그 기록과 Gap 분석으로 품질을 지킨다. 넷 다 형식이 있는데, 형식을 따르는 이유는 나중에 같은 문제를 두 번 겪지 않기 위해서다.",
      },
      {
        type: "list",
        items: [
          "Given — 테스트를 위한 조건·입력값을 준비한다.",
          "When — 테스트 대상 기능을 실행한다.",
          "Then — 실행 결과가 기대값과 같은지 확인(assert)한다.",
        ],
      },
      {
        type: "p",
        text: "단위 테스트를 미리 짜두면, 뒤에서 코드를 수정했을 때 기존 기능이 깨졌는지 바로 확인할 수 있어 이후 통합 테스트의 부담이 줄어든다.",
      },
      {
        type: "callout",
        title: "코드 리뷰를 받을 때",
        text: "코드만 보내지 말고 무엇을·왜 바꿨는지 짧게 덧붙인다. 지적은 코드에 대한 것이지 사람에 대한 것이 아니라고 받아들인다. 이해가 안 되는 지적은 그 자리에서 질문한다 — 넘겨짚고 고치지 않는다. 같은 지적을 두 번 받지 않도록 메모해 둔다.",
      },
      {
        type: "list",
        items: [
          "재현 절차 — 어떤 순서로 조작하면 문제가 발생하는지",
          "기대 결과 — 원래 어떻게 동작해야 하는지",
          "실제 결과 — 실제로 어떻게 동작했는지 (스크린샷·로그 첨부)",
          "우선순위 — 서비스에 미치는 영향 정도",
        ],
      },
      {
        type: "p",
        text: "네 가지 중 하나라도 빠지면 리포트를 받은 사람이 다시 물어야 한다. 재현 절차 없이 \"안 됩니다\"라고만 남기면, 담당자가 처음부터 원인을 추적해야 한다.",
      },
      {
        type: "quiz",
        question: "요구사항정의서와 실제 완성된 결과물을 나란히 놓고 빠지거나 다르게 구현된 부분을 찾는 작업을 무엇이라 하는가?",
        options: ["단위 테스트", "코드 리뷰", "Gap 분석", "버그 트래킹"],
        answer: 2,
        explain: "Gap 분석은 기준선(요구사항정의서)과 결과물 사이의 차이를 찾는 작업이다. 찾아낸 차이는 재구현하거나, 발주기관과 협의해 범위를 조정하는 방식으로 보완한다.",
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["unit-test", "integration-test", "gap-analysis"],
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "리뷰 코멘트를 하나 받으면 \"무엇을, 왜 바꿨는지\" 한 줄을 남겨 본다. 또는 눈에 띈 버그 하나를 재현 절차·기대 결과·실제 결과·우선순위 네 줄로 적어 본다.",
      },
    ],
  },

  {
    no: 8,
    date: "2026.09.10",
    weekday: "목",
    title: "SI 프로젝트가 이 순서로 가는 이유",
    dek: "코드보다 문서가 먼저 확정되는 게 이상해 보였다면, 계약 방식을 보면 이해가 된다.",
    minutes: 9,
    tags: ["폭포수 모델", "마르미-III", "WBS", "ERD"],
    takeaway: "계약은 산출물 단위로 검수되기 때문에, 코드보다 문서가 먼저 확정된다.",
    next: "리뷰받고 버그를 남기는 법",
    blocks: [
      {
        type: "p",
        text: "공공기관 SI 프로젝트는 대부분 발주자와 수주자 사이의 계약 관계로 진행된다. 계약금이 산출물 검수를 기준으로 지급되기 때문에, \"일단 만들어보고 고치자\"는 접근보다 요구사항을 먼저 문서로 확정하고 설계하고 구현하고 검증하는 순서가 표준으로 자리 잡았다.",
      },
      {
        type: "callout",
        title: "장점과 대가",
        text: "각 단계가 끝날 때마다 산출물을 제출하고 확인받아야 다음으로 넘어갈 수 있어 책임 소재가 명확하다. 대신 초반에 빠뜨린 요구사항을 뒤에서 바로잡기 어렵다. 그래서 요구사항 분석과 설계 문서 작성이 전체에서 가장 공들여야 하는 구간으로 여겨진다.",
      },
      {
        type: "p",
        text: "마르미-III는 이 흐름에 맞춰 분석부터 전개까지 각 단계에서 무엇을 제출해야 하는지 정해 둔 표준 방법론이다. 발주기관이 다른 업체가 수행한 사업이라도 동일한 틀로 검수할 수 있는 것이 목적이다.",
      },
      {
        type: "table",
        caption: "마르미-III 단계별 대표 산출물",
        head: ["단계", "산출물"],
        rows: [
          ["분석", "요구사항정의서, 요구사항추적표"],
          ["설계", "화면설계서, 테이블정의서(ERD 포함), 인터페이스정의서"],
          ["구현", "프로그램목록, 단위시험결과서"],
          ["시험", "통합시험계획서/결과서, 사용자매뉴얼"],
        ],
      },
      {
        type: "p",
        text: "설계 단계의 WBS는 전체 작업을 더 작은 단위로 쪼개 계층으로 정리한 표다. 무슨 작업을 누가 언제까지 할지를 한눈에 보이게 만드는 것이 목적이며, 이후 일정 관리와 진척률 보고의 기준이 된다. ERD는 테이블 사이의 관계를 그림으로, 테이블명세서는 컬럼·타입·제약조건까지 표로 정리한다 — 이 둘이 구현 단계에서 실제로 짤 쿼리의 설계도가 된다.",
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["waterfall", "marmi", "wbs", "erd", "pk-fk"],
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "지금 맡은 업무의 요구사항정의서나 화면설계서를 한 번 열어 본다. 코드를 보기 전에 이 문서가 먼저 확정되어 있었다는 사실만 확인해도, 왜 이렇게 만들어졌는지가 다르게 읽힌다.",
      },
    ],
  },

  {
    no: 7,
    date: "2026.09.09",
    weekday: "수",
    title: "@Transactional인데 왜 롤백이 안 될까",
    dek: "선언은 되어 있는데 실제로는 풀려 있는 트랜잭션. 원인은 대부분 두 가지 중 하나다.",
    minutes: 8,
    tags: ["@Transactional", "AOP", "프록시"],
    takeaway: "@Transactional은 선언일 뿐이다 — 예외를 잡아 삼키거나 자기 자신을 직접 부르면 롤백은 일어나지 않는다.",
    next: "SI 프로젝트가 왜 이 순서로 가는지",
    blocks: [
      {
        type: "p",
        text: "Service는 업무 규칙을, Mapper는 SQL 실행을 맡는다. Controller가 곧바로 Mapper로 가지 않고 Service를 거치게 두는 이유는 이 둘을 분리하기 위해서다. Service가 얇아 보여도, 권한 확인이나 여러 DAO 호출을 묶는 자리, 그리고 트랜잭션 경계가 여기에 온다.",
      },
      {
        type: "code",
        language: "java",
        caption: "표준프레임워크 Service 구현체의 전형",
        content: `@Service("noticeService")
public class NoticeServiceImpl extends EgovAbstractServiceImpl
    implements NoticeService {

  @Resource(name = "noticeMapper")
  private NoticeMapper noticeMapper;

  @Transactional
  public void registerNotice(NoticeVO notice) {
    noticeMapper.insertNotice(notice);
    // 이어지는 DB 작업 중 하나라도 실패하면 함께 되돌려야 한다.
  }
}`,
      },
      {
        type: "p",
        text: "그런데 @Transactional은 코드가 아니라 선언이다. 실제 커밋과 롤백은 프록시가 대신 수행하는데, 프록시를 거치지 않거나 프록시가 롤백 신호를 받지 못하면 어노테이션은 붙어 있어도 아무 일도 하지 않는다.",
      },
      {
        type: "list",
        items: [
          "예외를 잡아 삼킨다 — catch로 로그만 남기고 정상 종료하면, 프록시는 문제없이 끝난 것으로 보고 커밋한다.",
          "자기 자신을 직접 부른다 — 같은 클래스 안에서 this.메서드()로 호출하면 프록시를 거치지 않아 트랜잭션이 적용되지 않는다.",
        ],
      },
      {
        type: "quiz",
        question: "반복문 안에서 this.insertBoardArticle(vo)를 100번 호출하다 50번째에서 DB 오류가 났다. insertBoardArticle에 @Transactional이 붙어 있어도 예외를 잡아 로그만 남긴다면?",
        options: [
          "100건 모두 롤백된다",
          "49건까지만 저장되고 멈춘다",
          "50건이 저장된 채 나머지도 계속 처리된다",
          "트랜잭션이 없으므로 아무것도 저장되지 않는다",
        ],
        answer: 2,
        explain: "self-invocation이라 트랜잭션 경계가 없고, 예외를 잡아 로그만 남기므로 반복문도 멈추지 않는다. 실패한 건만 빠진 채 나머지가 그대로 저장된다 — 가장 늦게 발견되는 형태의 데이터 불일치다.",
      },
      {
        type: "link",
        href: "/drills/transaction-trap/",
        label: "오늘의 훈련",
        title: "롤백되지 않는 @Transactional 읽어 내기",
        detail: "실제 코드에서 두 함정을 직접 찾아본다 · 8분",
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["transactional", "aop", "proxy", "service-impl"],
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "담당 업무의 Service 클래스에서 @Transactional이 붙은 메서드를 하나 고른다. 안에서 예외를 잡아 삼키지 않는지, 같은 클래스 안의 다른 메서드를 this로 부르고 있지 않은지 확인한다.",
      },
    ],
  },

  {
    no: 6,
    date: "2026.09.08",
    weekday: "화",
    title: "Docker는 배포, 모놀리스·MSA는 구조",
    dek: "세 단어가 자주 같이 나오지만 답하는 질문이 다르다. 나란히 비교하면 처음부터 어긋난다.",
    minutes: 8,
    tags: ["Docker", "Monolith", "MSA"],
    takeaway: "Docker는 배포 방식이고, 모놀리스·MSA는 코드를 나누는 방식이다 — 축이 다르니 나란히 비교하지 않는다.",
    next: "@Transactional인데 왜 롤백이 안 될까",
    blocks: [
      {
        type: "table",
        caption: "축이 다르면 비교 자체가 성립하지 않는다",
        head: ["단어", "무엇에 대한 답인가"],
        rows: [
          ["모놀리스", "코드를 어떻게 나눌 것인가"],
          ["MSA", "코드를 어떻게 나눌 것인가"],
          ["Docker", "어떻게 배포하고 실행할 것인가"],
        ],
      },
      {
        type: "callout",
        title: "핵심 구분",
        text: "Docker를 쓴다고 MSA가 되는 것은 아니다. WAR 하나를 Tomcat 컨테이너에 넣으면 그것은 Docker 위의 모놀리스다. 반대로 MSA는 Docker 없이도 가능하지만, 서비스별 배포를 다루기 쉬워 컨테이너와 함께 쓰는 경우가 많다.",
      },
      {
        type: "flow",
        caption: "같은 모놀리스를 Docker로 감싼 배포",
        steps: [
          { label: "Maven build", detail: "project.war" },
          { label: "Docker image", detail: "JDK + Tomcat + WAR" },
          { label: "Container", detail: "어느 서버에서나 같게 실행" },
        ],
      },
      {
        type: "p",
        text: "공공·온프레미스 유지보수에서는 운영팀이 이미 Java와 Tomcat을 설치해 두고 개발팀은 WAR만 전달하는 경우가 흔하다. 그래서 Docker가 없어도 이상하지 않다. 반면 개발·테스트·운영 환경을 동일하게 만들거나 CI/CD를 정비하려면 Docker가 유용해진다.",
      },
      {
        type: "list",
        items: [
          "서비스를 나누면 한 덩어리의 코드가 작아지고 독립 배포가 가능해진다.",
          "대신 네트워크 호출·인증·분산 로그·장애 전파·데이터 일관성·운영 비용이 늘어난다.",
          "그래서 \"복잡하니 무조건 MSA\"가 아니라, 독립적으로 바뀌고 운영될 업무 경계가 실제로 있는지를 먼저 본다.",
        ],
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["docker", "monolith", "msa", "war"],
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "담당 시스템이 WAR 하나로 도는지, 여러 서비스로 나뉘어 있는지 확인해 본다. Docker로 감싸져 있어도 서비스가 하나뿐이면 그것은 여전히 모놀리스다.",
      },
    ],
  },

  {
    no: 5,
    date: "2026.09.07",
    weekday: "월",
    title: "# 은 자리를 가리킨다",
    dek: "화면 어딘가에 내용이 새로 그려진다면 그 자리에는 id가 붙어 있다. 그리고 서버로 가는 이름은 따로 있다.",
    minutes: 9,
    tags: ["id", "name", "jQuery", "DOM"],
    takeaway: "id 속성은 브라우저가 찾는 이름, name 속성은 서버가 받는 이름이다.",
    next: "AJAX로 갈아 끼운 목록에서 버튼이 죽는 이유와, 이벤트를 다시 거는 방법",
    blocks: [
      {
        type: "p",
        text: "코드를 읽다 보면 기호에서 먼저 막힌다. @ 는 대체로 \"이건 실행되는 코드가 아니라 프레임워크에게 주는 지시\"라는 표시라 정리가 쉬운 편이다. 어려운 쪽은 # 인데, 화면과 SQL에서 완전히 다른 일을 하기 때문이다.",
      },
      {
        type: "p",
        text: "화면 쪽에서 # 은 언제나 하나를 가리킨다 — id 속성이다. HTML에서 어떤 자리에 이름표를 붙여 두면, CSS는 #이름 으로 그 자리만 꾸미고 JavaScript는 같은 문법으로 그 자리를 찾아 내용을 바꾼다. 이름표를 붙일 때는 # 을 쓰지 않고, 부를 때만 붙인다는 점이 헷갈리는 지점이다.",
      },
      {
        type: "code",
        language: "html",
        caption: "이름표를 붙이는 쪽과 부르는 쪽",
        content: '<!-- 붙일 때: # 없음 -->\n<div id="listArea"></div>\n\n/* 부를 때: CSS */\n#listArea { min-height: 200px; }\n\n// 부를 때: JavaScript\n$("#listArea").html(data);\ndocument.getElementById("listArea");',
      },
      {
        type: "callout",
        title: "특정 위치에 내용이 들어간다는 말의 정체",
        text: "빈 div 를 자리로 만들어 두고, 스크립트가 그 이름을 찾아 안쪽을 서버가 보낸 HTML로 통째로 교체하는 것이다. 페이지는 새로 고쳐지지 않고 그 자리만 바뀐다. 레거시 화면에서 목록만 갱신되는 구조는 거의 전부 이것이다.",
      },
      {
        type: "p",
        text: "여기까지는 화면 안의 이야기다. 그런데 입력칸을 보면 id 속성 옆에 name 속성이 같은 값으로 나란히 붙어 있다. 중복처럼 보이지만 둘은 서로 다른 방향을 향한다. id는 브라우저 안에서만 쓰이고, 서버까지 가는 것은 name뿐이다.",
      },
      {
        type: "flow",
        caption: "검색어 한 글자가 지나가는 두 갈래",
        steps: [
          { label: "입력칸", detail: 'id="searchKeyword" name="searchKeyword"' },
          { label: "id 쪽", detail: '$("#searchKeyword") — 화면이 값을 읽고 쓴다' },
          { label: "name 쪽", detail: "form 전송 · serialize() 가 이 이름으로 싣는다" },
          { label: "Controller", detail: "@ModelAttribute 가 name 기준으로 VO를 채운다" },
          { label: "Mapper", detail: "#{searchKeyword} — 여기의 # 은 전혀 다른 뜻" },
        ],
      },
      {
        type: "quiz",
        question: "입력칸에 id만 있고 name이 없다. 화면에서 타이핑은 되는데 검색이 걸러지지 않는다. 서버는 이 값을 받았을까?",
        options: [
          "받았다. id로도 전송된다",
          "받지 못했다. 전송 대상은 name이 붙은 것뿐이다",
          "받았지만 VO 필드가 없어 버려졌다",
          "브라우저 설정에 따라 다르다",
        ],
        answer: 1,
        explain: "form 전송도 jQuery의 serialize() 도 name을 기준으로 값을 모은다. name이 없으면 그 입력칸은 아예 포함되지 않는다. 서버는 받은 적이 없으므로 오류도 나지 않고, 로그에도 흔적이 없다 — 그래서 원인 찾기가 오래 걸린다.",
      },
      {
        type: "link",
        href: "/drills/id-and-name/",
        label: "오늘의 훈련",
        title: "id와 name — 화면이 찾는 이름, 서버가 받는 이름",
        detail: "검색 화면 한 편을 줄 단위로 읽고 두 이름의 경로를 갈라 본다 · 8분",
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["html-id", "name-attribute", "css-selector", "dom", "url-fragment"],
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "담당 화면의 JSP를 열고 두 목록을 만들어 본다. 하나는 name이 붙은 입력칸 전부 — 이것이 서버로 가는 전부다. 다른 하나는 스크립트 안의 $(\"#…\") 전부 — 이것이 화면이 건드리는 자리다. 두 목록을 나란히 놓으면 그 화면이 무엇을 보내고 무엇을 바꾸는지가 정리된다.",
      },
    ],
  },

  {
    no: 4,
    date: "2026.09.04",
    weekday: "금",
    title: "설정이 코드를 부른다",
    dek: "호출문이 없는데 실행되는 코드의 출처는 언제나 설정 파일이다. web.xml부터 순서대로 읽는다.",
    minutes: 9,
    tags: ["web.xml", "context-*.xml", "DispatcherServlet"],
    takeaway: "코드에 없는 동작을 만나면 어노테이션이 아니라 XML을 먼저 연다.",
    next: "context-datasource.xml의 커넥션 풀 설정과, 풀이 마르면 어떤 증상이 나는지",
    blocks: [
      {
        type: "p",
        text: "Java 파일만 읽으면 이해되지 않는 일이 계속 생긴다. 아무도 부르지 않은 Controller가 실행되고, new 하지 않은 Service가 필드에 들어와 있고, 반환한 문자열이 파일을 찾아낸다. 이 셋의 출처는 모두 설정이다. 3.8 계열 프로젝트에서 설정은 어노테이션보다 XML에 더 많이 들어 있다.",
      },
      {
        type: "p",
        text: "순서가 있다. 서버가 애플리케이션을 띄울 때 가장 먼저 읽는 파일이 web.xml이고, 그 안에서 나머지 설정 파일의 위치가 지정된다. 그래서 낯선 프로젝트를 열 때도 이 파일부터 읽으면 지도를 손에 쥔 채 시작할 수 있다.",
      },
      {
        type: "codeRead",
        language: "xml",
        caption: "web.xml — 애플리케이션이 켜지는 순서",
        question: "이 파일에서 나머지 설정 파일의 위치를 알려 주는 줄은 어디인가?",
        code: `<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath*:egovframework/spring/com/context-*.xml</param-value>
</context-param>

<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>

<filter>
    <filter-name>encodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
</filter>

<servlet>
    <servlet-name>action</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
    <servlet-name>action</servlet-name>
    <url-pattern>*.do</url-pattern>
</servlet-mapping>`,
        notes: [
          {
            lines: "1-4",
            title: "여기가 설정의 목차다",
            body: "contextConfigLocation이 가리키는 경로 아래 XML들이 애플리케이션 전체의 빈 설정이다. classpath*: 는 여러 jar와 소스 경로를 모두 훑으라는 뜻이고, context-*.xml 은 이름이 그렇게 시작하는 파일을 전부 읽는다는 뜻이다. 새 설정 파일을 만들었는데 반영되지 않는다면 이름 규칙에서 벗어난 경우다.",
          },
          {
            lines: "6-8",
            title: "리스너가 컨테이너를 켠다",
            body: "ContextLoaderListener는 서버 기동 시 위 경로의 XML을 읽어 Spring 컨테이너를 만든다. 이 시점에 component-scan이 돌면서 @Service, @Repository가 붙은 클래스가 전부 빈으로 등록된다. 애플리케이션이 뜰 때 나는 오류의 상당수가 이 단계에서 발생한다.",
          },
          {
            lines: "10-17",
            title: "한글이 깨지면 여기부터 본다",
            body: "필터는 서블릿보다 먼저 실행된다. CharacterEncodingFilter는 요청 본문을 UTF-8로 해석하도록 지정한다. POST로 보낸 한글이 물음표로 저장된다면 이 설정이 빠졌거나 DB 인코딩과 어긋난 경우다.",
          },
          {
            lines: "19-23",
            title: "DispatcherServlet이 등록되는 자리",
            body: "load-on-startup 1은 첫 요청을 기다리지 않고 서버가 켜질 때 미리 초기화하라는 뜻이다. 이때 servlet-name과 같은 이름의 XML — 여기서는 action-servlet.xml — 을 화면 설정으로 함께 읽는다. ViewResolver 설정을 찾을 때 이 이름이 단서가 된다.",
          },
          {
            lines: "25-28",
            title: "*.do 의 정체",
            body: "이 매핑 때문에 .do로 끝나는 모든 요청이 DispatcherServlet으로 간다. 서버에 list.do 라는 파일은 존재하지 않는다. 전자정부 계열 URL에서 .do를 보면 \"여기부터 Spring이 처리한다\"는 신호로 읽는다.",
          },
        ],
      },
      {
        type: "flow",
        caption: "서버가 켜질 때 일어나는 일 — 요청이 오기 전에 이미 끝나 있다",
        steps: [
          { label: "web.xml 읽기", detail: "리스너 · 필터 · 서블릿 등록" },
          { label: "context-*.xml 로드", detail: "component-scan · DataSource · 트랜잭션" },
          { label: "빈 생성과 주입", detail: "@Service · @Repository가 컨테이너에 들어감" },
          { label: "action-servlet.xml 로드", detail: "ViewResolver · 인터셉터 · 매핑 수집" },
          { label: "요청 대기", detail: "이제 .do 요청을 받을 준비 완료" },
        ],
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["web-xml", "context-xml", "dispatcher-servlet-xml", "component-scan"],
      },
      {
        type: "quiz",
        question: "새로 만든 @Service 클래스가 주입되지 않아 NoSuchBeanDefinitionException이 났다. 가장 먼저 확인할 곳은?",
        options: [
          "dispatcher-servlet.xml의 ViewResolver prefix",
          "context-*.xml의 component-scan base-package 범위",
          "web.xml의 url-pattern",
          "pom.xml의 Java 버전",
        ],
        answer: 1,
        explain: "빈이 아예 등록되지 않았다는 뜻이므로 스캔 범위 밖에 클래스를 만든 경우가 압도적으로 많다. 어노테이션을 아무리 정확히 붙여도 스캔하지 않는 패키지에 있으면 컨테이너는 그 클래스의 존재를 모른다.",
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "담당 화면의 web.xml을 열어 contextConfigLocation 경로를 확인하고, 그 폴더에 실제로 어떤 XML이 몇 개 있는지 세어 본다. 파일 이름만 훑어도 이 시스템이 무엇을 쓰는지 절반은 보인다.",
      },
    ],
  },

  {
    no: 3,
    date: "2026.09.03",
    weekday: "목",
    title: "한 글자 차이, #{ }와 ${ }",
    dek: "MyBatis에서 값이 들어가는 자리와 문장이 들어가는 자리. 이 구분이 곧 보안 점검 항목이다.",
    minutes: 8,
    tags: ["MyBatis", "SQL 인젝션", "Mapper XML"],
    takeaway: "#{ }는 값, ${ }는 문장. 값 자리에 ${ }가 보이면 그 줄이 취약점이다.",
    next: "동적 SQL의 <where>와 <foreach>가 실제로 만들어 내는 문장",
    blocks: [
      {
        type: "p",
        text: "SQL을 XML에 적어 두는 방식은 처음 보면 번거롭지만, 익숙해지면 복잡한 조회를 다루기에 좋다. 문제는 값을 넣는 문법이 두 가지고 생김새가 거의 같다는 것이다. 하나는 안전하고 하나는 위험한데, 오타처럼 보이기 때문에 리뷰에서 놓치기 쉽다.",
      },
      {
        type: "table",
        caption: "같아 보이지만 완전히 다른 두 문법",
        head: ["", "#{ }", "${ }"],
        rows: [
          ["들어가는 방식", "자리표시자로 바인딩", "문자열을 그대로 치환"],
          ["SQL 구조 변경", "불가능 — 항상 값 하나", "가능 — 문장 자체가 바뀜"],
          ["따옴표 처리", "MyBatis가 알아서", "직접 붙여야 함"],
          ["쓰는 자리", "검색어 · ID · 개수 등 모든 값", "컬럼명 · 정렬 방향 · 테이블명"],
          ["검증 책임", "프레임워크", "개발자 — 허용 목록 대조 필수"],
        ],
      },
      {
        type: "code",
        language: "sql",
        caption: "searchKeyword 에 ' OR '1'='1 을 넣었을 때 실제로 실행되는 문장",
        content: `-- #{searchKeyword} 인 경우 : 값으로 들어간다
SELECT * FROM COMTNBBS WHERE NTT_SJ LIKE ?
   -- 바인딩된 값: %' OR '1'='1%   → 그냥 이상한 검색어일 뿐

-- \${searchKeyword} 인 경우 : 문장이 된다
SELECT * FROM COMTNBBS WHERE NTT_SJ LIKE '%' OR '1'='1%'
   -- WHERE 조건이 항상 참 → 전체 행이 그대로 노출된다`,
      },
      {
        type: "link",
        href: "/drills/mybatis-binding/",
        label: "오늘의 훈련",
        title: "#{ } 와 ${ } — 한 글자가 취약점이 되는 자리",
        detail: "Mapper XML 한 편을 줄 단위로 읽고 위험한 자리를 직접 짚어 본다 · 8분",
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["mybatis", "sql-injection", "prepared-statement", "dynamic-sql"],
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        tone: "warn",
        text: "담당 업무의 Mapper XML에서 ${ } 를 전부 검색해 본다. 컬럼명이나 정렬 방향이 아닌 자리에 있다면 메모해 둔다. 바로 고치지 않아도 좋다 — 어디에 무엇이 있는지 아는 것이 먼저다.",
      },
    ],
  },

  {
    no: 2,
    date: "2026.09.02",
    weekday: "수",
    title: "Model의 이름은 화면까지 살아남는다",
    dek: "Controller가 붙인 이름이 JSP의 ${...}로 그대로 다시 나온다. 서버와 화면을 잇는 단 하나의 끈.",
    minutes: 7,
    tags: ["EL", "JSTL", "Model", "JSP"],
    takeaway: "화면에서 막히면 ${이름}을 그대로 들고 서버 코드를 전역 검색한다.",
    next: "EgovMap이 DB 컬럼명을 카멜케이스로 바꾸는 지점",
    blocks: [
      {
        type: "p",
        text: "서버가 만든 데이터가 어떻게 화면까지 가는지는 사실 단순하다. Controller가 바구니에 이름을 붙여 담고, JSP가 그 이름으로 꺼낸다. 중간에 이름이 바뀌는 일은 없다. 이 점 때문에 화면에서 서버로 거슬러 올라가는 추적이 아주 정확하게 통한다.",
      },
      {
        type: "flow",
        caption: "이름 하나가 지나가는 길",
        steps: [
          { label: "SQL", detail: "SELECT NTT_SJ ..." },
          { label: "Mapper", detail: "resultType으로 객체에 담김" },
          { label: "Service", detail: "List<BoardVO> 반환" },
          { label: "Controller", detail: 'addAttribute("resultList", list)' },
          { label: "JSP", detail: "${resultList} 로 다시 등장" },
        ],
      },
      {
        type: "p",
        text: "주의할 점이 하나 있다. EL은 없는 이름을 만나도 오류를 내지 않는다. 조용히 빈 값을 출력하고 지나간다. 그래서 화면이 비어 있는데 로그에는 아무것도 없는 상황이 흔하다. 이럴 때는 예외를 찾지 말고 이름 철자를 대조한다.",
      },
      {
        type: "link",
        href: "/drills/model-to-el/",
        label: "오늘의 훈련",
        title: "Model의 이름을 화면에서 다시 만나기",
        detail: "게시판 목록 JSP를 줄 단위로 읽고 서버 코드를 역추적한다 · 7분",
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["el", "jstl", "model", "xss"],
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "담당 화면의 JSP에서 ${...} 를 하나 골라, 그 이름을 그대로 전역 검색해 Controller의 addAttribute를 찾아본다. 한 번만 성공하면 이 방법은 평생 쓴다.",
      },
    ],
  },

  {
    no: 1,
    date: "2026.09.01",
    weekday: "화",
    title: "요청 하나가 화면이 되기까지",
    dek: "첫 출근. 파일 목록 대신 화면 하나를 잡고 URL부터 JSP까지 한 바퀴 돈다.",
    minutes: 8,
    tags: ["Spring MVC", "DispatcherServlet", "코드 읽기"],
    takeaway: "레거시는 위에서 아래로 읽는 것이 아니라, 요청 하나를 따라 옆으로 읽는다.",
    next: "Controller가 담은 이름이 JSP에서 어떻게 다시 나오는지",
    blocks: [
      {
        type: "p",
        text: "처음 저장소를 받으면 폴더를 하나씩 열어 보고 싶어진다. 그러면 반드시 길을 잃는다. 파일 수백 개는 서로 비슷하게 생겼고, 어떤 것이 중요한지 알려 주는 표시가 없기 때문이다.",
      },
      {
        type: "p",
        text: "대신 화면 하나를 정한다. 목록 화면이면 충분하다. 그 화면의 주소를 손에 쥐고, URL에서 시작해 JSP에서 끝나는 한 바퀴를 돈다. 한 바퀴가 이해되면 나머지 화면은 전부 같은 지도 위에 놓이게 된다. 이것이 레거시를 읽는 유일하게 확실한 방법이다.",
      },
      {
        type: "flow",
        caption: "Spring MVC 요청 한 바퀴",
        steps: [
          { label: "브라우저", detail: "GET /cop/bbs/selectBoardList.do" },
          { label: "DispatcherServlet", detail: "모든 .do 요청의 현관" },
          { label: "HandlerMapping", detail: "이 URL의 담당 메서드를 찾는다" },
          { label: "Controller", detail: "요청 파라미터를 VO로 받는다" },
          { label: "Service", detail: "업무 규칙과 트랜잭션 경계" },
          { label: "Mapper", detail: "XML에 적힌 SQL 실행" },
          { label: "Model", detail: "결과에 이름을 붙여 담는다" },
          { label: "ViewResolver", detail: "뷰 이름 → JSP 경로" },
          { label: "JSP", detail: "HTML로 완성되어 브라우저로" },
        ],
      },
      {
        type: "callout",
        title: "자동으로 호출되는 것처럼 보이는 이유",
        text: "코드 어디에도 Controller를 부르는 문장이 없다. 그런데 실행된다. web.xml이 모든 .do 요청을 DispatcherServlet에 넘기도록 등록해 두었고, 그 서블릿이 @RequestMapping 문자열을 모아 만든 표에서 담당 메서드를 찾기 때문이다. 마법이 아니라 설정의 결과다.",
      },
      {
        type: "link",
        href: "/drills/url-to-controller/",
        label: "오늘의 훈련",
        title: "URL 하나로 Controller 찾아가기",
        detail: "실제 공통컴포넌트 코드를 줄 단위로 읽는다 · 6분",
      },
      {
        type: "terms",
        title: "오늘의 용어",
        ids: ["dispatcher-servlet", "handler-mapping", "view-resolver", "do-extension"],
      },
      {
        type: "callout",
        title: "오늘 회사에서 해 볼 것",
        text: "담당 시스템에서 아무 목록 화면이나 열고 주소를 복사해 둔다. 그 문자열이 내일까지의 유일한 숙제다.",
      },
    ],
  },
];

export const issueByNo = (no: number) => issues.find((i) => i.no === no);
