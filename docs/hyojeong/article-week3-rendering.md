# 어디서, 언제 그릴 것인가: 서버·클라이언트 컴포넌트와 정적·동적 렌더링

App Router에서는 두 가지를 정해야 한다.

1. 컴포넌트를 어디서 실행할지
2. 화면을 언제 만들지

첫 번째 질문은 서버 컴포넌트와 클라이언트 컴포넌트, 그리고 둘 사이에 경계를 긋는 'use client'로 답한다. 두 번째 질문은 정적·동적 렌더링과 스트리밍으로 답한다. 순서대로 하나씩 살펴보자.

### 1. 서버 컴포넌트와 클라이언트 컴포넌트

App Router에서 layout과 page는 기본적으로 서버 컴포넌트이다. 상호작용이나 브라우저 API가 필요한 부분에만 클라이언트 컴포넌트를 얹는 것이 공식 문서가 권장하는 방식이다.

클라이언트 컴포넌트는 새로운 개념이 아니라 Page Router 시절부터 쓰던 일반 React 컴포넌트다. 서버에서만 실행되는 컴포넌트를 따로 서버 컴포넌트라고 부르면서, 나머지가 클라이언트 컴포넌트라는 이름을 얻었을 뿐이다.

#### 왜 두 종류의 컴포넌트로 나눴을까?

Page Router는 페이지에 들어간 모든 컴포넌트를 JS 번들에 담아 브라우저로 보냈다. 훅도 이벤트 핸들러도 없는 정적 컴포넌트는 하이드레이션할 이유가 없는데도 말이다. 그 결과는 다음과 같았다.

1. JS 번들이 불필요하게 커진다.
2. 번들을 불러오고 하이드레이션하는 시간이 늘어난다.
3. 결국 TTI(Time To Interactive)까지 늦어진다.

그래서 상호작용이 없는 컴포넌트를 서버 컴포넌트로 따로 분류해 번들에서 빼는 것이 서버 컴포넌트의 출발점이다.

| 구분 | 서버 컴포넌트 | 클라이언트 컴포넌트 |
| --- | --- | --- |
| 선언 방법 | 기본값 (아무것도 안 붙임) | 파일 최상단에 "use client" |
| 실행 위치 | 서버에서만 | 서버(사전 렌더링) + 브라우저(하이드레이션) |
| JS 번들 포함 | 제외 | 포함 |
| 이럴 때 씀 | DB·API에서 데이터 가져오기, API 키·토큰 같은 비밀 값 사용, 브라우저로 가는 JS 줄이기, FCP 개선과 스트리밍 | state와 이벤트 핸들러(onClick, onChange), useEffect 같은 생명주기 로직, localStorage·window 같은 브라우저 전용 API, 커스텀 훅 |
| 쓸 수 없는 것 | 훅, 이벤트 핸들러, React Context, 브라우저 전용 라이브러리 | 비밀 값(NEXT_PUBLIC_ 없는 환경 변수는 빈 문자열이 됨) |

공식 문서의 대표 예시는 검색창이 있는 레이아웃이다.

로고와 내비게이션 링크는 서버 컴포넌트로 두고, 검색창만 클라이언트 컴포넌트로 분리한다.

