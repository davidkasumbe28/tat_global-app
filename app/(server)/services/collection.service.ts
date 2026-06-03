import { CATEGORY_PRODUCT } from "@/lib/constants/constants";
import {
  CategoryProduct,
  Collection,
  Prisma,
  StateCollection,
} from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";
import Igt from "@/modules/class/igt/Igt";

async function createCollection(
  name: string,
  description: string,
  color: string,
  category: CategoryProduct,
  state: StateCollection,
): Promise<{ success: boolean; collection?: Collection; error?: string }> {
  try {
    const newCollection: Prisma.CollectionCreateInput = {
      name,
      sku: new Igt().generateSku("CLT", 1, name),
      description,
      category,
      image: "",
      color,
      state,
    };

    const collection = await prisma.collection.create({ data: newCollection });

    if (!collection)
      return {
        success: false,
        error: logs.error.create.collection + ",veuillez réesseyer",
      };

    return { success: true, collection };
  } catch (error) {
    console.error("Create collection error : ", error);
    return {
      success: false,
      error: logs.error.create.collection,
    };
  }
}

async function readCollectionsCollection(
  category: CategoryProduct | "ALL" = "ALL",
  searchQuery: string,
  sortBy: string = "newest",
): Promise<{
  success: boolean;
  collections?: Collection[];
  total?: number;
  error?: string;
}> {
  try {
    const select: Prisma.CollectionSelect = {
      id: true,
      name: true,
      category: true,
      description: true,
      image: true,
      color: true,
    };

    const where: Prisma.CollectionWhereInput = {
      category:
        category !== "ALL"
          ? category
          : {
              in: Object.keys(CATEGORY_PRODUCT) as CategoryProduct[],
            },
      OR: [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
      state: "AVAILABLE",
    };

    let orderBy: Prisma.CollectionOrderByWithRelationInput;

    switch (sortBy) {
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
    const [collections, total] = await prisma.$transaction([
      prisma.collection.findMany({
        select,
        where,
        orderBy,
      }),
      prisma.collection.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, collections, total };
  } catch (error) {
    console.error("Read collections collection error : ", error);
    return {
      success: false,
      error: logs.error.read.collections,
    };
  }
}

async function readCollectionsSelect(
  category: CategoryProduct | "ALL" = "ALL",
  state: StateCollection | "ALL" = "ALL",
  sortBy: string = "newest",
): Promise<{
  success: boolean;
  collections?: Collection[];
  error?: string;
}> {
  try {
    const select: Prisma.CollectionSelect = {
      id: true,
      sku: true,
      name: true,
      category: true,
      state: true,
    };

    const where: Prisma.CollectionWhereInput = {
      category:
        category !== "ALL"
          ? category
          : {
              in: Object.keys(CATEGORY_PRODUCT) as CategoryProduct[],
            },
      state:
        state !== "ALL"
          ? state
          : {
              in: Object.values(StateCollection) as StateCollection[],
            },
    };

    let orderBy: Prisma.CollectionOrderByWithRelationInput;

    switch (sortBy) {
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
    const collections = await prisma.collection.findMany({
      select,
      where,
      orderBy,
    });

    return { success: true, collections };
  } catch (error) {
    console.error("Read collections select error:", error);
    return {
      success: false,
      error: logs.error.read.collections,
    };
  }
}

async function readCollections(
  category: CategoryProduct | "ALL" = "ALL",
  state: StateCollection | "ALL" = "ALL",
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  collections?: Collection[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.CollectionSelect = {
      id: true,
      sku: true,
      name: true,
      category: true,
      description: true,
      image: true,
      color: true,
      state: true,
      createdAt: true,
      _count: true,
    };

    const where: Prisma.CollectionWhereInput = {
      category:
        category !== "ALL"
          ? category
          : {
              in: Object.keys(CATEGORY_PRODUCT) as CategoryProduct[],
            },
      state:
        state !== "ALL"
          ? state
          : {
              in: Object.values(StateCollection) as StateCollection[],
            },
      OR: [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          sku: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    };

    let orderBy: Prisma.CollectionOrderByWithRelationInput;

    switch (sortBy) {
      case "name-asc":
        orderBy = {
          name: "asc",
        };
        break;
      case "name-desc":
        orderBy = {
          name: "desc",
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
    const [collections, total] = await prisma.$transaction([
      prisma.collection.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.collection.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, collections, total };
  } catch (error) {
    console.error("Read collections error:", error);
    return {
      success: false,
      error: logs.error.read.collections,
    };
  }
}

async function readCollection(
  id: number,
): Promise<{ success: boolean; collection?: Collection; error?: string }> {
  try {
    const select: Prisma.CollectionSelect = {
      id: true,
      sku: true,
      name: true,
      category: true,
      description: true,
      image: true,
      color: true,
      state: true,
      createdAt: true,
      updatedAt: true,
      _count: true,
    };

    const collection = await prisma.collection.findUnique({
      select,
      where: { id },
    });

    return { success: true, collection: collection as Collection };
  } catch (error) {
    console.error("Read collection error : ", error);
    return {
      success: false,
      error: logs.error.read.collection,
    };
  }
}

async function updateCollection(
  id: number,
  data: Prisma.ProductUpdateInput,
): Promise<{ success: boolean; collection?: Collection; error?: string }> {
  try {
    const collection = await prisma.collection.update({
      where: { id },
      data,
    });

    if (!collection)
      return {
        success: false,
        error: logs.error.update.collection + ",veuillez réesseyer",
      };

    return { success: true, collection };
  } catch (error) {
    console.error("Update collection error : ", error);
    return {
      success: false,
      error: logs.error.update.collection,
    };
  }
}

async function deleteCollection(
  id: number,
): Promise<{ success: boolean; collection?: Collection; error?: string }> {
  try {
    const collection = await prisma.collection.delete({
      where: { id },
    });

    if (!collection)
      return {
        success: false,
        error: logs.error.delete.collection + ",veuillez réesseyer",
      };

    return { success: true, collection };
  } catch (error) {
    console.error("Delete collection error : ", error);
    return {
      success: false,
      error: logs.error.delete.collection,
    };
  }
}

export {
  createCollection,
  readCollectionsCollection,
  readCollectionsSelect,
  readCollections,
  readCollection,
  updateCollection,
  deleteCollection,
};
