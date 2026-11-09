import "./globals.css";

// 루트 레이아웃 (필수) → <html>, <body> 는 여기에만!
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
