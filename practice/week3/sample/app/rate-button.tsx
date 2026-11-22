'use client';

import { useState } from 'react';
import type { Movie } from '@/lib/movies';

export default function RateButton({ movie }: { movie: Movie }) {
  console.log('[RateButton] 렌더링');

  const [rated, setRated] = useState(false);

  const handleRate = () => {
    console.log(`${movie.title} 평가`);
    setRated(true);
  };

  return (
    <div>
      <button onClick={handleRate}>{movie.title} 평가하기</button>
      {rated && <p>{movie.title} ({movie.year}) 평가 완료</p>}
    </div>
  );
}
