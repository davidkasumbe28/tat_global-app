import { initCheckSession } from "@/app/(server)/middlewares/auth";
import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { resendForgetPasswordEmail } from "@/app/(server)/services/check.service";
import { StateUser } from "@/lib/generated/prisma/enums";
import { PayloadCheck } from "@/lib/utils/jwt";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const { tokenStr, uuid } = await request.json()

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

      const res = await resendForgetPasswordEmail(payload.uuid, payload.token, tokenStr)

      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      if (res.session?.state === StateUser.DISABLED)
        return NextResponse.json({ error: logs.error.state }, { status: 401 });


      return initCheckSession(res.session as {
        id: string,
        userId: number,
        firstName: string,
        lastName: string,
        email: string,
        state: StateUser,
        token: string,
        tokenId: string,
        tokenStr: string
      });

    });
  } catch (error) {
    console.error("POST check resend forgot password email error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}