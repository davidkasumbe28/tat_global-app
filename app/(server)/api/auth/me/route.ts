import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  profileUser,
  updateProfileUser,
} from "@/app/(server)/services/user.service";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      const res = await profileUser(userId);

      if (!res.success)
        return NextResponse.json({ error: res.error }, { status: 400 });

      return NextResponse.json({ data: res.user }, { status: 200 });
    });
  } catch (error) {
    console.error("GET read profile user API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const profile = await request.json();

      const res = await updateProfileUser(claims as string, profile);

      if (!res.success)
        return NextResponse.json({ error: res.error }, { status: 401 });

      return NextResponse.json(
        { data: logs.success.updateProfileUser },
        { status: 201 },
      );
    });
  } catch (error) {
    console.error("POST update profile user API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
