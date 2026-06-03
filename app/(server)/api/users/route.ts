import { RoleUser, StateUser } from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";
import { checkAuth } from "../../middlewares/check-auth";
import { createUser, readUsers } from "../../services/user.service";

export async function GET(request: NextRequest) {
  try {
    // return await checkAuth(request, async () => {
      const searchParams = request.nextUrl.searchParams;
      const role = (searchParams.get("role") || "ALL") as RoleUser | "ALL";
      const state = (searchParams.get("state") || "ALL") as StateUser | "ALL";
      const search = searchParams.get("search") || "";
      const sort = searchParams.get("sort") || "newest";
      const page = Number.parseInt(searchParams.get("page") || "1");
      const limit = Number.parseInt(searchParams.get("limit") || "10");

      const result = await readUsers(role, state, search, sort, page, limit);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(
        { data: { users: result.users, total: result.total } },
        { status: 200 },
      );
    // });
  } catch (error) {
    console.error("GET users error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const { data } = await request.json();

      const res = await createUser(data);

      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }

      return NextResponse.json({ data: res.user }, { status: 200 });
    });
  } catch (error) {
    console.error("POST users API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
