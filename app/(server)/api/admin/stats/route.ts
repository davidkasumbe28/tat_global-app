// import { getAdminDashboardStatsAction } from "@/app/(server)/actions/admin";
// import { type NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   try {
//     const result = await getAdminDashboardStatsAction();

//     if (!result.success) {
//       return NextResponse.json({ error: result.error }, { status: 400 });
//     }

//     return NextResponse.json({ stats: result.stats }, { status: 200 });
//   } catch (error) {
//     console.error("[v0] Dashboard stats API error:", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
