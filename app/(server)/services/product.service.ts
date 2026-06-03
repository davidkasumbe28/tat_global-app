import { CATEGORY_PRODUCT } from "@/lib/constants/constants";
import {
  CategoryProduct,
  Prisma,
  Product,
  StateProduct,
} from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";
import Igt from "@/modules/class/igt/Igt";

async function createProduct(
  name: string,
  category: CategoryProduct,
  description: string,
  features: string,
  price: number,
  cost: number,
  sizes: string,
  colors: string,
  stock: number,
  rating: number,
  state: StateProduct,
  collectionId: number,
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const igt = new Igt();

    const c = await prisma.product.count();

    const newProduct = {
      name,
      sku: igt.generateSku("PRD", 1, name),
      category,
      description,
      features,
      price,
      cost,
      image: "",
      sizes,
      colors,
      stock,
      rating,
      trackingNumber: igt.generateCode(c + 1, "PRD"),
      state,
      collectionId,
    };

    const product = await prisma.product.create({ data: newProduct });

    if (!product)
      return {
        success: false,
        error: logs.error.create.product + ", veuillez réesseyer",
      };

    return { success: true, product };
  } catch (error) {
    console.error("Create product error : ", error);
    return {
      success: false,
      error: logs.error.create.product,
    };
  }
}

async function readProductsCatalogue(
  category: CategoryProduct | "ALL" = "ALL",
  searchQuery: string,
  sortBy: string = "newest",
  price: string,
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  products?: Product[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;
    const { min, max } = JSON.parse(price);

    const select: Prisma.ProductSelect = {
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
      _count: true,
    };

    const where: Prisma.ProductWhereInput = {
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
      price: {
        gte: min,
        lte: max,
      },
      state: "AVAILABLE",
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput;

    switch (sortBy) {
      case "price-asc":
        orderBy = {
          price: "asc",
        };
        break;
      case "price-desc":
        orderBy = {
          price: "desc",
        };
        break;
      case "rating":
        orderBy = {
          rating: "desc",
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

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.product.count({
        where,
        orderBy,
      }),
    ]);

    if (total === 0) return { success: true, products: [], total: 0 };

    return { success: true, products, total };
  } catch (error) {
    console.error("Read products catalogue error : ", error);
    return {
      success: false,
      error: logs.error.read.products,
    };
  }
}

async function readProductsCollection(
  collectionId: number,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  products?: Product[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.ProductSelect = {
      id: true,
      name: true,
      sku: true,
      category: true,
      description: true,
      features: true,
      price: true,
      cost: true,
      image: true,
      sizes: true,
      colors: true,
      stock: true,
      rating: true,
      state: true,
      _count: true,
    };

    const where: Prisma.ProductWhereInput = {
      collectionId,
      state: "AVAILABLE",
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput;

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

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.product.count({
        where,
        orderBy,
      }),
    ]);

    if (total === 0) return { success: true, products: [], total: 0 };

    return { success: true, products, total };
  } catch (error) {
    console.error("Read products collection error : ", error);
    return {
      success: false,
      error: logs.error.read.products,
    };
  }
}

async function readProductsCartItem(
  productIds: number[],
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  products?: Product[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.ProductSelect = {
      id: true,
      name: true,
      sku: true,
      category: true,
      description: true,
      features: true,
      price: true,
      cost: true,
      image: true,
      sizes: true,
      colors: true,
      stock: true,
      rating: true,
      state: true,
      _count: true,
    };

    const where: Prisma.ProductWhereInput = {
      id: { in: productIds },
      state: "AVAILABLE",
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        select,
        skip,
        take,
        where,
      }),
      prisma.product.count({
        where,
      }),
    ]);

    // if (!products || !total)
    //   return { success: false, error: "Aucun produit trouvé" };

    return { success: true, products, total };
  } catch (error) {
    console.error("Read products cartItem error : ", error);
    return {
      success: false,
      error: logs.error.read.products,
    };
  }
}

async function readProducts(
  category: CategoryProduct | "ALL" = "ALL",
  state: StateProduct | "ALL" = "ALL",
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  products?: Product[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.ProductSelect = {
      id: true,
      name: true,
      sku: true,
      category: true,
      description: true,
      features: true,
      price: true,
      cost: true,
      image: true,
      sizes: true,
      colors: true,
      stock: true,
      trackingNumber: true,
      rating: true,
      state: true,
      createdAt: true,
      _count: true,
    };

    const where: Prisma.ProductWhereInput = {
      category:
        category !== "ALL"
          ? category
          : {
              in: Object.values(CategoryProduct) as CategoryProduct[],
            },
      state:
        state !== "ALL"
          ? state
          : {
              in: Object.values(StateProduct) as StateProduct[],
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

    let orderBy: Prisma.ProductOrderByWithRelationInput;

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

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.product.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, products, total };
  } catch (error) {
    console.error("Read products error : ", error);
    return {
      success: false,
      error: logs.error.read.products,
    };
  }
}

async function readProduct(
  id: number,
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const select: Prisma.ProductSelect = {
      id: true,
      name: true,
      sku: true,
      category: true,
      description: true,
      features: true,
      price: true,
      cost: true,
      image: true,
      sizes: true,
      colors: true,
      stock: true,
      rating: true,
      trackingNumber: true,
      state: true,
      collectionId: true,
      createdAt: true,
      updatedAt: true,
      reviews: {
        select: { id: true, productId: true, rating: true },
      },
      _count: true,
    };

    const product = await prisma.product.findUnique({ select, where: { id } });

    return { success: true, product: product as Product };
  } catch (error) {
    console.error("Read product error : ", error);
    return {
      success: false,
      error: logs.error.read.product,
    };
  }
}

async function updateProduct(
  id: number,
  data: Prisma.ProductUpdateInput,
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const product = await prisma.product.update({
      where: { id },
      data,
    });

    if (!product)
      return {
        success: false,
        error: logs.error.update.product + ",veuillez réesseyer",
      };

    return { success: true, product };
  } catch (error) {
    console.error("Update product error : ", error);
    return {
      success: false,
      error: logs.error.update.product,
    };
  }
}

async function deleteProduct(
  id: number,
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const product = await prisma.product.delete({
      where: { id },
      
    });

    if (!product)
      return {
        success: false,
        error: logs.error.delete.product + ",veuillez réesseyer",
      };

    return { success: true, product };
  } catch (error) {
    console.error("Delete product error : ", error);
    return {
      success: false,
      error: logs.error.delete.product,
    };
  }
}

export {
  createProduct,
  readProducts,
  readProductsCartItem,
  readProductsCatalogue,
  readProductsCollection,
  readProduct,
  updateProduct,
  deleteProduct,
};
