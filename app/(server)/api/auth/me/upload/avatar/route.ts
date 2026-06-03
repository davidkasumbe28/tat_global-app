import { putAvatarAction } from "@/app/(server)/helpers/vercel.blob";
import { checkAuth } from "@/app/(server)/middlewares/check-auth";
import { generateFileName } from "@/lib/utils/generated";
import logs from "@/lib/utils/logs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    return await checkAuth(request, async () => {
      const claims = request.headers.get("claims");

      const form = await request.formData();

      const file = form.get("file") as File;

      if (!file)
        return NextResponse.json(
          { error: "Fichier ou format du fichier invalide" },
          { status: 400 },
        );

      const buffer = Buffer.from(await file.arrayBuffer());

      const payload = JSON.parse(claims as string);

      const { userId } = payload;

      const fileName = generateFileName.avatar(userId);

      console.log(fileName);

      const uploaded = await putAvatarAction(fileName, buffer);

      if (!uploaded.success)
        return NextResponse.json({ error: uploaded.error }, { status: 400 });

      // const res = await updateProfileUserAction(claims as string, {
      //   avatar:
      //     "https://nk4klggv4zbdyuue.public.blob.vercel-storage.com/default-avatar.png",
      // });

      // if (!res.success)
      //   return NextResponse.json({ error: res.error }, { status: 400 });

      return NextResponse.json({ data: "ok" }, { status: 200 });
    });
  } catch (error) {
    console.error("POST upload avatar API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}
