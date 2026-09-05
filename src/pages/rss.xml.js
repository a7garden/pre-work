import rss from "@astrojs/rss";
import { issues } from "../data/issues";

/** 전체 칼럼을 RSS로 내보낸다. 매일 아침 발행을 전제로 한다. */
export function GET(context) {
  return rss({
    title: "pre-work",
    description: "일 하기 전 10분, 개발자가 꾸준히 성장하기 위한 뉴스레터",
    site: context.site,
    items: issues.map((issue) => ({
      title: `제${issue.no}호 — ${issue.title}`,
      description: issue.dek,
      pubDate: new Date(`${issue.date.replaceAll(".", "-")}T09:00:00+09:00`),
      link: `daily/${issue.no}/`,
    })),
    customData: "<language>ko-kr</language>",
  });
}
