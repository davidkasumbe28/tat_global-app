import { readCollectionsCollection } from "@/app/(server)/services/collection.service";
import { CategoryProduct } from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get("category") || "ALL";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";

    const result = await readCollectionsCollection(
      category as CategoryProduct | "ALL",
      search,
      sort,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { data: { collections: result.collections, total: result.total } },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET collections collection API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
