import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  deleteOrder,
  readOrder,
  updateOrder,
} from "@/app/(server)/services/order.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      if (!userId)
        return NextResponse.json(
          {
            error:
              "Vous n'avez aucune autorisation pour accéder à ces données.",
          },
          { status: 401 },
        );

      const { id } = await params;

      const result = await readOrder(parseInt(id));

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.order }, { status: 200 });
    });
  } catch (error) {
    console.error("GET order API error : ", error);
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

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      if (!userId)
        return NextResponse.json(
          {
            error: logs.error.notAuthorized,
          },
          { status: 401 },
        );

      const { id } = await params;
      const { status } = await request.json();

      const result = await updateOrder(parseInt(id), { status });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.order }, { status: 200 });
    });
  } catch (error) {
    console.error("PATCH order API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      if (!userId)
        return NextResponse.json(
          {
            error: logs.error.notAuthorized,
          },
          { status: 401 },
        );

      const { id } = await params;

      const result = await deleteOrder(parseInt(id));

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.order }, { status: 200 });
    });
  } catch (error) {
    console.error("DELETE order API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
