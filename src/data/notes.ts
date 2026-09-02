import type { Block } from "./blocks";

export type NoteSection = {
  title: string;
  blocks: Block[];
};

export type Note = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  updated: string;
  minutes: number;
  tags: string[];
  sections: NoteSection[];
  sources?: { label: string; href: string }[];
};

export const notes: Note[] = [
  {
    slug: "spring-mvc-reading-map",
    category: "코드 읽기",
    title: "Spring MVC + JSP 코드를 읽는 순서",
    summary:
      "Controller부터 JSP까지 요청 하나를 끝까지 추적하는 법. 자동 호출처럼 보이는 Spring의 연결 고리와 자주 보는 문법을 같이 정리한다.",
    updated: "2026.09.03",
    minutes: 18,
    tags: ["Spring MVC", "JSP", "eGovFrame 3.8", "MyBatis"],
    sections: [
      {
        title: "먼저 화면 하나의 요청을 잡는다",
        blocks: [
          {
            type: "p",
            text: "레거시 프로젝트를 파일 목록부터 읽으면 길을 잃기 쉽다. 브라우저에서 실제로 누르는 버튼이나 주소 하나를 정한 다음, URL에서 Controller, Service, Mapper, DB, JSP 순서로 한 바퀴 도는 것이 가장 빠르다. 이 한 바퀴가 이해되면 다른 화면도 같은 지도 위에 놓인다.",
          },
          {
            type: "flow",
            caption: "요청 하나가 지나가는 아홉 걸음",
            steps: [
              { label: "브라우저", detail: "GET /notice/list.do" },
              { label: "DispatcherServlet", detail: "web.xml이 등록한 현관" },
              { label: "HandlerMapping", detail: "담당 메서드 탐색" },
              { label: "Controller", detail: "파라미터를 VO로 받는다" },
              { label: "Service", detail: "업무 규칙 · 트랜잭션" },
              { label: "Mapper", detail: "XML의 SQL 실행" },
              { label: "DB", detail: "결과 반환" },
              { label: "Model", detail: "이름을 붙여 담는다" },
              { label: "JSP", detail: "EL로 꺼내 HTML 완성" },
            ],
          },
          {
            type: "callout",
            title: "자동으로 호출되는 이유",
            text: "마법처럼 보이지만 설정의 결과다. DispatcherServlet이 모든 요청을 먼저 받고, @RequestMapping 같은 매핑 정보를 읽어 Controller 메서드를 찾는다. @Service와 @Repository는 component-scan 또는 XML 설정으로 미리 컨테이너에 등록되어 있으므로, Controller가 의존성을 주입받아 호출할 수 있다.",
          },
        ],
      },
      {
        title: "Controller에서는 URL과 화면 이름을 읽는다",
        blocks: [
          {
            type: "p",
            text: "Controller를 열면 가장 먼저 클래스 위와 메서드 위의 매핑을 합친다. 클래스가 /notice이고 메서드가 /list.do라면 실제 주소는 /notice/list.do다. return 문자열은 JSP 자체가 아니라 ViewResolver가 해석할 논리적 뷰 이름이다.",
          },
          {
            type: "codeRead",
            language: "java",
            caption: "전형적인 3.8 Controller",
            question: "이 메서드가 실행되기 위해 미리 준비되어 있어야 하는 것은 무엇인가?",
            code: `@Controller
@RequestMapping("/notice")
public class NoticeController {

  @Resource(name = "noticeService")
  private NoticeService noticeService;

  @RequestMapping(value = "/list.do")
  public String list(@ModelAttribute("searchVO") SearchVO searchVO, ModelMap model) {
    List<NoticeVO> list = noticeService.selectNoticeList(searchVO);
    model.addAttribute("resultList", list);
    return "notice/list";
  }
}`,
            notes: [
              {
                lines: "1",
                title: "@Controller — 요청을 받는 입구라는 표시",
                body: "이 표시가 있어야 component-scan이 빈으로 등록하고, HandlerMapping이 안의 매핑을 수집한다. 화면 대신 데이터를 그대로 돌려주려면 @RestController나 @ResponseBody를 쓴다.",
              },
              {
                lines: "5-6",
                title: "@Resource — 이름으로 주입",
                body: "타입이 아니라 이름으로 빈을 찾는다. \"noticeService\"라는 문자열이 다음 추적 대상이며, 이 이름으로 전역 검색하면 @Service(\"noticeService\")가 붙은 구현체가 나온다. 주입 실패의 대부분은 이름 오타다.",
              },
              {
                lines: "8",
                title: "클래스 매핑과 합쳐 최종 주소가 된다",
                body: "/notice + /list.do = /notice/list.do. method를 지정하지 않으면 GET과 POST를 모두 받는다. 조회 전용 화면이라면 method = RequestMethod.GET을 명시하는 편이 안전하다.",
              },
              {
                lines: "9",
                title: "@ModelAttribute는 두 가지 일을 한다",
                body: "요청 파라미터를 SearchVO의 같은 이름 필드에 채우고(setter 기준), 그 객체를 \"searchVO\"라는 이름으로 화면에도 넘긴다. 검색 후에도 조건이 화면에 남아 있는 이유다.",
              },
              {
                lines: "11",
                title: "여기서 붙인 이름이 JSP에 그대로 나온다",
                body: "\"resultList\"는 JSP에서 ${resultList}로 다시 등장한다. 화면과 서버를 잇는 가장 확실한 검색 키워드다.",
              },
              {
                lines: "12",
                title: "반환값은 파일 경로가 아니다",
                body: "ViewResolver의 prefix와 suffix가 앞뒤에 붙어 실제 경로가 완성된다. 이 설정은 dispatcher-servlet.xml에 있다.",
              },
            ],
          },
        ],
      },
      {
        title: "Service와 Mapper는 무엇을과 어떻게를 나눈다",
        blocks: [
          {
            type: "p",
            text: "Service는 업무 규칙을 읽는 곳이다. 권한 확인, 여러 DAO 호출 묶기, 트랜잭션 경계가 여기에 온다. Mapper는 DB에 어떤 SQL을 실행할지 담당한다. Service가 얇아 보여도 Controller가 곧바로 Mapper로 가지 않게 두는 이유는 규칙과 DB 접근을 분리하기 위해서다.",
          },
          {
            type: "code",
            language: "java",
            caption: "Service에서 트랜잭션을 읽는 감각",
            content: `@Service("noticeService")
public class NoticeServiceImpl extends EgovAbstractServiceImpl
    implements NoticeService {

  @Resource(name = "noticeMapper")
  private NoticeMapper noticeMapper;

  @Transactional
  public void registerNotice(NoticeVO notice) {
    noticeMapper.insertNotice(notice);
    // 이어지는 DB 작업 중 하나라도 실패하면 함께 되돌릴 수 있다.
    // 단, 예외를 여기서 잡아 삼키면 롤백 신호가 프록시까지 가지 않는다.
  }
}`,
          },
          {
            type: "p",
            text: "트랜잭션이 걸린 것처럼 보이지만 실제로는 풀려 있는 경우가 자주 있다. 예외를 잡아 로그만 남기거나, 같은 클래스 안에서 자기 메서드를 직접 호출하는 두 가지가 대표적인 함정이다.",
          },
          {
            type: "link",
            href: "/drills/transaction-trap/",
            label: "관련 훈련",
            title: "롤백되지 않는 @Transactional 읽어 내기",
            detail: "실제 코드에서 두 함정을 직접 찾아본다 · 8분",
          },
          {
            type: "code",
            language: "xml",
            caption: "MyBatis XML에서 값과 문장을 구분한다",
            content: `<select id="selectNoticeList" parameterType="SearchVO" resultType="NoticeVO">
  SELECT * FROM NOTICE
  WHERE TITLE LIKE '%' || #{searchKeyword} || '%'
  ORDER BY NOTICE_ID DESC
</select>

<!-- #{ } : 값 바인딩. 일반 입력값에는 예외 없이 이것을 쓴다. -->
<!-- \${ } : 문자열 치환. 컬럼명·정렬식처럼 구조가 바뀌는 자리에만, 그것도 검증한 값으로. -->`,
          },
        ],
      },
      {
        title: "JSP에서는 Model의 이름을 다시 만난다",
        blocks: [
          {
            type: "p",
            text: "Controller에서 이름을 붙여 담은 값은 JSP에서 그 이름 그대로 나타난다. EL의 ${…}는 서버가 페이지를 만들 때 값을 꺼내는 문법이고, JavaScript의 ${…}와는 실행 시점이 다르다. EL은 브라우저에 도착하기 전에 이미 값으로 바뀌어 사라진다.",
          },
          {
            type: "code",
            language: "jsp",
            caption: "JSTL + EL로 목록 출력",
            content: `<c:forEach var="notice" items="\${resultList}">
  <tr>
    <td>\${notice.noticeId}</td>
    <td><c:out value="\${notice.title}" /></td>
  </tr>
</c:forEach>

<c:if test="\${empty resultList}">등록된 글이 없습니다.</c:if>`,
          },
          {
            type: "list",
            items: [
              "${user.name} — EL. request, session, application 범위를 차례로 뒤져 값을 꺼낸다.",
              "<c:forEach> — 반복. items에 리스트, var에 한 항목의 별칭을 둔다.",
              "<c:if> — 조건부 렌더링. empty 연산자는 null과 빈 목록을 함께 참으로 본다.",
              "<c:out> — 출력할 때 HTML 특수문자를 이스케이프한다. 사용자 입력 출력에는 이것을 쓴다.",
              "<% … %> — 스크립틀릿. Java를 JSP에 직접 섞는 옛 문법이며, 새 코드는 EL과 JSTL로 옮긴다.",
            ],
          },
          {
            type: "callout",
            title: "EL은 틀려도 조용하다",
            tone: "warn",
            text: "이름을 한 글자 틀려도 예외가 나지 않고 빈 값이 출력된다. 화면이 비어 있는데 로그에 아무것도 없다면, 오류를 찾지 말고 이름 철자를 대조한다.",
          },
        ],
      },
      {
        title: "기호는 문맥으로 읽는다",
        blocks: [
          {
            type: "table",
            caption: "같은 기호가 자리마다 다른 뜻을 갖는다",
            head: ["보이는 곳", "기호", "뜻"],
            rows: [
              ["CSS", "#menu", "id가 menu인 요소를 선택한다"],
              ["URL 끝", "…/list.do#reply", "같은 페이지 안 위치로 이동하는 fragment. 서버에 전송되지 않는다"],
              ["MyBatis", "#{name}", "PreparedStatement 파라미터로 바인딩되는 값"],
              ["MyBatis", "${name}", "SQL 문자열에 그대로 치환 — 검증 없이 쓰면 취약점"],
              ["JSP", "${name}", "EL 표현식. 서버가 값으로 바꿔 내보낸다"],
              ["JavaScript", "`${name}`", "템플릿 리터럴. 브라우저에서 실행된다"],
              ["shell", "# 주석", "그 줄은 실행하지 않는다"],
            ],
          },
          {
            type: "callout",
            title: "막히면 이렇게 검색한다",
            text: "URL을 보면 @RequestMapping의 문자열을 찾고, JSP의 ${name}을 보면 addAttribute(\"name\")이나 @ModelAttribute(\"name\")를 찾는다. Service 메서드를 보면 구현체와 Mapper id를 찾는다. 파일 이름보다 문자열 하나를 기준으로 전역 검색하는 습관이 훨씬 강력하다.",
          },
        ],
      },
    ],
  },

  {
    slug: "egovframe-38-legacy-map",
    category: "레거시 구조",
    title: "eGovFrame 3.8 프로젝트의 지도",
    summary:
      "Spring 4.3 계열과 XML 설정이 많은 3.8 프로젝트를 볼 때, 폴더와 설정과 공통컴포넌트를 어디서부터 읽는지 정리한다.",
    updated: "2026.09.03",
    minutes: 14,
    tags: ["eGovFrame 3.8", "XML", "Spring", "WAR"],
    sections: [
      {
        title: "3.8을 한 문장으로",
        blocks: [
          {
            type: "p",
            text: "eGovFrame 3.8은 Spring 4.3.16과 JDK 1.8 위에서 도는 전통적인 Java 웹 애플리케이션이다. Spring MVC가 요청을 받고, JSP가 화면을 만들며, MyBatis가 SQL을 실행하고, 완성된 결과물은 WAR 파일로 Tomcat에 배포된다. 실행환경 패키지가 egovframework.rte로 시작하는 것이 이 세대의 표식이다.",
          },
          {
            type: "tree",
            caption: "보통 보게 되는 레이어",
            rows: [
              { path: "src/main/java/egovframework/", depth: 0 },
              { path: "<업무>/web/", note: "Controller", depth: 1 },
              { path: "<업무>/service/", note: "인터페이스 + VO", depth: 1 },
              { path: "<업무>/service/impl/", note: "ServiceImpl + Mapper/DAO", depth: 1 },
              { path: "src/main/resources/egovframework/", depth: 0 },
              { path: "spring/", note: "context-*.xml", depth: 1 },
              { path: "sqlmap/", note: "MyBatis Mapper XML", depth: 1 },
              { path: "src/main/webapp/WEB-INF/", depth: 0 },
              { path: "web.xml", note: "탐색의 출발점", depth: 1 },
              { path: "config/", note: "화면 설정 XML", depth: 1 },
              { path: "jsp/", note: "화면", depth: 1 },
              { path: "pom.xml", note: "의존성과 빌드 설정", depth: 0 },
            ],
          },
          {
            type: "link",
            href: "/framework/",
            label: "더 깊게",
            title: "표준프레임워크 3.8 구조 해부",
            detail: "환경 구성 · 실행환경 여섯 레이어 · 설정 파일 · 공통컴포넌트 · 코드 관용구",
          },
        ],
      },
      {
        title: "설정 파일은 실행의 설계도다",
        blocks: [
          {
            type: "p",
            text: "어노테이션만 보지 말고 XML도 같이 본다. context-*.xml에는 component-scan, DataSource, 트랜잭션 매니저가 있고, 화면 설정 XML에는 ViewResolver와 인터셉터와 파일 업로드 설정이 들어 있다. 코드에 없는 동작은 거의 언제나 이 파일들 위에서 일어난다.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "pom.xml — Java 버전, Spring과 표준프레임워크 의존성, WAR 패키징 방식을 먼저 확인한다.",
              "web.xml — DispatcherServlet 등록, URL 패턴, contextConfigLocation 경로를 확인한다.",
              "context-*.xml — 서비스와 DAO의 스캔 범위, DB 접속과 트랜잭션 인프라를 확인한다.",
              "Mapper XML — Java 메서드가 결국 어떤 SQL id로 연결되는지 확인한다.",
              "properties — DB 주소나 파일 경로처럼 환경별로 달라지는 값을 확인한다. 비밀번호는 절대 노트나 저장소에 복사하지 않는다.",
            ],
          },
        ],
      },
      {
        title: "공통컴포넌트는 먼저 재사용 코드로 본다",
        blocks: [
          {
            type: "p",
            text: "공통컴포넌트는 사용자, 권한, 게시판, 파일, 코드관리 같은 반복 기능을 제공한다. 처음부터 내부를 다 외우기보다, 지금 보는 화면이 어떤 공통 기능을 호출하는지와 이 프로젝트가 어느 부분을 커스터마이즈했는지를 구분해서 본다.",
          },
          {
            type: "callout",
            title: "읽기 순서 체크",
            text: "화면 URL, Controller, Service 인터페이스와 구현체, Mapper id와 SQL, JSP, 그리고 해당 기능의 XML과 권한 설정 순서로 좁혀 간다. 설정부터 전부 읽으려 하지 않는다.",
          },
          {
            type: "link",
            href: "/drills/generation-check/",
            label: "관련 훈련",
            title: "import 한 줄로 프로젝트 세대 판별하기",
            detail: "낯선 저장소를 받았을 때 30초 안에 3.x인지 가른다 · 4분",
          },
        ],
      },
    ],
  },

  {
    slug: "docker-monolith-and-msa",
    category: "배포와 구조",
    title: "Docker, 모놀리스, MSA를 한 번에 구분하기",
    summary:
      "Docker는 배포 방식이고 모놀리스와 MSA는 애플리케이션 구조다. Spring과 JSP와 Tomcat 프로젝트가 어디에 놓이는지 구분한다.",
    updated: "2026.09.03",
    minutes: 13,
    tags: ["Docker", "Monolith", "MSA", "Tomcat"],
    sections: [
      {
        title: "세 단어는 같은 축이 아니다",
        blocks: [
          {
            type: "table",
            caption: "축이 다르면 비교 자체가 성립하지 않는다",
            head: ["단어", "무엇에 대한 답인가", "반대말"],
            rows: [
              ["모놀리스", "코드를 어떻게 나눌 것인가", "MSA"],
              ["MSA", "코드를 어떻게 나눌 것인가", "모놀리스"],
              ["Docker", "어떻게 배포하고 실행할 것인가", "서버에 직접 설치"],
            ],
          },
          {
            type: "callout",
            title: "핵심 구분",
            text: "Docker를 쓴다고 MSA가 되는 것은 아니다. 하나의 WAR를 Tomcat 컨테이너에 넣으면 그것은 Docker 위의 모놀리스다. 반대로 MSA는 Docker 없이도 가능하지만, 서비스별 배포를 다루기 쉬워 컨테이너와 함께 쓰는 경우가 많다.",
          },
        ],
      },
      {
        title: "현재 레거시에서 자연스러운 두 배포",
        blocks: [
          {
            type: "flow",
            caption: "전통적인 직접 배포",
            steps: [
              { label: "개발 PC", detail: "Maven build" },
              { label: "project.war", detail: "산출물 하나" },
              { label: "Tomcat webapps", detail: "운영팀이 배치" },
              { label: "서비스", detail: "Spring MVC + JSP + DB" },
            ],
          },
          {
            type: "flow",
            caption: "같은 모놀리스를 Docker로 감싼 배포",
            steps: [
              { label: "Maven build", detail: "project.war" },
              { label: "Docker image", detail: "JDK + Tomcat + WAR" },
              { label: "Container", detail: "어느 서버에서나 같게 실행" },
              { label: "Apache / Nginx", detail: "앞단에서 중계" },
            ],
          },
          {
            type: "p",
            text: "공공과 온프레미스 유지보수에서는 운영팀이 이미 Java와 Tomcat을 설치해 두고 개발팀은 WAR만 전달하는 경우가 흔하다. 그래서 Docker가 없어도 이상하지 않다. 반면 개발과 테스트와 운영 환경을 동일하게 만들고 싶거나 CI/CD를 정비한다면 Docker가 유용하다.",
          },
        ],
      },
      {
        title: "MSA로 갈 때 새로 생기는 문제",
        blocks: [
          {
            type: "p",
            text: "서비스를 나누면 한 덩어리의 코드가 작아지고 독립 배포가 가능해지지만, 네트워크 호출과 인증과 분산 로그와 장애 전파와 데이터 일관성과 운영 비용이 늘어난다. 그래서 서비스가 복잡하니 무조건 MSA가 아니라, 독립적으로 바뀌고 운영될 업무 경계가 실제로 있는지를 먼저 본다.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "초기에는 모놀리스를 모듈 단위로 정리하고 REST 경계를 명확히 만든다.",
              "그 다음 변경 빈도와 팀 분리와 확장 요구가 큰 기능부터 분리 후보로 검토한다.",
              "Docker와 CI/CD는 서비스 분리 전에도 도입할 수 있는 별도 개선이다.",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "egovframe-50-modernization",
    category: "현대화",
    title: "eGovFrame 3.8 → 5.0: 무엇이 달라지고, 무엇은 그대로인가",
    summary:
      "5.0은 단순 의존성 버전 변경이 아니라 Java와 Spring과 Jakarta 경계를 넘는 마이그레이션이다. MSA는 그와 별개의 선택이다.",
    updated: "2026.09.03",
    minutes: 16,
    tags: ["eGovFrame 5.0", "Java 17", "Spring 6.2", "Jakarta"],
    sections: [
      {
        title: "5.0의 큰 변화",
        blocks: [
          {
            type: "p",
            text: "공식 5.0 개발 가이드는 실행환경으로 Spring Framework 6.2 계열과 JDK 17 이상, Jakarta EE 계열 Servlet API를 안내한다. 3.8의 Java 8 중심 환경에서 넘어갈 때는 중간 세대를 여러 개 건너뛰는 큰 변화로 보는 편이 맞다.",
          },
          {
            type: "table",
            caption: "3.8과 5.0 사이에서 실제로 바뀌는 것",
            head: ["항목", "3.8", "5.0"],
            rows: [
              ["Spring", "4.3.16", "6.2 계열"],
              ["JDK", "1.8", "17 이상"],
              ["Servlet API", "javax.servlet", "jakarta.servlet"],
              ["실행환경 패키지", "egovframework.rte", "org.egovframe.rte"],
              ["설정 방식", "XML 중심", "XML · Java config · Boot 선택"],
              ["배포", "WAR → 외부 Tomcat", "WAR 또는 실행 가능한 jar"],
            ],
          },
        ],
      },
      {
        title: "그렇다고 5.0이 곧 MSA는 아니다",
        blocks: [
          {
            type: "list",
            items: [
              "eGovFrame 5.0 + Spring 6 + JDK 17 + Tomcat + JSP + WAR — 최신 기반의 모놀리스로 계속 운영할 수 있다.",
              "eGovFrame 5.0 + Spring Boot + Docker + Gateway + 여러 서비스 — 클라우드 네이티브와 MSA 방향.",
            ],
          },
          {
            type: "p",
            text: "5.0에는 MSA Boot Template Project가 있고 서비스 탐색과 설정과 Gateway, 그리고 예시 업무 서비스를 제공한다. 이는 MSA로 갈 수 있는 길이 마련됐다는 뜻이지, 기존 시스템이 자동으로 여러 서비스로 변한다는 뜻은 아니다. MSA 전환은 업무 도메인 분리와 운영 체계를 포함하는 별도 아키텍처 사업이다.",
          },
        ],
      },
      {
        title: "실제 마이그레이션은 단계로 본다",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "레거시 인벤토리 — Java, Tomcat, 라이브러리, 공통컴포넌트, 외부 연계, DB 의존성을 목록화한다.",
              "호환성 해결 — JDK 17, javax에서 jakarta로, Spring과 Security와 MyBatis와 Servlet API, 빌드 도구를 정비한다.",
              "회귀 테스트 — 기존 모놀리스가 같은 기능을 하는지 먼저 검증한다.",
              "배포 현대화 — CI/CD, Docker, 환경 설정 분리 등 운영 기반을 개선한다.",
              "도메인 분리 검토 — 독립 배포가 실제로 필요한 경계만 MSA 후보로 본다.",
            ],
          },
          {
            type: "callout",
            title: "지금의 공부 우선순위",
            text: "현재 JSP와 Spring MVC와 Tomcat 코드를 읽을 수 있게 되는 것이 출발점이다. 그 뒤 Java 17, Spring Boot, REST API, Docker, MSA 개념, Kubernetes 순서로 넓히면 현대화 사업의 대화를 훨씬 잘 따라갈 수 있다.",
          },
        ],
      },
    ],
    sources: [
      { label: "eGovFrame 5.0 Getting Started", href: "https://www.egovframe.go.kr/docs/5.0/getting-started/" },
      { label: "eGovFrame MSA Boot Template Project Wizard", href: "https://www.egovframe.go.kr/docs/5.0/egovframe-development/implementation-tool/ide/msa-template-wizard/" },
      { label: "실행환경 Migration 가이드 (3.x → 4.0)", href: "https://www.egovframe.go.kr/wiki/doku.php?id=egovframework:rtemigration4.0" },
    ],
  },
];

export const noteBySlug = (slug: string) => notes.find((note) => note.slug === slug);