```tsx
// app/layout.tsx — 기본값이므로 서버 컴포넌트
import Search from './search' // 클라이언트 컴포넌트
import Logo from './logo'     // 서버 컴포넌트

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

### 2. 서버에서 브라우저까지 렌더링 흐름

두 컴포넌트를 잇는 것은 RSC Payload(React Server Component Payload)이다. 서버 컴포넌트를 렌더링한 트리를 압축·직렬화한 데이터로, 여기에는 세 가지가 담긴다.

- 서버 컴포넌트의 렌더링 결과
- 클라이언트 컴포넌트가 들어갈 자리(placeholder)와 그 JS 파일 참조
- 서버 컴포넌트가 클라이언트 컴포넌트에 넘긴 props

서버는 layout·page 같은 라우트 세그먼트 단위로 작업을 나눠, 서버 컴포넌트를 먼저 RSC Payload로 만든 뒤 클라이언트 컴포넌트와 합쳐 HTML을 사전 렌더링한다.

흔히 말하는 "클라이언트 컴포넌트는 서버에서 한 번, 브라우저에서 한 번 실행된다"는 설명은 첫 방문 기준이다. 앱 안에서 페이지를 이동할 때는 서버 HTML 없이 브라우저에서만 렌더링되고, 서버 컴포넌트는 미리 받아 둔 RSC Payload로 반영된다. 하이드레이션은 정적인 HTML에 이벤트 핸들러를 붙여 상호작용이 가능하게 만드는 React의 과정이다.

### 3. 'use client' - 서버 컴포넌트와 클라이언트 컴포넌트의 경계선

'use client'는 컴포넌트 하나를 표시하는 태그가 아니라, 서버 모듈 그래프와 클라이언트 모듈 그래프 사이의 경계(boundary)를 선언하는 React 기능이다. 이 파일에서 export한 컴포넌트는 클라이언트로 들어가는 입구가 된다.

**① 파일 맨 위, import 보다 위에 작성한다.**

디렉티브는 모듈 전체에 적용되므로 컴포넌트나 함수 안에 넣을 수 없다.

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**② 경계에만 붙이면 된다.**

'use client' 파일이 import하는 모듈과 직접 렌더링하는 컴포넌트는 모두 클라이언트 번들에 들어간다. 그래서 클라이언트 컴포넌트 파일마다 붙일 필요는 없고, 서버 컴포넌트에서 바로 렌더링할 파일에만 붙이면 된다.

클라이언트 컴포넌트가 import한 서버 컴포넌트가 클라이언트 컴포넌트로 바뀌는 것도 바로 이 규칙 때문이다. import하는 순간 클라이언트 모듈 그래프에 포함되기 때문이다.

**③ 경계는 최대한 아래로 (잎사귀 쪽으로) 내린다. 🍃🌿**

JS 번들을 줄이려면 큰 UI 덩어리 전체가 아니라 상호작용하는 컴포넌트 파일에만 'use client'를 붙인다. 레이아웃 전체 대신 검색창만 분리한 제일 처음 레이아웃 예시가 그 예다.

**④ 서버 컴포넌트를 넣고 싶다면 children으로 !!**

import하지 않고 children(또는 다른 props)로 넘긴 서버 컴포넌트는 클라이언트 모듈 그래프에 들어가지 않는다. 서버에서 미리 렌더링되고, 클라이언트 컴포넌트는 그 결과물만 받는다.

```tsx
// app/ui/modal.tsx
'use client'
export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

// app/page.tsx (서버 컴포넌트)
<Modal>
  <Cart /> {/* 서버 컴포넌트 그대로 유지 */}
