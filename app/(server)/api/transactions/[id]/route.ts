import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  readTransaction,
  updateTransaction,
} from "@/app/(server)/services/transaction.service";
import { RoleUser } from "@/lib/generated/prisma/enums";
import { Payload } from "@/lib/utils/jwt";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string) as Payload;

      if (!claims && payload.role !== RoleUser.ADMIN)
        return NextResponse.json(
          { error: logs.error.notAuthorized },
          { status: 403 },
        );

      const { id } = await params;

      const result = await readTransaction(parseInt(id));

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }

      return NextResponse.json({ data: result.transaction }, { status: 200 });
    });
  } catch (error) {
    console.error("GET transaction API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string) as Payload;

      if (!claims && payload.role !== RoleUser.ADMIN)
        return NextResponse.json(
          { error: logs.error.notAuthorized },
          { status: 403 },
        );

      const { id } = await params;

      const data = await request.json();

      const result = await updateTransaction(parseInt(id), data);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }

      return NextResponse.json({ data: result.transaction }, { status: 200 });
    });
  } catch (error) {
    console.error("PATCH transaction API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
