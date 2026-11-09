import Link from "next/link";
import { getMovie } from "@/lib/movies";

export default async function WatchPage({ params }: PageProps<"/watch/[id]">) {
  const { id } = await params;
  const movie = getMovie(id);

  return (
    <div>
      <span className="file-label">app/(watch)/watch/[id]/page.tsx</span>
      <h1>▶ {movie?.title} 재생 중</h1>
      <Link href="/browse" className="btn">
        ← 나가기
      </Link>
    </div>
  );
}
