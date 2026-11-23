export const members = ['이채원', '강효정', '공기훈', '심민식', '최효비', '이해니', '조예슬', '황유림', '남주형'];

export const topics = [
  {
    label: 'Streaming & Suspense',
    missions: [
      {
        id: 'boundaries',
        explanationStep: 'streaming-example',
        title: '로딩 경계 나누기',
        question: '빠른 응답과 느린 응답이 하나의 Suspense 안에 있으면 어느 쪽부터 보일까?',
        block: '각 응답에 Suspense 따로 두기',
        before: '<Suspense fallback={<Loading label="전체" />}>\n  <FastGroup />\n  <SlowGroup />\n</Suspense>',
        after: '<Suspense fallback={<Loading label="첫 번째" />}>\n  <FastGroup />\n</Suspense>\n<Suspense fallback={<Loading label="두 번째" />}>\n  <SlowGroup />\n</Suspense>',
        check: '경계 하나에서는 두 목록이 같이 나타납니다. 경계를 나누면 약 0.8초 뒤 첫 번째 목록이 나타나고 두 번째는 계속 로딩 중입니다.',
      },
      {
        id: "await-position",
        explanationStep: "streaming-example",
        title: "await 위치 바꾸기",
        question: "Suspense가 있어도 부모가 먼저 기다리면 제목을 먼저 볼 수 있을까?",
        block: "조회 대기를 자식 안으로 옮기기",
        before: "const names = await readMembers();\nreturn <><h2>스터디원 목록</h2>\n  <Suspense fallback={<Loading label=\"스터디원\" />}>\n    <MemberList names={names} />\n  </Suspense>\n</>;",
        after: "return <><h2>스터디원 목록</h2>\n  <Suspense fallback={<Loading label=\"스터디원\" />}>\n    <SlowMemberList />\n  </Suspense>\n</>;",
        check: "부모에서 await하면 약 2.5초 동안 제목도 기다립니다. 자식으로 옮기면 제목과 fallback을 먼저 볼 수 있습니다. 경계가 존재하는지와 조회를 기다리는 위치를 함께 확인하세요.",
      },
    ],
  },
  {
    label: 'Composition Patterns',
    missions: [
      {
        id: 'slots',
        explanationStep: 'composition-example',
        title: '제목과 본문을 슬롯으로 넘기기',
        question: '같은 패널에서 제목과 본문을 각각 바꾸려면 어디에서 조합할까?',
        block: '제목 슬롯에 서버 콘텐츠 연결',
        before: '<ClientPanel>\n  <ServerMemberList />\n</ClientPanel>',
        after: '<ClientPanel heading={<ServerHeading />}>\n  <ServerMemberList />\n</ClientPanel>',
        check: '블록을 넣으면 서버에서 전달한 제목이 버튼 옆에 표시됩니다. 제목이 바뀌어도 열기 버튼과 본문은 계속 동작합니다.',
      },
      {
        id: "reuse-panels",
        explanationStep: "composition-example",
        title: "같은 패널을 두 곳에 재사용하기",
        question: "서버가 서로 다른 목록을 넘기면 두 패널의 열림 상태도 함께 바뀔까?",
        block: "다른 목록을 담은 두 번째 패널 추가",
        before: "<ClientPanel heading=\"첫 번째 그룹\">\n  <MemberList names={members.slice(0, 4)} />\n</ClientPanel>",
        after: "<ClientPanel heading=\"첫 번째 그룹\">\n  <MemberList names={members.slice(0, 4)} />\n</ClientPanel>\n<ClientPanel heading=\"두 번째 그룹\">\n  <MemberList names={members.slice(4)} />\n</ClientPanel>",
        check: "추가된 화면에서 첫 번째 패널만 열어 보세요. 두 번째 패널은 닫혀 있습니다. 같은 컴포넌트를 사용해도 각 인스턴스의 useState는 독립적이고 서버가 넘긴 목록도 서로 다릅니다.",
      },
    ],
  },
  {
    label: 'Hydration',
    missions: [
      {
        id: 'hydration',
        explanationStep: 'hydration',
        title: 'HTML만 있는 패널은 열릴까?',
        question: '서버가 보낸 열기 버튼이 보여도 JavaScript 실행을 막으면 패널이 열릴까?',
        block: '미리보기 JavaScript 켜기',
        before: '<iframe\n  src="/preview?mission=hydration"\n  sandbox="allow-same-origin"\n/>',
        after: '<iframe src="/preview?mission=hydration" />',
        check: '두 화면 모두 서버 HTML로 열기 버튼이 보입니다. JavaScript가 허용된 쪽에서만 패널이 열리고 이름 목록이 나타납니다. 이 실습은 iframe에서 스크립트를 막아 하이드레이션 전후의 차이를 관찰합니다.',
      },
      {
        id: "after-hydration",
        explanationStep: "hydration-example",
        title: "하이드레이션 이후 자동 갱신하기",
        question: "서버 HTML에 0이 보인 뒤 브라우저에서만 시간을 갱신하려면 언제 시작할까?",
        block: "Effect에서 interval 시작",
        before: "const [seconds, setSeconds] = useState(0);\nreturn <output>경과 {seconds}초</output>;",
        after: "const [seconds, setSeconds] = useState(0);\nuseEffect(() => {\n  const timer = setInterval(() => setSeconds(value => value + 1), 1000);\n  return () => clearInterval(timer);\n}, []);\nreturn <output>경과 {seconds}초</output>;",
        check: "두 화면의 서버 HTML과 브라우저 첫 렌더는 모두 0입니다. Effect가 있는 쪽은 마운트 후 interval이 시작되어 숫자가 올라갑니다. 실행할 때마다 새로 시작하고, 미리보기가 사라지면 interval을 해제합니다. 이 값은 실제 경과 시간 측정이 아닌 interval 호출 횟수 예제입니다.",
      },
    ],
  },
];

export type Mission = (typeof topics)[number]['missions'][number];
