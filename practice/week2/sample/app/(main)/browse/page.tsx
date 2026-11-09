import Link from "next/link";
import { movies, genres } from "@/lib/movies";
import MovieCard from "../_components/movie-card";

// 파일 기반 라우팅: browse/page.tsx → /browse
export default function BrowsePage() {
  return (
    <main>
      <span className="file-label">app/(main)/browse/page.tsx</span>
      <h1>무엇을 볼까요? 🍿</h1>

      <div className="chips">
        {genres.map((g) => (
          <Link key={g} href={`/genre/${g}`} className="chip">
            {g}
          </Link>
        ))}
        <Link href="/genre/action/korean" className="chip">
          action + korean
        </Link>
      </div>

      <div className="grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </main>
  );
}
