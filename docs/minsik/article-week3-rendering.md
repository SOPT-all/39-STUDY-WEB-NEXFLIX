# 넥제. 자네는 렌더링을 어떻게 하는가?

- 주차: Week 3 · Rendering
- 작성자: 심민식
- [벨로그에서 읽기](https://velog.io/@minsik1014/%EB%84%A5%EC%A0%9C.-%EC%9E%90%EB%84%A4%EB%8A%94-%EB%A0%8C%EB%8D%94%EB%A7%81%EC%9D%84-%EC%96%B4%EB%96%BB%EA%B2%8C-%ED%95%98%EB%8A%94%EA%B0%80)

---

지난 글에서는 Next.js의 App Router가 폴더와 파일을 페이지로 연결하는 규칙을 알아봤다.

`page.tsx`에 화면을 작성하고, `layout.tsx`에 공통 영역을 두면 주소에 따라 페이지가 연결됐다. 영화 상세 페이지처럼 주소의 일부가 달라지는 경우에는 대괄호 폴더를 사용했다.

이제 어디에 파일을 두면 어떤 페이지가 열리는지는 조금 알겠다.

그런데 페이지에 접속한 뒤, 그 화면은 누가 만드는 걸까?

3주차 영화 과제를 만들 때는 브라우저에서 API를 요청하고, 응답을 상태에 저장한 뒤 영화 목록을 표시했다. 검색어나 필터를 바꾸면 상태가 달라지고, 그에 맞춰 화면도 바뀌었다.

그러다 Next.js를 공부하면서 **서버 컴포넌트**와 **클라이언트 컴포넌트**라는 말을 만났다.

서버에서 실행하는 컴포넌트와 브라우저에서 실행하는 컴포넌트를 나누는 것 같았다. 상태나 클릭 이벤트를 사용하려면 파일 위에 `'use client'`를 붙이라고 한다.

이름만 보면 꽤 명확하다.

서버 컴포넌트는 서버에서, 클라이언트 컴포넌트는 브라우저에서 실행하면 되는 거 아닌가?

그런데 첫 페이지를 불러올 때는 클라이언트 컴포넌트도 서버에서 HTML을 만드는 데 사용될 수 있다고 한다.

![](https://velog.velcdn.com/images/minsik1014/post/6da013cb-503a-4867-b703-7c12f12021db/image.png)



> 자네… 클라이언트라면서 서버 일까지 하고 있었는가? 대체ㅔ 왜지..?

여기에 정적 렌더링과 동적 렌더링이라는 말까지 등장했다.

서버에서 만든다는 것과, 요청할 때마다 새로 만든다는 것은 또 다른 이야기라고 한다. 화면이 보이는 시점과 버튼이 클릭에 반응하는 시점도 구분해야 했다.

분명 페이지 하나를 띄우는 이야기였는데, 궁금한 것이 점점 늘어난다.

**어떤 코드를 서버에서 처리하고, 어떤 코드를 브라우저에서 처리할까? 화면은 언제 만들어지고, 언제부터 동작할까?**

![](https://velog.velcdn.com/images/minsik1014/post/b034a3b7-3693-4ce4-8a86-0da448a7ff6b/image.png)


> 넥제. 자네는 렌더링을 어떻게 하는가?

이번 글에서는 **Next.js 16의 App Router를 기준으로 서버·클라이언트 컴포넌트와 렌더링 과정을** 살펴보려고 한다.

먼저 각 컴포넌트의 역할과 `'use client'`의 경계를 알아보고, 정적·동적 렌더링과 하이드레이션으로 이어가 보자. 이후에는 서버와 클라이언트 컴포넌트를 조합하는 방법과, 느린 영역을 기다리는 동안 화면을 먼저 보여주는 방법까지 준비한 예제로 확인해보려고 한다.

먼저 서버 컴포넌트부터 살펴보자.

## 1. 서버 컴포넌트는 무엇을 할까?

Next.js의 App Router에서는 **페이지와 레이아웃이 기본적으로 서버 컴포넌트다.**

지난 글에서 작성했던 `page.tsx`와 `layout.tsx`도 별도로 클라이언트 경계를 선언하지 않았다면 서버 컴포넌트로 사용된다.

그렇다면 컴포넌트를 서버에서 실행한다는 것은 무슨 뜻일까?

### 컴포넌트를 실행하는 위치가 서버다

다음처럼 넥플릭스 멤버를 보여주는 페이지를 작성했다고 해보자.

```tsx
// app/page.tsx

const members = [
  { id: 1, name: '강효정' },
  { id: 2, name: '심민식' },
  { id: 3, name: '공기훈' },
];

export default function Page() {
  return (
    <main>
      <h1>넥플릭스 멤버</h1>

      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

코드 자체는 익숙하다. 배열을 `map`으로 순회하고, 각 멤버의 이름을 JSX로 반환한다.

여기서 중요한 것은 **이 컴포넌트 함수를 어디에서 실행하느냐**다.

서버 컴포넌트에서는 `Page`를 실행하고 멤버 목록을 구성하는 작업이 서버에서 이루어진다. 이 함수의 코드를 브라우저에 보내서 다시 실행하도록 하는 방식이 아니다.

브라우저에서 목록을 볼 수 있다고 해서, 목록을 만든 컴포넌트 코드까지 브라우저에서 실행된 것은 아닌 셈이다.

### 코드 대신 렌더링 결과를 전달한다

그렇다면 서버에서 만든 결과는 어떻게 브라우저까지 도착할까?

Next.js는 서버 컴포넌트의 렌더링 결과를 **RSC Payload**라는 데이터 형태로 전달한다. 여기에는 서버에서 렌더링한 결과와, 클라이언트 컴포넌트를 연결하는 데 필요한 정보 등이 담긴다.

첫 페이지를 불러올 때는 이 결과와 클라이언트 컴포넌트를 이용해 화면을 먼저 보여줄 HTML도 생성한다.

지금은 내부 형식을 외우기보다 다음 차이를 기억하면 된다.

```text
서버 컴포넌트 코드
    ↓ 서버에서 실행
렌더링 결과 생성
    ↓
브라우저의 화면 구성에 사용
```

**브라우저에는 서버 컴포넌트의 함수 코드가 아니라, 화면을 구성하는 데 필요한 결과가 전달된다.**

따라서 서버 컴포넌트에서만 사용하는 코드와 라이브러리를 클라이언트 번들에 포함하지 않을 수 있다. 브라우저가 내려받고 실행해야 할 JavaScript를 줄이는 데 도움이 된다.

### 데이터도 서버에서 가져올 수 있다

앞의 예제에서는 멤버 목록을 배열에 직접 작성했다.

실제 서비스에서는 API나 데이터베이스에서 멤버 정보를 가져와야 할 수도 있다. 서버 컴포넌트는 이런 데이터 조회를 서버에서 처리한 뒤, 결과를 이용해 화면을 구성할 수 있다.

```text
서버에서 멤버 데이터 조회
    ↓
조회한 데이터로 목록 구성
    ↓
결과를 전달해 브라우저에 표시
```

화면에 목록을 보여주기 위해 항상 브라우저에서 요청을 보내고, 응답을 상태에 저장하는 과정부터 준비할 필요는 없는 것이다.

다만 **서버에서 실행한다는 것과 요청할 때마다 새로 실행한다는 것은 서로 다른 이야기다.** 언제 렌더링하는지는 뒤에서 정적·동적 렌더링과 함께 살펴보겠다.

### 클릭에 반응하는 역할은 어떻게 할까?

멤버 목록을 보여주는 것까지는 가능했다.

그런데 목록 옆에 응원 버튼을 붙이고, 클릭할 때마다 숫자를 올리고 싶다면 어떨까?

이때는 사용자의 입력을 받고, 상태를 변경하고, 변경된 값을 화면에 반영해야 한다.

서버 컴포넌트에서는 `useState`, `useEffect`를 사용하거나 `onClick` 같은 이벤트 핸들러를 직접 연결할 수 없다.

**서버에서 화면을 구성하는 것만으로는 브라우저에서 계속 발생하는 상호작용까지 처리할 수 없는 것이다.**

그렇다면 클릭과 상태 변경이 필요한 부분은 어떻게 작성할까?

여기서 클라이언트 컴포넌트가 등장한다.

[Next.js 공식 문서 — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

## 2. 클릭하려면 클라이언트 컴포넌트가 필요할까?

앞에서 만든 멤버 목록에 응원 버튼을 추가해보자.

버튼을 클릭할 때마다 응원 횟수가 올라가려면 현재 숫자를 기억할 상태와, 클릭했을 때 상태를 바꾸는 이벤트 처리가 필요하다.

**이처럼 브라우저에서 사용자의 조작에 반응하는 부분은 클라이언트 컴포넌트로 작성할 수 있다.**

### 파일 위에 'use client'를 선언한다

```tsx
// app/CheerButton.tsx

'use client';

import { useState } from 'react';

export default function CheerButton() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      응원하기 {count}
    </button>
  );
}
```

파일 위에 `'use client'`가 추가됐다. import보다 위에 작성하는 이 지시문이 클라이언트 코드의 시작점을 표시한다.

나머지는 익숙한 React 코드다.

`useState`가 응원 횟수를 기억하고, 버튼을 클릭하면 이벤트 핸들러가 `setCount`를 호출한다. 이전 값에 1을 더한 상태가 반영되면서 화면의 숫자도 바뀐다.

```text
응원하기 0
    ↓ 클릭
응원하기 1
    ↓ 클릭
응원하기 2
```

클라이언트 컴포넌트에서는 이러한 상태와 이벤트 처리뿐 아니라 Effect나 브라우저 API를 사용하는 기능도 구현할 수 있다.

다만 브라우저 API를 **언제 사용하는지**도 중요하다. `'use client'`를 붙였다고 컴포넌트의 모든 코드가 브라우저에서만 실행되는 것은 아니기 때문이다. 이 부분은 다음 항목에서 이어서 살펴보자.

### 버튼 때문에 페이지 전체를 바꿔야 할까?

이제 서버 컴포넌트인 페이지에서 버튼을 가져와 사용해보자.

```tsx
// app/page.tsx

import CheerButton from './CheerButton';

export default function Page() {
  return (
    <main>
      <h1>넥플릭스</h1>
      <p>이번 주 발표도 무사히 끝나기를.</p>

      <CheerButton />
    </main>
  );
}
```

`page.tsx`에는 `'use client'`를 추가하지 않았다.

페이지는 서버 컴포넌트로 두고, 상태와 클릭 처리가 필요한 `CheerButton`만 클라이언트 컴포넌트로 분리한 것이다.

```text
Page — 서버 컴포넌트
└── CheerButton — 클라이언트 컴포넌트
```

**서버 컴포넌트에서 클라이언트 컴포넌트를 사용한다고 해서 부모까지 클라이언트 컴포넌트가 되는 것은 아니다.**

따라서 버튼 하나에 상호작용이 필요하다는 이유로 페이지 전체에 `'use client'`를 붙일 필요는 없다. 필요한 부분에 경계를 두면 브라우저로 전달하는 JavaScript의 범위를 줄일 수 있다.

### 'use client'는 어디까지 영향을 줄까?

여기서 `'use client'`를 단순히 “이 파일에서 Hook을 사용해도 된다”는 표시로만 기억하면 놓치는 부분이 있다.

이 지시문은 **서버와 클라이언트의 모듈 경계**를 선언한다.

예를 들어 `CheerButton`이 다른 컴포넌트를 가져와 사용한다고 해보자.

```text
CheerButton.tsx — 'use client'
└── import CountLabel
    └── import formatCount
```

이 경우 `CountLabel`과 `formatCount`도 클라이언트 코드에 포함된다. 각 파일에 `'use client'`를 반복해서 작성할 필요는 없다.

그렇다고 “화면에서 아래에 있는 컴포넌트는 전부 클라이언트 컴포넌트다”라는 뜻은 아니다.

**import로 연결되는 코드의 관계와, 화면에서 부모·자식으로 배치되는 관계는 구분해야 한다.**

서버에서 렌더링한 내용을 클라이언트 컴포넌트의 `children`으로 전달하는 방법도 있다. 이 조합은 뒤에서 예제로 살펴보겠다.

[Next.js 공식 문서 — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

여기까지 보면 역할이 나뉜 것 같다. 서버 컴포넌트는 서버에서 화면을 구성하고, 클라이언트 컴포넌트는 브라우저에서 상호작용을 처리한다.

그런데 이름 때문에 한 가지 오해하기 쉽다.

**클라이언트 컴포넌트라면 처음부터 브라우저에서만 화면을 만드는 걸까?**

첫 화면을 불러오는 과정에서는 조금 다른 일이 일어난다.



## 3. 클라이언트인데 서버에서도 화면을 만든다고?

앞에서 응원 버튼에 `'use client'`를 붙였다.

상태와 클릭 이벤트를 사용하니, 이제 이 버튼은 브라우저에서만 렌더링할 것 같다.

하지만 **Next.js에서 첫 페이지를 불러올 때는 클라이언트 컴포넌트도 서버에서 HTML을 미리 만드는 과정에 참여한다.**

도입부에서 의문을 가졌던 부분이다. 클라이언트 컴포넌트인데 서버에서도 화면을 만든다면, 브라우저에서는 무엇을 더 하는 걸까?

여기서는 **화면이 보이는 시점과, 화면을 조작할 수 있는 시점**을 나눠서 살펴보자.

### 먼저 HTML로 화면을 보여준다

앞에서 작성한 응원 버튼을 다시 보자.

```tsx
// app/CheerButton.tsx

'use client';

import { useState } from 'react';

export default function CheerButton() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      응원하기 {count}
    </button>
  );
}
```

첫 화면을 만드는 과정에서 서버는 이 버튼의 초기 상태인 `0`을 반영해 HTML을 생성할 수 있다.

브라우저는 전달받은 HTML을 이용해 다음 버튼을 먼저 보여준다.

```html
<button>응원하기 0</button>
```

이렇게 하면 클라이언트 JavaScript가 준비될 때까지 화면 전체를 비워둘 필요가 없다.

하지만 HTML이 도착했다고 해서 React의 클릭 처리까지 준비된 것은 아니다. 위 HTML에는 `setCount`를 실행하는 JavaScript 로직이 들어 있지 않다.

**버튼이 보인다는 것과, 클릭했을 때 숫자가 바뀐다는 것은 서로 다른 단계다.**

### 하이드레이션으로 상호작용을 연결한다

이후 브라우저에서 클라이언트 컴포넌트의 JavaScript를 불러오고 실행한다.

React는 서버에서 만들어 보낸 HTML을 재사용하면서 컴포넌트의 로직을 연결한다. 이 과정을 **하이드레이션(Hydration)**이라고 한다.

응원 버튼의 흐름을 정리하면 다음과 같다.

```text
서버에서 초기 HTML 생성
    ↓
