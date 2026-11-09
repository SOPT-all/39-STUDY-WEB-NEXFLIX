import { getMoviesByGenres } from "@/lib/movies";
import MovieCard from "../../_components/movie-card";

// catch-all: /genre/action → ["action"], /genre/action/korean → ["action", "korean"]
export default async function GenrePage({
  params,
}: PageProps<"/genre/[...slug]">) {
  const { slug } = await params;
  const list = getMoviesByGenres(slug);

  return (
    <main>
      <span className="file-label">app/(main)/genre/[...slug]/page.tsx</span>
      <h1>params.slug = {JSON.stringify(slug)}</h1>
      <div className="grid">
        {list.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </main>
  );
}
