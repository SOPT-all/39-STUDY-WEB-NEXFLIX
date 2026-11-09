import Link from "next/link";
import type { Movie } from "@/lib/movies";

// 포스터 → /title/[id] 로 이동
export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/title/${movie.id}`} className="card">
      <strong>{movie.title}</strong>
      <small>{movie.year}</small>
    </Link>
  );
}
