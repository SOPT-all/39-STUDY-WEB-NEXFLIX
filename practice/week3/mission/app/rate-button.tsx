'use client';

import { useState } from 'react';
import type { Movie } from '@/lib/movies';

// TODO(미션 3): 서버 컴포넌트에서 함수(onRate)는 넘겨받을 수 없습니다. props에서 onRate를 지워보세요.
export default function RateButton({ movie, onRate }: { movie: Movie; onRate?: () => void }) {
  console.log('[RateButton] 렌더링');

  const [rated, setRated] = useState(false);

  const handleRate = () => {
    // TODO(미션 3): 부모에게 받은 onRate 대신, 여기서 직접 `${movie.title} 평가` 로그를 출력해보세요.
    onRate?.();
    setRated(true);
  };

  return (
    <div>
      <button onClick={handleRate}>{movie.title} 평가하기</button>
      {rated && <p>{movie.title} ({movie.year}) 평가 완료</p>}
    </div>
  );
}
