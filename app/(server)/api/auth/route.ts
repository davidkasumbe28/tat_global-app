import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";
import { authenticated } from "../../services/auth.service";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const authorization = request.cookies.get("authorization")?.value;

      if (!claims && !authorization)
        return NextResponse.json(
          {
            error: logs.error.authenticated,
          },
          { status: 401 },
        );

      const newAcces_token = authorization?.split(" ")[1];

      if (!claims && newAcces_token) {
        const response = NextResponse.json(
          { data: newAcces_token },
          { status: 200 },
        );

        response.cookies.set(
          process.env.ACCESS_COOKIE_NAME as string,
          newAcces_token as string,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 jour
            sameSite: "strict",
            path: "/",
          },
        );

        return response;
      }

      const res = await authenticated(claims as string);

      if (!res.success)
        return NextResponse.json({ error: res.error }, { status: 400 });

      const response = NextResponse.json({ data: res.user }, { status: 200 });

      return response;
    });
  } catch (error) {
    console.error("GET auth authenticated API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
