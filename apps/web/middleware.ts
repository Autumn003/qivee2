import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "@prisma/client";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api/admin")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (token.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (
    token &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/forget-password") ||
      url.pathname.startsWith("/reset-password"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/forget-password/:pathname*",
    "/reset-password/:pathname*",
    "/dashboard/:path*",
    "/admin/:pathname*",
    "/admin",
    "/api/admin/:pathname*",
  ],
};
