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
