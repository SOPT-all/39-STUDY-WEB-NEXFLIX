"use client";

import { useParams } from "next/navigation";

// 클라이언트 컴포넌트에서 params 읽기 → useParams()
export default function LikeButton() {
  const { id } = useParams<{ id: string }>();

  return (
    <button className="btn" onClick={() => alert(`${id}번 찜!`)}>
      + 찜하기 (id: &quot;{id}&quot;)
    </button>
  );
}
