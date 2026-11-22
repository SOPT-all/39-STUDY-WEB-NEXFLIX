import { movies } from '@/lib/movies';
import LikeButton from './like-button';
import MovieList from './movie-list';
import RateButton from './rate-button';
import TogglePanel from './toggle-panel';

export default function Home() {
  console.log('[Page] 렌더링');

  return (
    <main>
      <h1>NEXFLIX 3주차 렌더링 실습</h1>

      <section>
        <h2>미션 1. {"'use client'"} 붙이기</h2>
        <LikeButton />
      </section>

      <section>
        <h2>미션 2. import 대신 children으로 넘기기</h2>
        <TogglePanel>
          <MovieList />
        </TogglePanel>
      </section>

      <section>
        <h2>미션 3. 직렬화 가능한 props만 넘기기</h2>
        <RateButton movie={movies[1]} />
      </section>
    </main>
  );
}
