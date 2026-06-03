import { readCollectionsSelect } from "@/app/(server)/services/collection.service";
import { CategoryProduct, StateCollection } from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get("category") || "ALL";
    const state = searchParams.get("state") || "ALL";
    const sort = searchParams.get("sort") || "newest";

    const result = await readCollectionsSelect(
      category as CategoryProduct | "ALL",
      state as StateCollection | "ALL",
      sort,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.collections }, { status: 200 });
  } catch (error) {
    console.error("GET collections select API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
