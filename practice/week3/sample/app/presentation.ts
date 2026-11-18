export const sources = {
  streaming: 'https://nextjs.org/docs/app/getting-started/fetching-data#streaming',
  composition: 'https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components',
  hydration: 'https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load',
};

export const exercises = [
  {
    id: 'streaming',
    title: '로딩 경계 추가하기',
    starter: '<SlowMemberList />',
    answer: '<Suspense fallback={<p>스터디원 불러오는 중…</p>}>\n  <SlowMemberList />\n</Suspense>',
    explanation: '느린 조회를 자식 컴포넌트 안에 두고 그 자식을 Suspense로 감싸면, 바깥 제목과 fallback을 먼저 보낼 수 있습니다.',
  },
  {
    id: 'composition',
    title: '서버 목록을 패널에 전달하기',
    starter: '<ClientPanel />',
    answer: '<ClientPanel>\n  <MemberList />\n</ClientPanel>',
    explanation: '서버 페이지가 목록을 렌더링해 children으로 전달합니다. 패널은 열림 상태를 관리하고 전달받은 목록을 그 자리에 배치합니다.',
  },
  {
    id: 'initial-state',
    title: '초기값과 클릭 연결하기',
    starter: 'const [count] = useState(0);\nreturn (<div className="counter">\n  <output aria-label="현재 인원" aria-live="polite">{count}</output>\n  <button type="button">+1</button>\n  <small>서버에서 받은 인원 {initialCount}명</small>\n</div>);',
    answer: 'const [count, setCount] = useState(initialCount);\nreturn (\n  <div className="counter">\n    <output aria-label="현재 인원" aria-live="polite">{count}</output>\n    <button type="button" onClick={() => setCount((value) => value + 1)}>+1</button>\n    <small>서버에서 받은 인원 {initialCount}명</small>\n  </div>\n);',
    explanation: '서버에서 받은 initialCount로 서버 HTML과 브라우저의 첫 렌더를 같은 값으로 시작합니다. 하이드레이션 이후에는 클릭 핸들러가 상태를 갱신합니다.',
  },
];

export type Slide = {
  id: string;
  title: string;
  topic: string;
  source: string;
  body?: string;
  paragraphs?: string[];
  points?: { title: string; detail: string }[];
  code?: string;
  codeNotes?: { code: string; detail: string }[];
  steps?: { title: string; detail: string; screen: string }[];
  note?: string;
  observation?: { detail: string; href: string };
};

