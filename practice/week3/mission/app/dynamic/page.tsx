export default function DynamicPage() {
  // TODO(미션 4): next/headers의 cookies()로 name 쿠키를 읽어 name에 넣어보세요.
  // 쿠키가 없으면 '웹토리'를 사용합니다. cookies()는 Promise를 반환하므로 await가 필요합니다.
  const name = '웹토리';

  console.log('[DynamicPage] 렌더링');

  const renderedAt = new Date().toLocaleString('ko-KR');

  return (
    <main>
      <h1>동적 렌더링</h1>
      <section>
        <h2>{name}님, 안녕하세요</h2>
        <p>렌더링 시각: {renderedAt}</p>
      </section>
    </main>
  );
}
