import { CategoryProduct, StateCollection } from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";
import {
  createCollection,
  readCollections,
} from "../../services/collection.service";
import { checkAuth } from "../../middlewares/check-auth";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const searchParams = request.nextUrl.searchParams;

      const category = searchParams.get("category") || "ALL";
      const state = searchParams.get("state") || "ALL";
      const search = searchParams.get("search") || "";
      const sort = searchParams.get("sort") || "newest";
      const page = Number.parseInt(searchParams.get("page") || "1");
      const limit = Number.parseInt(searchParams.get("limit") || "10");

      const result = await readCollections(
        category as CategoryProduct | "ALL",
        state as StateCollection | "ALL",
        search,
        sort,
        page,
        limit,
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(
        { data: { collections: result.collections, total: result.total } },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("GET collections API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const { name, description, category, color, state } =
        await request.json();

      const result = await createCollection(
        name,
        description,
        color,
        category,
        state,
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.collection }, { status: 200 });
    });
  } catch (error) {
    console.error("POST collection API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
