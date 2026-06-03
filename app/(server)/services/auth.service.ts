import { UserAuth } from "@/lib/@types/user.type";
import { CHECK_SESSION_DURATION, SESSION_DURATION } from "@/lib/constants/constants";
import {
  Prisma,
  RankAdmin,
  RoleUser,
  Session,
  StateCart,
  StateUser,
  StatusUser
} from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import { generateResetToken } from "@/lib/utils/auth.utils";
import { comparePassword, hashPassword } from "@/lib/utils/bcrypt";
import { createHash, generateToken, verifyHash } from "@/lib/utils/crypto";
import { Payload } from "@/lib/utils/jwt";
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

async function login(
  { email,
    password,
    fingerPrint
  }:
    {
      email: string,
      password: string,
      fingerPrint?: string
    }
): Promise<{
  success: boolean;
  session?: { id: string, userId: number, role: RoleUser, state: StateUser, rank?: RankAdmin, token: string };
  error?: string;
}> {
  try {

    // find user by email
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: selectAuth,
    });

    if (!user) return { success: false, error: "Adresse mail incorrect" };

    // compare user password with password
    const compare = await comparePassword(password, user.password);

    if (!compare) return { success: false, error: "Mot de passe incorrect" };

    // if user status checked delete many sessions
    if (user.status === StatusUser.CHECKED) {
      await prisma.session.deleteMany({
        where: {
          userId: user.id
        }
      })
    }

    // create hash fingerprint
    const hashFingerPrint = createHash(fingerPrint as string)

    // generate token
    const { token, hashToken } = generateToken()

    const newSession: Prisma.SessionCreateManyInput | Prisma.SessionCreateWithoutUserInput = {
      tokenRefresh: hashToken,
      fingerPrint: hashFingerPrint,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    }

    // find many session valid
    const sessions = await prisma.$transaction(async (tx) => {
      await tx.session.deleteMany({
        where: {
          AND: {
            userId: user.id,
            expiresAt: { lt: new Date() }
          }
        }
      })

      const sessions = await tx.session.findMany({ where: { userId: user.id } })

      return sessions
    })

    // if sessions valid > 0
    if (sessions.length > 0) {

      // find session exist with same fingerprint
      const isExistSession = user.sessions.find((s) => (!fingerPrint && (s.fingerPrint === null)) ? true : verifyHash(fingerPrint as string, s.fingerPrint as string))

      // if session is exist
      if (isExistSession) {

        // update user status and session
        const userSession = await prisma.user.update({
          select: { sessions: { select: { id: true, userId: true, fingerPrint: true }, where: { id: isExistSession.id } } },
          where: { id: user.id },
          data: {
            status: user.status === StatusUser.IN_PROGRESS ? StatusUser.IN_PROGRESS : StatusUser.ONLINE,
            sessions: {
              update: {
                where: { id: isExistSession.id },
                data: newSession
              }
            }
          }
        })

        // not update
        if (!userSession) return { success: false, error: logs.error.create.session + ", veuillez réesseyer" };

        // find session with same fingerprint and userId
        const sid = userSession.sessions.find((s) => (fingerPrint ? verifyHash(fingerPrint as string, s.fingerPrint as string) : false) || s.userId == user.id)?.id

        const session = {
          id: sid,
          userId: user.id,
          role: user.role,
          state: user.state,
          rank: user.admin?.rank,
          token: token
        } as { id: string, userId: number, role: RoleUser, state: StateUser, rank?: RankAdmin, token: string }

        return {
          success: true,
          session
        };

      }

    }

    // if session valid = 0

    // update user status and create new session
    const userSession = await prisma.user.update({
      select: { sessions: { select: { id: true, userId: true } } },
      where: { id: user.id },
      data: {
        status: user.status === StatusUser.IN_PROGRESS ? StatusUser.IN_PROGRESS : StatusUser.ONLINE,
        sessions: { create: [newSession] }
      }
    })

    if (!userSession) return { success: false, error: logs.error.create.session + ", veuillez réesseyer" };

    const sid = userSession.sessions.find((s) => s.userId == user.id)?.id

    const session = {
      id: sid,
      userId: user.id,
      role: user.role,
      state: user.state,
      rank: user.admin?.rank,
      token: token
    } as { id: string, userId: number, role: RoleUser, state: StateUser, rank?: RankAdmin, token: string }

    return {
      success: true,
      session,
    };

  } catch (error) {
    console.error("Login error : ", error);
    return {
      success: false,
      error: logs.error.login,
    };
  }
}

async function signup(
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  phone: string,
): Promise<{
  success: boolean;
  session?: { id: string, userId: number, role: RoleUser, state: StateUser, rank?: RankAdmin, token: string };
  error?: string;
}> {
  try {

    const { token, hashToken } = generateToken()

    const newSession: Prisma.SessionCreateWithoutUserInput = {
      tokenRefresh: hashToken,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    }

    const passwordHash = await hashPassword(password);

    const newUser: Prisma.UserCreateInput = {
      email,
      password: passwordHash,
      firstName,
      lastName,
      phone,
      address: "",
      city: "",
      zipCode: "",
      country: "",
      status: StatusUser.IN_PROGRESS,
      sessions: {
        create: [newSession],
      } as Prisma.SessionCreateNestedManyWithoutUserInput,
    };

    const userSession = await prisma.$transaction(async (tx) => {

      const isExistUser = await tx.user.findUnique({
        where: { email: email },
        select: selectAuth,
      });

      if (isExistUser) return {
        error: "Voter adresse mail : " + email + " est déjà lié à un compte TAT GLOBAL, connectez vous sur notre page de connexion.",
      };

      const userSession = await prisma.user.create({
        select: selectAuth,
        data: newUser,
      });

      return {
        data: userSession
      }

    })

    if (userSession?.error) return {
      success: false,
      error: userSession?.error
    }

    if (!userSession?.data)
      return {
        success: false,
        error: logs.error.signup + ", veuillez réesseyer",
      };

    const sid = userSession.data.sessions.find((s) => s.userId == userSession.data.id)?.id

    const session = {
      id: sid,
      userId: userSession.data.id,
      role: userSession.data.role,
      state: userSession.data.state,
      rank: userSession.data.admin?.rank,
      token: token
    } as { id: string, userId: number, role: RoleUser, state: StateUser, rank?: RankAdmin, token: string }

    return {
      success: true,
      session,
    };
  } catch (error) {
    console.error("Signup error : ", error);
    return {
      success: false,
      error: logs.error.signup,
    };
  }
}

