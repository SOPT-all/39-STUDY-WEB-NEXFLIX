import Link from "next/link";
import type { Movie } from "@/lib/movies";

// Colocation: 상세 페이지에서만 쓰니까 같은 폴더에 (page가 아니라서 라우트 X)
export default function MovieInfo({ movie }: { movie: Movie }) {
  return (
    <>
      <h1>
        {movie.title} ({movie.year})
      </h1>
      <p>{movie.description}</p>
      <div className="chips">
        {movie.genres.map((g) => (
          <Link key={g} href={`/genre/${g}`} className="chip">
            {g}
          </Link>
        ))}
      </div>
    </>
  );
}
