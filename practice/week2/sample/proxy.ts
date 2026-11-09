import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Proxy: 페이지 도착 전에 검사 → 프로필 없으면 /profiles 로
export function proxy(request: NextRequest) {
  if (!request.cookies.get("profile")) {
    return NextResponse.redirect(new URL("/profiles", request.url));
  }
  return NextResponse.next();
}

// 검사할 주소 (/profiles 넣으면 무한 리다이렉트. . .)
export const config = {
  matcher: [
    "/browse/:path*",
    "/title/:path*",
    "/genre/:path*",
    "/my-list/:path*",
    "/watch/:path*",
  ],
};
