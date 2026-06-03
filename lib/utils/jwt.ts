import { RankAdmin, RoleUser } from "@/lib/@types/types";
import jwt from "jsonwebtoken";

const ACCESS_PRIVATE_KEY = process.env.JWT_ACCESS_PRIVATE_KEY as string;

const REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY as string;

const ACCESS_PUBLIC_KEY = process.env.JWT_ACCESS_PUBLIC_KEY as string;

const REFRESH_PUBLIC_KEY = process.env.JWT_REFRESH_PUBLIC_KEY as string;

const ISSUER = process.env.JWT_ISSUER as string;

const PUBLIC_KEYS: Record<string, string> = {
  "access-public-key_FFFE": ACCESS_PUBLIC_KEY,
  "refresh-public-key_FFFD": REFRESH_PUBLIC_KEY,
};

export interface Payload {
  userId: number;
  role: RoleUser;
  rank?: RankAdmin | null;
  fingerPrint?: string
}

export interface PayloadRefresh {
  sid: string;
  token: string;
  fingerPrint?: string
}

export interface PayloadCheck {
  userId: number;
  token: string,
  uuid: string,
  tokenId?: string
}

export function signToken(
  payload: Payload,
  options: Record<any, any> = {
    algorithm: "RS256",
    expiresIn: "1d",
    issuer: ISSUER,
    keyid: "access-public-key_FFFE",
  },
): string {
  try {
    return jwt.sign(payload, ACCESS_PRIVATE_KEY, options);
  } catch (error) {
    throw new Error();
  }
}

export function signCheckToken(
  payload: PayloadCheck,
  options: Record<any, any> = {
    algorithm: "RS256",
    expiresIn: "30m",
    issuer: ISSUER,
    keyid: "access-public-key_FFFE",
  },
): string {
  try {
    return jwt.sign(payload, ACCESS_PRIVATE_KEY, options);
  } catch (error) {
    throw new Error();
  }
}

export function signRefreshToken(
  payload: PayloadRefresh,
  options: Record<any, any> = {
    algorithm: "RS256",
    expiresIn: "7d",
    issuer: ISSUER,
    keyid: "refresh-public-key_FFFD",
  },
): string {
  try {
    return jwt.sign(payload, REFRESH_PRIVATE_KEY, options);
  } catch (error) {
    throw new Error();
  }
}

export function verifyToken(
  token: string,
): Payload | PayloadCheck | PayloadRefresh | null {
  try {
    const decodedHeader = JSON.parse(
      Buffer.from(token.split(".")[0], "base64").toString(),
    );
    const key = PUBLIC_KEYS[decodedHeader.kid];
    if (!key) throw new Error("Identifiant de clé inconnu");

    return jwt.verify(token, key, {
      algorithms: ["RS256"],
      issuer: process.env.JWT_ISSUER,
    }) as Payload | PayloadCheck | PayloadRefresh;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// export function verifyToken(token: string): Payload | PayloadCheck | null {
//   try {
//     return jwt.verify(token, ACCESS_SECRET_KEY) as Payload | PayloadCheck;
//   } catch (error) {
//     return null;
//   }
// }

// export function verifyRefreshToken(token: string): PayloadRefresh | null {
//   try {
//     return jwt.verify(token, REFRESH_SECRET_KEY) as PayloadRefresh;
//   } catch (error) {
//     return null;
//   }
// }
