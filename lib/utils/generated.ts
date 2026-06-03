import { NextRequest } from "next/server";
import { generateToken } from "../utils/crypto";



function generateTrackingNumber(userId: number): string {
  const year = new Date().getFullYear();

  const x = parseInt(userId.toString()) * 10000;

  const y = Date.now();

  const idPart = Math.floor(y / x).toString();

  const stringPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  const uniqueId = idPart.slice(-8) + stringPart;

  return "#ORD-" + year + "-" + uniqueId;
}

const generateResetToken = (length: number) => {
  const tokenId = crypto.randomUUID().replace(/-/g, "").slice(0, length);
  const { token, hashToken } = generateToken();
  return { tokenId, tokenKey: hashToken, token };
};

function avatar(userId: number): string {
  return (
    "avatar_" + Number.parseInt(Math.pow(Math.PI, userId).toString()) + "_user"
  );
}

const generateFileName = {
  avatar,
};

export { generateFileName, generateResetToken, generateTrackingNumber };
