import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  readCartItems,
  createCartItem
} from "@/app/(server)/services/cartItem.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const searchParams = request.nextUrl.searchParams;

      const cartId = Number.parseInt(searchParams.get("cartId") || "0");

      const result = await readCartItems(cartId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(
        { data: { cartItems: result.cartItems, total: result.total } },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("GET cartItems API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const { cartId, productId, quantity, size, color } = await request.json();

      const result = await createCartItem(
        cartId,
        productId,
        quantity,
        size,
        color,
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.cart }, { status: 200 });
    });
  } catch (error) {
    console.error("POST cartItem API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
