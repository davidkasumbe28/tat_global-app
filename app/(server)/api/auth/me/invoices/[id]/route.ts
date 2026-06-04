import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { readInvoiceUser } from "@/app/(server)/services/invoice.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      if (!userId)
        return NextResponse.json(
          {
            error:
              "Vous n'avez aucune autorisation pour accéder à ces données.",
          },
          { status: 401 },
        );

      const { id } = await params;

      const result = await readInvoiceUser(parseInt(id));

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ data: result.invoice }, { status: 200 });
    });
  } catch (error) {
    console.error("GET invoice user API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

