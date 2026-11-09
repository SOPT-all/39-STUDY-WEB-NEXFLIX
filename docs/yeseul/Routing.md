# 🎬 App Router 라우팅

> Week2 · 조예슬
> 실습 코드: `practice/week2/mission` (직접 실습) · `practice/week2/sample` (완성본)

## Intro

> v13 이후 **App Router** 도입, 서버 컴포넌트 기반 동작

**App Router**

```
app/
└── my-list/
    └── page.tsx
```

**Pages Router**

```
pages/
└── my-list.tsx
```

> 💡 `app`과 `pages`를 함께 쓸 수 있고 App Router가 우선한다. 단, **두 폴더의 라우트가 같은 URL이 되면 빌드 에러**가 난다.

<details>
<summary><b>용어 정리 ^_____^</b></summary>

<br>

📍 **루트** : 트리나 서브트리의 첫 번째 노드

📍 **리프** : 자식이 없는 서브트리의 노드

📍 **세그먼트** : `/` 로 구분된 URL 경로의 일부

📍 **경로** : 도메인 이후에 오는 URL의 일부

</details>

---

## URL은 어떻게 만들어질까

### 📂 파일 기반 라우팅

> 💡 **폴더 = URL 세그먼트**, `page.tsx`가 있어야 공개된다.

- **폴더** : URL 세그먼트 정의 → 폴더 중첩 시 세그먼트도 중첩
- **파일** : `page`, `layout` 등 = 해당 세그먼트의 UI

<details>
<summary><b>특수 파일 👀</b></summary>

<br>

| 파일        | 역할                          |
| ----------- | ----------------------------- |
| `layout`    | 공유 UI (헤더, 내비게이션 등) |
| `page`      | 페이지 (라우트 공개)          |
| `loading`   | 로딩 스켈레톤                 |
| `not-found` | 404 UI                        |
| `error`     | 에러 바운더리                 |
| `template`  | 매번 다시 마운트되는 레이아웃 |
| `default`   | 병렬 라우트의 대체 페이지     |
| `route`     | API 엔드포인트                |

✅ 감싸는 순서 : `layout` → `template` → `error` → `loading` → `not-found` → `page`

```tsx
<Layout>
  {" "}
  {/* layout.tsx */}
  <Template>
    {" "}
    {/* template.tsx */}
    <ErrorBoundary fallback={<Error />}>
      {" "}
      {/* error.tsx */}
      <Suspense fallback={<Loading />}>
        {" "}
        {/* loading.tsx */}
        <NotFoundBoundary fallback={<NotFound />}>
          {" "}
          {/* not-found.tsx */}
          <Page /> {/* page.tsx */}
        </NotFoundBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>
```

✅ 하위 세그먼트는 부모 세그먼트 컴포넌트 안에 **중첩**

</details>

- **공개 조건** : `page` 또는 `route` 파일이 있어야 라우트 공개
- **Colocation** : 자주, 함께 변경되는 파일들을 같이 저장하는 방식
  - 클라이언트로 가는 건 `page` / `route` 의 반환값뿐이라, 다른 파일을 라우트 폴더에 같이 둬도 안전

```bash
app/
└── title/
    └── [id]/
        ├── page.tsx           # 라우트 (/title/1)
        ├── movie-info.tsx     # 상세 페이지에서만 쓰는 컴포넌트
        └── title.module.css   # 상세 페이지 전용 스타일
```

- **Private Folder** : `_folder` → 폴더명 앞에 `_`를 붙이면 해당 폴더와 하위 폴더 전체를 라우팅에서 제외

<details>
<summary>어차피 <code>page.tsx</code> 없으면 라우트 안 된다며?</summary>

<br>

‼️ **폴더 이름만 봐도 라우트가 아님**을 바로 구분 가능

‼️ 버전마다 업데이트 되는 특수 파일 이름과 충돌하더라도 안전

‼️ 에디터에서 `_` 폴더끼리 상단에 모여 정렬됨

</details>

### 🧭 동적 라우팅

> 💡 URL 일부가 데이터에 따라 달라질 때 대괄호 폴더 `[id]` 로 빈칸을 만들고, 들어온 값은 `params` 로 받음

| 폴더 이름           | 대괄호 자리에 오는 세그먼트 수 | ✅                                                | ❌                     |
| ------------------- | ------------------------------ | ------------------------------------------------- | ---------------------- |
| `title/[id]`        | 1개                            | `/title/1`                                        | `/title`, `/title/1/2` |
| `genre/[...slug]`   | 1개 이상                       | `/genre/action`, `/genre/action/korean`           | `/genre`               |
| `genre/[[...slug]]` | 0개 이상                       | `/genre`, `/genre/action`, `/genre/action/korean` | 없음                   |

