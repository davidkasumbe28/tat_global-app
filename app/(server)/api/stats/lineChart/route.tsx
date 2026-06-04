import { NextRequest, NextResponse } from "next/server";
import logs from "@/lib/utils/logs";
import { TimeRange } from "@/lib/@types/enums";
import { readStatsChart } from "@/app/(server)/services/stats.service";
import { checkAuth } from "@/app/(server)/middlewares/check-auth";

export async function GET(request: NextRequest) {
    try {
        return await checkAuth(request, async () => {
            const searchParams = request.nextUrl.searchParams;

            const timeRange = searchParams.get("timeRange") || TimeRange.MOTH;

            const result = await readStatsChart(timeRange as TimeRange);

            if (!result.success) {
                return NextResponse.json({ error: result.error }, { status: 400 });
            }

            return NextResponse.json({ data: result.stats }, { status: 200 });
        });
    } catch (error) {
        console.error("GET stats chart API error:", error);
        return NextResponse.json({ error: logs.error.server }, { status: 500 });
    }
}
