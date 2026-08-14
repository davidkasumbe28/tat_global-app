import { readInvoicesSelect } from "../../../services/invoice.service";
import { StatusInvoice } from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get("status") || "ALL";
    const sort = searchParams.get("sort") || "newest";

    const result = await readInvoicesSelect(
      status as StatusInvoice | "ALL",
      sort,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.invoices }, { status: 200 });
  } catch (error) {
    console.error("GET invoices select API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
