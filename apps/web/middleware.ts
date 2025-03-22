import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/api/admin") ||
      url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/dashboard/:path*",
    "/admin/:pathname*",
    "/api/admin/:pathname*",
  ],
};
