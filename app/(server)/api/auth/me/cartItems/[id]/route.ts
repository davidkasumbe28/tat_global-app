import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  deleteCartItem,
  updateCartItem,
} from "@/app/(server)/services/cartItem.service";
import logs from "@/lib/utils/logs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = await params;

      const { quantity } = await request.json();

      const res = await updateCartItem(Number.parseInt(id), quantity);

      if (!res.success)
        return NextResponse.json({ error: res.error }, { status: 400 });

      return NextResponse.json({ data: res.cart }, { status: 200 });
    });
  } catch (error) {
    console.error("PATCH cartItem API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = await params;

      const res = await deleteCartItem(Number.parseInt(id));

      if (!res.success)
        return NextResponse.json({ error: res.error }, { status: 400 });

      return NextResponse.json({ data: res.cart }, { status: 200 });
    });
  } catch (error) {
    console.error("DELETE cartItem API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
