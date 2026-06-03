import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  createFavorites,
  readFavoritesFavorite,
} from "@/app/(server)/services/favorite.service";
import logs from "@/lib/utils/logs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      const searchParams = request.nextUrl.searchParams;

      const page = Number.parseInt(searchParams.get("page") || "1");
      const limit = Number.parseInt(searchParams.get("limit") || "10");

      const result = await readFavoritesFavorite(userId, page, limit);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(
        { data: { favorites: result.favorites, total: result.total } },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("GET favorites favorite API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      const { productIds } = await request.json();

      const result = await createFavorites(userId, productIds);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.favorites }, { status: 200 });
    });
  } catch (error) {
    console.error("POST favorites favorite API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