브라우저에 '응원하기 0' 표시
    ↓
클라이언트 JavaScript 로드 및 실행
    ↓
하이드레이션으로 상호작용 연결
    ↓
클릭하면 상태 변경
    ↓
'응원하기 1' 표시
```

하이드레이션은 **서버에서 만든 화면을 React가 이어받아 상호작용할 수 있게 만드는 과정**으로 이해하면 좋다.

### JavaScript가 없어도 버튼은 보일까?

이 차이를 확인할 수 있도록 예제를 준비했다.

[예제 실행해보기](https://nexflix-rendering-lab.vercel.app/lab?step=hydration)

같은 서버 HTML을 사용하는 화면에서 JavaScript 실행을 막은 경우와 허용한 경우를 비교한다.

먼저 두 화면에 버튼이 모두 보이는지 확인하고, 각각의 버튼을 눌러보자.

![](https://velog.velcdn.com/images/minsik1014/post/9a9efc3c-d8f8-468f-ac8f-8803d0c4d018/image.png)

JavaScript 실행을 막은 화면에서도 서버에서 만든 버튼은 보인다. 하지만 클릭해도 예제의 상태는 바뀌지 않는다.

JavaScript 실행을 허용한 화면에서는 하이드레이션이 완료된 뒤 버튼을 누르면 상태가 바뀐다.

**HTML만으로 화면을 보여줄 수는 있지만, 이 버튼의 상태를 바꾸려면 JavaScript가 연결되어야 한다.**

### 'use client'는 브라우저에서만 실행하라는 뜻이 아니다

이제 `'use client'`의 의미를 조금 더 정확하게 정리할 수 있다.

클라이언트 컴포넌트는 브라우저에서 상태와 이벤트를 처리할 수 있다. 다만 첫 페이지를 불러올 때는 서버에서 초기 HTML을 만드는 데도 사용된다.

따라서 `'use client'`를 붙였다는 이유로 렌더링 중에 `window`나 `localStorage`를 바로 사용하면 문제가 생길 수 있다. 서버에는 이러한 브라우저 API가 없기 때문이다.

브라우저에서만 필요한 처리는 이벤트 핸들러나 `useEffect`처럼 실행 시점이 맞는 위치에 두어야 한다.

또한 지금 설명한 흐름은 **첫 페이지를 불러오는 경우를 기준으로 한다.** 이후 Next.js의 클라이언트 내비게이션으로 이동할 때는 첫 로드와 같은 방식으로 페이지 HTML을 다시 전달받는 것은 아니다.

[Next.js 공식 문서 — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

여기까지는 컴포넌트가 어디에서 실행되고, 화면이 어떻게 상호작용할 수 있게 되는지 살펴봤다.

그런데 아직 남은 질문이 있다.

**서버에서 화면을 만든다면, 누군가 접속할 때마다 매번 새로 만드는 걸까?**

이번에는 실행 위치에서 한 걸음 더 나아가, 화면을 만드는 시점을 살펴보자.


## 4. 서버에서 만들면 요청할 때마다 실행될까?

서버 컴포넌트는 서버에서 실행된다고 했다.

그렇다면 열 명이 접속하면 같은 컴포넌트를 열 번 실행하고, 백 명이 접속하면 백 번 실행하는 걸까?

항상 그런 것은 아니다.

**서버에서 실행한다는 것은 실행 위치에 관한 이야기이고, 언제 실행할지는 별도로 구분해야 한다.**

여기서 정적 렌더링과 동적 렌더링이 등장한다.

### 정적 렌더링은 미리 만들어 재사용한다

넥플릭스 소개 페이지를 만든다고 해보자.

```tsx
// app/about/page.tsx

