import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { readManagers } from "@/app/(server)/services/user.service";
import { RankAdmin, StateUser } from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const searchParams = request.nextUrl.searchParams;
      const rank = (searchParams.get("rank") || "ALL") as RankAdmin | "ALL";
      const state = (searchParams.get("state") || "ALL") as StateUser | "ALL";

      const result = await readManagers(rank, state);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.managers }, { status: 200 });
    });
  } catch (error) {
    console.error("GET managers error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
