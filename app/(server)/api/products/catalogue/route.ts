import { readProductsCatalogue } from "@/app/(server)/services/product.service";
import { CategoryProduct } from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get("category") || "ALL";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    const price =
      searchParams.get("price") || JSON.stringify({ min: 0, max: 1000 });
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const result = await readProductsCatalogue(
      category as CategoryProduct | "ALL",
      search,
      sort,
      price,
      page,
      limit,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { data: { products: result.products, total: result.total } },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET products catalogue API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
