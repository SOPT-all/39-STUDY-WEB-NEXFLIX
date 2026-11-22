# 🎬 Week3 Rendering 실습 - sample (정답)

서버 컴포넌트, 클라이언트 컴포넌트, `'use client'`, 정적 렌더링, 동적 렌더링을 영화 목록 하나로 실습합니다.
이 폴더는 미션을 모두 완료한 **정답 코드**입니다. 미션은 `mission` 폴더에서 진행해주세요! 

---

## 🚀 실행 방법

```bash
pnpm install

# 미션 1~3 확인
pnpm dev

# 미션 4 확인 (반드시 build 후 start)
pnpm build
pnpm start
```

---

## 📂 파일 구조

```text
sample/
├── next.config.ts        # Cache Components OFF (○/ƒ를 라우트 단위로 확인하기 위해)
├── lib/
│   └── movies.ts         # 영화 더미 데이터
└── app/
    ├── layout.tsx
    ├── globals.css
    ├── page.tsx          # 미션 1~3
    ├── like-button.tsx   # 미션 1
    ├── toggle-panel.tsx  # 미션 2 (클라이언트)
    ├── movie-list.tsx    # 미션 2 (서버)
    ├── rate-button.tsx   # 미션 3
    ├── static/page.tsx   # 미션 4
    └── dynamic/page.tsx  # 미션 4
```

---

## 🔍 로그로 실행 위치 확인하기

모든 컴포넌트에 `console.log('[컴포넌트 이름] 렌더링')`이 들어 있습니다. 로그가 어디에 찍히는지 보면 컴포넌트가 어디서 실행되었는지 알 수 있습니다.

| 로그 위치 | 의미 |
|---|---|
| 터미널 | 서버에서 실행됨 |
| 브라우저 콘솔 (`Server` 배지 **있음**) | 서버에서 실행된 로그를 브라우저에 다시 보여준 것 (dev 모드 전용) |
| 브라우저 콘솔 (`Server` 배지 **없음**) | 브라우저에서 실행됨 |

> ✅ **배지가 없는 로그만 브라우저에서 실행된 것**입니다.
> dev 모드에서는 React가 서버 컴포넌트의 로그를 기록해 두었다가 브라우저에서 `Server` 배지를 붙여 다시 출력합니다.
> Strict Mode 때문에 브라우저 로그가 2번씩 찍힐 수 있습니다.

---

## 📝 미션 요약

| 미션 | 주제 | 파일 | 확인 방법 |
|---|---|---|---|
| 1 | `'use client'` 붙이기 | `like-button.tsx`, `page.tsx` | `pnpm dev` |
| 2 | import 대신 children으로 넘기기 | `toggle-panel.tsx`, `page.tsx` | `pnpm dev` |
| 3 | 직렬화 가능한 props만 넘기기 | `rate-button.tsx`, `page.tsx` | `pnpm dev` |
| 4 | 정적 vs 동적 렌더링 | `dynamic/page.tsx` | `pnpm build` → `pnpm start` |

---

## 1️⃣ 미션 1. `'use client'` 붙이기

### 개념

`useState`, `onClick` 같은 **상태와 이벤트**는 브라우저에서 동작해야 하므로 클라이언트 컴포넌트에서만 사용할 수 있습니다.
App Router의 컴포넌트는 기본적으로 서버 컴포넌트이므로, 파일 맨 위에 `'use client'`를 붙여 클라이언트 컴포넌트로 만듭니다.

### `'use client'`가 없으면

```text
You're importing a module that depends on `useState` into a React Server Component module.
This API is only available in Client Components. To fix, mark the file (or its parent) with the `"use client"` directive.
```

이 에러는 컴포넌트를 **사용할 때가 아니라 import할 때** 발생합니다.

### 정답 포인트

```tsx
'use client';

import { useState } from 'react';
```

### 확인

- 좋아요 버튼을 누르면 숫자가 올라갑니다.
- `[Page]`: 터미널 + 브라우저 콘솔(`Server` 배지)
- `[LikeButton]`: 터미널 + 브라우저 콘솔(배지 없음)

> 💡 클라이언트 컴포넌트인데 왜 터미널에도 찍힐까요?
> 클라이언트 컴포넌트도 첫 HTML을 만들기 위해 **서버에서 한 번 실행(SSR)** 되고, 브라우저에서 다시 실행되면서 이벤트가 연결(hydration)됩니다.
> `'use client'`는 "브라우저에서만 실행"이 아니라 "브라우저에서**도** 실행"이라는 뜻입니다.

---

## 2️⃣ 미션 2. import 대신 children으로 넘기기

### 개념

`'use client'`는 **경계**입니다. 클라이언트 컴포넌트가 import하는 모듈은 모두 클라이언트 번들에 포함됩니다.
따라서 클라이언트 컴포넌트 안에서 서버 컴포넌트를 import하면, 그 컴포넌트도 클라이언트 컴포넌트가 됩니다.
서버 컴포넌트를 클라이언트 컴포넌트 안에 보여주고 싶다면 **서버 컴포넌트에서 children으로 넘깁니다.**

