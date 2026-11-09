import { notFound } from "next/navigation";
import { getMovie } from "@/lib/movies";
import Modal from "../../../_components/modal";
import MovieInfo from "../../../(main)/title/[id]/movie-info";

// Intercepting: (.)title → 같은 레벨의 /title 을 가로챔
// 포스터 클릭(Soft) → 이 파일 = 모달 / 새로고침(Hard) → (main)/title/[id]/page.tsx
export default async function TitleModal({ params }: PageProps<"/title/[id]">) {
  const { id } = await params;
  const movie = getMovie(id);
  if (!movie) notFound();

  return (
    <Modal>
      <span className="file-label">@modal/(.)title/[id]/page.tsx (모달)</span>
      <MovieInfo movie={movie} />
    </Modal>
  );
}
