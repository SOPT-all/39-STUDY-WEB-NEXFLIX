import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieSlow } from "@/lib/movies";
import MovieInfo from "./movie-info";
import LikeButton from "./like-button";

// 동적 라우팅: [id] → /title/1, /title/2 ...
export default async function TitlePage({ params }: PageProps<"/title/[id]">) {
  const { id } = await params; // params 는 Promise → await
  const movie = await getMovieSlow(id); // 1.5초 → loading.tsx

  if (!movie) notFound(); // /title/999 → not-found.tsx

  return (
    <main>
      <span className="file-label">
        app/(main)/title/[id]/page.tsx (전체 페이지)
      </span>
      <MovieInfo movie={movie} />
      <Link href={`/watch/${movie.id}`} className="btn">
        ▶ 재생
      </Link>{" "}
      <LikeButton />
    </main>
  );
}