**`params`로 받는 값**

| URL                      | params                           | 형태                     |
| ------------------------ | -------------------------------- | ------------------------ |
| `/title/1`               | `{ id: "1" }`                    | 문자열                   |
| `/genre/action/korean`   | `{ slug: ["action", "korean"] }` | 배열 (세그먼트 순서대로) |
| `/genre` (`[[...slug]]`) | `{ slug: undefined }`            | 값 없음                  |

**값을 꺼내는 곳**

- 서버 컴포넌트 (`page`, `layout`) → props의 `params`를 `await`

  ```tsx
  export default async function TitlePage({
    params,
  }: PageProps<"/title/[id]">) {
    const { id } = await params;
  }
  ```

  > `params`는 Promise라서 `await`로 꺼내야 함

- 클라이언트 컴포넌트 → `useParams()` 훅

  ```tsx
  "use client";
  import { useParams } from "next/navigation";

  const { id } = useParams();
  ```

> 💡 `params` 값은 항상 **문자열**이고, 사용자가 주소창에 아무 값이나 넣을 수 있다. → 숫자 비교 주의 필요 . . . 없는 값은 `notFound()` 처리
>
> ```tsx
> const movie = getMovie(id);
> if (!movie) notFound(); // /title/999 → 404
> ```

<details>
<summary>⚠️ <i>error</i></summary>

<br>

같은 위치에 이름만 다른 대괄호 폴더를 두 개 두면 에러

```bash
app/title/[id]/page.tsx
app/title/[movieId]/page.tsx   # 둘 다 /title/1 을 받으려 해서 충돌
```

</details>

### 🫂 Route Groups

> 💡 `(folderName)` 괄호 폴더는 정리용 → **URL에 포함되지 않는다!**

**사용 목적**

- 팀 / 관심사 / 기능별 라우트 정리
- 특정 라우트만 레이아웃 공유
- 같은 URL 깊이에서 그룹마다 다른 레이아웃 적용
- 루트 레이아웃 여러 개 정의

```bash
app/
├── layout.tsx
├── (main)/                 # 헤더 있는 화면
│   ├── layout.tsx
│   └── browse/page.tsx     # → /browse
├── (auth)/                 # 헤더 없는 화면
│   ├── layout.tsx
│   └── profiles/page.tsx   # → /profiles
└── (watch)/                # 풀스크린 재생 화면
    ├── layout.tsx
    └── watch/[id]/page.tsx # → /watch/1
```

⚠️ 다른 그룹의 라우트가 같은 URL이 되면 ERROR

```bash
(main)/about → /about
(auth)/about → /about        # 둘 다 /about 경로를 찾음
```

<details>
<summary>루트 레이아웃을 여러 개 사용할 경우</summary>

<br>

```bash
app/                    # app/layout.tsx 없음
├── (main)/layout.tsx   # ← 루트 레이아웃(1) (<html>, <body>)
└── (auth)/layout.tsx   # ← 루트 레이아웃(2) (<html>, <body>)
```

루트(1) 에서 루트(2)로 이동하면 `<html>` 부터 통째로 갈아끼운당 → 새로고침한 것처럼 **페이지 전체 재로드**

감싸줄 루트 레이아웃이 없으니 `app/page.tsx` (홈)도 그룹 안으로 옮겨야 한다.

</details>

---

## 공통 UI는 어떻게 나눌까

### 🎨 Layout

> 💡 **여러 페이지가 공유**하는 UI → 이동해도 상태가 유지되고, 리렌더되지 않는다!

**규칙 ☝🏻**

- `layout.tsx` 에서 default export → `children` prop으로 하위 페이지를 받음
- 루트 레이아웃(`app/layout.tsx`)은 **필수** → `<html>`, `<body>` 포함
- 폴더 계층을 따라 중첩 → 상위 레이아웃이 하위를 `children`으로 감쌈

```bash
# /title/1 접속 시
app/layout.tsx                  # <html><body>
└── (main)/layout.tsx           # 헤더
    └── title/[id]/page.tsx     # 상세 페이지
```

```tsx
// app/(main)/layout.tsx
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />   {/* /browse ↔ /my-list 이동해도 검색창 입력값 유지 */}
      {children}
    </>
  );
}

// /browse 일 때
<MainLayout>
  <Header />
  <BrowsePage />      ← 이것만
</MainLayout>

// /my-list 일 때
<MainLayout>
  <Header />
  <MyListPage />      ← 바뀜
</MainLayout>
```