export default function AboutPage() {
  return (
    <main>
      <h1>넥플릭스</h1>
      <p>Next.js를 함께 공부하는 스터디입니다.</p>
    </main>
  );
}
```

이 페이지는 접속한 사람이 누구인지 몰라도 만들 수 있다. 요청마다 달라지는 정보도 사용하지 않는다.

이처럼 미리 만들 수 있는 화면은 빌드 시점 등에 렌더링하고, 만들어둔 결과를 재사용할 수 있다. 이를 **정적 렌더링(Static Rendering)**이라고 한다.

```text
빌드 시점 등에 화면 생성
    ↓
렌더링 결과 저장
    ↓
여러 요청에 결과 재사용
```

요청이 들어올 때마다 같은 화면을 처음부터 만들지 않아도 되는 것이다.

다만 정적이라는 말이 영원히 바뀌지 않는다는 뜻은 아니다. 다시 배포하거나 재검증하는 방식으로 결과를 갱신할 수 있다.

### 동적 렌더링은 요청 시점의 정보를 반영한다

이번에는 접속한 사용자의 쿠키에 따라 테마 안내를 다르게 보여주고 싶다고 해보자.

이 정보는 실제 요청이 들어와야 알 수 있다.

다음 예제는 **Next.js 16에서 `cacheComponents`를 활성화하지 않은 경우**를 기준으로 한다.

```tsx
// app/preferences/page.tsx

