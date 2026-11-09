"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { href: "/browse", label: "홈" },
  { href: "/genre/action", label: "액션" },
  { href: "/my-list", label: "내가 찜한 콘텐츠" },
];

// _components → Private Folder 라서 라우트 아님 (/_components → 404)
export default function Header() {
  const pathname = usePathname(); // 현재 경로 → 활성 메뉴 표시

  return (
    <header className="header">
      <Link href="/browse" className="logo">
        NEXFLIX
      </Link>
      <nav className="nav">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={pathname.startsWith(menu.href) ? "active" : ""}
          >
            {menu.label}
          </Link>
        ))}
      </nav>
      <input placeholder="입력하고 페이지 이동해보기" />
    </header>
  );
}
