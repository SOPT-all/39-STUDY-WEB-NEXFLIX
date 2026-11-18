# 넥플릭스 3주차 사전 과제

저장소를 클론하고 발표 브랜치로 이동합니다.

```sh
git clone https://github.com/SOPT-all/39-STUDY-WEB-NEXFLIX.git
cd 39-STUDY-WEB-NEXFLIX
git switch week3/minsik/rendering
```

이어서 사전 과제를 실행합니다.

```sh
cd practice/week3/mission
pnpm install
pnpm dev
```

스터디 전에 브라우저에서 기본 화면을 확인하고 TODO 세 곳을 채워 오세요.

1. `app/page.tsx`의 느린 목록에 Suspense를 추가합니다. 새로고침하면 제목과 fallback이 먼저 보이고, 약 2.5초 뒤 목록이 표시됩니다.
2. 같은 파일에서 서버의 `MemberList`를 `ClientPanel`에 넘깁니다. **열기**를 누르면 이름 목록이 보입니다.
3. `app/counter.tsx`에서 서버가 넘긴 `initialCount`로 상태를 시작하고 클릭 이벤트를 연결합니다. 새로고침하면 9, 한 번 누르면 10입니다.

발표에서는 작성한 코드와 화면 결과를 함께 비교합니다.
