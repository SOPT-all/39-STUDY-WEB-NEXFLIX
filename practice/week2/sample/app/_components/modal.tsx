"use client";

import { useRouter } from "next/navigation";

// 모달 → 밖을 클릭하거나 ✕ 누르면 router.back() 으로 닫기
export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="overlay" onClick={() => router.back()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <button className="btn" onClick={() => router.back()}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