import { cookies } from 'next/headers';

export default async function PreferencesPage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value ?? 'light';

  return (
    <main>
      <h1>화면 설정</h1>
      <p>현재 테마: {theme}</p>
    </main>
  );
}
```

`cookies()`는 들어온 요청의 쿠키를 읽는다. 따라서 빌드할 때 모든 사용자의 결과를 하나로 정해둘 수 없다.

이처럼 요청 시점에 렌더링하는 것을 **동적 렌더링(Dynamic Rendering)**이라고 한다.

```text
사용자 요청
    ↓
요청의 쿠키 등 필요한 정보 확인
    ↓
해당 요청에 맞춰 렌더링
```

동적으로 렌더링하더라도 일부 데이터는 캐시해서 재사용할 수 있다. 요청마다 화면을 만든다고 모든 데이터까지 반드시 새로 조회하는 것은 아니다.

[Next.js 공식 문서 — Caching and Revalidating without Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components)

### 서버·클라이언트와 정적·동적은 다른 기준이다

여기서 두 구분을 섞지 않는 것이 중요하다.

| 구분 | 확인하는 질문 |
|---|---|
| 서버·클라이언트 컴포넌트 | 컴포넌트 코드가 어떤 환경에서 실행되고, 브라우저에 어떤 코드가 필요한가? |
| 정적·동적 렌더링 | 요청 전에 결과를 만들어 재사용할 수 있는가, 요청 시점의 정보가 필요한가? |

**서버 컴포넌트라고 무조건 요청마다 실행되는 것은 아니다.**

반대로 **클라이언트 컴포넌트가 있다고 무조건 동적 렌더링이 필요한 것도 아니다.**

앞에서 만든 응원 버튼도 초기 숫자는 `0`으로 미리 보여줄 수 있다. 이후 브라우저에서 하이드레이션을 마치면 클릭에 따라 숫자가 바뀐다.

처음 전달할 화면을 미리 만드는 것과, 이후 사용자의 입력으로 화면이 바뀌는 것은 함께 가능하다.

### Next.js 16에서는 설정도 확인해야 한다

Next.js 16의 `cacheComponents`를 활성화하면, 한 경로 안에서도 미리 만들 수 있는 부분과 요청 시점에 처리할 부분을 함께 구성할 수 있다.

미리 만든 화면을 먼저 보내고, 요청 시점의 데이터가 필요한 영역은 `Suspense` 경계 안에서 처리해 준비되는 대로 전달하는 방식이다.

따라서 모든 프로젝트를 “페이지 전체가 정적 또는 동적”이라는 설명만으로 판단하기는 어렵다. 사용하는 설정과 데이터의 성격을 함께 확인해야 한다.

여기서는 먼저 다음 두 가지를 기억하자.

- 미리 만들 수 있는 결과는 재사용할 수 있다.
- 요청 시점의 정보가 필요한 부분은 해당 요청을 받아 처리해야 한다.

[Next.js 공식 문서 — Caching with Cache Components](https://nextjs.org/docs/app/getting-started/caching)

이제 컴포넌트의 역할과 렌더링 시점을 구분할 수 있게 됐다.

그렇다면 두 종류의 컴포넌트를 화면에서 조합하는 방법은 어떨까?

**열고 닫는 기능은 클라이언트 컴포넌트에 맡기면서, 그 안의 목록은 서버 컴포넌트로 만들 수 있을까?**

## 5. 클라이언트 패널 안에 서버 목록을 넣을 수 있을까?

멤버 목록을 접었다 펼치는 패널을 만들어보자.

패널을 열고 닫으려면 상태와 클릭 이벤트가 필요하다. 따라서 패널은 클라이언트 컴포넌트로 작성해야 한다.

그렇다면 그 안에 들어가는 멤버 목록까지 클라이언트 컴포넌트로 바꿔야 할까?

**서버 컴포넌트인 부모에서 목록을 구성하고, 클라이언트 패널의 `children`으로 전달하면 된다.**

### 패널은 열고 닫는 역할을 맡는다

먼저 패널을 작성한다.

```tsx
// app/ClientPanel.tsx

