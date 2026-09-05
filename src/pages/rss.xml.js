import rss from "@astrojs/rss";
import { issueToHtml } from "../lib/issue-html";
import { issues } from "../data/issues";

/** 전체 칼럼을 RSS로 내보낸다. 매일 아침 발행을 전제로 한다. */
export function GET(context) {
  const base = context.site.toString(); /* site 설정 — 끝에 슬래시, 하위 경로 배포의 기준점 */
  return rss({
    title: "pre-work",
    description: "일 하기 전 10분, 개발자가 꾸준히 성장하기 위한 뉴스레터",
    site: context.site,
    items: issues.map((issue) => ({
      title: `제${issue.no}호 — ${issue.title}`,
      description: issue.dek,
      /* 전문을 함께 내보내 리더 안에서 한 편이 끝나도록 한다 */
      content: issueToHtml(issue, base),
      pubDate: new Date(`${issue.date.replaceAll(".", "-")}T09:00:00+09:00`),
      link: `read/${issue.no}/`,
      categories: issue.tags,
    })),
    customData:
      "<language>ko-kr</language>" +
      `<atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${new URL("rss.xml", base)}" rel="self" type="application/rss+xml" />`,
  });
}
