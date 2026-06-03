import { initSession } from "@/app/(server)/middlewares/auth";
import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { resetPassword } from "@/app/(server)/services/check.service";
import { RankAdmin, RoleUser, StateUser } from "@/lib/generated/prisma/enums";
import { PayloadCheck } from "@/lib/utils/jwt";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const { password, tokenStr } = await request.json();

      if (!password) return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });

      const payload = JSON.parse(claims as string) as PayloadCheck;

      const res = await resetPassword(payload.userId, payload.token, payload.tokenId as string, tokenStr, payload.uuid, password);

      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }

      return await initSession(res.session as {
        id: string;
        userId: number;
        role: RoleUser;
        state: StateUser;
        rank?: RankAdmin;
        token: string;
      });

    });
  } catch (error) {
    console.error("POST check reset password API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
