import { revokeSession } from "@/app/(server)/middlewares/auth";
import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { logout } from "@/app/(server)/services/auth.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const res = await logout(claims as string);

      if (!res.success)
        return NextResponse.json({ error: res.error }, { status: 400 });

      return await revokeSession();
    });
  } catch (error) {
    console.error("GET auth logout API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
