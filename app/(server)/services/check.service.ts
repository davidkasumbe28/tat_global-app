import { CompareSigne } from "@/lib/@types/enums";
import { CHECK_SESSION_DURATION, SESSION_DURATION } from "@/lib/constants/constants";
import {
  Prisma,
  RankAdmin,
  RoleUser,
  Session,
  StateUser,
  StatusUser
} from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import { generateResetToken } from "@/lib/utils/auth.utils";
import { hashPassword } from "@/lib/utils/bcrypt";
import { createHash, generateToken, verifyHash } from "@/lib/utils/crypto";
import { compareDate } from "@/lib/utils/date";
import logs from "@/lib/utils/logs";

export interface Auth {
  id: number;
  role: RoleUser;
  state: StateUser;
  status: StatusUser;
  firstName?: string;
  lastName?: string;
  email?: string;
  rank?: RankAdmin | null;
  session?: Session | null;
}

const selectAuth: Prisma.UserSelect = {
  id: true,
  password: true,
  role: true,
  state: true,
  status: true,
  firstName: true,
  lastName: true,
  email: true,
  admin: { select: { rank: true } },
  sessions: true
};

async function checking(token: string, tokenId: string, tokenStr: string, sid: string): Promise<{
  success: boolean;
  session?: { id: string, userId: number, state: StateUser, token: string, tokenId: string, tokenStr: string };
  error?: string;
}> {
  try {

    const session = await prisma.session.findUnique({ include: { user: { select: selectAuth } }, where: { id: sid } });

    if (!session) return { success: false, error: "Votre session est invalidee." };

    if (session.tokenKeyUsed) return { success: false, error: "Vous avez déjà utilisé votre clé de session de verification par email." };

    if (compareDate(session?.expiresAt as Date, new Date(), CompareSigne["<"])) return { success: false, error: logs.error.invalidSession }

    if (!verifyHash(token, session.tokenRefresh)) return { success: false, error: logs.error.invalidToken }

    const tokenKey = tokenId + "@" + tokenStr

    if (!verifyHash(tokenKey, session.tokenKey as string)) return { success: false, error: "Code incorrect." }

    const newToken = generateToken()

    const newTokenKey = generateResetToken(10);

    const updateSession: Prisma.SessionCreateManyInput | Prisma.SessionUpdateInput = {
      tokenRefresh: newToken.hashToken,
      tokenKey: newTokenKey.hashTokenKey,
      tokenKeyUsed: true,
      expiresAt: new Date(Date.now() + CHECK_SESSION_DURATION),
    }

    const newSession = await prisma.session.update({
      select: { id: true, fingerPrint: true },
      where: { id: session.id },
      data: updateSession
    })

    if (!newSession) return { success: false, error: logs.error.create.session + ", veuillez réesseyer" };

    const currentSession = {
      id: newSession.id,
      userId: session.user?.id,
      state: session.user?.state,
      token: newToken.token, tokenId: newTokenKey.tokenId, tokenStr: newTokenKey.tokenStr
    } as {
      id: string,
      userId: number,
      state: StateUser,
      token: string, tokenId: string, tokenStr: string
    }

    return {
      success: true,
      session: currentSession
    };

  } catch (error) {
    console.error("Checking error : ", error);
    return { success: false, error: logs.error.checking };
  }
}


async function isNotMe(userId: number): Promise<{
  success: boolean;
  state?: boolean;
  error?: string;
}> {
  try {

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) return {
      success: true,
      state: true
    }

    const currentStatus = (user?.address && user.avatar && user.city && user.country && user.zipCode) ? StatusUser.ONLINE : StatusUser.IN_PROGRESS

    const currentUser = await prisma.user.update({
      where: { id: userId },
      data: { status: currentStatus, sessions: { deleteMany: { userId: user?.id } } },
    });

    if (!currentUser) return {
      success: false,
      error: logs.error.is_not_me + ", Veuillez réesseyer"
    }

    return {
      success: true,
      state: true
    }

  } catch (error) {
    console.error("Is not me error : ", error);
    return { success: false, error: logs.error.is_not_me };
  }
}

async function resendForgetPasswordEmail(sid: string, token: string, tokenStr: string): Promise<{
  success: boolean;
  session?: { id: string, userId: number, firstName: string, lastName: string, email: string, state: StateUser, token: string, tokenId: string, tokenStr: string };
  error?: string;
}> {
  try {
    const session = await prisma.session.findUnique({
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, state: true } } },
      where: { id: sid }
    });

    if (!session) return {
      success: false,
      error: "Votre session est inavlidee."
    }

    if (session.tokenKeyUsed)
      return {
        success: false,
        error: "Vous avez déjà utilisé votre clé de session de verification par email."
      }

    if (compareDate(session?.expiresAt as Date, new Date(), CompareSigne["<"])) return { success: false, error: logs.error.invalidSession }

    if (!verifyHash(token, session.tokenRefresh)) return { success: false, error: logs.error.invalidToken }

    const newToken = generateToken()

    const { tokenId } = generateResetToken(8);

    const tokenKey = tokenId + "@" + tokenStr

    const hashTokenKey = createHash(tokenKey)

    const updateSession: Prisma.SessionUpdateInput = {
      tokenRefresh: newToken.hashToken,
      tokenKey: hashTokenKey,
      expiresAt: new Date(Date.now() + CHECK_SESSION_DURATION),
    }

    const newSession = await prisma.session.update({
      where: { id: sid },
      data: updateSession
    })

    if (!newSession) return { success: false, error: logs.error.create.session + ", veuillez réesseyer" };

    const userSession = {
      id: newSession.id,
      userId: session.userId,
      firstName: session.user?.firstName,
      lastName: session.user?.lastName,
      email: session.user?.email,
      state: session.user?.state,
      token: token,
      tokenId: tokenId,
      tokenStr: tokenStr
    } as {
      id: string,
      userId: number,
      firstName: string,
      lastName: string,
      email: string,
      state: StateUser,
      token: string, tokenId: string, tokenStr: string
    }

    return {
      success: true,
      session: userSession,
    };

  } catch (error) {
    console.error("Resend forgot password email error : ", error);
    return { success: false, error: logs.error.resendForgetPasswordEmail };
  }
}


