import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  deleteCollection,
  readCollection,
  updateCollection,
} from "@/app/(server)/services/collection.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await readCollection(parseInt(id));

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ data: result.collection }, { status: 200 });
  } catch (error) {
    console.error("GET collection API error : ", error);
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

      const data = await request.json();

      const result = await updateCollection(parseInt(id), data);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }

      return NextResponse.json({ data: result.collection }, { status: 200 });
    });
  } catch (error) {
    console.error("PATCH collection API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = await params;

      const result = await deleteCollection(parseInt(id));

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }

      return NextResponse.json({ data: result.collection }, { status: 200 });
    });
  } catch (error) {
    console.error("DELETE collection API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
