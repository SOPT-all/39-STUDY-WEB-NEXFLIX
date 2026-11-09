import { movies } from "@/lib/movies";
import MovieCard from "../../_components/movie-card";

export default function WatchingSlot() {
  return (
    <>
      <span className="file-label">@watching/page.tsx</span>
      <h2>시청 중</h2>
      <div className="grid">
        {movies.slice(0, 2).map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </>
  );
}
