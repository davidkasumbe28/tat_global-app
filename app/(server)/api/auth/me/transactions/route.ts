import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { Payload } from "@/lib/utils/jwt";
import { StatusTransaction } from "@/lib/generated/prisma/enums";
import { readTransactionsUser } from "@/app/(server)/services/transaction.service";


export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const searchParams = request.nextUrl.searchParams;
      const status = (searchParams.get("status") || "ALL") as
        | StatusTransaction
        | "ALL";
      const search = searchParams.get("search") || "";
      const sort = searchParams.get("sort") || "newest";
      const page = Number.parseInt(searchParams.get("page") || "1");
      const limit = Number.parseInt(searchParams.get("limit") || "10");

      const payload = JSON.parse(claims as string) as Payload;

      const { userId } = payload;

      const result = await readTransactionsUser(
        userId,
        status,
        search,
        sort,
        page,
        limit,
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(
        { data: { transactions: result.transactions, total: result.total } },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("GET transactions user API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     return await checkAuth(request, async () => {
//       const {
//         userId,
//         cartId,
//         totalAmount,
//         paymentMethod,
//         paymentType,
//         shippingAddress,
//         // shippingType,
//       } = await request.json();

//       const res = await createOrder({
//         userId,
//         cartId,
//         totalAmount,
//         paymentMethod,
//         paymentType,
//         shippingAddress,
//         // shippingType,
//       });

//       if (!res.success) {
//         return NextResponse.json({ error: res.error }, { status: 400 });
//       }

//       const content = {
//         first_name: res.order?.user?.firstName as string,
//         last_name: res.order?.user?.lastName as string,
//         orderNumber: res.order?.orderNumber as string,
//         orderTotal: res.order?.totalAmount as number,
//         domain_name: "localhost:3000",
//       };

//       // const to = res.order?.cart?.user?.phone.replace(" ", "");
//       const to = "+243999086787";

//       await sendOrderConfirmationMessage(to as string, content);

//       return NextResponse.json({ data: res.order }, { status: 200 });
//     });
//   } catch (error) {
//     console.error("POST order API error:", error);
//     return NextResponse.json({ error: logs.error.server }, { status: 500 });
//   }
// }
