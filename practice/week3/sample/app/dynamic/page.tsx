import { cookies } from 'next/headers';

export default async function DynamicPage() {
  const cookieStore = await cookies();
  const name = cookieStore.get('name')?.value ?? '웹토리';

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
