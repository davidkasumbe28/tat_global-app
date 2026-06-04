import { StatusTransaction, TransactionType } from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";
import { createTransaction, readTransactions } from "../../services/transaction.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const type = searchParams.get("type") || "ALL";
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const result = await readTransactions(
      type as TransactionType | "ALL",
      status as StatusTransaction | "ALL",
      search,
      sort,
      page,
      limit,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { data: { transactions : result.transactions, total: result.total } },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET transactions API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, invoiceId, amount, method, type, reference } =
      await request.json();

    const res = await createTransaction({
      userId,
      invoiceId,
      amount,
      method,
      type,
      reference,
    });

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    // const content = {
    //   first_name: res.order?.cart?.user?.firstName as string,
    //   last_name: res.order?.cart?.user?.lastName as string,
    //   orderSku: res.order?.trackingNumber as string,
    //   orderTotal: res.order?.totalAmount as number,
    //   domain_name: "localhost:3000",
    // };

    // // const to = res.order?.cart?.user?.phone.replace(" ", "");
    // const to = "+243999086787";

    // await sendOrderConfirmationMessage(to as string, content);

    return NextResponse.json({ data: res.transaction }, { status: 200 });
  } catch (error) {
    console.error("POST transaction API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
