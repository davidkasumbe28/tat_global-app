import { NextRequest } from "next/server"
import { createHash, generateToken } from "./crypto"
import { parseDevice } from "./parse"


export function generateFingerPrint(req: NextRequest, remember_me: boolean = false) {
  if (!remember_me) return
  const userAgent = req.headers.get("user-agent") ?? ""
  const deviceName = parseDevice(userAgent)
  return "#" + deviceName + "@" + userAgent
}

export const generateResetToken = (length: number) => {
  const tokenId = crypto.randomUUID().replace(/-/g, "").slice(0, length);
  const { token } = generateToken();
  const tokenKey = tokenId + "@" + token
  const hashTokenKey = createHash(tokenKey)
  return { tokenId, tokenStr: token, hashTokenKey };
};

export const generateUUID = (length?: number) => {
  if (length) return crypto.randomUUID().replace(/-/g, "").slice(0, length);
  return crypto.randomUUID().replace(/-/g, "")
}