import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { readCart } from "@/app/(server)/services/cart.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = await params;

      const res = await readCart(Number.parseInt(id));

      if (!res.success)
        return NextResponse.json({ error: res.error }, { status: 500 });

      return NextResponse.json({ data: res.cart }, { status: 200 });
    });
  } catch (error) {
    console.error("GET cart API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     return await checkAuth(request, async () => {
//       const { id } = await params;

//       const user = await request.json();

//       const res = await updateUser({
//         id: Number.parseInt(id),
//         data: user,
//       });

//       if (!res.success)
//         return NextResponse.json({ error: res.error }, { status: 500 });

//       const name =
//         capitalizeFirstLetter(res.user?.firstName as string) +
//         " " +
//         capitalizeFirstLetter(res.user?.lastName as string);

//       return NextResponse.json(
//         { data: logs.success.update.user(name) },
//         { status: 201 },
//       );
//     });
//   } catch (error) {
//     console.error("PATCH user API error : ", error);
//     return NextResponse.json({ error: logs.error.server }, { status: 500 });
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     return await checkAuth(request, async () => {
//       const { id } = await params;

//       const res = await deleteUser(Number.parseInt(id));

//       if (!res.success)
//         return NextResponse.json({ error: res.error }, { status: 500 });

//       const name =
//         capitalizeFirstLetter(res.user?.firstName as string) +
//         " " +
//         capitalizeFirstLetter(res.user?.lastName as string);

//       return NextResponse.json(
//         { data: logs.success.delete.user(name) },
//         { status: 200 },
//       );
//     });
//   } catch (error) {
//     console.error("DELETE user API error : ", error);
//     return NextResponse.json({ error: logs.error.server }, { status: 500 });
//   }
// }