async function forgetPassword(email: string): Promise<{
  success: boolean;
  session?: { id: string, userId: number, firstName: string, lastName: string, email: string, state: StateUser, token: string, tokenId: string, tokenStr: string };
  error?: string;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: selectAuth,
    });

    if (!user) return { success: false, error: "Adresse email incorrect" };

    const { token, hashToken } = generateToken()

    const { tokenId, tokenStr, hashTokenKey } = generateResetToken(8);

    const newSession: Prisma.SessionCreateWithoutUserInput = {
      tokenRefresh: hashToken,
      tokenKey: hashTokenKey,
      tokenKeyUsed: false,
      expiresAt: new Date(Date.now() + CHECK_SESSION_DURATION),
    }

    await prisma.session.deleteMany({ where: { userId: user.id } })

    const userSession = await prisma.user.update({
      select: { sessions: { select: { id: true, userId: true, fingerPrint: true } } },
      where: { id: user.id },
      data: {
        status: StatusUser.CHECKED,
        sessions: { create: newSession }
      }
    })

    if (!userSession) return { success: false, error: logs.error.create.session + ", veuillez réesseyer" };
    const sid = userSession.sessions.find((s) => s.userId == user.id)?.id

    const session = {
      id: sid,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      state: user.state,
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
      session,
    };

  } catch (error) {
    console.error("ForgetPassword error : ", error);
    return { success: false, error: logs.error.forgetPassword };
  }
}

async function authenticated(
  auth_user: string,
): Promise<{ success: boolean; user?: UserAuth; error?: string }> {
  try {
    const payload = JSON.parse(auth_user) as Payload;

    const { userId } = payload;

    const select = {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      state: true,
      status: true,
      favorites: {
        select: {
          id: true,
          userId: true,
          productId: true,
        },
      },
      carts: {
        where: { state: StateCart.ENABLED },
        select: {
          id: true,
          userId: true,
          state: true,
          cartItems: { select: { id: true, quantity: true, product: { select: { price: true } } } },
        },
      },
    }

    const user = await prisma.$transaction(async (tx) => {

      const sessions = await tx.session.findMany({ where: { userId } })

      if (sessions.length === 0 || !sessions) return {
        error: "Vous n'avez aucune session initialisée.",
      };

      await prisma.session.deleteMany({
        where: {
          AND: {
            userId,
            expiresAt: { lt: new Date() }
          }
        }
      })

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select
      });

      const userFormat = {
        id: user?.id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        avatar: user?.avatar,
        role: user?.role,
        state: user?.state,
        status: user?.status,
        favorites: user?.favorites,
        cart: user?.carts.find((c) => userId === c.userId && c.state === StateCart.ENABLED)
      }

      return { data: userFormat }

    })

    if (user.error) return {
      success: false,
      error: user.error,
    };


    if (!user.data)
      return {
        success: false,
        error: "Aucune de vos informations n'a été trouvée",
      };

    return { success: true, user: user.data as UserAuth };
  } catch (error) {
    console.error("Authenticated error : ", error);
    return { success: false, error: logs.error.authenticated };
  }
}

async function logout(auth_user: string): Promise<{
  success: boolean;
  state?: boolean;
  error?: string;
}> {
  try {
    const payload = JSON.parse(auth_user as string) as Payload;

    const { userId, fingerPrint } = payload;

    await prisma.$transaction(async (tx) => {

      const user = await tx.user.findUnique({ select: selectAuth, where: { id: userId } })

      if (!user) {

        const session = await prisma.session.deleteMany({ where: { userId } })

        return session
      }

      if (fingerPrint) {

        const isExistSession = user.sessions.find((s) => verifyHash(fingerPrint, s.fingerPrint as string))

        const userSession = await prisma.user.update({
          select: selectAuth,
          where: { id: userId },
          data: {
            status: user.status === StatusUser.IN_PROGRESS ? StatusUser.IN_PROGRESS : StatusUser.OFFLINE,
            sessions: { delete: { id: isExistSession?.id } }
          }
        });

        return userSession

      }

      const userSession = await prisma.user.update({
        select: selectAuth,
        where: { id: userId },
        data: {
          status: user.status === StatusUser.IN_PROGRESS ? StatusUser.IN_PROGRESS : StatusUser.OFFLINE,
          sessions: { deleteMany: { userId: user.id } }
        }
      });

      return userSession

    })

    return {
      success: true,
      state: true
    };
  } catch (error) {
    console.error("Logout error : ", error);
    return { success: false, error: logs.error.logout };
  }
}

export {
  authenticated,
  forgetPassword,
  login,
  logout,
  signup
};