async function resetPassword(
  userId: number, token: string, tokenId: string,
  tokenStr: string, sid: string, password: string
): Promise<{
  success: boolean;
  session?: { id: string, userId: number, role: RoleUser, state: StateUser, rank?: RankAdmin, token: string };
  error?: string;
}> {
  try {

    const session = await prisma.session.findUnique({
      include: { user: { select: selectAuth } },
      where: { id: sid }
    });

    if (!session) return {
      success: false,
      error: "Votre session est invalidee."
    }

    if (!session.tokenKeyUsed)
      return {
        success: false,
        error: "Votre session est invalidee."
      }

    if (compareDate(session?.expiresAt as Date, new Date(), CompareSigne["<"])) return { success: false, error: logs.error.invalidSession }

    const tokenKey = tokenId + "@" + tokenStr

    if (!verifyHash(token, session.tokenRefresh) || !verifyHash(tokenKey, session.tokenKey as string)) return { success: false, error: logs.error.invalidToken }

    const newToken = generateToken()

    const newSession: Prisma.SessionCreateManyInput | Prisma.SessionCreateWithoutUserInput = {
      tokenRefresh: newToken.hashToken,
      tokenKey: null,
      tokenKeyUsed: false,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    }

    const currentStatus = (session.user?.address && session.user.avatar && session.user.city && session.user.country && session.user.zipCode) ? StatusUser.ONLINE : StatusUser.IN_PROGRESS

    const newPassword = await hashPassword(password)

    const userSession = await prisma.user.update({
      select: { sessions: { select: { id: true, userId: true, fingerPrint: true }, where: { id: session.id } } },
      where: { id: userId },
      data: {
        status: currentStatus,
        password: newPassword,
        sessions: {
          update: {
            where: { id: session.id },
            data: newSession
          }
        }
      }
    })

    if (!userSession) return { success: false, error: logs.error.create.session + ", veuillez réesseyer" };

    const newSid = userSession.sessions.find((s) => s.userId == userId)?.id

    const currentSession = {
      id: newSid,
      userId: session.user?.id,
      role: session.user?.role,
      state: session.user?.state,
      rank: session.user?.admin?.rank,
      token: newToken.token
    } as { id: string, userId: number, role: RoleUser, state: StateUser, rank?: RankAdmin, token: string }

    return {
      success: true,
      session: currentSession
    };

  } catch (error) {
    console.error("ResetPassword error : ", error);
    return { success: false, error: logs.error.resetPassword };
  }
}



async function verify(
  userId: number, token: string, tokenId: string,
  tokenStr: string, sid: string
): Promise<{
  success: boolean;
  session?: { id: string, userId: number, role: RoleUser, state: StateUser, rank?: RankAdmin, token: string };
  error?: string;
}> {
  try {

    const session = await prisma.session.findUnique({
      include: { user: { select: selectAuth } },
      where: { id: sid }
    });

    if (!session) return {
      success: false,
      error: "Votre session est invalidee."
    }

    if (!session.tokenKeyUsed)
      return {
        success: false,
        error: "Votre session est invalidee."
      }

    if (compareDate(session?.expiresAt as Date, new Date(), CompareSigne["<"])) return { success: false, error: logs.error.invalidSession }

    const tokenKey = tokenId + "@" + tokenStr

    if (!verifyHash(token, session.tokenRefresh) || !verifyHash(tokenKey, session.tokenKey as string)) return { success: false, error: logs.error.invalidToken }

    const newToken = generateToken()

    const newSession: Prisma.SessionCreateManyInput | Prisma.SessionCreateWithoutUserInput = {
      tokenRefresh: newToken.hashToken,
      tokenKey: null,
      tokenKeyUsed: false,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    }

    const currentStatus = (session.user?.address && session.user.avatar && session.user.city && session.user.country && session.user.zipCode) ? StatusUser.ONLINE : StatusUser.IN_PROGRESS

    const userSession = await prisma.user.update({
      select: { sessions: { select: { id: true, userId: true, fingerPrint: true }, where: { id: session.id } } },
      where: { id: userId },
      data: {
        status: currentStatus,
        sessions: {
          update: {
            where: { id: session.id },
            data: newSession
          }
        }
      }
    })

    if (!userSession) return { success: false, error: logs.error.create.session + ", veuillez réesseyer" };

    const newSid = userSession.sessions.find((s) => s.userId == userId)?.id

    const currentSession = {
      id: newSid,
      userId: session.user?.id,
      role: session.user?.role,
      state: session.user?.state,
      rank: session.user?.admin?.rank,
      token: newToken.token
    } as { id: string, userId: number, role: RoleUser, state: StateUser, rank?: RankAdmin, token: string }

    return {
      success: true,
      session: currentSession
    };

  } catch (error) {
    console.error("Verify error : ", error);
    return { success: false, error: logs.error.resetPassword };
  }
}


export {
  checking,
  isNotMe,
  resendForgetPasswordEmail,
  resetPassword,
  verify
};
