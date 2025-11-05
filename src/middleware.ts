import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Réécrit /jeu-page-1 ou /jeu-page1 -> /jeu/1
  const m = pathname.match(/^\/jeu-page-?(\d+)$/);
  if (m) {
    const url = request.nextUrl.clone();
    url.pathname = `/jeu/${m[1]}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};


