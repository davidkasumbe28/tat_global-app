import { CompareSigne } from "@/lib/@types/enums";
import { RoleUser } from "@/lib/generated/prisma/enums";
import { verifyHash } from "@/lib/utils/crypto";
import { compareDate } from "@/lib/utils/date";
import {
  Payload,
  PayloadCheck,
  PayloadRefresh,
  signToken,
  verifyToken,
} from "@/lib/utils/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import logs from "../../../lib/utils/logs";
import { deleteSession, readSession, readSessions } from "../services/session.service";

export async function checkAuth(
  request: NextRequest,
  next: () => Promise<
    | NextResponse<{ error: string | undefined }>
    | NextResponse<{ data: any | undefined }>
  >,
) {
  try {
    const access_token = (await cookies()).get(
      process.env.ACCESS_COOKIE_NAME as string,
    )?.value;

    const refresh_token = (await cookies()).get(
      process.env.REFRESH_COOKIE_NAME as string,
    )?.value;

    /* This line of code is checking the presence of `refresh_token` and `access_token` cookies. Here's
    a breakdown of what it does: */
    if (!refresh_token && !access_token) return inauthenticated()

    if (!refresh_token && access_token) {
      const claimsCheck = verifyToken(access_token as string) as PayloadCheck;

      const { userId, token } = claimsCheck

      const res = await readSessions({ userId });

      if (res.error) return NextResponse.json(
        { error: res.error },
        { status: 400 },
      );

      if (res.sessions?.length === 0) return invalidSession()

      const session = res.sessions?.find((s) => verifyHash(token, s.tokenRefresh))

      if (!session) return invalidSession()

      request.headers.set("claims", JSON.stringify(claimsCheck));

      return next();

    }

    const claims = verifyToken(access_token as string) as Payload;

    const claimsRefresh = verifyToken(refresh_token as string) as PayloadRefresh;

    /* This part of the code is checking if both `claims` and `claimsRefresh` are falsy. If both are
    falsy, it means that neither the access token nor the refresh token is valid or present. In this
    case, the function `invalidToken()` is called, which returns a JSON response indicating that the
    token is invalid with a status code of 401. Additionally, it deletes both the refresh and access
    cookies to ensure that the user is logged out and cannot access protected resources. */
    if (!claims && !claimsRefresh) return invalidToken()

    // /* This line of code is checking two conditions using logical operators. Here's a breakdown of what
    // it does: */
    // if ((claims && !claimsRefresh) || !claimsRefresh) return invalidToken()

    /* This part of the code is handling a specific scenario where the `claims` are falsy (meaning the
    access token is not valid or present) but `claimsRefresh` is truthy (meaning the refresh token
    is present). Here's a breakdown of what each step is doing: */
    if (!claims && claimsRefresh) {

      const res = await readSession(claimsRefresh.sid);

      if (res.error) {
        const response = NextResponse.json(
          { error: res.error },
          { status: 401 },
        );

        return response
      }

      const currentSession = res.session

      if (compareDate(currentSession?.expiresAt as Date, new Date(), CompareSigne["<"]) && !verifyHash(claimsRefresh.token, currentSession?.tokenRefresh as string)) {

        await deleteSession(claimsRefresh.sid)

        const response = NextResponse.json(
          { error: logs.error.invalidSession },
          { status: 401 },
        );

        response.cookies.delete(process.env.REFRESH_COOKIE_NAME as string);

        return response
      }


      const payload: Payload = {
        userId: currentSession?.userId as number,
        role: currentSession?.user?.role as RoleUser,
        rank: currentSession?.user?.admin?.rank,
        fingerPrint: currentSession?.fingerPrint as string
      }

      const newAcces_token = signToken(payload as Payload);

      request.cookies.set(
        "authorization",
        ("Bear " + newAcces_token) as string,
      );

      return next();
    }


    const { userId } = claims
    const { token } = claimsRefresh

    const res = await readSessions({ userId });

    if (res.error) return NextResponse.json(
      { error: res.error },
      { status: 400 },
    );

    if (res.sessions?.length === 0) return invalidSession()

    const session = res.sessions?.find((s) => verifyHash(token, s.tokenRefresh))

    if (!session) return invalidSession()

    request.headers.set("claims", JSON.stringify(claims));

    return next();
  } catch (error) {
    console.error("CheckAuth API error : ", error);
    return NextResponse.json({ error: logs.error.server }, { status: 500 });
  }
}


const invalidToken = () => {
  const response = NextResponse.json(
    {
      error: logs.error.invalidToken,
    },
    { status: 401 },
  )

  // response.cookies.delete(process.env.REFRESH_COOKIE_NAME as string);
  // response.cookies.delete(process.env.ACCESS_COOKIE_NAME as string);

  return response
}

const invalidSession = () => {
  const response = NextResponse.json(
    { error: logs.error.invalidSession },
    { status: 401 },
  );

  // response.cookies.delete(process.env.REFRESH_COOKIE_NAME as string);
  // response.cookies.delete(process.env.ACCESS_COOKIE_NAME as string);

  return response
}

const inauthenticated = () => {
  return NextResponse.json(
    {
      error: logs.error.authenticated,
    },
    { status: 401 },
  )
}