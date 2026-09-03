## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## 새 호 작성 — 사용자가 무언가를 중얼거릴 때

사용자가 이 프로젝트와 관련해 오늘 회사에서 겪은 일, 막혔던 코드, 새로 알게 된 개념 같은 것을
지나가듯 언급하면 — 명시적으로 "글 써줘" "새 호 만들어줘"라고 하지 않았더라도 — 그것을
`/daily/` 새 호로 정리해서 배포까지 하는 것이 이 프로젝트의 기본 동작이다. 매번 확인받을
필요 없이 바로 진행한다.

절차:

1. `npm run new:issue` 로 다음 호 뼈대를 `src/data/issues.ts` 맨 앞에 생성한다
   (날짜를 지정하려면 `npm run new:issue -- YYYY-MM-DD`).
2. 사용자가 중얼거린 내용을 `CONTENT.md`의 저작 규칙에 맞춰 한 편으로 완성한다.
   - 10분 안쪽, `takeaway` 한 문장, `callout`로 "오늘 회사에서 해 볼 것" 하나로 마무리.
   - 실무 코드는 그대로 옮기지 않고 구조만 남겨 각색한다 (공개 배포이므로).
   - 등장하는 개념이 `src/data/glossary.ts`에 없으면 용어를 함께 추가한다 —
     추가하는 즉시 사이트 전체 본문에 자동 연결된다.
   - 코드를 다루는 내용이면 `src/data/drills.ts`에 관련 훈련을 붙이는 것도 고려한다.
3. `npx astro build` 로 로컬 빌드가 깨지지 않는지 확인한다.
4. 커밋하고 `main`에 push한다 — push하면 GitHub Actions가 자동으로 GitHub Pages에 배포한다.
   별도 배포 명령은 없다.
5. `gh run list --limit 1 --json status,conclusion` 등으로 워크플로 완료를 확인하고,
   완료되면 라이브 URL을 사용자에게 알려준다.

이 프로젝트는 1인 개인 학습 플랫폼이라 PR 없이 `main`에 바로 push한다.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
