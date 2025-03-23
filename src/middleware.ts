import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware"; //It used to apply middleware on each and every file
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/signIn") ||
      url.pathname.startsWith("/signUpFreelancer") ||
      url.pathname.startsWith("/signUpEmployer") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/signIn",
    "/signUpFreelancer",
    "/signUpEmployer",
    '/',
    "/verify/:path*",
  ],
}; //This will consist on what paths I have to run this middleware