'use client';

import { useState, type ReactNode } from 'react';

type ClientPanelProps = {
  children: ReactNode;
};

export default function ClientPanel({
  children,
}: ClientPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section>
      <button
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? '멤버 목록 접기' : '멤버 목록 펼치기'}
      </button>

      {isOpen && (
        <div>
          {children}
        </div>
      )}
    </section>
  );
}
```

`isOpen`은 패널이 열려 있는지를 기억한다. 버튼을 클릭하면 값이 바뀌고, 열려 있을 때만 `children`을 보여준다.

여기서 패널은 멤버 데이터를 직접 가져오거나 목록을 만들지 않는다.

**전달받은 내용을 어디에 보여줄지와, 보여줄지를 결정한다.**

### 목록은 서버 컴포넌트로 작성한다

```tsx
// app/MemberList.tsx

const members = [
  { id: 1, name: '강효정' },
  { id: 2, name: '심민식' },
  { id: 3, name: '공기훈' },
];

export default function MemberList() {
  return (
    <ul>
      {members.map((member) => (
        <li key={member.id}>
          {member.name}
        </li>
      ))}
    </ul>
  );
}
```

이 목록은 서버에서 사용할 컴포넌트로 두고, 부모 페이지에서 패널과 조합한다.

```tsx
// app/page.tsx

import ClientPanel from './ClientPanel';
import MemberList from './MemberList';

export default function Page() {
  return (
    <main>
      <h1>넥플릭스</h1>

      <ClientPanel>
        <MemberList />
      </ClientPanel>
    </main>
  );
}
```

`Page`가 두 컴포넌트를 가져와 조합한다. `ClientPanel`은 `MemberList`를 직접 import하지 않는다.

서버에서 렌더링한 목록의 결과가 패널의 `children`으로 전달되는 구조다.

```text
Page — 서버에서 조합
├── ClientPanel — 열고 닫는 상태 처리
└── MemberList — 서버에서 목록 렌더링
        ↓
    패널의 children으로 전달
