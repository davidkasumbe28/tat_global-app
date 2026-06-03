import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  createReview,
  readReviews,
} from "@/app/(server)/services/review.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const searchParams = request.nextUrl.searchParams;

      const search = searchParams.get("search") || "";
      const sort = searchParams.get("sort") || undefined;
      const page = Number.parseInt(searchParams.get("page") || "1");
      const limit = Number.parseInt(searchParams.get("limit") || "10");

      const result = await readReviews(search, sort, page, limit);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(
        { data: { reviews: result.reviews, total: result.total } },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("GET reviews API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      const { productId, rating, comment } = await request.json();

      const result = await createReview(
        userId,
        productId,
        parseFloat(rating),
        comment,
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.review }, { status: 200 });
    });
  } catch (error) {
    console.error("POST review API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
