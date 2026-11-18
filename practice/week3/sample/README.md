# 넥플릭스 3주차 Rendering Lab

[발표·실습 페이지 열기](https://nexflix-rendering-lab.vercel.app)

배포 링크에서 개념 설명과 블록 실습을 따라갈 수 있습니다. 사전 과제 코드는 아래 mission 폴더에서 작성합니다.

```sh
pnpm install
npm run dev
```

터미널에 표시된 주소에서 발표를 시작합니다. 개념 설명 20페이지 사이에서 주제별 블록 실습 6개를 진행하고, 마지막에 `/mission`에서 사전 과제 코드를 함께 설명합니다. 오른쪽 목차에서 원하는 항목으로 이동할 수 있고, 실습의 설명으로 돌아가기는 실습을 열었던 페이지로 연결됩니다.

사전 과제는 [별도 mission 폴더](../mission/README.md)에서 실행합니다.

| 주제 | 사전 과제 | 발표 실습 |
| --- | --- | --- |
| Streaming & Suspense | 목록 하나에 Suspense 추가 | 로딩 경계 나누기, await 위치 바꾸기 |
| Composition Patterns | 본문을 children으로 전달 | 제목 슬롯 전달, 두 패널의 독립적인 상태 비교 |
| Hydration | 같은 초기값과 클릭 이벤트 연결 | JavaScript 유무에 따른 패널 동작, Effect의 자동 갱신 비교 |

미리보기는 실행할 때마다 Next.js 페이지를 새로 요청합니다. Hydration에서 JavaScript 제한은 해당 미리보기에만 적용됩니다. 이름은 스터디 저장소 README의 명단을 사용했습니다.

과제 편집기는 입력의 TSX 문법을 확인합니다. 미리보기는 기본 코드와 예제 코드에 대응하는 Next.js 화면을 실행합니다. 로딩 문구나 증가량도 바꿔 볼 수 있습니다. 편집기에 붙여 넣은 임의 코드를 서버에서 실행하지는 않습니다.
