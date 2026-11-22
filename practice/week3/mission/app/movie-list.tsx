import { movies } from '@/lib/movies';

export default function MovieList() {
  console.log('[MovieList] 렌더링');

  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          {movie.title} ({movie.year}) · {movie.genre}
        </li>
      ))}
    </ul>
  );
}
