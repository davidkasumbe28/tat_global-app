import { initCheckSession } from "@/app/(server)/middlewares/auth";
import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { StateUser } from "@/lib/generated/prisma/enums";
import { PayloadCheck } from "@/lib/utils/jwt";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";
import { checking } from "../../services/check.service";

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const { tokenId, tokenStr, uuid } = await request.json();

      if (!tokenId) {
        return NextResponse.json({ error: "Code requis" }, { status: 400 });
      }

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

      const res = await checking(payload.token, tokenId, tokenStr, payload.uuid);

      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }

      return await initCheckSession(res.session as {
        id: string;
        userId: number;
        state: StateUser;
        token: string;
        tokenId: string;
        tokenStr: string;
      })

    });
  } catch (error) {
    console.error("POST check cheking API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
