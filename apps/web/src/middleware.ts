import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/sign-up", "/dashboard", "/analytics"];
const AUTH_ROUTES = ["/settings"];

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ?? request.headers.get("authorization")?.split(" ")[1];

  const isPublic = PUBLIC_ROUTES.some((r) => request.nextUrl.pathname.startsWith(r));

  const isAuthRequired = AUTH_ROUTES.some((r) => request.nextUrl.pathname.startsWith(r));

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && isAuthRequired) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\.svg).*)"],
};
