import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { STATUS_USER } from "./lib/constants/constants";
import { APP } from "./lib/data/raw/routes";
import { RoleUser } from "./lib/generated/prisma/enums";
import prisma from "./lib/prisma";
import { Payload, PayloadCheck, verifyToken } from "./lib/utils/jwt";


const protectedRoutes = Object.values(APP.private);

const publicRoutes = Object.values(APP.public);

const authRoutes = Object.values(APP.auth);

const checkRoutes = Object.values(APP.check);

const adminRoutes = Object.values(APP.admin);

export default async function proxy(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;

    const isAuthRoute = authRoutes.includes(path);

    const isCheckRoute = checkRoutes.includes(path) || path.startsWith(APP.check.verify) || path.startsWith(APP.check.resetPassword);

    const isAdminRoute = adminRoutes.includes(path);

    const isPublicRoute = publicRoutes.includes(path) || path.startsWith(APP.public.product) || isAuthRoute;

    const isProtectedRoute = protectedRoutes.includes(path) || isCheckRoute || isAdminRoute

    const access_token = (await cookies()).get(
      process.env.ACCESS_COOKIE_NAME as string,
    )?.value;

    // const access_token = (await cookies()).get(
    //   process.env.ACCESS_COOKIE_NAME as string,
    // )?.value;

    if (!access_token && isProtectedRoute) {
      return NextResponse.redirect(new URL(APP.auth.login, req.url));
    } else if (!access_token && !isProtectedRoute) {
      return NextResponse.next();
    }

    const claims = verifyToken(access_token as string) as PayloadCheck &
      Payload;

    if (!claims && isProtectedRoute) {
      return NextResponse.redirect(new URL(APP.auth.login, req.url));
    } else if (!claims && !isProtectedRoute) {
      return NextResponse.next();
    }

    const select = {
      id: true,
      email: true,
      status: true,
      state: true,
      role: true,
      admin: { select: { rank: true } },
      sessions: { select: { userId: true, tokenKey: true, tokenKeyUsed: true } }
    };

    const user = await prisma.user.findUnique({
      select,
      where: { id: claims?.userId }
    });

    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL(APP.auth.login, req.url));
    } else if (!user && !isProtectedRoute) {
      return NextResponse.next();
    }

    if (user?.status === STATUS_USER.offline && isProtectedRoute) {
      return NextResponse.redirect(new URL(APP.auth.login, req.url));
    }

    const session = user?.sessions.find((s) => s.userId === claims.userId)

    if (user?.status === STATUS_USER.checked && ((isProtectedRoute && !path.startsWith(APP.check.resetPassword) && !path.startsWith(APP.check.verify)) || path === APP.auth.forgetPassword))
      return NextResponse.redirect(new URL(APP.auth.login, req.url));
    else if (user?.status === STATUS_USER.checked && APP.check.resetPasswordToken.test(path) || APP.check.verifyToken.test(path))
      if (!session)
        return NextResponse.redirect(new URL(APP.auth.login, req.url));
      else if (!session?.tokenKey)
        return NextResponse.redirect(new URL(APP.auth.login, req.url));
      else if (session?.tokenKey && !session?.tokenKeyUsed && path.startsWith(APP.check.resetPassword))
        return NextResponse.redirect(new URL(APP.check.verify, req.url));
      else if (session?.tokenKey && session?.tokenKeyUsed && path.startsWith(APP.check.verify))
        return NextResponse.redirect(new URL(APP.check.resetPassword, req.url));

    if (user?.status !== STATUS_USER.checked && (path.startsWith(APP.check.verify) || path.startsWith(APP.check.resetPassword))) {
      return NextResponse.redirect(new URL(APP.auth.login, req.url));
    }

    if (user?.status === STATUS_USER.in_progress && (isProtectedRoute && path !== APP.private.formCompletion)) {
      return NextResponse.redirect(
        new URL(APP.private.formCompletion, req.url),
      );
    }

    if (user?.status !== STATUS_USER.in_progress && path === APP.private.formCompletion) {
      return NextResponse.redirect(new URL(APP.auth.login, req.url));
    }

    if (user?.status === STATUS_USER.online && (isAuthRoute || isCheckRoute || path === APP.private.formCompletion)) {
      switch (claims?.role) {
        case RoleUser.ADMIN:
          return NextResponse.redirect(new URL(APP.private.admin, req.url));
        default:
          return NextResponse.redirect(new URL(APP.private.account, req.url));
      }
    }

    if (
      user?.status === STATUS_USER.online &&
      isAdminRoute &&
      claims?.role !== RoleUser.ADMIN
    ) {
      return NextResponse.redirect(new URL(APP.private.account, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|actions|helpers|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
