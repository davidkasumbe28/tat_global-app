// import { getAdminCustomersByIdAction } from "@/app/(server)/actions/admin";
// import { checkAuth } from "@/app/(server)/middlewares/check-auth";
// import { type NextRequest, NextResponse } from "next/server";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     return await checkAuth(request, async () => {
//       const claims = request.headers.get("claims");

//       const payload = JSON.parse(claims as string);

//       if (payload?.role !== "admin")
//         return NextResponse.json(
//           {
//             error: "Vous n'avez pas les autorisations pour cette action.",
//           },
//           { status: 401 },
//         );

//       const { id } = await params;
//       const result = await getAdminCustomersByIdAction(parseInt(id));

//       if (!result.success) {
//         return NextResponse.json({ error: result.error }, { status: 404 });
//       }

//       return NextResponse.json({ data: result.customer }, { status: 200 });
//     });
//   } catch (error) {
//     console.error("Admin customer API error:", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