**Layout vs. Template**

|           | Layout           | Template                            |
| --------- | ---------------- | ----------------------------------- |
| 이동할 때 | 그대로 유지      | 새로 마운트                         |
| 내부 상태 | 유지             | 초기화                              |
| 언제 써   | 헤더, 내비게이션 | input 초기화, `useEffect` 다시 실행 |

✅ `layout.tsx` → `template.tsx` 로 이름만 바꾸면 이동할 때마다 검색창이 초기화된당

> ⚠️ 레이아웃은 리렌더 X → 현재 경로(`pathname`) 못 읽음 → 경로 필요 시 클라이언트 컴포넌트로 빼서 `usePathname()` 사용
>
> ```tsx
> "use client";
> import { usePathname } from "next/navigation";
>
> export default function Header() {
>   const pathname = usePathname(); // 헤더 활성 메뉴 표시용
> }
> ```

---

## 페이지 사이를 어떻게 오갈까

### 🚘 Linking & Navigating

> 💡 페이지 이동은 기본적으로 `<Link>` → 새로고침 없이 **바뀐 부분만 갈아끼우자~~**

**이동 방법**

|               | 어디서              | 언제                                            |
| ------------- | ------------------- | ----------------------------------------------- |
| `<Link>`      | 어디서나            | 대부분 이걸로 충분 (default)                    |
| `useRouter()` | 클라이언트 컴포넌트 | 버튼 클릭 후 이동, 뒤로가기 등 코드로 이동할 때 |

```tsx
import Link from "next/link";
import { useRouter } from "next/navigation";

// 헤더 메뉴
<Link href="/my-list">내가 찜한 콘텐츠</Link>;

// 모달 닫기
const router = useRouter();
<button onClick={() => router.back()}>✕</button>;
```

> ⚠️ `useRouter` 는 `next/navigation` 에서 가져오라… (`next/router` 는 Pages Router용)

**이동이 왜 빠릅니까**

1. **Prefetching** : `<Link>` 가 화면에 보이면 **누르기 전에** 미리 받아둔다.

   ```
   영화 목록에 포스터가 보이는 순간
   "이거 누르겠지? 🤔"
   하고 상세 페이지를 미리 준비함

   → 클릭하면 바로 이동
   ```

2. **Client-side transitions** : `<Link>` 로 이동하면 **새로고침 없이** 바뀐 부분만 교체한다.

   ```
   포스터를 클릭하면
   "헤더는 그대로 두고 🙆‍♀️"
   아래 영화 목록만 상세 페이지로 쏙 바꿔 끼움

   → 깜빡임 없이 이동 + 검색창 글자도 그대로
   ```

3. **Streaming** : 준비된 부분부터 **먼저** 보여준다잉

   ```
   상세 페이지로 넘어갔는데 작품 정보가 아직 안 왔다면
   "일단 이것부터 보여줄게 🫡"
   하고 헤더 + 로딩 화면 먼저 띄움

   → 작품 정보가 준비되면 로딩 화면을 실제 내용으로 교체
   ```

**Soft vs. Hard Navigation**

|      | Soft                         | Hard                        |
| ---- | ---------------------------- | --------------------------- |
| 언제 | `<Link>` 클릭, `router.push` | 새로고침, 주소창 직접 입력  |
| 동작 | 바뀐 부분만 교체             | 페이지 전체를 처음부터 로드 |

<details>
<summary>⚠️ 동적 라우트에는 <code>loading.tsx</code> 추가하자</summary>

<br>

동적 라우트(`/title/[id]`)는 미리 받아두기가 거의 안 됨

→ 클릭해도 서버 응답이 올 때까지 멈춘 느낌 . . .

→ `loading.tsx` 가 있으면 일부라도 미리 받아두고, 클릭하자마자 로딩 화면이 뜬다!

</details>

---

## 한 화면에 여러 페이지를 보여주고 싶어

### 🗺️ Parallel Routes

> 💡 `@폴더` (슬롯) → **한 화면에 여러 페이지를 동시에** 렌더!

**뭔소리여**

```
/my-list 에 들어가면
"시청 중인 콘텐츠"랑 "추천 콘텐츠"가 한 화면에 같이 뜸
근데 둘은 각자 따로 놀잖여

→ 추천이 느려도 시청 중은 먼저 보이게 할 수 있따
```

**규칙**

- 폴더 이름 앞에 `@` → 슬롯
- 슬롯은 `layout`이 props로 받아서 원하는 자리에 배치
- `@` 는 URL에 안 나온당
- `children` 도 슬롯임 (이름 없는 기본 슬롯)
- props 이름 = 폴더 이름에서 `@` 빼고. . . (`@watching` → `watching`), import 필요 없음!

