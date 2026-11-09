import { movies } from "@/lib/movies";
import MovieCard from "../../_components/movie-card";

// 2초 걸리는 척ㅎ → 이 슬롯만 loading.tsx
export default async function RecommendSlot() {
  await new Promise((r) => setTimeout(r, 2000));

  return (
    <>
      <span className="file-label">@recommend/page.tsx</span>
      <h2>추천</h2>
      <div className="grid">
        {movies.slice(2).map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </>
  );
}