export const slides: Slide[] = [
  {
    "id": "streaming",
    "title": "어떤 화면을 먼저 보낼까?",
    "topic": "Streaming & Suspense",
    "body": "제목은 바로 그릴 수 있는데 스터디원 목록을 가져오는 데 2.5초가 걸린다면, 제목까지 함께 기다려야 할까요? Streaming을 사용하면 서버는 준비된 화면부터 브라우저에 나눠 보낼 수 있습니다.",
    "points": [
      {
        "title": "느린 요청이 영향을 주는 범위",
        "detail": "부모 페이지에서 목록을 먼저 await하면 JSX를 반환할 때까지 제목도 기다립니다. 조회를 목록 컴포넌트 안으로 옮기면 제목과 목록이 기다리는 범위를 나눌 수 있습니다."
      },
      {
        "title": "Suspense가 정하는 것",
        "detail": "Suspense로 목록을 감싸면 그 영역만 준비될 때까지 fallback을 보여줍니다. 목록이 준비되면 로딩 문구를 목록으로 바꾸고, 경계 밖 제목은 그대로 둡니다."
      },
      {
        "title": "사용자가 느끼는 차이",
        "detail": "같은 조회에 걸리는 시간은 그대로지만, 제목과 로딩 상태를 먼저 볼 수 있습니다. 첫 화면에 무엇을 먼저 보여줄지에 따라 경계 위치가 달라집니다."
      }
    ],
    "source": "https://nextjs.org/docs/app/getting-started/fetching-data#streaming"
  },
  {
    "id": "streaming-detail-1",
    "title": "Streaming과 Suspense는 어떻게 연결될까?",
    "topic": "Streaming & Suspense",
    "source": "https://nextjs.org/docs/app/getting-started/fetching-data#streaming",
    "paragraphs": [
      "Streaming은 서버가 렌더링 결과를 여러 조각으로 보내는 방식입니다. Suspense는 자식이 준비되지 않았을 때 임시 UI를 보여줄 범위를 선언합니다. Next.js는 이 경계를 활용해 준비된 영역을 먼저 보내고, 기다리는 영역을 나중에 채웁니다.",
      "이 페이지의 목록 예제에서는 서버 컴포넌트가 Promise를 기다립니다. 서버가 제목과 fallback을 보내고, 목록 Promise가 완료되면 해당 목록의 결과를 이어 보냅니다. 브라우저는 전체 문서를 다시 요청하지 않고 해당 영역을 채웁니다."
    ]
  },
  {
    "id": "streaming-detail-2",
    "title": "경계 크기는 사용자에게 보이는 순서를 정한다",
    "topic": "Streaming & Suspense",
    "source": "https://nextjs.org/docs/app/getting-started/fetching-data#streaming",
    "paragraphs": [
      "빠른 목록과 느린 목록을 한 경계로 묶으면 그 경계는 둘 다 준비될 때까지 fallback을 보여줍니다. 각각의 경계로 나누면 빠른 목록은 먼저 공개됩니다. 사용자가 함께 봐야 하는 내용인지, 독립적으로 봐도 되는 내용인지에 따라 경계를 배치합니다.",
      "loading.tsx는 같은 경로의 페이지 영역을 감싸는 Suspense 경계를 자동으로 제공합니다. 페이지 내부의 특정 목록만 기다리게 하려면 직접 Suspense를 둘 수 있습니다."
    ]
  },
  {
    "id": "streaming-detail-3",
    "title": "일반적인 useEffect 조회도 감지할까?",
    "topic": "Streaming & Suspense",
    "source": "https://nextjs.org/docs/app/getting-started/fetching-data#streaming",
    "paragraphs": [
      "Suspense는 React가 지원하는 방식으로 자식이 대기할 때 동작합니다. 마운트 후 useEffect에서 fetch를 시작하는 코드만 감싸면 그 요청을 자동으로 감지하지 않습니다. 이 실습은 async 서버 컴포넌트가 렌더링 중 Promise를 기다리는 상황입니다."
    ]
  },
  {
    "id": "streaming-example",
    "title": "목록이 2.5초 걸리면?",
    "topic": "Streaming & Suspense",
    "body": "부모 페이지는 제목을 만들고, SlowMemberList는 목록 조회를 기다립니다. Suspense는 목록만 감쌉니다.",
    "points": [
      {
        "title": "fallback",
        "detail": "목록이 준비되기 전에는 제목 아래에 “스터디원 불러오는 중…”이 표시됩니다."
      },
      {
        "title": "SlowMemberList",
        "detail": "조회가 끝나면 서버가 목록을 보내고, 브라우저는 해당 영역을 실제 이름 목록으로 바꿉니다."
      }
    ],
    "source": "https://nextjs.org/docs/app/getting-started/fetching-data#streaming"
  },
  {
    "id": "streaming-example-detail-1",
    "title": "기다리는 자식과 경계를 코드에서 함께 보기",
    "topic": "Streaming & Suspense",
    "source": "https://nextjs.org/docs/app/getting-started/fetching-data#streaming",
    "paragraphs": [
      "readMembers는 실습용 조회 함수입니다. 아래에서는 SlowMemberList 안에서 await하고 부모 페이지는 바로 제목과 Suspense를 반환합니다."
    ],
    "code": "import { Suspense } from 'react';\nimport { readMembers } from './data';\n\nasync function SlowMemberList() {\n  const names = await readMembers();\n  return <ul>{names.map(name => <li key={name}>{name}</li>)}</ul>;\n}\n\nexport default function Page() {\n  return (\n    <main>\n      <h1>넥플릭스</h1>\n      <Suspense fallback={<p>목록 불러오는 중…</p>}>\n        <SlowMemberList />\n      </Suspense>\n    </main>\n  );\n}"
  },
  {
    "id": "streaming-example-detail-2",
    "title": "목록이 도착하기까지의 순서",
    "topic": "Streaming & Suspense",
    "source": "https://nextjs.org/docs/app/getting-started/fetching-data#streaming",
    "observation": {
      "detail": "사전 과제에서 목록 하나에 경계를 만들었다면, 실습에서는 빠른 목록과 느린 목록의 경계를 나눠 보세요. 0.8초 뒤 빠른 목록부터 나타나는지 관찰합니다.",
      "href": "/lab?step=boundaries"
    },
    "body": "제목과 로딩 문구가 먼저 표시되고, 준비된 목록이 뒤이어 채워집니다.",
    "steps": [
      {
        "title": "부모 페이지가 화면을 반환",
        "detail": "제목과 Suspense 경계를 만들고, 자식 목록이 조회를 기다립니다.",
        "screen": "제목 + 로딩 문구"
      },
      {
        "title": "목록 조회가 진행 중",
        "detail": "경계는 fallback을 보여주고, 바깥 제목은 계속 표시됩니다.",
        "screen": "제목 + 로딩 문구"
      },
      {
        "title": "약 2.5초 뒤 조회 완료",
        "detail": "서버가 목록 결과를 보내면 해당 경계의 로딩 문구가 이름 목록으로 바뀝니다.",
        "screen": "제목 + 스터디원 목록"
      }
    ],
    "note": "실습에서는 조회 지연을 2.5초로 설정했습니다. 네트워크와 브라우저 버퍼링에 따라 실제 표시 시점은 달라질 수 있습니다."
  },
  {
    "id": "composition",
    "title": "서버 목록을 누가 만들고 누가 열까?",
    "topic": "Composition Patterns",
    "body": "목록을 준비하는 일과 패널을 여닫는 일은 실행되는 곳이 다릅니다. 서버 페이지가 둘을 조합하고, 브라우저에서는 패널의 열림 상태를 관리할 수 있습니다.",
    "points": [
      {
        "title": "서버의 역할",
        "detail": "서버 페이지는 MemberList를 렌더링해 목록을 만듭니다. 그 JSX를 ClientPanel의 children으로 넘기는 것도 서버 페이지가 맡습니다."
      },
      {
        "title": "클라이언트의 역할",
        "detail": "ClientPanel은 useState로 패널이 열렸는지 기억하고, 전달받은 children을 본문 자리에 배치합니다. 패널이 어떤 목록을 받는지 알아야 할 필요는 없습니다."
      },
      {
        "title": "전달할 자리가 여러 개라면",
        "detail": "children은 기본 본문 자리입니다. 제목도 서버에서 만들어 전달하려면 heading처럼 이름이 있는 prop을 추가할 수 있습니다."
      }
    ],
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components"
  },
  {
    "id": "composition-detail-1",
    "title": "화면의 부모·자식과 import 관계를 구분하기",
    "topic": "Composition Patterns",
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components",
    "paragraphs": [
      "JSX에서 ClientPanel 안에 목록이 보이는 것과, ClientPanel 파일이 목록 구현을 import하는 것은 다른 관계입니다. 서버 부모가 두 컴포넌트를 import해 조합하면 클라이언트 패널은 전달받은 결과를 자신의 children 자리에 표시할 수 있습니다.",
      "'use client'는 해당 파일에서 시작하는 클라이언트 모듈 경계를 선언합니다. 패널이 서버 전용 데이터 조회 모듈까지 import하면 클라이언트 경계에 서버 의존성을 끌어들이게 됩니다. 목록 생성은 서버 부모에 두고, 상호작용을 맡는 패널에는 렌더링할 내용을 전달합니다."
    ]
  },
  {
    "id": "composition-detail-2",
    "title": "children과 이름 있는 prop은 모두 콘텐츠를 받을 자리",
    "topic": "Composition Patterns",
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components",
    "paragraphs": [
      "children은 태그 사이의 JSX를 받습니다. heading처럼 이름 있는 prop에는 제목 JSX를 넘길 수 있습니다. 이때 슬롯은 컴포넌트의 prop으로 만든 자리이며 App Router의 @폴더로 만드는 Parallel Routes 슬롯과 구분합니다.",
      "텍스트나 숫자 같은 데이터도 서버에서 클라이언트로 전달할 수 있습니다. 전달 값은 React가 직렬화할 수 있어야 하며 일반 이벤트 함수나 데이터베이스 연결 객체를 그대로 넘길 수는 없습니다. JSX 전달은 React가 지원하는 조합 방식입니다."
    ]
  },
  {
    "id": "composition-example",
    "title": "열기 버튼 안에 스터디원 목록 넣기",
    "topic": "Composition Patterns",
    "body": "아래 코드는 서버 페이지에서 작성합니다. 태그 사이에 넣은 MemberList가 패널의 children으로 전달됩니다.",
    "points": [
      {
        "title": "ClientPanel만 사용하면",
        "detail": "버튼을 눌러 열 수 있지만 본문에 넘긴 내용이 없어서 “전달된 콘텐츠가 없습니다.”가 나옵니다."
      },
      {
        "title": "MemberList를 사이에 넣으면",
        "detail": "패널이 열릴 때 서버가 이미 만들어 전달한 이름 목록이 보입니다. 이 예제에서 버튼은 표시 여부만 바꾸므로 열 때마다 새 조회가 일어나지 않습니다."
      }
    ],
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components"
  },
  {
    "id": "composition-example-detail-1",
    "title": "받는 쪽에서는 children을 어디에 놓을까?",
    "topic": "Composition Patterns",
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components",
    "paragraphs": [
      "서버 페이지는 기존 코드처럼 ClientPanel 안에 MemberList를 넣습니다. 패널 파일은 아래처럼 전달받은 children을 열림 상태에 따라 표시합니다."
    ],
    "codeNotes": [
    {
        "code": "'use client'",
        "detail": "상태와 클릭 이벤트를 사용하는 패널 파일을 클라이언트 경계로 선언합니다."
    },
    {
        "code": "{ children }: { children: ReactNode }",
        "detail": "부모가 ClientPanel 태그 사이에 넣은 JSX를 children으로 받습니다. ReactNode는 JSX, 문자열 등 React가 화면에 표시할 수 있는 값의 타입입니다."
    },
    {
        "code": "useState(false)",
        "detail": "처음에는 닫힌 상태로 시작합니다. open은 현재 열림 상태이고 setOpen은 그 상태를 바꾸는 함수입니다."
    },
    {
        "code": "setOpen(value => !value)",
        "detail": "버튼을 누를 때마다 이전 상태를 반대로 바꿉니다. false는 true가 되고, 다시 누르면 false가 됩니다. 버튼 문구도 open 값에 따라 열기와 닫기로 바뀝니다."
    },
    {
        "code": "<div hidden={!open}>{children}</div>",
        "detail": "children을 실제로 배치하는 자리입니다. 닫혀 있을 때는 hidden이 true여서 숨겨지고, 열리면 false가 되어 부모가 전달한 목록이 보입니다. hidden은 이미 렌더링된 내용을 숨기는 속성입니다."
    }
],
    "code": "'use client';\n\nimport { useState, type ReactNode } from 'react';\n\nexport default function ClientPanel({ children }: { children: ReactNode }) {\n  const [open, setOpen] = useState(false);\n\n  return (\n    <section>\n      <button onClick={() => setOpen(value => !value)}>\n        {open ? '닫기' : '열기'}\n      </button>\n      <div hidden={!open}>{children}</div>\n    </section>\n  );\n}"
  },
  {
    "id": "composition-example-detail-2",
    "title": "열기 버튼이 바꾸는 것은 무엇일까?",
    "topic": "Composition Patterns",
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components",
    "paragraphs": [
      "서버는 처음 화면을 준비할 때 목록을 렌더링합니다. 패널은 전달받은 내용을 숨기거나 보여줍니다. 열기 버튼을 눌러야 서버 목록 함수가 처음 실행되는 구조로 해석하면 안 됩니다.",
      "패널을 두 개 만들면 각 패널의 useState는 독립적으로 유지됩니다. 발표 실습에서는 서로 다른 이름 목록을 같은 패널에 넘겨 첫 번째를 열 때 두 번째 상태가 유지되는지 확인합니다."
    ],
    "observation": {
      "detail": "사전 과제에서는 본문을 children으로 넘겼습니다. 실습에서는 heading 자리도 추가해 같은 패널의 제목과 본문을 각각 바꿔 보세요.",
      "href": "/lab?step=slots"
    }
  },
  {
    "id": "hydration",
    "title": "버튼이 보이는 시점과 동작하는 시점",
    "topic": "Hydration",
    "body": "첫 페이지 로드에서는 Client Component의 버튼도 서버가 보낸 HTML로 먼저 보일 수 있습니다. React는 브라우저에서 기존 HTML에 클라이언트 컴포넌트를 연결해 상태와 클릭 이벤트가 동작하게 합니다. 이 과정을 하이드레이션이라고 합니다.",
    "points": [
      {
        "title": "HTML이 도착했을 때",
        "detail": "브라우저는 버튼과 숫자를 화면에 그릴 수 있습니다. 실습에서 JavaScript 실행을 막아도 패널의 열기 버튼은 그대로 보입니다."
      },
      {
        "title": "하이드레이션이 끝났을 때",
        "detail": "브라우저에서 React가 클릭을 처리할 수 있게 됩니다. 이제 열기 버튼을 누르면 이벤트 핸들러가 상태를 바꾸고 패널 본문이 표시됩니다."
      },
      {
        "title": "첫 화면이 일치해야 하는 이유",
        "detail": "React는 기존 HTML을 재사용하므로 브라우저의 첫 렌더 결과가 서버 HTML과 같아야 합니다. 첫 렌더에서 각각 Math.random()을 호출하면 값이 달라져 하이드레이션 불일치가 날 수 있습니다."
      }
    ],
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load"
  },
  {
    "id": "hydration-detail-1",
    "title": "첫 로드에서 전달되는 세 가지",
    "topic": "Hydration",
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load",
    "paragraphs": [
      "HTML은 브라우저가 처음 화면을 표시하는 데 사용합니다. RSC Payload는 서버 컴포넌트의 렌더 결과, 클라이언트 컴포넌트의 위치와 참조, 전달된 props 등을 담아 서버·클라이언트 트리를 맞추는 데 사용합니다. 클라이언트 컴포넌트의 JavaScript는 상태와 이벤트 처리를 동작시킵니다.",
      "Client Component도 첫 로드에서는 서버에서 HTML을 미리 만들 수 있습니다. 그래서 버튼이 보인다는 사실만으로 브라우저의 JavaScript 실행이 끝났다고 판단할 수 없습니다. 이후 클라이언트 라우팅은 첫 문서 로드와 전달·렌더링 과정이 다를 수 있습니다."
    ]
  },
  {
    "id": "hydration-detail-2",
    "title": "하이드레이션 불일치는 언제 생길까?",
    "topic": "Hydration",
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load",
    "paragraphs": [
      "서버 HTML이 9를 표시하는데 브라우저 첫 렌더가 0을 기대하면 React가 재사용하려던 화면과 계산 결과가 다릅니다. HTML에 표시한 초기값을 props로 전달해 양쪽에서 같은 값을 사용해야 합니다.",
      "렌더링 중 Date.now(), Math.random(), 브라우저 저장소의 값을 각각 사용하면 결과가 달라질 수 있습니다. 사용자 브라우저에서만 알 수 있는 값은 동일한 초기 화면을 만든 뒤 Effect 등으로 갱신하는 방식을 검토합니다."
    ]
  },
  {
    "id": "hydration-detail-3",
    "title": "실습의 JavaScript 제한으로 관찰하는 범위",
    "topic": "Hydration",
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load",
    "paragraphs": [
      "iframe의 sandbox로 스크립트를 막으면 서버 HTML의 버튼은 보이지만 React 이벤트가 동작하지 않습니다. 허용한 화면에서는 열기 버튼이 패널 상태를 바꿉니다.",
      "이 비교는 하이드레이션이 완료되기까지의 실제 시간을 측정하지 않습니다. 스크립트 실행을 완전히 막은 상태와 허용한 상태를 비교해 HTML 표시와 상호작용의 차이를 관찰합니다."
    ],
    "observation": {
      "detail": "JavaScript를 막은 화면과 허용한 화면에서 열기 버튼을 눌러 보세요. 두 버튼 모두 처음부터 보이지만, 패널이 열리는 것은 JavaScript가 실행된 쪽입니다.",
      "href": "/lab?step=hydration"
    }
  },
  {
    "id": "hydration-example",
    "title": "서버가 준 9에서 10으로",
    "topic": "Hydration",
    "body": "서버 페이지가 스터디원 수 9를 initialCount로 넘깁니다. 카운터는 그 값을 첫 상태로 사용하고, 이후에는 클릭으로 자기 상태를 바꿉니다.",
    "points": [
      {
        "title": "useState(initialCount)",
        "detail": "서버에서 만든 HTML에도, 브라우저의 첫 렌더에도 9가 표시됩니다. 첫 화면의 출발점이 같은 셈입니다."
      },
      {
        "title": "setCount((value) => value + 1)",
        "detail": "클릭하면 현재 상태를 기준으로 1을 더해 10을 표시합니다. 아래의 “서버에서 받은 인원”은 여전히 9입니다. props로 받은 기준값과 바뀌는 상태를 한 화면에서 확인할 수 있습니다."
      }
    ],
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load"
  },
  {
    "id": "hydration-example-detail-1",
    "title": "초기값을 넘기는 서버 부모도 함께 보기",
    "topic": "Hydration",
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load",
    "paragraphs": [
      "서버 부모는 members.length를 숫자로 전달합니다. 클라이언트 카운터는 앞에서 본 useState(initialCount) 코드로 시작합니다."
    ],
    "codeNotes": [
    {
        "code": "<Counter initialCount={members.length} />",
        "detail": "서버 부모가 스터디원 수를 계산해 숫자 props로 전달합니다. 명단이 9명이면 initialCount는 9입니다."
    },
    {
        "code": "'use client'",
        "detail": "app/counter.tsx 파일 맨 위에 작성합니다. 카운터에서 useState와 클릭 이벤트를 사용하므로 클라이언트 경계를 선언합니다. 위의 app/page.tsx와는 별도 파일입니다."
    },
    {
        "code": "{ initialCount }: { initialCount: number }",
        "detail": "서버 부모가 넘긴 initialCount를 받습니다. number 타입은 이 값으로 숫자를 전달해야 한다는 의미입니다."
    },
    {
        "code": "const [count, setCount] = useState(initialCount)",
        "detail": "받은 9를 카운터의 첫 상태로 사용합니다. 서버 HTML과 브라우저의 첫 렌더가 같은 props를 사용하므로 모두 9로 시작합니다. useState의 초기 인수는 해당 인스턴스의 첫 상태를 정합니다."
    },
    {
        "code": "onClick={() => setCount(value => value + 1)}",
        "detail": "하이드레이션 이후 버튼을 누르면 현재 상태 value에 1을 더합니다. 처음 클릭하면 9에서 10으로 바뀌며, 이 클릭으로 서버 부모가 다시 실행되지는 않습니다."
    },
    {
        "code": "{count}",
        "detail": "현재 상태를 버튼의 글자로 표시합니다. setCount로 상태가 바뀌면 React가 카운터를 다시 렌더링해 화면의 숫자를 갱신합니다. 부모가 전달한 initialCount는 계속 9이고 카운터의 count가 바뀝니다."
    }
],
    "code": "// app/page.tsx — 서버 부모\nimport Counter from './counter';\nimport { members } from './data';\n\nexport default function Page() {\n  return <Counter initialCount={members.length} />;\n}\n\n// app/counter.tsx — 별도 파일\n'use client';\n\nimport { useState } from 'react';\n\nexport default function Counter({ initialCount }: { initialCount: number }) {\n  const [count, setCount] = useState(initialCount);\n  return (\n    <button onClick={() => setCount(value => value + 1)}>\n      {count}\n    </button>\n  );\n}"
  },
  {
    "id": "hydration-example-detail-2",
    "title": "초기 렌더 → 하이드레이션 → 상태 갱신",
    "topic": "Hydration",
    "source": "https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load",
    "body": "같은 초기값으로 시작한 화면에 클릭 처리가 연결되고, 이후 브라우저에서 상태가 바뀝니다.",
    "steps": [
      {
        "title": "서버 HTML 표시",
        "detail": "서버가 initialCount를 9로 전달해 버튼에 9가 표시됩니다.",
        "screen": "9"
      },
      {
        "title": "브라우저에서 하이드레이션",
        "detail": "첫 렌더도 9로 시작하고 React가 클릭 이벤트를 처리할 수 있게 됩니다.",
        "screen": "9 · 클릭 가능"
      },
      {
        "title": "+1 버튼 클릭",
        "detail": "setCount가 현재 상태에 1을 더하고 브라우저가 변경된 숫자를 표시합니다.",
        "screen": "10"
      }
    ],
    "note": "Effect 실습은 초기값 0으로 시작한 뒤 마운트 후 interval을 등록합니다. 미리보기가 사라지면 정리 함수가 interval을 해제합니다."
  }
];
