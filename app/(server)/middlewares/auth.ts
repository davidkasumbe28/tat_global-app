import {
  Payload,
  PayloadCheck,
  PayloadRefresh,
  signCheckToken,
  signRefreshToken,
  signToken,
} from "@/lib/utils/jwt";
import { NextResponse } from "next/server";
import { APP } from "../../../lib/data/raw/routes";
import {
  RankAdmin,
  RoleUser,
  StateUser
} from "../../../lib/generated/prisma/enums";
import { sendResetEmail } from "../../../lib/utils/emails/email";
import logs from "../../../lib/utils/logs";
import { generateUUID } from "@/lib/utils/auth.utils";

// ----------------------------------------- sessions /auth -------------------------------------------

// ----------------------------------------- init session /auth/login -------------------------------------------

export async function initSession({
  id,
  userId,
  role,
  rank,
  token,
}: {
  id: string;
  userId: number,
  state: StateUser;
  role: RoleUser;
  rank?: RankAdmin | null;
  token: string
}, fingerPrint?: string) {

  const payloadAccess: Payload = {
    userId,
    role,
    rank,
    fingerPrint
  };

  const payloadRefresh: PayloadRefresh = {
    sid: id,
    token,
    fingerPrint
  };

  // create a JWT ACCESS
  const access_token = signToken(payloadAccess as Payload);

  // create a JWT REFRESH
  const refresh_token = signRefreshToken(payloadRefresh as PayloadRefresh);

  // 🍪 Stocker les tokens dans un cookie HTTP-only sécurisé
  const response = NextResponse.json(
    { data: logs.success.login },
    { status: 200 },
  );

  response.cookies.set(
    process.env.REFRESH_COOKIE_NAME as string,
    refresh_token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 60 * 60 * 24, // 7 jours
      sameSite: "strict",
      path: "/",
    },
  );
  response.cookies.set(process.env.ACCESS_COOKIE_NAME as string, access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 jour
    sameSite: "strict",
    path: "/",
  });

  return response;
}

// ----------------------------------------- init check session /auth/forget-password -------------------------------------------

export async function initCheckSession({
  id,
  userId,
  firstName,
  email,
  tokenId,
  tokenStr,
  token,
}: {
  id: string;
  userId: number;
  state: StateUser;
  firstName?: string;
  email?: string;
  tokenId: string
  tokenStr: string;
  token: string
}) {

  const payload: PayloadCheck = {
    userId,
    token,
    uuid: id,
    tokenId: !firstName && !email ? tokenId : undefined
  };

  // create a JWT ACCESS
  const access_token = signCheckToken(payload as PayloadCheck);

  // send email with reset link
  if (firstName && email && tokenId)
    await sendResetEmail(
      { firstName, email },
      tokenId,
    );

  let link: string

  if (firstName && email && tokenId)
    link = APP.check.verify + "/" + tokenStr + "?uuid=" + id
  else
    link = APP.check.resetPassword + "/" + tokenStr + "?id=" + generateUUID(12)

  // 🍪 Stocker les tokens dans un cookie HTTP-only sécurisé
  const response = NextResponse.json(
    { data: link },
    { status: 200 },
  );

  response.cookies.set(process.env.ACCESS_COOKIE_NAME as string, access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15, // 15 min
    sameSite: "strict",
    path: "/",
  });

  return response;
}

// ----------------------------------------- revoke session /auth/logout -------------------------------------------

export async function revokeSession() {

  const response = NextResponse.json(
    { data: logs.success.logout },
    { status: 200 },
  );

  response.cookies.delete(process.env.REFRESH_COOKIE_NAME as string);
  response.cookies.delete(process.env.ACCESS_COOKIE_NAME as string);

  return response;
}
