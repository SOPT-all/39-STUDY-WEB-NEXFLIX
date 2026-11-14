export const members = ['이채원', '강효정', '공기훈', '심민식', '최효비', '이해니', '조예슬', '황유림', '남주형'];

export const topics = [
  {
    label: 'Streaming & Suspense',
    missions: [
      {
        id: 'streaming',
        title: '느린 응답 먼저 기다리기',
        question: '스터디원 목록을 불러오는 동안 페이지 제목을 먼저 볼 수 있을까?',
        block: '느린 영역을 Suspense로 감싸기',
        before: 'const names = await readMembers();\nreturn <MemberList names={names} />;',
        after: '<Suspense fallback={<Loading label="스터디원" />}>\n  <SlowMemberList />\n</Suspense>',
        check: '블록을 넣으면 제목과 로딩 문구가 먼저 보이고, 약 2.5초 뒤 이름 목록이 채워집니다.',
      },
      {
        id: 'boundaries',
        title: '로딩 경계 나누기',
        question: '빠른 응답과 느린 응답이 하나의 Suspense 안에 있으면 어느 쪽부터 보일까?',
        block: '각 응답에 Suspense 따로 두기',
        before: '<Suspense fallback={<Loading label="전체" />}>\n  <FastGroup />\n  <SlowGroup />\n</Suspense>',
        after: '<Suspense fallback={<Loading label="첫 번째" />}>\n  <FastGroup />\n</Suspense>\n<Suspense fallback={<Loading label="두 번째" />}>\n  <SlowGroup />\n</Suspense>',
        check: '경계 하나에서는 두 목록이 같이 나타납니다. 경계를 나누면 약 0.8초 뒤 첫 번째 목록이 나타나고 두 번째는 계속 로딩 중입니다.',
      },
    ],
  },
  {
    label: 'Composition Patterns',
    missions: [
      {
        id: 'composition',
        title: '서버 콘텐츠를 children으로 넘기기',
        question: '클라이언트 패널의 열기 버튼을 유지하면서 서버 콘텐츠를 안에 넣을 수 있을까?',
        block: '스터디원 목록을 children으로 연결',
        before: '<ClientPanel />',
        after: '<ClientPanel>\n  <ServerMemberList />\n</ClientPanel>',
        check: '두 화면에서 패널을 열어 보세요. 블록을 넣은 쪽의 패널 안에서 스터디원 이름을 볼 수 있습니다.',
      },
      {
        id: 'slots',
        title: '제목과 본문을 슬롯으로 넘기기',
        question: '같은 패널에서 제목과 본문을 각각 바꾸려면 어디에서 조합할까?',
        block: '제목 슬롯에 서버 콘텐츠 연결',
        before: '<ClientPanel>\n  <ServerMemberList />\n</ClientPanel>',
        after: '<ClientPanel heading={<ServerHeading />}>\n  <ServerMemberList />\n</ClientPanel>',
        check: '블록을 넣으면 서버에서 전달한 제목이 버튼 옆에 표시됩니다. 제목이 바뀌어도 열기 버튼과 본문은 계속 동작합니다.',
      },
    ],
  },
  {
    label: 'Hydration',
    missions: [
      {
        id: 'hydration',
        title: '보이는 버튼과 눌리는 버튼',
        question: '두 화면에서 +1 버튼이 모두 보인다면 둘 다 클릭에 반응할까?',
        block: '미리보기 JavaScript 켜기',
        before: '<iframe sandbox="allow-same-origin" />',
        after: '<iframe />',
        check: '두 화면 모두 0으로 시작합니다. +1을 누르면 JavaScript를 켠 쪽의 숫자만 올라갑니다.',
      },
      {
        id: 'initial-state',
        title: '서버 값으로 첫 화면 그리기',
        question: '서버가 준 스터디원 수를 첫 화면과 클릭 이후에도 이어서 쓸 수 있을까?',
        block: '서버에서 계산한 인원 전달',
        before: '<Counter />\n// 기본값 0',
        after: '<Counter initialCount={members.length} />\n// 서버에서 계산한 9로 시작',
        check: '기본 상태는 0, 블록을 넣은 상태는 9로 시작합니다. 각각 +1을 누르면 1과 10으로 바뀝니다.',
      },
    ],
  },
];

export type Mission = (typeof topics)[number]['missions'][number];