```

이처럼 컴포넌트를 조합하는 방식을 **컴포지션 패턴(Composition Patterns)**이라고 한다.

### 화면의 부모·자식 관계와 import 관계를 구분한다

완성된 화면에서는 패널 안에 목록이 들어 있다.

하지만 그렇다고 목록의 코드까지 클라이언트 코드에 포함되는 것은 아니다. 패널은 이미 서버에서 렌더링한 내용을 전달받았기 때문이다.

또한 패널을 펼치는 순간 서버 목록을 처음 요청하는 구조도 아니다. 이 예제에서는 **목록의 렌더링 결과를 먼저 전달받고, 클라이언트 상태로 표시 여부를 바꾼다.**

[Next.js 공식 문서 — Interleaving Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components)

### 패널을 접었다 펼쳐보자

[예제 실행해보기](https://nexflix-rendering-lab.vercel.app/lab?step=slots)

예제에서 패널을 접었다 펼치며, 클라이언트의 상태가 서버에서 만든 내용의 표시 여부를 제어하는 모습을 확인해보자.

![](https://velog.velcdn.com/images/minsik1014/post/29a43fd3-8ae6-4b19-916e-566f374cd203/image.png)


역할을 나누고 나니 다음 질문이 생긴다.

지금은 간단한 배열이지만, 서버에서 멤버 목록을 가져오는 데 시간이 오래 걸린다면 어떨까?

**목록 하나를 기다리느라 제목과 패널까지 전부 늦게 보여줘야 할까?**

## 6. 느린 목록 때문에 화면 전체가 기다려야 할까?

멤버 목록을 서버에서 가져오는 데 시간이 걸린다고 해보자.

제목과 안내 문구는 바로 보여줄 수 있는데, 목록이 준비될 때까지 함께 기다려야 한다면 답답할 것이다.

**먼저 준비된 부분부터 보여주고, 느린 부분은 나중에 전달할 수 없을까?**

이때 사용하는 것이 스트리밍과 Suspense다.

### 스트리밍은 준비된 부분부터 전달한다

화면 전체가 완성된 뒤 한 번에 보내는 대신, 준비된 부분부터 나누어 전달하는 방식을 **스트리밍(Streaming)**이라고 한다.

```text
제목과 안내 문구 준비
    ↓
브라우저에 먼저 전달
    ↓
느린 멤버 목록 준비 완료
    ↓
목록을 추가로 전달
```

목록을 가져오는 작업 자체가 빨라지는 것은 아니다.

사용자가 그 작업이 끝날 때까지 아무 화면도 보지 못한 채 기다리는 상황을 줄이는 것이다.

### Suspense로 기다릴 영역을 지정한다

React의 `Suspense`는 내부의 콘텐츠가 준비되는 동안 대신 보여줄 화면을 지정할 수 있게 한다.

```tsx
<Suspense fallback={<p>멤버 목록을 불러오는 중...</p>}>
  <MemberList />
</Suspense>
```

`fallback`은 기다리는 동안 보여줄 UI다.

`MemberList`가 렌더링 중 대기하면 fallback을 보여주고, 목록이 준비되면 실제 콘텐츠로 바꾼다.

Next.js에서는 이러한 경계를 이용해 서버에서 준비되는 콘텐츠를 나누어 전달할 수 있다.

[Next.js 공식 문서 — Streaming](https://nextjs.org/docs/app/getting-started/fetching-data#streaming)

### 경계를 어디에 두느냐에 따라 달라진다

빠른 목록과 느린 목록이 하나씩 있다고 해보자.

두 목록을 같은 Suspense로 감싸면 하나의 표시 단위가 된다.

```tsx
<Suspense fallback={<p>전체 목록을 불러오는 중...</p>}>
  <FastMemberList />
  <SlowMemberList />
</Suspense>
```

빠른 목록이 먼저 준비되어도, 이 경계 안의 콘텐츠는 느린 목록까지 준비된 뒤 함께 나타난다.

각각 감싸면 어떻게 될까?

```tsx
<>
  <Suspense fallback={<p>첫 번째 목록을 불러오는 중...</p>}>
    <FastMemberList />
  </Suspense>

  <Suspense fallback={<p>두 번째 목록을 불러오는 중...</p>}>
    <SlowMemberList />
  </Suspense>
