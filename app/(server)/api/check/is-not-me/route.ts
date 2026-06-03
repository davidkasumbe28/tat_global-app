import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { isNotMe } from "@/app/(server)/services/check.service";
import { PayloadCheck } from "@/lib/utils/jwt";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const { uuid } = await request.json()

      const payload = JSON.parse(claims as string) as PayloadCheck;

      if (uuid !== payload.uuid) {
        const response = NextResponse.json(
          { error: "Votre identifiant de verification est incorrect." },
          { status: 400 },
        );

        response.cookies.delete(process.env.REFRESH_COOKIE_NAME as string);
        response.cookies.delete(process.env.ACCESS_COOKIE_NAME as string);

        return response;
      }

      const res = await isNotMe(payload.userId);

      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }

      const response = NextResponse.json(
        { data: logs.success.is_not_me },
        { status: 201 },
      );

      response.cookies.delete(process.env.REFRESH_COOKIE_NAME as string);
      response.cookies.delete(process.env.ACCESS_COOKIE_NAME as string);

      return response;
    });
  } catch (error) {
    console.error("POST check is not me API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
