import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import {
  deleteProfileUser,
  updatePasswordUser,
  readUser,
} from "@/app/(server)/services/user.service";
import { comparePassword } from "@/lib/utils/bcrypt";
import logs from "@/lib/utils/logs";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = await params;

      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      if (Number.parseInt(id) !== Number.parseInt(userId))
        return NextResponse.json(
          {
            error: logs.error.notAuthorized,
          },
          { status: 401 },
        );

      const { password, currentPassword } = await request.json();

      const me = await readUser(userId);

      if (!me.success)
        return NextResponse.json({ error: me.error }, { status: 400 });

      const compare = await comparePassword(
        currentPassword,
        me.user?.password as string,
      );

      if (!compare)
        return NextResponse.json(
          { error: "Mot de passe actuel incorrect" },
          { status: 400 },
        );

      const res = await updatePasswordUser(claims as string, password);

      if (!res.success)
        return NextResponse.json({ error: res.error }, { status: 401 });

      return NextResponse.json({ data: res.state }, { status: 201 });
    });
  } catch (error) {
    console.error("PATCH update password user API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    return await checkAuth(request, async () => {
      const { id } = params;

      const claims = request.headers.get("claims");

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      if (Number.parseInt(id) !== Number.parseInt(userId))
        return NextResponse.json(
          {
            error: logs.error.notAuthorized,
          },
          { status: 401 },
        );

      const res = await deleteProfileUser(Number.parseInt(id));

      if (!res.success)
        return NextResponse.json({ error: res.error }, { status: 500 });

      const name =
        capitalizeFirstLetter(res.user?.firstName as string) +
        " " +
        capitalizeFirstLetter(res.user?.lastName as string);

      // await revokeSession(res.user)

      return NextResponse.json(
        { data: logs.success.delete.user(name) },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("DELETE user API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