```bash
app/(main)/my-list/
├── layout.tsx            # 슬롯들을 받아서 배치
├── page.tsx              # → children
├── @watching/page.tsx    # → watching
└── @recommend/
    ├── page.tsx          # → recommend (2초 걸림)
    └── loading.tsx       # 얘만 로딩 중 표시
```

```tsx
export default function MyListLayout({ children, watching, recommend }) {
  return (
    <>
      {children}
      <section>{watching}</section> {/* @watching 자리 */}
      <section>{recommend}</section> {/* @recommend 자리 */}
    </>
  );
}
```

✅ 슬롯마다 `loading`, `error` 를 따로 둘 수 있어 하나가 느리거나 터져도 🤯 나머지는 멀쩡하다

**새로고침하면 슬롯은?**

```
링크로 이동(Soft)할 땐
"아까 뭐 보고 있었는지 기억하고 있어"
→ 바뀐 슬롯만 교체, 나머지는 그대로

새로고침(Hard)하면
"이 슬롯에 뭘 보여줘야 해?"
→ default.tsx 를 대신 보여줌
```

> ⚠️ `default.tsx` 없으면 에러나 `404` 맞음 → 슬롯 만들 땐 `default.tsx` 도 함께 만들 것

<details>
<summary><b>복잡다 . . . 언제 쓰는데?</b></summary>

<br>

**1. 사용자 Role에 따라 다른 화면을 보여줄 때**

```
키즈 프로필로 /browse에 들어오면 어린이용 화면

내 프로필로 /browse에 들어오면 전체 콘텐츠 . . .

→ 주소는 똑같이 /browse인데 화면이 다르지
슬롯을 따로 만들고 layout.tsx에서 전환
```

```bash
app/(main)/browse/
├── layout.tsx         # 프로필 보고 둘 중 하나 고름
├── page.tsx           # children
├── @kids/page.tsx     # 키즈용 화면
└── @adult/page.tsx    # 일반 화면
```

```tsx
import { cookies } from "next/headers";

export default async function BrowseLayout({ kids, adult }) {
  const profile = (await cookies()).get("profile")?.value;
  return profile === "키즈" ? kids : adult;
}
```

> ⚠️ 화면에는 하나만 보여도 **두 슬롯 모두 서버에서 실행**된다.

**2. 탭 (슬롯 안에 `layout` 두기)**

```
추천 콘텐츠 영역에 [영화][시리즈] 탭이 있을 때

[시리즈] 탭을 누르면
추천 콘텐츠 영역만 바꾸고 다른 영역은 그대로
```

```bash
app/(main)/my-list/
├── layout.tsx
├── page.tsx
├── default.tsx
├── @watching/
│   ├── page.tsx
│   └── default.tsx
└── @recommend/
    ├── layout.tsx               # [영화] [시리즈] 탭 버튼
    ├── page.tsx                 # /my-list          → 영화 (기본)
    └── series/page.tsx          # /my-list/series   → 시리즈
```

> ⚠️ `/my-list/series` 에서 새로고침하면 `@watching` 이랑 `children` 에는 `series` 가 없음 → 그래서 `default.tsx` 가 필요하다 . . . 어휴

**3. 모달 → Intercepting Routes랑 같이. . . >>>**

```
포스터를 누르면 목록은 그대로 두고 위에 모달을 띄우자
→ @modal 슬롯에 상세 모달을
```

</details>

### 📍 Intercepting Routes

> 💡 다음 페이지로 가는 길을 **가로채서** 지금 화면 위에 띄우자!

```
영화 목록에서 포스터를 눌렀다
→ 페이지 넘어가지 말고 여기다 띄우자
→ 목록 위에 상세 모달 (주소는 /title/1로 바뀜)

근데 여기서 새로고침하면?
원래 페이지 보여줄게
→ 상세 페이지 전체
```

|               | 포스터 클릭 (Soft)              | 새로고침 / 링크 공유 (Hard)  |
| ------------- | ------------------------------- | ---------------------------- |
| 주소창        | `/title/1`                      | `/title/1`                   |
| 렌더되는 파일 | `@modal/(.)title/[id]/page.tsx` | `(main)/title/[id]/page.tsx` |
| 화면          | 목록 위에 모달                  | 상세 페이지 전체             |

> 📍 `/title/1` 을 맡는 파일이 **2개** → 보던 화면이 있으면(Soft) 모달, 없으면(Hard) 진짜 페이지
>
> ⇒ 주소는 똑같지만 **어떻게 들어왔냐**에 따라 다른 파일이 뜬다~~

