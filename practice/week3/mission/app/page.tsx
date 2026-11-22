// TODO(미션 1): 아래 import와 <LikeButton />의 주석을 풀고 에러를 확인한 뒤, like-button.tsx를 고쳐보세요.
// import LikeButton from './like-button';
// TODO(미션 3): 아래 import 2개와 <RateButton />의 주석을 풀고 에러를 확인한 뒤, 함수 없이 movie만 넘기도록 고쳐보세요.
// import { movies } from '@/lib/movies';
// import RateButton from './rate-button';
import TogglePanel from './toggle-panel';

export default function Home() {
  console.log('[Page] 렌더링');

  return (
    <main>
      <h1>NEXFLIX 3주차 렌더링 실습</h1>

      <section>
        <h2>미션 1. {"'use client'"} 붙이기</h2>
        {/* <LikeButton /> */}
      </section>

      <section>
        <h2>미션 2. import 대신 children으로 넘기기</h2>
        {/* TODO(미션 2): MovieList를 import해서 TogglePanel의 children으로 넘겨보세요. */}
        <TogglePanel />
      </section>

      <section>
        <h2>미션 3. 직렬화 가능한 props만 넘기기</h2>
        {/* <RateButton movie={movies[1]} onRate={() => console.log(`${movies[1].title} 평가`)} /> */}
      </section>
    </main>
  );
}
