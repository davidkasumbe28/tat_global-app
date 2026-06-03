import { initSession } from "@/app/(server)/middlewares/auth";
import { signup } from "@/app/(server)/services/auth.service";
import { RankAdmin, RoleUser, StateUser } from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, password, phone } =
      await request.json();

    if (!email || !firstName || !lastName || !password || !phone) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 },
      );
    }

    const res = await signup(email, firstName, lastName, password, phone);

    if (!res.success)
      return NextResponse.json({ error: res.error }, { status: 400 });

    if (res.session?.state === StateUser.DISABLED)
      return NextResponse.json({ error: logs.error.state }, { status: 401 });

    return await initSession(res?.session as {
      id: string;
      userId: number;
      role: RoleUser;
      state: StateUser;
      rank?: RankAdmin;
      token: string;
    });

  } catch (error) {
    console.error("POST auth signup API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
