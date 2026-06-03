import { SESSION_DURATION } from "@/lib/constants/constants";
import {
  Admin,
  Prisma,
  RankAdmin,
  RoleUser,
  Session,
  StatusUser
} from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";


async function createSession({
  userId,
  tokenRefresh,
  fingerPrint,
  tokenKey,
  tokenKeyUsed,
  expiresAt = new Date(Date.now() + SESSION_DURATION),
}: {
  userId: number,
  tokenRefresh: string,
  fingerPrint?: string,
  tokenKey?: string,
  tokenKeyUsed?: boolean,
  expiresAt?: string | Date,
}): Promise<{ success: boolean; session?: Session; error?: string }> {
  try {

    const newSession: Prisma.SessionCreateManyInput = {
      userId,
      tokenRefresh,
      fingerPrint,
      tokenKey,
      tokenKeyUsed,
      expiresAt,
    }

    const session = await prisma.session.create({ data: newSession })

    if (!session)
      return {
        success: false,
        error: logs.error.create.session + ", veuillez réesseyer",
      };

    return { success: true, session: session };
  } catch (error) {
    console.error("Create session error : ", error);
    return {
      success: false,
      error: logs.error.create.session,
    };
  }
}

async function readSessions({
  userId
}: {
  userId: number;
}): Promise<{
  success: boolean;
  sessions?: Session[];
  error?: string;
}> {
  try {

    const sessions = await prisma.session.findMany({ where: { userId } });

    // if (sessions.length === 0 || !sessions)
    //   return {
    //     success: false,
    //     error: "Aucune session initialisée",
    //   };

    return { success: true, sessions };
  } catch (error) {
    console.error("Read sessions error : ", error);
    return {
      success: false,
      error: logs.error.read.sessions,
    };
  }
}

async function readSession(id: string): Promise<{
  success: boolean;
  session?: {
    id: string;
    userId: number;
    tokenRefresh: string | null;
    fingerPrint: string | null;
    tokenKey: string | null;
    tokenKeyUsed: boolean | null;
    expiresAt: Date;
    user: { role: RoleUser; admin: { rank: RankAdmin } };
  };
  error?: string;
}> {
  try {
    const select = {
      id: true,
      userId: true,
      tokenRefresh: true,
      fingerPrint: true,
      tokenKey: true,
      tokenKeyUsed: true,
      expiresAt: true,
      user: { select: { role: true, admin: { select: { rank: true } } } }
    };

    const session = await prisma.session.findUnique({ select, where: { id } });

    // if (!session)
    //   return {
    //     success: false,
    //     error: "Votre session n'est pas initialisée",
    //   };

    return {
      success: true,
      session: session as {
        id: string;
        userId: number;
        tokenRefresh: string | null;
        fingerPrint: string | null;
        tokenKey: string | null;
        tokenKeyUsed: boolean | null;
        expiresAt: Date;
        user: { role: RoleUser; admin: { rank: RankAdmin } };
      }
    };
  } catch (error) {
    console.error("Read session error : ", error);
    return {
      success: false,
      error: logs.error.read.session,
    };
  }
}

async function updateSession(
  id: string,
  data: Prisma.SessionUpdateInput,
): Promise<{ success: boolean; session?: Session; error?: string }> {
  try {
    const session = await prisma.session.update({
      where: { id },
      data,
    });

    if (!session)
      return {
        success: false,
        error: "La session n'a pas été mise à jour, veuillez réesseyer",
      };

    return { success: true, session: session };
  } catch (error) {
    console.error("Update session error : ", error);
    return {
      success: false,
      error: logs.error.update.session,
    };
  }
}

async function deleteSession(
  id: string,
): Promise<{ success: boolean; session?: Session; error?: string }> {
  try {
    const session = await prisma.session.delete({
      where: { id: id },
    });

    if (!session)
      return {
        success: false,
        error: "La session n'a pas été supprimer, veuillez réesseyer",
      };

    return { success: true, session: session };
  } catch (error) {
    console.error("Delete session error : ", error);
    return {
      success: false,
      error: logs.error.delete.session,
    };
  }
}


export { createSession, readSessions, readSession, deleteSession, updateSession };

