import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  readReview,
  updateReview,
} from "@/app/(server)/services/review.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = await params;

      const result = await readReview(parseInt(id));

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.review }, { status: 200 });
    });
  } catch (error) {
    console.error("GET review API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = await params;

      const { rating, comment } = await request.json();

      const result = await updateReview(
        parseInt(id),
        parseFloat(rating),
        comment,
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.review }, { status: 200 });
    });
  } catch (error) {
    console.error("PATCH review API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