</Modal>
```

React Context도 같은 방식이다. 서버 컴포넌트는 Context를 지원하지 않으므로, children을 받는 클라이언트 컴포넌트로 Provider를 만들고 가능한 깊은 곳에 둔다.

**⑤ props는 직렬화 가능해야 한다.**

서버에서 클라이언트로 넘기는 props는 RSC Payload에 담기므로 React가 직렬화할 수 있는 값이어야 한다. 함수는 대표적인 불가능 사례다. 여기서 직렬화(serialization)란 객체나 배열 같은 복잡한 값을 문자열이나 바이트처럼 단순한 형태로 바꾸는 과정이다. 네트워크로 보내거나 저장하려면 이 형태여야 한다.

```js
JSON.stringify({ title: '넥플리스 3주차', tags: ['next.js', 'webtory'] })
// '{"title":"넥플리스 3주차","tags":["next.js","webtory"]}'
```

함수는 값이 아니라 코드 블록이고, 클로저나 렉시컬 스코프 같은 주변 환경에 기대는 경우가 많다. 이 정보를 문자열로 표현할 수 없어서 직렬화가 불가능하고, RSC Payload에 담기지 못해 런타임 에러가 난다.

```tsx
'use client'
export default function Counter({
  onClick, // 함수는 직렬화할 수 없음
}) {
  return <button onClick={onClick}>Increment</button>
}
```

### 4. 정적 렌더링과 동적 렌더링

**정적 렌더링은 빌드 때 미리 만들어 두고 재사용하는 것, 동적 렌더링은 요청이 올 때마다 서버에서 만드는 것**이다. 이건 ‘언제 만드느냐’의 문제라서, 서버·클라이언트 컴포넌트 구분과는 별개다. 클라이언트 컴포넌트도 정적 HTML로 미리 렌더링될 수 있고, 서버 컴포넌트도 요청마다 렌더링될 수 있다.

| 구분 | 정적 렌더링 | 동적 렌더링 |
| --- | --- | --- |
| 만드는 시점 | 빌드 때 (또는 재검증 때) | 요청이 올 때 마다 |
| 결과물 | HTML + RSC Payload를 저장해 CDN에서 바로 제공 | 요청별로 새로 생성 |
| 잘 맞는 화면 | 도서 목록, 블로그, 문서처럼 모두에게 같은 내용 | 로그인 사용자 정보, 검색 결과처럼 요청 마다 다른 내용 |

#### 렌더링을 동적으로 만드는 요소는 ?

요청이 와야만 알 수 있는 값을 읽는 순간 그 부분은 미리 만들 수 없다. 공식 문서는 이를 런타임 API라고 부른다.

- cookies(), headers(): 사용자 쿠키와 요청 헤더
- searchParams: URL 쿼리 파라미터 (예: /search?q=react)
- params: 동적 경로 값. generateStaticParams로 미리 알려주면 빌드 때 만들 수 있음
- 캐시하지 않은 데이터 조회 (fetch, DB 쿼리 등)
- Math.random(), Date.now()처럼 실행할 때마다 달라지는 값 (요청마다 달라야 하면 connection() 사용)

반대로 모듈 import, fs.readFileSync 같은 동기 읽기, 순수 계산만 하는 컴포넌트는 설정 없이 자동으로 정적 렌더링된다.

#### 라우트 단위 vs. 컴포넌트 단위

Next.js 16부터 정식 옵션이 된 **Cache Components**(cacheComponents: true)를 켜느냐에 따라 정적·동적을 나누는 단위가 달라진다. 권장 설정으로 create-next-app을 실행해 만든 새 앱에는 이미 켜져 있고, 다음 메이저 버전에서는 모든 앱에 적용될 예정이다. 내 프로젝트가 어느 쪽인지는 next.config에서 확인하면 된다.

예를 들어 상품 목록 페이지 구석에 "안녕하세요, 효정님" 인사말이 하나 있다고 하자. 인사말은 로그인 쿠키를 읽어야 해서 요청이 와야만 만들 수 있다. 헤더와 상품 목록은 누구에게나 같다.

- **라우트 단위(이전 방식)**: 정적인지 동적인지를 페이지(라우트) 하나를 통째로 판단한다. 인사말이 cookies()를 읽는 순간 헤더와 상품 목록까지 페이지 전체가 요청마다 새로 렌더링된다. 미리 만들어 둔 HTML이 없으니 첫 화면도 서버가 페이지를 다 만들 때까지 기다려야 한다.
- **컴포넌트 단위(Cache Components)**: 컴포넌트마다 따로 판단한다. 인사말만 `<Suspense>`로 감싸면 헤더와 상품 목록은 빌드 때 정적 셸로 만들어지고, 인사말 자리만 fallback으로 비워 두었다가 요청 시 스트리밍으로 채운다.

즉 같은 코드라도 모델에 따라 ‘페이지 전체가 동적’이 되느냐, ‘특정 영역 하나만 동적’이 되느냐가 갈린다.

| 구분 | 이전 모델(Cache Components 꺼짐) | Cache Components 켜짐 |
| --- | --- | --- |
| 정적/동적 단위 | 라우트 전체 | 컴포넌트별 |
| cookies()를 읽으면 | 라우트 전체가 동적 렌더링 | `<Suspense>`로 감싼 부분만 요청 시 스트리밍, 나머지는 정적 |
| 라우트 강제 설정 | export const dynamic = 'force-dynamic' 또는 'force-static', export const revalidate | 필요없음 (컴포넌트 단위로 결정) |
| 결과물 | 정적 페이지 또는 동적 페이지 | 정적 셸(static shell) + 스트리밍되는 동적 구멍. 이를 Partial Prerendering(PPR)이라 부름 |

무엇을 캐시해 정적 결과에 넣을지('use cache', cacheLife 등)는 5주차 Caching에서 더 자세히 알아보도록 하자, 이 글에서는 렌더링 방식만 다룬다.

**나으 경험 참고 : force-dynamic이 답이 아니었던 경우 ...**

내 프로필 페이지에서 useSuspenseQuery로 프로필 API를 부르는 'use client' 컴포넌트를 만들었더니 빌드가 실패했다. 클라이언트 컴포넌트도 빌드 때 서버에서 사전 렌더링되는데, 이때 토큰 없이 API를 호출했기 때문이다.

처음에는 페이지에 export const dynamic = 'force-dynamic'을 붙여 빌드를 통과시켰다. 하지만 이건 사전 렌더링 시점을 빌드에서 요청 시점으로 옮길 뿐이다. 요청 시점의 서버 렌더링에도 브라우저에 있는 인증 정보는 없으므로, 인증이 준비되기 전에 쿼리가 실행되는 문제는 그대로 남는다.

최종적으로는 force-dynamic을 지우고, 인증이 끝날 때까지 자식을 그리지 않는 클라이언트 컴포넌트 AuthEntryGuard로 감쌌다.

```tsx
// app/profile/page.tsx
export default function ProfilePage() {
  return (
    <AuthEntryGuard>         {/* 인증 전에는 null을 그린다 */}
      <AsyncBoundary loadingState={...} errorState={...}>
        <MyProfileContainer />  {/* useSuspenseQuery로 프로필 조회 */}
      </AsyncBoundary>
    </AuthEntryGuard>
  )
}
```

서버 사전 렌더링 때는 인증 상태가 준비되지 않아 가드가 null만 그리므로 쿼리가 실행되지 않고, 브라우저에서 인증이 끝난 뒤에야 프로필을 조회한다. 문제는 ‘정적이냐 동적이냐’가 아니라 ‘언제 실행되느냐’였고, 그래서 렌더링 방식을 강제하는 대신 실행 조건을 건 것이다. force-dynamic을 붙이고 싶어질 때는, 먼저 그 코드가 서버 사전 렌더링 때 실행돼도 되는지부터 확인해 보자.

### 5. 스트리밍과 Suspense

스트리밍은 HTML을 한 번에 다 만들어 보내지 않고, 준비된 부분부터 조각으로 나눠 보내는 방식이다. 느린 데이터 하나가 페이지 전체를 붙잡지 않도록, 빠른 부분은 먼저 그리고 늦는 부분은 준비되는 대로 채운다. App Router에서는 따로 설정하지 않아도 동작하고, 나누는 단위는 `<Suspense>` 경계이다.

스트리밍이 없으면 가장 느린 추천 상품(3초)이 끝날 때까지 화면이 하얗게 비어 있다. 스트리밍이 있으면 제목은 즉시, 나머지는 준비되는 대로 나타난다.

핵심은 ~~

1. **정적 셸이 먼저 간다**: 레이아웃, 내비게이션, Suspense의 fallback처럼 바로 그릴 수 있는 부분이 즉시 전송된다.
2. **경계마다 따로 채워진다**: `<Suspense>`로 감싼 부분은 준비되는 순서대로 도착하고, 서로 기다리지 않는다.
3. **페이지 전체는 loading.js, 부분은 Suspense**: loading.js는 페이지를 통째로 Suspense로 감싼 것과 같다. 대부분의 페이지에서는 느린 부분 가까이에 `<Suspense>`를 두는 편이 낫다.
4. **동적 접근은 아래로 내린다**: cookies()나 params를 페이지 맨 위에서 await하면 그 아래 전체가 기다린다. 값이 필요한 컴포넌트를 Suspense로 감싸고 그 안에서 읽는다.

```tsx
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>                              {/* 정적 셸 */}
      <Suspense fallback={<p>Loading revenue...</p>}>
        <Revenue />                                   {/* 준비되면 채워짐 */}
      </Suspense>
      <Suspense fallback={<p>Loading orders...</p>}>
        <RecentOrders />                              {/* 따로 채워짐 */}
      </Suspense>
    </div>
  )
}
```

주의할 점 !!

- 스트리밍이 시작되면 상태 코드(200)를 바꿀 수 없다. 404가 필요하면 Suspense 경계 전에 notFound()를 부른다.
- fallback 크기는 실제 내용과 맞추고, 대표 이미지나 메인 제목은 Suspense 밖에 둔다. 그래야 화면이 덜 흔들리고 빨리 보인다.

---

그래서 ~~ 지금까지의 내용을 한마디로 줄이면, 컴포넌트를 만들 때는 두 가지를 정해야 한다. 어디서 실행할지(서버 컴포넌트와 클라이언트 컴포넌트의 경계)와 언제 그릴지(정적 렌더링과 동적 렌더링)다. 어느 쪽으로 두어야 할지 헷갈린다면 아래 체크리스트로 하나씩 점검해 보자.

- 상호작용(state, 이벤트 핸들러, useEffect, 브라우저 API)이 없다면 서버 컴포넌트로 두었는가?
- 'use client'를 파일 맨 위, 그리고 상호작용하는 가장 작은 컴포넌트에만 붙였는가?
- 클라이언트 컴포넌트에서 서버 컴포넌트를 import하지 않고 children으로 넘겼는가?
- 서버 → 클라이언트 props가 직렬화 가능한 값(함수 제외)인가?
- cookies(), headers(), searchParams를 읽는 부분이 페이지 전체를 동적으로 만들고 있지 않은가? (Cache Components라면 `<Suspense>`로 감쌌는가?)
- 느린 데이터를 읽는 컴포넌트를 `<Suspense>`로 감싸고, fallback 크기를 실제 내용과 맞췄는가?
- 로그인이 필요한 데이터를 클라이언트 컴포넌트에서 부른다면, 서버 사전 렌더링 때 실행되지 않도록 인증 준비 여부로 막았는가? (force-dynamic으로 우회하지 않기)