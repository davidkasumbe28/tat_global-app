import { Favorite, Prisma } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";

async function createFavorites(
  userId: number,
  data: number[],
): Promise<{
  success: boolean;
  favorites?: Favorite[];
  error?: string;
}> {
  try {
    const select: Prisma.FavoriteSelect = {
      id: true,
      userId: true,
      productId: true,
    };

    const where: Prisma.FavoriteWhereInput = {
      userId: userId,
    };

    const [existingFavorites, total] = await prisma.$transaction([
      prisma.favorite.findMany({
        select: select,
        where: { userId, productId: { in: data } },
      }),
      prisma.favorite.count({
        where: { userId, productId: { in: data } },
      }),
    ]);

    if (existingFavorites && total > 0) {
      const alreadyAdded = existingFavorites.map((a) => a.productId);

      const newFavorites: Prisma.FavoriteCreateManyInput[] = data
        .filter((p) => !alreadyAdded.includes(p))
        .map((productId) => ({ userId, productId }));

      if (!newFavorites || newFavorites.length === 0)
        return {
          success: true,
          favorites: existingFavorites,
        };

      const { favoriteCount, favorites } = await prisma.$transaction(
        async (tx) => {
          const favoriteCount = await tx.favorite.createMany({
            data: newFavorites,
            skipDuplicates: true,
          });
          const favorites = await tx.favorite.findMany({ select, where });

          return { favoriteCount, favorites };
        },
      );

      const { count } = favoriteCount;

      if (count === 0)
        return {
          success: false,
          error:
            "Produits non ajouter dans vos favories, veuillez réesséyer plus tard.",
        };

      return { success: true, favorites };
    }

    const newFavorites: Prisma.FavoriteCreateManyInput[] = data.map(
      (productId) => ({ userId, productId }),
    );

    const { favoriteCount, favorites } = await prisma.$transaction(
      async (tx) => {
        const favoriteCount = await tx.favorite.createMany({
          data: newFavorites,
          skipDuplicates: true,
        });
        const favorites = await tx.favorite.findMany({ select, where });

        return { favoriteCount, favorites };
      },
    );

    const { count } = favoriteCount;

    if (count === 0)
      return {
        success: false,
        error:
          "Produits non ajouter dans vos favories, veuillez réesséyer plus tard.",
      };

    return { success: true, favorites };
  } catch (error) {
    console.error("Create favorites error : ", error);
    return {
      success: false,
      error: logs.error.create.favorite,
    };
  }
}

async function createFavorite(
  userId: number,
  productId: number,
): Promise<{ success: boolean; favorites?: Favorite[]; error?: string }> {
  try {
    const newFavorite: Prisma.FavoriteCreateManyInput = {
      userId,
      productId,
    };

    const select: Prisma.FavoriteSelect = {
      id: true,
      userId: true,
      productId: true,
    };

    const where: Prisma.FavoriteWhereInput = {
      userId: userId,
    };

    const { favorite, favorites } = await prisma.$transaction(async (tx) => {
      const favorite = await tx.favorite.create({ data: newFavorite });
      const favorites = await tx.favorite.findMany({ select, where });

      return { favorite, favorites };
    });

    if (!favorite)
      return {
        success: false,
        error:
          "Produit non ajouter dans vos favories, veuillez réesséyer plus tard.",
      };

    return { success: true, favorites };
  } catch (error) {
    console.error("Create favorite error : ", error);
    return {
      success: false,
      error: logs.error.create.favorite,
    };
  }
}

async function readFavoritesFavorite(
  userId: number,
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  favorites?: Favorite[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.FavoriteSelect = {
      id: true,
      userId: true,
      product: true,
    };

    const where: Prisma.FavoriteWhereInput = {
      userId: userId,
    };

    const [favorites, total] = await prisma.$transaction([
      prisma.favorite.findMany({
        select,
        skip,
        take,
        where,
      }),
      prisma.favorite.count({
        where,
      }),
    ]);

    return { success: true, favorites, total };
  } catch (error) {
    console.error("Read favorites product error : ", error);
    return {
      success: false,
      error: logs.error.read.favorites,
    };
  }
}

async function readFavorites(userId: number): Promise<{
  success: boolean;
  favorites?: Favorite[];
  total?: number;
  error?: string;
}> {
  try {
    const select: Prisma.FavoriteSelect = {
      id: true,
      userId: true,
      productId: true,
    };

    const where: Prisma.FavoriteWhereInput = {
      userId: userId,
    };

    const [favorites, total] = await prisma.$transaction([
      prisma.favorite.findMany({
        select,
        where,
      }),
      prisma.favorite.count({
        where,
      }),
    ]);

    return { success: true, favorites, total };
  } catch (error) {
    console.error("Read favorites error : ", error);
    return {
      success: false,
      error: logs.error.read.favorites,
    };
  }
}

async function readFavorite(id: number): Promise<{
  success: boolean;
  favorite?: Favorite;
  error?: string;
}> {
  try {
    const selectProduct: Prisma.ProductSelect = {
      id: true,
      name: true,
      sku: true,
      category: true,
      description: true,
      features: true,
      price: true,
      image: true,
      sizes: true,
      colors: true,
      stock: true,
      rating: true,
      state: true,
      collectionId: true,
      reviews: true,
      _count: true,
    };

    const select: Prisma.FavoriteSelect = {
      id: true,
      userId: true,
      product: { select: selectProduct },
    };

    const favorite = await prisma.favorite.findUnique({
      where: { id: id },
      select,
    });

    return { success: true, favorite: favorite as Favorite };
  } catch (error) {
    console.error("Read favorite error : ", error);
    return {
      success: false,
      error: logs.error.read.favorite,
    };
  }
}

async function updateFavorite(params: {
  where: Prisma.FavoriteWhereUniqueInput;
  data: Prisma.FavoriteUpdateInput;
}) {
  const { where, data } = params;
  return prisma.favorite.update({
    data,
    where,
  });
}

async function deleteFavorite(
  userId: number,
  id: number,
): Promise<{
  success: boolean;
  favorites?: Favorite[];
  error?: string;
}> {
  try {
    const select: Prisma.FavoriteSelect = {
      id: true,
      userId: true,
      productId: true,
    };

    const where: Prisma.FavoriteWhereInput = {
      userId: userId,
    };

    const { favorite, favorites } = await prisma.$transaction(async (tx) => {
      const favorite = await tx.favorite.delete({ where: { id: id } });
      const favorites = await tx.favorite.findMany({ select, where });

      return { favorite, favorites };
    });

    if (!favorite)
      return {
        success: false,
        error:
          "Produit non rétirer de vos favories, veuillez réesséyer plus tard.",
      };

    return { success: true, favorites };
  } catch (error) {
    console.error("Delete favorite error : ", error);
    return {
      success: false,
      error: logs.error.delete.favorite,
    };
  }
}

export {
  createFavorite,
  createFavorites,
  deleteFavorite,
  readFavorite,
  readFavorites,
  readFavoritesFavorite,
  updateFavorite,
};
