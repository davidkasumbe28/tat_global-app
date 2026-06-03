import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  createFavorite,
  readFavorites,
} from "@/app/(server)/services/favorite.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      const result = await readFavorites(userId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(
        { data: { favorites: result.favorites, total: result.total } },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("GET favorites API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      const { productId } = await request.json();

      const result = await createFavorite(userId, productId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.favorites }, { status: 200 });
    });
  } catch (error) {
    console.error("POST favorite API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
