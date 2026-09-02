import type { Block } from "./blocks";

export type Drill = {
  id: string;
  no: number;
  title: string;
  /** 이 훈련으로 기르는 감각 한 줄 */
  goal: string;
  /** 1 = 읽기, 2 = 추적, 3 = 판단 */
  level: 1 | 2 | 3;
  minutes: number;
  tags: string[];
  blocks: Block[];
};

export const drills: Drill[] = [
  {
    id: "url-to-controller",
    no: 1,
    title: "URL 하나로 Controller 찾아가기",
    goal: "주소창의 문자열만 보고 어떤 클래스·메서드가 실행되는지 짚어 낸다.",
    level: 1,
    minutes: 6,
    tags: ["@RequestMapping", "Controller", ".do"],
    blocks: [
      {
        type: "p",
        text: "레거시 코드를 처음 열면 파일이 수백 개다. 파일 목록부터 읽으면 반드시 길을 잃는다. 대신 브라우저에서 실제로 누른 화면의 주소 하나를 손에 쥐고 시작한다. 주소는 소스 어딘가에 문자열 그대로 적혀 있고, 그 문자열이 곧 출발점이다.",
      },
      {
        type: "codeRead",
        language: "java",
        caption: "공통컴포넌트 게시판 Controller (요약)",
        question: "이 메서드가 실제로 응답하는 주소는 무엇이고, 어떤 파일이 화면으로 그려지는가?",
        code: `@Controller
@RequestMapping("/cop/bbs")
public class EgovBBSManageController {

    @Resource(name = "EgovBBSManageService")
    private EgovBBSManageService bbsMngService;

    @RequestMapping("/selectBoardList.do")
    public String selectBoardList(
            @ModelAttribute("searchVO") BoardVO boardVO,
            ModelMap model) throws Exception {

        List<BoardVO> list = bbsMngService.selectBoardList(boardVO);
        model.addAttribute("resultList", list);
        return "cop/bbs/EgovNoticeList";
    }
}`,
        notes: [
          {
            lines: "1-2",
            title: "클래스에 붙은 매핑이 주소의 앞부분이다",
            body: "@Controller는 이 클래스가 요청을 받는 입구라는 표시이고, 클래스에 붙은 @RequestMapping(\"/cop/bbs\")는 이 안의 모든 메서드 주소 앞에 공통으로 붙는 접두어다. 메서드 매핑만 보고 주소를 판단하면 절반만 읽은 것이다.",
          },
          {
            lines: "5-6",
            title: "이름으로 주입된 Service",
            body: "@Resource는 타입이 아니라 이름으로 빈을 찾는다. \"EgovBBSManageService\"라는 문자열이 곧 다음 추적 대상이다. 이 이름으로 전역 검색하면 @Service(\"EgovBBSManageService\")가 붙은 구현 클래스가 나온다.",
          },
          {
            lines: "8",
            title: "메서드 매핑이 주소의 뒷부분이다",
            body: "클래스의 \"/cop/bbs\"와 메서드의 \"/selectBoardList.do\"가 이어져 최종 주소는 /cop/bbs/selectBoardList.do가 된다. .do는 실제 파일이 아니라 web.xml에서 DispatcherServlet에 넘기기로 약속한 확장자다.",
          },
          {
            lines: "10",
            title: "요청 파라미터가 객체로 들어온다",
            body: "@ModelAttribute(\"searchVO\")는 두 가지 일을 한다. 요청에 담긴 값을 BoardVO의 같은 이름 필드에 채우고, 그 객체를 \"searchVO\"라는 이름으로 화면에도 넘긴다. 검색 후 조건이 화면에 그대로 남아 있는 이유가 이것이다.",
          },
          {
            lines: "14",
            title: "여기서 붙인 이름이 JSP에 그대로 나온다",
            body: "\"resultList\"라는 문자열은 JSP에서 ${resultList}로 다시 등장한다. 화면과 서버 코드를 잇는 가장 확실한 검색 키워드이므로, JSP를 읽다 막히면 이 이름을 전역 검색한다.",
          },
          {
            lines: "15",
            title: "반환값은 파일 경로가 아니라 뷰 이름이다",
            body: "ViewResolver가 앞뒤에 prefix와 suffix를 붙여 실제 경로를 완성한다. prefix가 /WEB-INF/jsp/, suffix가 .jsp라면 /WEB-INF/jsp/cop/bbs/EgovNoticeList.jsp가 된다. 이 설정은 dispatcher-servlet.xml에 있다.",
          },
        ],
      },
      {
        type: "quiz",
        question: "이 메서드가 응답하는 최종 URL은?",
        options: [
          "/selectBoardList.do",
          "/cop/bbs/selectBoardList.do",
          "/cop/bbs/EgovNoticeList.jsp",
          "/WEB-INF/jsp/cop/bbs/selectBoardList.do",
        ],
        answer: 1,
        explain: "클래스 매핑 /cop/bbs 와 메서드 매핑 /selectBoardList.do 가 이어 붙는다. 마지막 return 값은 URL이 아니라 뷰 이름이므로 주소와 무관하다.",
      },
      {
        type: "callout",
        title: "현장에서 쓰는 순서",
        text: "화면에서 주소를 복사한다 → 확장자(.do)를 뺀 문자열을 전역 검색한다 → 걸린 @RequestMapping의 클래스 매핑을 함께 읽어 주소를 맞춰 본다. 이 세 걸음이면 어떤 화면이든 코드 입구를 찾는다.",
      },
    ],
  },

  {
    id: "view-name-to-jsp",
    no: 2,
    title: "return 문자열이 JSP 파일이 되는 계산",
    goal: "설정 두 줄과 반환값을 조합해 실제 화면 파일 경로를 손으로 계산한다.",
    level: 1,
    minutes: 5,
    tags: ["ViewResolver", "JSP", "dispatcher-servlet.xml"],
    blocks: [
      {
        type: "p",
        text: "Controller가 문자열 하나를 돌려주는데 화면이 뜬다. 마법처럼 보이지만 문자열 붙이기다. 설정에 적힌 prefix와 suffix를 반환값 앞뒤에 붙이면 그것이 파일 경로다.",
      },
      {
        type: "codeRead",
        language: "xml",
        caption: "dispatcher-servlet.xml 의 뷰 설정",
        question: "return \"cop/bbs/EgovNoticeList\" 는 어떤 파일을 가리키게 되는가?",
        code: `<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/jsp/egovframework/" />
    <property name="suffix" value=".jsp" />
    <property name="order"  value="1" />
</bean>`,
        notes: [
          {
            lines: "2",
            title: "prefix — 반환값 앞에 붙는 고정 경로",
            body: "/WEB-INF 아래에 두는 것이 핵심이다. 이 폴더는 브라우저가 직접 열 수 없어서, 사용자가 JSP 주소를 그대로 입력해 Controller를 건너뛰는 일을 막는다. 보안 설정이자 관례다.",
          },
          {
            lines: "3",
            title: "suffix — 반환값 뒤에 붙는 확장자",
            body: "그래서 Controller의 return 값에는 .jsp를 쓰지 않는다. 실수로 붙이면 EgovNoticeList.jsp.jsp를 찾게 되어 404가 난다.",
          },
          {
            lines: "4",
            title: "order — 뷰 해석기가 여럿일 때의 순서",
            body: "JSON을 반환하는 해석기나 타일즈(Tiles) 해석기가 함께 등록된 프로젝트에서는 이 숫자가 작은 것부터 시도한다. 화면 대신 엉뚱한 결과가 나온다면 순서를 확인한다.",
          },
        ],
      },
      {
        type: "quiz",
        question: "위 설정에서 Controller가 return \"cop/bbs/EgovNoticeList\" 를 반환했다. 실제로 열리는 파일은?",
        options: [
          "/WEB-INF/jsp/cop/bbs/EgovNoticeList.jsp",
          "/WEB-INF/jsp/egovframework/cop/bbs/EgovNoticeList.jsp",
          "/cop/bbs/EgovNoticeList.jsp",
          "/WEB-INF/egovframework/cop/bbs/EgovNoticeList.jsp",
        ],
        answer: 1,
        explain: "prefix(/WEB-INF/jsp/egovframework/) + 반환값(cop/bbs/EgovNoticeList) + suffix(.jsp)를 그대로 이어 붙이면 된다. 화면이 404라면 이 계산 결과대로 파일이 실제로 있는지부터 확인한다.",
      },
    ],
  },

  {
    id: "model-to-el",
    no: 3,
    title: "Model의 이름을 화면에서 다시 만나기",
    goal: "JSP의 ${...}를 보고 그 값을 담은 서버 코드를 역추적한다.",
    level: 2,
    minutes: 7,
    tags: ["EL", "JSTL", "Model"],
    blocks: [
      {
        type: "p",
        text: "화면을 읽는 방향은 서버와 반대다. JSP에서 낯선 값을 만나면, 그 이름을 그대로 들고 Controller로 거슬러 올라간다. 이름은 절대 변형되지 않으므로 검색이 정확히 통한다.",
      },
      {
        type: "codeRead",
        language: "jsp",
        caption: "게시판 목록 JSP (요약)",
        question: "이 화면이 필요로 하는 값 세 가지는 각각 서버 어디에서 담겼을까?",
        code: `<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="/WEB-INF/tld/com/egovframe.tld" %>

<table>
  <c:forEach var="result" items="\${resultList}" varStatus="status">
    <tr>
      <td>\${result.rowNo}</td>
      <td><a href="<c:url value='/cop/bbs/selectBoardArticle.do'/>?nttId=\${result.nttId}">
        <c:out value="\${result.nttSj}" />
      </a></td>
      <td>\${result.frstRegisterNm}</td>
    </tr>
  </c:forEach>

  <c:if test="\${empty resultList}">
    <tr><td colspan="3">등록된 게시물이 없습니다.</td></tr>
  </c:if>
</table>

<ui:pagination paginationInfo="\${paginationInfo}"
               type="image" jsFunction="fn_egov_link_page" />`,
        notes: [
          {
            lines: "1-2",
            title: "태그 라이브러리 선언이 먼저다",
            body: "prefix로 선언한 이름이 아래 태그의 접두어가 된다. c는 JSTL 표준 태그, ui는 표준프레임워크가 제공하는 커스텀 태그다. 태그가 화면에 글자 그대로 찍힌다면 이 선언이 빠졌거나 라이브러리가 없는 것이다.",
          },
          {
            lines: "5",
            title: "${resultList} — Controller에서 온 이름",
            body: "model.addAttribute(\"resultList\", list) 로 담긴 값이다. items에 리스트를 주고 var에 한 항목의 별칭을 정하면, 반복 안에서 result 라는 이름으로 각 행을 쓸 수 있다.",
          },
          {
            lines: "7",
            title: "result.rowNo — SQL이 만든 컬럼일 수 있다",
            body: "VO에 없는 필드가 나오면 Mapper XML을 본다. ROW_NUMBER() 같은 함수로 계산해 내려보낸 값을 EgovMap이 카멜케이스 키로 바꿔 준 경우가 흔하다.",
          },
          {
            lines: "8-10",
            title: "c:out 은 그냥 출력이 아니다",
            body: "<c:out>은 <, > 같은 문자를 이스케이프해서 내보낸다. 사용자가 입력한 제목을 ${result.nttSj} 로 바로 찍으면 XSS 통로가 되므로, 입력값 출력에는 c:out을 쓰는 것이 기본이다.",
          },
          {
            lines: "16",
            title: "empty 는 null과 빈 목록을 함께 본다",
            body: "EL의 empty 연산자는 null, 빈 문자열, 크기가 0인 컬렉션을 모두 참으로 본다. 목록 화면의 \"데이터 없음\" 처리는 거의 항상 이 형태다.",
          },
          {
            lines: "21-22",
            title: "paginationInfo — 세 번째 이름",
            body: "Controller가 PaginationInfo 객체를 만들어 model에 담아야 이 태그가 동작한다. 페이지 번호가 아예 안 보인다면 화면이 아니라 Controller에서 이 이름을 담았는지부터 확인한다.",
          },
        ],
      },
      {
        type: "quiz",
        question: "목록은 잘 나오는데 페이지 번호만 보이지 않는다. 가장 먼저 확인할 곳은?",
        options: [
          "JSP의 <ui:pagination> 태그 속성 철자",
          "Controller가 model에 \"paginationInfo\"를 담았는지",
          "Mapper XML의 ORDER BY 절",
          "dispatcher-servlet.xml의 prefix 설정",
        ],
        answer: 1,
        explain: "목록이 나온다는 것은 URL 매핑·뷰 해석·SQL이 모두 정상이라는 뜻이다. 남은 변수는 화면이 요구하는 두 번째 이름이 담겼는지 여부다. EL은 없는 이름을 만나도 오류 없이 빈 값으로 지나가기 때문에, 이런 증상은 조용히 나타난다.",
      },
      {
        type: "callout",
        title: "EL이 조용한 것이 함정이다",
        tone: "warn",
        text: "${resultLst} 처럼 이름을 한 글자 틀려도 JSP는 예외를 던지지 않고 빈 값을 출력한다. 화면이 비어 있을 때 오류 로그가 없다고 안심하지 말고, 이름 철자부터 대조한다.",
      },
    ],
  },

  {
    id: "mybatis-binding",
    no: 4,
    title: "#{ } 와 ${ } — 한 글자가 취약점이 되는 자리",
    goal: "Mapper XML을 읽으며 안전한 바인딩과 위험한 치환을 즉시 구분한다.",
    level: 2,
    minutes: 8,
    tags: ["MyBatis", "SQL 인젝션", "동적 SQL"],
    blocks: [
      {
        type: "p",
        text: "MyBatis에서 값을 넣는 방법은 두 가지고, 생김새는 한 글자만 다르다. 그런데 하나는 값으로 들어가고 다른 하나는 SQL 문장 자체로 들어간다. 이 차이를 모르면 정상 동작하는 코드가 그대로 보안 지적 사항이 된다.",
      },
      {
        type: "codeRead",
        language: "xml",
        caption: "게시물 목록 조회 Mapper",
        question: "이 SQL에서 외부 입력이 그대로 문장 구조에 끼어들 수 있는 자리는 어디인가?",
        code: `<select id="selectBoardList" parameterType="boardVO" resultType="egovMap">
  SELECT NTT_ID, NTT_SJ, FRST_REGISTER_NM
    FROM COMTNBBS
   <where>
     <if test="searchKeyword != null and searchKeyword != ''">
       AND NTT_SJ LIKE '%' || #{searchKeyword} || '%'
     </if>
     <if test="bbsId != null">
       AND BBS_ID = #{bbsId}
     </if>
   </where>
   ORDER BY \${sortColumn} \${sortOrder}
   LIMIT #{recordCountPerPage} OFFSET #{firstIndex}
</select>`,
        notes: [
          {
            lines: "1",
            title: "id 가 Java 메서드와 이어지는 고리",
            body: "Mapper 인터페이스의 selectBoardList() 메서드와 이 id가 같은 문자열이어야 연결된다. resultType=\"egovMap\"은 결과를 VO 대신 EgovMap으로 받겠다는 뜻이고, 컬럼 NTT_SJ는 화면에서 ${result.nttSj}가 된다.",
          },
          {
            lines: "4",
            title: "<where> 는 AND를 알아서 정리한다",
            body: "조건이 하나도 참이 아니면 WHERE 자체를 만들지 않고, 첫 조건 앞의 AND는 지워 준다. 그래서 각 <if> 안에 AND를 붙여 두는 것이 관례다. 손으로 WHERE 1=1 을 쓰는 옛 방식을 대체한다.",
          },
          {
            lines: "6",
            title: "#{ } — 값으로 바인딩된다",
            body: "PreparedStatement의 자리표시자(?)로 바뀌고 값은 나중에 따로 전달된다. 입력에 따옴표나 OR 1=1 이 들어 있어도 그냥 검색어 문자열일 뿐, 문장 구조를 바꾸지 못한다. 일반 입력값에는 예외 없이 이것을 쓴다.",
          },
          {
            lines: "12",
            title: "${ } — 문자열이 SQL에 그대로 붙는다",
            body: "정렬 컬럼명은 값이 아니라 문장 구조라서 #{ }로는 넣을 수 없다. 그래서 ${ }를 쓸 수밖에 없는 자리다. 문제는 sortColumn이 화면에서 그대로 넘어온 값이라면, 여기에 어떤 SQL 조각이든 끼워 넣을 수 있다는 것이다.",
          },
          {
            lines: "13",
            title: "페이징 값은 다시 #{ } 로",
            body: "행 수와 시작 위치는 순수한 값이므로 바인딩이 가능하다. PaginationInfo가 계산해 준 firstIndex가 여기로 들어온다.",
          },
        ],
      },
      {
        type: "quiz",
        question: "12번째 줄의 ${sortColumn}을 안전하게 다루는 방법으로 가장 적절한 것은?",
        options: [
          "#{sortColumn} 으로 바꾸면 해결된다",
          "Service에서 허용된 컬럼명 목록에 있는 값만 통과시킨다",
          "JSP에서 select 박스로만 고르게 하면 충분하다",
          "SQL 주석을 붙여 무력화한다",
        ],
        answer: 1,
        explain: "#{ }는 값 자리에만 쓸 수 있어 컬럼명에는 통하지 않는다. 화면을 select 박스로 제한해도 요청은 얼마든지 직접 만들어 보낼 수 있으므로 화면 제약은 방어가 아니다. 서버에서 허용 목록과 대조해 목록에 없으면 기본값으로 되돌리는 것이 표준 대응이다.",
      },
      {
        type: "callout",
        title: "코드 리뷰에서 이 한 줄만은",
        text: "Mapper XML을 열면 먼저 ${ } 를 전부 찾는다. 컬럼명·정렬 방향·테이블명처럼 구조에 해당하는 자리 외에 ${ }가 있다면, 그 자리는 이유를 물어봐야 하는 곳이다.",
      },
    ],
  },

  {
    id: "transaction-trap",
    no: 5,
    title: "롤백되지 않는 @Transactional 읽어 내기",
    goal: "트랜잭션이 걸린 것처럼 보이지만 실제로는 풀려 있는 코드를 알아본다.",
    level: 3,
    minutes: 8,
    tags: ["@Transactional", "AOP", "프록시"],
    blocks: [
      {
        type: "p",
        text: "@Transactional은 코드가 아니라 선언이다. 실제 커밋과 롤백은 프록시가 대신 수행한다. 그래서 프록시를 거치지 않거나, 프록시가 롤백해야 할 신호를 받지 못하면 어노테이션은 붙어 있어도 아무 일도 하지 않는다.",
      },
      {
        type: "codeRead",
        language: "java",
        caption: "게시물 등록 Service 구현체",
        question: "insertBoardArticle 중간에서 실패하면 앞선 INSERT는 되돌아갈까?",
        code: `@Service("EgovBBSManageService")
public class EgovBBSManageServiceImpl extends EgovAbstractServiceImpl
        implements EgovBBSManageService {

    @Resource(name = "EgovBBSManageDAO")
    private EgovBBSManageDAO bbsMngDAO;

    @Transactional
    public void insertBoardArticle(BoardVO boardVO) {
        try {
            bbsMngDAO.insertBoardArticle(boardVO);
            fileService.insertFileInfs(boardVO.getFiles());
        } catch (Exception e) {
            egovLogger.error("게시물 등록 실패", e);
        }
    }

    public void registerAll(List<BoardVO> list) {
        for (BoardVO vo : list) {
            this.insertBoardArticle(vo);
        }
    }
}`,
        notes: [
          {
            lines: "1-2",
            title: "이름 있는 빈 + 표준프레임워크 상위 클래스",
            body: "@Service(\"...\")로 이름을 주었기 때문에 Controller가 @Resource(name=\"EgovBBSManageService\")로 받을 수 있다. EgovAbstractServiceImpl을 상속하면 egovLogger 같은 공통 도구가 따라온다 — 아래 13번 줄에서 쓰는 그 로거다.",
          },
          {
            lines: "8",
            title: "선언은 되어 있다",
            body: "이 메서드는 프록시를 통해 호출될 때 트랜잭션 경계 안에서 실행된다. 정상 종료하면 커밋, 런타임 예외로 빠져나가면 롤백이 기본 동작이다.",
          },
          {
            lines: "10-15",
            title: "함정 하나 — 예외를 잡아 삼켰다",
            body: "catch가 예외를 붙잡고 로그만 남긴 뒤 메서드는 정상 종료한다. 프록시 입장에서는 아무 문제 없이 끝난 것이므로 커밋한다. 첨부파일 저장이 실패해도 게시물 INSERT는 남는다. 되돌리려면 예외를 다시 던지거나 rollbackFor를 지정해야 한다.",
          },
          {
            lines: "18-22",
            title: "함정 둘 — 자기 자신을 직접 불렀다",
            body: "registerAll은 this.insertBoardArticle()로 같은 객체의 메서드를 부른다. 이 호출은 프록시를 거치지 않고 원본 객체 안에서 곧바로 일어나므로 @Transactional이 적용되지 않는다. 어노테이션이 무시되는 대표적인 자리다.",
          },
        ],
      },
      {
        type: "quiz",
        question: "registerAll()이 100건을 처리하다 50번째에서 DB 오류가 났다. 결과는?",
        options: [
          "100건 모두 롤백된다",
          "49건은 저장되고 50번째부터 중단된다",
          "50건이 저장된 뒤 오류가 로그로만 남고 나머지도 계속 처리된다",
          "트랜잭션이 없으므로 아무것도 저장되지 않는다",
        ],
        answer: 2,
        explain: "self-invocation이라 트랜잭션 경계가 없고, 안쪽 메서드는 예외를 잡아 로그만 남기므로 반복문은 멈추지 않는다. 결과적으로 실패한 건만 빠진 채 나머지가 모두 저장된다 — 가장 발견하기 어려운 형태의 데이터 불일치다.",
      },
      {
        type: "callout",
        title: "읽을 때 확인하는 세 가지",
        tone: "warn",
        text: "첫째, @Transactional이 붙은 메서드가 public인가. 둘째, 안에서 예외를 잡아 삼키지 않는가. 셋째, 같은 클래스 안에서 this로 부르고 있지 않은가. 셋 중 하나라도 걸리면 그 트랜잭션은 선언만 있는 상태다.",
      },
    ],
  },

  {
    id: "generation-check",
    no: 6,
    title: "import 한 줄로 프로젝트 세대 판별하기",
    goal: "낯선 저장소를 받았을 때 3.x인지 4.x 이상인지 30초 안에 가른다.",
    level: 1,
    minutes: 4,
    tags: ["eGovFrame 3.8", "pom.xml", "마이그레이션"],
    blocks: [
      {
        type: "p",
        text: "인수인계 없이 저장소만 받는 일이 잦다. 이때 가장 먼저 알아야 할 것은 기능이 아니라 세대다. 세대를 알면 어떤 문법이 나올지, 어떤 설정 파일이 어디 있을지가 함께 정해진다.",
      },
      {
        type: "codeRead",
        language: "java",
        caption: "Service 구현체 상단의 import 문",
        question: "이 프로젝트는 3.x인가, 4.x 이상인가?",
        code: `package egovframework.com.cop.bbs.service.impl;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.rte.fdl.idgnr.EgovIdGnrService;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;`,
        notes: [
          {
            lines: "3-5",
            title: "egovframework.rte — 3.x 계열의 표식",
            body: "실행환경 패키지가 egovframework.rte로 시작하면 3.x다. 4.0부터는 org.egovframe.rte로 바뀌었고, pom.xml의 groupId도 함께 바뀐다. 마이그레이션의 첫 작업이 이 문자열 일괄 치환인 이유다.",
          },
          {
            lines: "3",
            title: "fdl · psl · ptl 은 실행환경 레이어 약어다",
            body: "fdl은 공통기반(Foundation), psl은 데이터처리(Persistence), ptl은 화면처리(Presentation)를 뜻한다. import 경로만 봐도 그 클래스가 어느 레이어의 부품인지 알 수 있다.",
          },
          {
            lines: "7-8",
            title: "javax.* — Jakarta 이전 세대",
            body: "Servlet API가 javax.servlet이면 JDK 8 · Java EE 시절 코드다. 5.0 계열은 jakarta.servlet을 쓴다. 이 접두어 하나가 라이브러리 호환성의 경계선이라, 버전 올리기가 단순 숫자 변경이 아닌 이유가 된다.",
          },
        ],
      },
      {
        type: "table",
        caption: "저장소를 받으면 순서대로 확인하는 네 곳",
        head: ["확인할 곳", "3.8 계열이라면", "5.0 계열이라면"],
        rows: [
          ["import 접두어", "egovframework.rte.*", "org.egovframe.rte.*"],
          ["Servlet 패키지", "javax.servlet.*", "jakarta.servlet.*"],
          ["pom.xml java.version", "1.8", "17 이상"],
          ["빌드 산출물", "war → 외부 Tomcat", "war 또는 실행 가능한 jar"],
        ],
      },
      {
        type: "quiz",
        question: "위 import 문만 보고 확실하게 말할 수 있는 것은?",
        options: [
          "이 프로젝트는 Spring Boot를 쓴다",
          "이 프로젝트는 표준프레임워크 3.x 계열이고 JDK 8 시대의 Servlet API를 쓴다",
          "이 프로젝트는 MSA로 구성되어 있다",
          "이 프로젝트는 XML 설정을 전혀 쓰지 않는다",
        ],
        answer: 1,
        explain: "egovframework.rte 접두어가 3.x를, javax.servlet이 Jakarta 이전 세대를 가리킨다. 아키텍처나 설정 방식은 import 문만으로는 알 수 없으므로 pom.xml과 web.xml을 이어서 본다.",
      },
    ],
  },
];

export const drillById = (id: string) => drills.find((d) => d.id === id);
