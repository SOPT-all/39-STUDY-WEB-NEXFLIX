# 🔨 Week2 실습: App Router 라우팅 (mission)

`pnpm install` → `pnpm dev`

헤더, 카드, 모달, 프로필 화면은 준비돼 있어요. **라우팅 파일만** 만들면 돼요!
막히면 `../sample` 에서 같은 경로의 파일을 열어보세요.

| 미션 | 주제                      | 만들 파일                                                                            | 확인                                 |
| ---- | ------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------ |
| 1    | 📂 파일 기반 라우팅       | `app/(main)/browse/page.tsx`                                                         | `/browse` 에 작품 목록               |
| 2    | 🎨 Layout                 | `app/(main)/layout.tsx`                                                              | 헤더 생김, 이동해도 검색창 글자 유지 |
| 3    | 🧭 동적 라우팅            | `app/(main)/title/[id]/page.tsx`, `app/(main)/genre/[...slug]/page.tsx`              | `/title/1`, `/genre/action/korean`   |
| 4    | 📂 특수 파일 + Colocation | `title/[id]/` 에 `loading`, `not-found`, `movie-info`, `like-button`                 | 로딩 화면, `/title/999`, `useParams` |
| 5    | 🫂 Route Groups           | `app/(watch)/layout.tsx`, `app/(watch)/watch/[id]/page.tsx`                          | `/watch/1` 헤더 없음                 |
| 6    | 🗺️ Parallel Routes        | `app/(main)/my-list/` 에 `layout`, `page`, `@watching`, `@recommend`                 | 두 영역이 따로 뜸                    |
| 7    | 📍 Intercepting Routes    | `app/@modal/` 에 `default`, `(.)title/[id]`, `[...catchAll]` + `app/layout.tsx` 수정 | 포스터 클릭 → 모달                   |
| 8    | ✨ Proxy                  | `proxy.ts` (`app` 옆!)                                                               | 프로필 없으면 `/profiles` 로         |

> 💡 `PageProps<"/title/[id]">` 타입은 `pnpm dev` 가 켜져 있어야 생겨요.
