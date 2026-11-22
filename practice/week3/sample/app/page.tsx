import LikeButton from './like-button';

export default function Home() {
  console.log('[Page] 렌더링');

  return (
    <main>
      <h1>NEXFLIX 3주차 렌더링 실습</h1>

      <section>
        <h2>미션 1. {"'use client'"} 붙이기</h2>
        <LikeButton />
      </section>
    </main>
  );
}
