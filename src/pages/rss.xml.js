import rss from "@astrojs/rss";
import { issues } from "../data/issues";

/** 전체 데일리 호를 RSS로 내보낸다. 출근길 9시 발행으로 본다. */
export function GET(context) {
  return rss({
    title: "pre-work",
    description: "출근길 10분, 실무 코드를 읽는 힘",
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
