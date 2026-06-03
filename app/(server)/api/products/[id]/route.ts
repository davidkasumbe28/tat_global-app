import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  deleteProduct,
  readProduct,
  updateProduct,
} from "@/app/(server)/services/product.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await readProduct(parseInt(id));

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ data: result.product }, { status: 200 });
  } catch (error) {
    console.error("GET product API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = await params;

      const data = await request.json();

      const result = await updateProduct(parseInt(id), data);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }

      return NextResponse.json({ data: result.product }, { status: 200 });
    });
  } catch (error) {
    console.error("PATCH product API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = await params;

      const result = await deleteProduct(parseInt(id));

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }

      return NextResponse.json({ data: result.product }, { status: 200 });
    });
  } catch (error) {
    console.error("DELETE product API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
