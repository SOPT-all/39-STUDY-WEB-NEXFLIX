export default function StaticPage() {
  console.log('[StaticPage] 렌더링');

  const renderedAt = new Date().toLocaleString('ko-KR');

  return (
    <main>
      <h1>정적 렌더링</h1>
      <section>
        <h2>안녕하세요</h2>
        <p>렌더링 시각: {renderedAt}</p>
      </section>
    </main>
  );
}
