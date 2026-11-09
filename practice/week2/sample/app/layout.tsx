import "./globals.css";

// 루트 레이아웃 (필수) → <html>, <body> 는 여기에만!
// modal = @modal 슬롯 → 평소엔 null, 포스터 클릭하면 모달
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
