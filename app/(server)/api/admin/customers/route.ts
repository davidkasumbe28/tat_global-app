// import { getAdminCustomersAction } from "@/app/(server)/actions/admin";
// import { checkAuth } from "@/app/(server)/middlewares/check-auth";
// import { type NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
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
//       const searchParams = request.nextUrl.searchParams;
//       const page = Number.parseInt(searchParams.get("page") || "1");
//       const limit = Number.parseInt(searchParams.get("limit") || "10");

//       const result = await getAdminCustomersAction(page, limit);

//       if (!result.success) {
//         return NextResponse.json({ error: result.error }, { status: 400 });
//       }

//       return NextResponse.json(
//         { data: { customers: result.customers, total: result.total } },
//         { status: 200 },
//       );
//     });
//   } catch (error) {
//     console.error("Admin customers API error:", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
