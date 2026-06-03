import crypto from "crypto";


export const createHash = (data: string) => {
  try {
    const hashData = crypto
      .createHash("sha256")
      .update(data||"")
      .digest("hex");

    return hashData;
  } catch (error) {
    console.log(error)
  }
}

export const generateToken = (): {
  token: string;
  hashToken: string;
} => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const hashToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    return { token, hashToken };
  } catch (error) {
    console.log(error)
    return { token: "", hashToken: "" }
  }
};


export const verifyHash = (
  data: string,
  hashData: string
): boolean => {
  try {
    const hashToCompare = crypto
      .createHash("sha256")
      .update(data)
      .digest("hex");

    // Comparaison sécurisée contre timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(hashToCompare),
      Buffer.from(hashData)
    );
  } catch (error) {
    return false
  }
};