// Parallel Routes: @watching → watching, @recommend → recommend (import 필요 없음)
export default function MyListLayout({
  children,
  watching,
  recommend,
}: {
  children: React.ReactNode;
  watching: React.ReactNode;
  recommend: React.ReactNode;
}) {
  return (
    <main>
      {children}
      <div className="slots">
        <section className="slot">{watching}</section>
        <section className="slot">{recommend}</section>
      </div>
    </main>
  );
}