### 정답 포인트

```tsx
// toggle-panel.tsx
export default function TogglePanel({ children }: { children: ReactNode }) {
  ...
  {open && children}
}
```

```tsx
// page.tsx
<TogglePanel>
  <MovieList />
</TogglePanel>
```

### 확인

| | 고치기 전 (직접 import) | 고친 후 (children) |
|---|---|---|
| 브라우저 콘솔의 `[MovieList]` | 배지 없이 찍힘 | `Server` 배지만 찍힘 |
| 목록을 닫았다 다시 열면 | `[MovieList]`가 다시 찍힘 | 찍히지 않음 |
| 빌드 로그 순서 | `[TogglePanel]` → `[MovieList]` | `[MovieList]` → `[TogglePanel]` |

> 💡 빌드 로그 순서가 바뀌는 이유
> 렌더링은 서버 컴포넌트 단계(RSC) → HTML 생성 단계(SSR) 순서로 진행됩니다.
> children으로 넘긴 `MovieList`는 서버 컴포넌트 단계에서 먼저 실행되고, `TogglePanel`은 HTML 생성 단계에서 실행됩니다.

---

## 3️⃣ 미션 3. 직렬화 가능한 props만 넘기기

### 개념

서버 컴포넌트가 클라이언트 컴포넌트에 넘기는 props는 네트워크를 거쳐 브라우저로 전달됩니다.
따라서 **직렬화할 수 있는 데이터**만 넘길 수 있고, 함수 같은 로직은 넘길 수 없습니다.
로직은 받는 쪽(클라이언트 컴포넌트) 안에서 작성합니다.

| 넘길 수 있음 | 넘길 수 없음 |
|---|---|
| string, number, boolean, null | 함수 (Server Action 제외) |
| 배열, 평범한 객체 | class 인스턴스 |
| Date, Map, Set, Promise | Symbol |

### 함수를 넘기면

```tsx
<RateButton movie={movies[1]} onRate={() => console.log(`${movies[1].title} 평가`)} />
```

```text
Error: Event handlers cannot be passed to Client Component props.
  {movie: ..., onRate: function onRate}
                       ^^^^^^^^^^^^^^^
```

에러가 `onRate`만 가리킵니다. `movie` 객체는 문제없이 전달됩니다.

### 정답 포인트

```tsx
// page.tsx
<RateButton movie={movies[1]} />
```

```tsx
// rate-button.tsx
const handleRate = () => {
  console.log(`${movie.title} 평가`);
  setRated(true);
};
```

### 확인

- 에러 없이 화면이 표시됩니다.
- 버튼을 누르면 "인터스텔라 (2014) 평가 완료"가 표시됩니다.

---

## 4️⃣ 미션 4. 정적 vs 동적 렌더링

### 개념

| | 정적 렌더링 | 동적 렌더링 |
|---|---|---|
| 렌더링 시점 | 빌드할 때 한 번 | 요청이 올 때마다 |
| 빌드 표시 | `○` | `ƒ` |
| 조건 | 요청마다 달라지는 값을 사용하지 않음 | `cookies()`, `headers()`, `searchParams` 등을 사용 |

폴더 이름이 아니라 **코드가 무엇을 사용하는지**에 따라 정적/동적이 결정됩니다.

### 정답 포인트

```tsx
import { cookies } from 'next/headers';

export default async function DynamicPage() {
  const cookieStore = await cookies();
  const name = cookieStore.get('name')?.value ?? '웹토리';
  ...
}
```

Next 15부터 `cookies()`는 Promise를 반환하므로 `await`가 필요합니다.

### 확인

> ⚠️ `pnpm dev`에서는 `/static`도 요청마다 다시 렌더링됩니다. 반드시 `pnpm build` → `pnpm start`로 확인합니다.

**빌드 결과**

```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /dynamic
└ ○ /static
```

고치기 전에는 `/dynamic`도 `○`로 표시됩니다.

**브라우저**

| 해볼 것 | `/static` | `/dynamic` |
|---|---|---|
| 새로고침 | 시각이 그대로 (빌드 시각) | 시각이 매번 바뀜 |
| `name` 쿠키를 넣고 새로고침 | 변화 없음 | "OO님, 안녕하세요"로 바뀜 |
| 터미널 로그 | 찍히지 않음 (빌드 때 한 번) | 새로고침마다 `[DynamicPage]` |

**쿠키 넣는 방법** (`F12` → Console)

```js
// 넣기 (한글은 encodeURIComponent로 감싸야 깨지지 않습니다)
document.cookie = 'name=' + encodeURIComponent('효정');

// 지우기
document.cookie = 'name=; max-age=0';
```
