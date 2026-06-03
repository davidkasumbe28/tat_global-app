// import {
//   getAdminEmployeesAction,
//   registerEmployeeAction,
// } from "@/app/(server)/actions/admin";
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

//       const result = await getAdminEmployeesAction(page, limit);

//       if (!result.success) {
//         return NextResponse.json({ error: result.error }, { status: 400 });
//       }

//       return NextResponse.json(
//         { data: { employees: result.employees, total: result.total } },
//         { status: 200 },
//       );
//     });
//   } catch (error) {
//     console.error("Admin employees API error:", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
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

//       const { email, firstName, lastName, password, phone, role } =
//         await request.json();

//       if (!email || !firstName || !lastName || !password || !phone || !role) {
//         return NextResponse.json(
//           { error: "Tous les champs sont requis" },
//           { status: 400 },
//         );
//       }

//       const result = await registerEmployeeAction(
//         email,
//         firstName,
//         lastName,
//         password,
//         phone,
//         role,
//       );

//       if (!result.success) {
//         return NextResponse.json({ error: result.error }, { status: 400 });
//       }

//       return NextResponse.json({ data: result.user }, { status: 201 });
//     });
//   } catch (error) {
//     console.error("Register employee API error:", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
