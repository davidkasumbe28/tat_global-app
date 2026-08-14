import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";
import { readTransactionsSummary } from "../../../services/transaction.service";
import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { Payload } from "@/lib/utils/jwt";
import { RoleUser } from "@/lib/generated/prisma/enums";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string) as Payload;

      if (!claims && payload.role !== RoleUser.ADMIN)
        return NextResponse.json(
          { error: logs.error.notAuthorized },
          { status: 403 },
        );

      const result = await readTransactionsSummary();

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.summary }, { status: 200 });
    });
  } catch (error) {
    console.error("GET transactions summary API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