**규칙 → 상대 경로 `./` `../` 랑 비슷**

| 표기       | 의미                               |
| ---------- | ---------------------------------- |
| `(.)`      | 같은 레벨에 있는 것 싸악 가로챔    |
| `(..)`     | 한 칸 위에 있는 것 싸악 가로챔     |
| `(..)(..)` | 두 칸 위에 있는 것 싸악 가로챔     |
| `(...)`    | 맨 위 `app`부터 찾아서 싸악 가로챔 |

```bash
app/
├── layout.tsx                  # children + modal 슬롯
├── (main)/
│   └── title/[id]/page.tsx     # 새로고침·직접 접속 → 전체 페이지
└── @modal/
    ├── default.tsx             # 평소엔 null (모달 안 보임)
    └── (.)title/[id]/page.tsx  # 포스터 클릭 → 모달
```

⚠️ 칸 셀 때 `@modal`, `(main)` 은 안 셈! (URL에 안 나오는 폴더 . . .)

→ 그래서 `app/@modal` 안의 `(.)title` 이 `app/(main)/title` 과 같은 레벨이 됨

> ✅ Parallel(`@modal`) + Intercepting(`(.)title`) = 모달 완성‼️
>
> → 모달이 진짜 주소(`/title/1`)를 가지니까
>
> - 링크 복사해서 보내면 → 받은 사람은 상세 페이지로 바로 봄
> - 새로고침해도 내용 안 날아감
> - 뒤로가기 누르면 모달 닫힘

<details>
<summary>🚨 모달이 안 닫힌다면?</summary>

<br>

슬롯은 Soft 이동 때 맞는 파일이 없으면 **아까 보여주던 걸 계속 보여준다 . . .**

→ `@modal` 에 `[...catchAll]` 을 만들어서 다른 주소에서는 `null`이라고 알려주기

```bash
app/@modal/
└── [...catchAll]/page.tsx    # return null → 다른 페이지 가면 모달 닫힘
```

> 💡 `@modal` 을 `(main)` 안에 두면 이 catch-all 이 `/profiles`, `/watch/1` 까지 끌어들여서 404가 나요. 그래서 `app/` 바로 아래에 둬요!

</details>

---

## 페이지에 닿기 전에 무엇을 할 수 있을까

### ✨ Proxy

> 💡 요청이 페이지에 도착하기 **전에** 먼저 검사하는 문지기일세

```
프로필도 안 고르고 /browse 로 들어오려고 하면
→ /profiles 로 돌려보내는... 그녀석
```

**규칙 😮‍💨**

- 프로젝트 맨 위에 `proxy.ts` → `app` 안이 아니라 **`app` 옆**
- 프로젝트에 딱 1개만~
- `matcher` 로 검사할 주소를 정함 → 안 정하면 모든 요청 다 검사

```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (!request.cookies.get("profile")) {
    // 프로필 안 골랐으면
    return NextResponse.redirect(new URL("/profiles", request.url)); // /profiles 로!
  }
  return NextResponse.next(); // 골랐으면 통과
}

export const config = {
  matcher: ["/browse/:path*", "/my-list/:path*"], // 이 주소들만 검사
};
```

<details>
<summary>오 만약 <code>matcher</code> 에 <code>/profiles</code> 넣으면?</summary>

<br>

`/profiles` 로 보냈는데 또 검사 → 프로필 없어? → `/profiles` 로 가 → 또 검사 . . .

빙글빙글 무한반복 🎠🎠

</details>

**Middleware → Proxy (v16)**

|      | Before          | After      |
| ---- | --------------- | ---------- |
| 파일 | `middleware.ts` | `proxy.ts` |
| 함수 | `middleware()`  | `proxy()`  |

✅ 기능은 똑같고 이름만 바뀜 ㅎ-ㅎ (기본 런타임은 Edge → Node.js)

**⚠️ 이럴 땐 쓰지 말자**

- 그냥 주소만 바꿔 보내는 거면 → `next.config.ts`의 `redirects`가 더 간단
- 오래 걸리는 데이터 요청 → 모든 요청 앞에서 실행되니까 다 느려짐
- 로그인 여부 확인 정도는 OK, 권한 체크 전부를 맡기지는 말자

---

## 참고 문헌

- [Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
- [Proxy](https://nextjs.org/docs/app/getting-started/proxy)
- [Dynamic Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- [layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout)
- [template.js](https://nextjs.org/docs/app/api-reference/file-conventions/template)
- [Parallel Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes)
- [default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default)
- [Intercepting Routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes)
- [proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)
