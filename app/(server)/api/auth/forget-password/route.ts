import { initCheckSession } from "@/app/(server)/middlewares/auth";
import { forgetPassword } from "@/app/(server)/services/auth.service";
import {
  StateUser
} from "@/lib/generated/prisma/enums";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Adresse mail requis" },
        { status: 400 },
      );
    }

    const res = await forgetPassword(email);

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    if (res.session?.state === StateUser.DISABLED)
      return NextResponse.json({ error: logs.error.state }, { status: 401 });


    return initCheckSession(res.session as {
      id: string,
      userId: number,
      firstName: string,
      lastName: string,
      email: string,
      state: StateUser,
      token: string,
      tokenId: string,
      tokenStr: string
    });

  } catch (error) {
    console.error("POST auth forget password API error:", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
