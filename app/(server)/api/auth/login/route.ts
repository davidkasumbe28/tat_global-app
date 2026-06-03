import { initSession } from "@/app/(server)/middlewares/auth";
import { login } from "@/app/(server)/services/auth.service";
import { RankAdmin, RoleUser, StateUser } from "@/lib/generated/prisma/enums";
import { generateFingerPrint } from "@/lib/utils/auth.utils";
import logs from "@/lib/utils/logs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { formData, remember_me } = await request.json();

    const { email, password } = formData

    if (!email || !password) {
      return NextResponse.json(
        { error: "Adresse mail et mot de passe requis" },
        { status: 400 },
      );
    }

    const fingerPrint = generateFingerPrint(request, remember_me)

    const res = await login({ email, password, fingerPrint });

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    if (res.session?.state === StateUser.DISABLED)
      return NextResponse.json({ error: logs.error.state }, { status: 401 });

    return await initSession(res.session as {
      id: string;
      userId: number;
      role: RoleUser;
      state: StateUser;
      rank?: RankAdmin;
      token: string;
    }, fingerPrint as string);

  } catch (error) {
    console.error("POST auth login API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
