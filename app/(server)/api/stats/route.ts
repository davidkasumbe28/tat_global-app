import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "../../middlewares/check-auth";
import { readStats } from "../../services/stats.service";
import logs from "@/lib/utils/logs";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const result = await readStats();

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.stats }, { status: 200 });
    });
  } catch (error) {
    console.error("GET stats API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
