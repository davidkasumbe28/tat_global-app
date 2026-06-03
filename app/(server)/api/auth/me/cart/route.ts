import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { readCarts, createCart } from "@/app/(server)/services/cart.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      const result = await readCarts(userId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.carts }, { status: 200 });
    });
  } catch (error) {
    console.error("GET carts API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      const { id } = await request.json();

      if (userId !== parseInt(id))
        return NextResponse.json(
          { error: logs.error.notAuthorized },
          { status: 400 },
        );

      const result = await createCart(userId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.cart }, { status: 200 });
    });
  } catch (error) {
    console.error("POST cart API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
