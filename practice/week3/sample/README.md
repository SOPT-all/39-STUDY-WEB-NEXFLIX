# 넥플릭스 3주차 Rendering Lab

```sh
pnpm install
npm run dev
```

터미널에 표시된 주소를 열면 개념 소개가 나옵니다. 블록 실습 시작을 누르거나 `/lab`으로 이동합니다. 먼저 화면에 무엇이 표시될지 예상하고, 블록을 추가한 뒤 두 상태를 비교합니다. 두 결과를 비교할 때 각 미리보기 아래에서 해당 코드를 확인할 수 있습니다. 관찰 포인트는 실행 결과 아래에 있습니다.

| 주제 | 미션 |
| --- | --- |
| Streaming & Suspense | 느린 응답 먼저 기다리기, 로딩 경계 나누기 |
| Composition Patterns | 서버 콘텐츠를 children으로 넘기기, 제목과 본문을 슬롯으로 넘기기 |
| Hydration | 보이는 버튼과 눌리는 버튼, 서버 값으로 첫 화면 그리기 |

미리보기는 실행할 때마다 Next.js 페이지를 새로 요청합니다. Hydration에서 JavaScript 제한은 해당 미리보기에만 적용됩니다. 이름은 스터디 저장소 README의 명단을 사용했습니다.

비교를 마치면 **코드 채우기**를 누릅니다. `/mission`을 열어둔 채 아래 파일의 TODO를 순서대로 완성합니다.

1. `app/mission/page.tsx`에서 `SlowMemberList`에 Suspense와 로딩 문구를 추가합니다. 새로고침하면 안내가 먼저 표시되고, 뒤이어 이름 목록이 뜹니다.
2. 같은 파일에서 `MemberList`를 `ClientPanel`의 자식으로 전달합니다. **열기**를 누르면 이름 목록이 표시됩니다.
3. `app/mission/counter.tsx`에서 서버가 전달한 `initialCount`로 상태를 시작하고 버튼에 클릭 이벤트를 연결합니다. 새로고침하면 **9**, 한 번 클릭하면 **10**이 표시됩니다.
