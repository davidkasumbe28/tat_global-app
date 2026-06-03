import { readProductsCartItem } from "@/app/(server)/services/product.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // return await checkAuth(request, async () => {
    const searchParams = request.nextUrl.searchParams;

    const productIds = JSON.parse(searchParams.get("productIds") as string) || {
      productIds: [],
    };
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const result = await readProductsCartItem(productIds.productIds, page, limit);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { data: { products: result.products, total: result.total } },
      { status: 200 },
    );
    // });
  } catch (error) {
    console.error("GET product cartItem API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
