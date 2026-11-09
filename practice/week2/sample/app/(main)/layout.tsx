import Header from "./_components/header";

// Layout: (main) 안의 모든 페이지가 헤더를 공유
// 이동해도 리렌더 X → 검색창 글자 유지 (template.tsx 로 바꾸면 초기화)
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
