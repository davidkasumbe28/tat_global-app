import CartItem from "@/components/cart/cart-item";
import { UserProfile } from "@/lib/@types/user.type";
import {
  Prisma,
  RankAdmin,
  RoleUser,
  StateUser,
  StatusUser,
  User,
} from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";

const selectProfile: Prisma.UserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  address: true,
  city: true,
  zipCode: true,
  country: true,
  avatar: true,
  notifyOrderBy: true,
  notifyNewsletter: true,
};

async function profileUser(
  id: number,
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: selectProfile,
    });

    if (!user)
      return {
        success: false,
        error: "Aucune de vos informations trouvées",
      };

    return { success: true, user: user as UserProfile };
  } catch (error) {
    console.error("Read profile user error : ", error);
    return {
      success: false,
      error: logs.error.readProfileUser,
    };
  }
}

async function updateProfileUser(
  auth_user: string,
  data: Prisma.UserUpdateInput,
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const payload = JSON.parse(auth_user);

    const { userId } = payload;

    const user = await prisma.user.update({
      where: { id: userId },
      select: selectProfile,
      data,
    });

    if (!user)
      return {
        success: false,
        error: "Vos informations n'ont pas été mise à jour, veuillez réesseyer",
      };

    return { success: true, user: user as UserProfile };
  } catch (error) {
    console.error("Update profile user error : ", error);
    return {
      success: false,
      error: logs.error.updateProfileUser,
    };
  }
}

async function updateStatusUser({
  id,
  status,
}: {
  id: number;
  status: StatusUser;
}): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await prisma.user.update({
      data: { status: status },
      where: { id },
    });

    if (!user)
      return {
        success: false,
        error:
          "Le status de l'utilisateur n'a pas été mise à jour, veuillez réesseyer",
      };

    return { success: true, user: user };
  } catch (error) {
    console.error("Update status user error : ", error);
    return {
      success: false,
      error: logs.error.updateStatusUser,
    };
  }
}

async function updatePasswordUser(
  auth_user: string,
  password: string,
): Promise<{ success: boolean; state?: boolean; error?: string }> {
  try {
    const payload = JSON.parse(auth_user);

    const { userId } = payload;

    const user = prisma.user.update({
      where: { id: userId },
      data: { password: password },
    });

    if (!user)
      return {
        success: false,
        error: "Votre mot de passe n'a pas été mise à jour, veuillez réesseyer",
      };

    return { success: true, state: true };
  } catch (error) {
    console.error("Update password user error : ", error);
    return {
      success: false,
      error: logs.error.updateStatusUser,
    };
  }
}

async function deleteProfileUser(
  id: number,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await prisma.user.delete({
      where: { id },
    });

    if (!user)
      return {
        success: false,
        error: "Vos informations n'ont pas été supprimer, veuillez réesseyer",
      };

    return { success: true, user: user };
  } catch (error) {
    console.error("Delete profile user error : ", error);
    return {
      success: false,
      error: logs.error.deleteProfileUser,
    };
  }
}

async function createUser(
  data: Prisma.UserCreateInput,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // const select = {};

    const user = await prisma.user.create({ data });

    if (!user)
      return {
        success: false,
        error: logs.error.create.user + ", veuillez réesseyer",
      };

    return { success: true, user: user };
  } catch (error) {
    console.error("Create user error : ", error);
    return {
      success: false,
      error: logs.error.create.user,
    };
  }
}

async function readUsers(
  role: RoleUser | "ALL" = "ALL",
  state: StateUser | "ALL" = "ALL",
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  users?: User[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.UserSelect = {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      state: true,
      createdAt: true,
      transactions: {
        where: { status: "COMPLETED" },
        select: { id: true, amount: true },
      },
      _count: {
        select: {
          orders: true,
        },
      },
    };

    const where: Prisma.UserWhereInput = {
      role:
        role !== "ALL"
          ? role
          : {
              in: Object.values(RoleUser) as RoleUser[],
            },
      state:
        state !== "ALL"
          ? state
          : {
              in: Object.values(StateUser) as StateUser[],
            },
      OR: [
        {
          firstName: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    };

    let orderBy: Prisma.UserOrderByWithRelationInput;

    switch (sortBy) {
      case "name-asc":
        orderBy = {
          firstName: "asc",
        };
        break;
      case "name-desc":
        orderBy = {
          firstName: "desc",
        };
        break;
      case "newest":
        orderBy = {
          createdAt: "desc",
        };
        break;
      default:
        orderBy = {
          createdAt: "asc",
        };
        break;
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.user.count({
        skip,
        take,
        where,
        orderBy,
      }),
    ]);

    return { success: true, users, total };
  } catch (error) {
    console.error("Read users error : ", error);
    return {
      success: false,
      error: logs.error.read.users,
    };
  }
}

async function readManagers(
  rank: RankAdmin | "ALL" = "ALL",
  state: StateUser | "ALL" = "ALL",
): Promise<{
  success: boolean;
  managers?: User[];
  total?: number;
  error?: string;
}> {
  try {

    const select: Prisma.UserSelect = {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      state: true,
    };

    const where: Prisma.UserWhereInput = {
      admin: {
        rank:
          rank !== "ALL"
            ? rank
            : {
                in: Object.values(RankAdmin) as RankAdmin[],
              },
        state:
          state !== "ALL"
            ? state
            : {
                in: Object.values(StateUser) as StateUser[],
              },
      },
    };

    const managers = await prisma.user.findMany({
      select,
      where,
    });

    return { success: true, managers };
  } catch (error) {
    console.error("Read managers error : ", error);
    return {
      success: false,
      error: logs.error.read.managers,
    };
  }
}

async function readUser(
  id: number,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const include: Prisma.UserInclude = {
      admin: true,
      transactions: { select: { id: true, amount: true } },
      _count: {
        select: {
          carts: true,
          favorites: true,
          reviews: true,
          orders: true,
          transactions: true,
        },
      },
    };

    const user = await prisma.user.findUnique({
      include,
      where: { id },
    });

    return { success: true, user: user as User };
  } catch (error) {
    console.error("Read user error : ", error);
    return {
      success: false,
      error: logs.error.read.user,
    };
  }
}

async function updateUser(
  id: number,
  data: Prisma.UserUpdateInput,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await prisma.user.update({ where: { id }, data });

    if (!user)
      return {
        success: false,
        error:
          "Les informations de l'utilisateur n'ont pas été mise à jour, veuillez réesseyer",
      };

    return { success: true, user };
  } catch (error) {
    console.error("Update user error : ", error);
    return {
      success: false,
      error: logs.error.update.user,
    };
  }
}

async function deleteUser(
  id: number,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await prisma.user.delete({
      where: { id },
    });

    if (!user)
      return {
        success: false,
        error:
          "Les informations de l'utilisateur n'ont pas été supprimer, veuillez réesseyer",
      };

    return { success: true, user: user };
  } catch (error) {
    console.error("Delete user error : ", error);
    return {
      success: false,
      error: logs.error.delete.user,
    };
  }
}

export {
  createUser,
  deleteProfileUser,
  deleteUser,
  profileUser,
  readUser,
  readUsers,
  readManagers,
  updatePasswordUser,
  updateProfileUser,
  updateStatusUser,
  updateUser,
};
