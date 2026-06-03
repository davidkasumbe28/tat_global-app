import { readOrder } from "@/app/(server)/services/order.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await readOrder(parseInt(id));

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ data: result.order }, { status: 200 });
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
    const { id } = await params;

    const result = await readOrder(parseInt(id));

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ data: result.order }, { status: 200 });
  } catch (error) {
    console.error("GET order API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