</>
```

이제 각 목록이 별도의 경계를 가진다. 빠른 목록은 먼저 나타나고, 느린 목록은 자신의 fallback을 보여주며 기다릴 수 있다.

**Suspense의 경계는 어떤 내용을 함께 보여주고, 어떤 내용을 따로 기다릴지 결정하는 기준이다.**

무조건 잘게 나누기보다 사용자가 하나의 묶음으로 봐야 하는 내용을 기준으로 정하면 된다.

[React 공식 문서 — Suspense](https://react.dev/reference/react/Suspense)

### 두 결과를 비교해보자

[예제 실행해보기](https://nexflix-rendering-lab.vercel.app/lab?step=boundaries)

예제에서는 빠른 목록과 느린 목록의 준비 시간을 다르게 설정했다.

두 결과 비교를 실행하고, **빠른 목록이 준비됐지만 느린 목록은 아직 기다리는 순간**을 확인해보자.

![하나의 경계는 전체를 기다리고, 개별 경계는 첫 번째 응답을 먼저 보여준다.](https://velog.velcdn.com/images/minsik1014/post/e12be74e-2647-44eb-9824-1ef7f9a81400/image.jpeg)

하나의 경계로 묶은 쪽은 전체 로딩 화면을 유지한다. 개별 경계로 나눈 쪽은 빠른 목록을 먼저 보여준다.

모든 작업이 끝난 화면보다, 기다리는 중간 화면을 비교해야 차이가 잘 보인다.

![](https://velog.velcdn.com/images/minsik1014/post/f5862535-ceb3-4d3a-8d37-fac3bbd17e46/image.png)


> 그럼 Suspense로 감싸면 기다리는 문제는 다 해결되는 거 아닌가? 개쉽네.

### 그런데 await를 먼저 해버리면 어떨까?

Suspense를 작성했다고 모든 기다림이 자동으로 분리되는 것은 아니다.

다음은 부모가 데이터를 먼저 기다리는 구조다. `getMembers()`는 멤버 데이터를 비동기로 가져오는 함수라고 가정하자.

```tsx
export default async function Page() {
  const members = await getMembers();

  return (
    <main>
      <h1>넥플릭스 멤버</h1>

      <Suspense fallback={<p>목록을 불러오는 중...</p>}>
        <MemberList members={members} />
      </Suspense>
    </main>
  );
}
```

부모는 `getMembers()`가 끝나야 JSX를 반환한다.

따라서 아래쪽에 작성한 Suspense는 **부모에서 이미 발생한 기다림을 대신 처리하지 못한다.** 상위에 별도의 로딩 경계가 없다면 제목도 함께 기다리게 된다.

기다리는 작업을 경계 안의 컴포넌트로 옮기면 구조가 달라진다.

```tsx
async function MemberList() {
  const members = await getMembers();

  return (
    <ul>
      {members.map((member) => (
        <li key={member.id}>
          {member.name}
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <main>
      <h1>넥플릭스 멤버</h1>

      <Suspense fallback={<p>목록을 불러오는 중...</p>}>
        <MemberList />
      </Suspense>
    </main>
  );
}
```

이제 부모는 목록을 기다리지 않고 제목과 Suspense 경계를 반환한다.

기다림은 경계 안의 `MemberList`에서 발생하므로, 제목과 fallback을 먼저 보여줄 수 있다.

**경계를 어디에 두는지뿐 아니라, 그 경계 안에서 무엇을 기다리는지도 중요하다.**

[예제 실행해보기](https://nexflix-rendering-lab.vercel.app/lab?step=await-position)

이번에는 부모에서 기다리는 경우와 자식에서 기다리는 경우를 비교하며 제목이 나타나는 시점을 확인해보자.

![부모에서 기다리면 제목도 늦어지고, 자식에서 기다리면 제목과 fallback을 먼저 보여준다.](https://velog.velcdn.com/images/minsik1014/post/269d7042-45cc-4dc6-ac1d-7e869305ac09/image.jpeg)

참고로 Suspense가 모든 비동기 작업을 감지하는 것은 아니다. `useEffect`나 클릭 이벤트 안에서 실행한 요청을 감쌌다고 자동으로 fallback이 표시되지는 않는다. 여기서는 Next.js가 지원하는 비동기 서버 컴포넌트의 렌더링을 다루고 있다.

화면을 나누어 전달하는 방법까지 살펴봤다.

그렇다면 먼저 전달한 HTML과, 브라우저에서 React가 처음 렌더링한 내용이 서로 다르면 어떻게 될까?

## 7. 첫 화면의 값이 서로 다르면 어떻게 될까?

하이드레이션은 서버에서 만든 HTML을 React가 이어받는 과정이라고 했다.

그렇다면 서버가 만든 첫 화면과 브라우저에서 처음 렌더링한 내용은 같아야 하지 않을까?

**React는 하이드레이션할 때 서버 HTML과 클라이언트의 첫 렌더링 결과가 일치하기를 기대한다.**

### 처음부터 다른 값을 만들면 문제가 생긴다

다음처럼 렌더링 중 임의의 숫자를 만들었다고 해보자.

```tsx
'use client';

export default function RandomNumber() {
  return <p>{Math.random()}</p>;
}
```

서버에서 실행했을 때와 브라우저에서 실행했을 때 서로 다른 숫자가 나올 수 있다. 그러면 같은 컴포넌트인데도 첫 화면의 내용이 달라진다.

이처럼 서버 HTML과 클라이언트의 첫 렌더링 결과가 맞지 않는 상황을 **하이드레이션 불일치(Hydration Mismatch)**라고 한다.

![](https://velog.velcdn.com/images/minsik1014/post/87b6e3b7-95bc-49d8-9b77-b7fc94ae2530/image.png)


> 개 어렵네. 나만 어렵나.

개발 환경에서는 관련 경고가 나타날 수 있다. React가 해당 영역을 클라이언트에서 다시 렌더링하며 복구할 수도 있으므로, 경고를 숨기기보다 처음 값이 달라지는 원인을 고쳐야 한다.

[React 공식 문서 — hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

### 같은 초기값에서 시작한다

응원 버튼이라면 서버에서 전달한 초기값을 클라이언트에서도 그대로 사용하면 된다.

```tsx
// app/CheerButton.tsx

'use client';

import { useState } from 'react';

type CheerButtonProps = {
  initialCount: number;
};

export default function CheerButton({
  initialCount,
}: CheerButtonProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      응원하기 {count}
    </button>
  );
}
```

서버 컴포넌트인 페이지에서는 다음처럼 사용한다.

```tsx
// app/page.tsx

import CheerButton from './CheerButton';

export default function Page() {
  return <CheerButton initialCount={0} />;
}
```

서버가 만든 HTML도 `응원하기 0`, 브라우저의 첫 렌더링 결과도 `응원하기 0`이다.

이후 버튼을 눌러 숫자가 바뀌는 것은 정상적인 상태 갱신이다. **처음부터 결과가 다른 것과, 하이드레이션 이후 상태가 바뀌는 것은 구분해야 한다.**

### 브라우저에서 시작할 작업은 Effect로 연결한다

화면이 연결된 뒤 일정한 간격으로 숫자를 올리고 싶다면 어떨까?

```tsx
// app/TickCounter.tsx

'use client';

import { useEffect, useState } from 'react';

export default function TickCounter() {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTicks((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return <p>타이머 갱신 횟수: {ticks}</p>;
}
```

서버와 브라우저는 모두 `0`에서 시작한다. Effect는 서버 렌더링에서는 실행되지 않고, 브라우저에서 컴포넌트가 마운트된 뒤 실행되어 타이머를 연결한다.

타이머 콜백이 실행되면 상태가 바뀌고, 화면의 숫자도 올라간다. 컴포넌트가 제거되면 정리 함수가 타이머를 해제한다.

이 숫자는 콜백 실행 횟수다. 브라우저 사정에 따라 타이머 실행이 늦어질 수 있으므로 정확한 경과 시간을 측정하는 코드는 아니다.

[React 공식 문서 — useEffect](https://react.dev/reference/react/useEffect)

### 초기 화면과 이후 변화를 비교해보자

[예제 실행해보기](https://nexflix-rendering-lab.vercel.app/lab?step=after-hydration)

`Hydration` → `하이드레이션 이후 자동 갱신하기` 실습이다. 두 결과를 비교하고, Effect를 추가한 쪽에서만 숫자가 계속 바뀌는지 확인해보자.

![Effect를 추가하지 않은 쪽은 0, 추가한 쪽은 숫자가 갱신된다.](https://velog.velcdn.com/images/minsik1014/post/81789913-f3af-41d9-8a97-a56326494ede/image.jpeg)

예제의 표시는 `경과 0초`처럼 되어 있지만, 이 값 역시 타이머 콜백마다 1씩 더한 숫자다. 정확한 시간 측정과는 구분해서 보자.

이 예제는 일부러 오류를 만드는 예제가 아니다. 같은 초기값에서 출발한 뒤, 브라우저의 Effect가 실행되면서 상태가 달라지는 정상적인 흐름을 확인한다.

**하이드레이션에서는 첫 결과를 맞추고, 그 이후에는 상태와 이벤트에 따라 화면을 갱신한다.**

## 8. 그래서 넥제는 렌더링을 어떻게 하는가?

처음에는 서버 컴포넌트는 서버에서, 클라이언트 컴포넌트는 브라우저에서 실행한다고만 생각했다.

그런데 클라이언트 컴포넌트도 첫 HTML을 만드는 과정에 참여했고, 서버 컴포넌트라고 요청마다 반드시 새로 렌더링하는 것도 아니었다. 이름 하나로 모든 동작을 설명하려고 해서 헷갈렸던 것 같다.

이번에 살펴본 내용을 질문별로 정리하면 다음과 같다.

| 궁금했던 것 | 구분할 개념 |
|---|---|
| 서버에서 데이터와 화면을 구성하려면? | 서버 컴포넌트 |
| 상태와 클릭 이벤트가 필요하다면? | 클라이언트 컴포넌트 |
| 브라우저로 전달할 코드의 시작점은? | `'use client'` 경계 |
| 미리 만든 결과를 재사용할까, 요청 시점에 처리할까? | 정적·동적 렌더링 |
| 먼저 보이는 HTML은 언제 동작할까? | 하이드레이션 |
| 클라이언트 패널 안에 서버 콘텐츠를 넣으려면? | `children` 등을 활용한 컴포지션 |
| 느린 영역을 기다리는 동안 무엇을 보여줄까? | 스트리밍과 Suspense |

이제는 버튼이 있다고 페이지 전체에 `'use client'`를 붙이기보다, 어디에 상태가 필요한지 먼저 생각해볼 수 있겠다.

서버에서 만든 내용을 `children`으로 전달하거나, 느린 영역에 Suspense 경계를 두는 것도 결국 각 부분의 역할과 기다림을 나누는 일이었다. 특히 같은 작업이라도 `await` 위치에 따라 제목을 먼저 보여줄 수 있다는 점이 인상적이었다.

**어디에서 실행하는가, 언제 만드는가, 무엇을 먼저 보여주는가.**

이 질문들을 나눠서 보니 넥제의 렌더링 과정이 조금은 정리됐다.

다음에는 이 화면에 필요한 데이터를 어떻게 가져오고, 가져온 결과를 어떻게 재사용하거나 갱신하는지 살펴보려고 한다.
