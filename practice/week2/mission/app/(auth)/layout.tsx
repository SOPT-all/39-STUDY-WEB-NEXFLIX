// (auth) 그룹 → 헤더 없는 가운데 정렬 화면
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="center">{children}</div>;
}
