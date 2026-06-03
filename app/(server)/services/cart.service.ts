import { Cart, Prisma, StateCart } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";

async function createCart(userId: number): Promise<{
  success: boolean;
  cart?: Cart;
  error?: string;
}> {
  try {
    const select: Prisma.CartSelect = {
      id: true,
      userId: true,
      state: true,
      cartItems: {
        select: {
          id: true,
          quantity: true,
          product: { select: { price: true } },
        },
      },
    };

    const where: Prisma.CartWhereInput = {
      userId,
      state: "ENABLED",
    };

    const [carts, total] = await prisma.$transaction([
      prisma.cart.findMany({
        select,
        where,
      }),
      prisma.cart.count({
        where,
      }),
    ]);

    if (carts && total > 0) {
      const cart = carts.find(
        (cart) => cart.userId === userId && cart.state === "ENABLED",
      );

      return { success: true, cart: cart };
    }

    const newCart: Prisma.CartCreateManyInput = { userId };

    const cart = await prisma.cart.create({ data: newCart });

    // if (!cart)
    //   return {
    //     success: false,
    //     error: "Votre panier n'a pas été initialiser, veuillez réesseyer.",
    //   };

    return { success: true, cart: cart };
  } catch (error) {
    console.error("Create cart error : ", error);
    return {
      success: false,
      error: logs.error.create.cart,
    };
  }
}

async function readCartsCart(
  userId: number,
  state: StateCart | "ALL" = "ALL",
  sortBy?: string,
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  carts?: Cart[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.CartSelect = {
      id: true,
      userId: true,
      state: true,
      _count: true,
    };

    const where: Prisma.CartWhereInput = {
      userId,
      state:
        state !== "ALL"
          ? state
          : {
              in: ["ENABLED", "DISABLED"],
            },
    };

    let orderBy: Prisma.CartOrderByWithRelationInput;

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

    const [carts, total] = await prisma.$transaction([
      prisma.cart.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.cart.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, carts, total };
  } catch (error) {
    console.error("Read carts error : ", error);
    return {
      success: false,
      error: logs.error.read.carts,
    };
  }
}

// async function readCartsOrder(userId: number): Promise<{
//   success: boolean;
//   carts?: Cart[];
//   error?: string;
// }> {
//   try {
//     const select: Prisma.CartSelect = {
//       // id: true,
//       // userId: true,
//       // state: true,
//       // cartItems: {
//       //   select: {
//       //     id: true,
//       //     quantity: true,
//       //     product: { select: { price: true } },
//       //   },
//       // },
//       orders: {
//         select: {
//           id : true,
//           totalAmount: true,
//           status: true,
//           shippingType: true,
//           trackingNumber: true,
//           delivery: true,
//         },
//       },
//     };

//     const where: Prisma.CartWhereInput = {
//       userId,
//       state: "ENABLED",
//     };

//     const carts = await prisma.cart.findMany({
//       select,
//       where,
//     });

//     return { success: true, carts: carts as Cart[] };
//   } catch (error) {
//     console.error("Read carts error : ", error);
//     return {
//       success: false,
//       error: logs.error.read.carts,
//     };
//   }
// }

async function readCarts(userId: number): Promise<{
  success: boolean;
  carts?: Cart[];
  error?: string;
}> {
  try {
    const select: Prisma.CartSelect = {
      id: true,
      userId: true,
      state: true,
      cartItems: {
        select: {
          id: true,
          quantity: true,
          product: { select: { price: true } },
        },
      },
    };

    const where: Prisma.CartWhereInput = {
      userId,
      state: "ENABLED",
    };

    const carts = await prisma.cart.findMany({
      select,
      where,
    });

    return { success: true, carts: carts as Cart[] };
  } catch (error) {
    console.error("Read carts error : ", error);
    return {
      success: false,
      error: logs.error.read.carts,
    };
  }
}

async function readCart(id: number): Promise<{
  success: boolean;
  cart?: Cart;
  error?: string;
}> {
  try {
    const select: Prisma.CartSelect = {
      id: true,
      userId: true,
      state: true,
      cartItems: true,
      orders: true,
    };

    const cart = await prisma.cart.findUnique({ where: { id }, select });

    return { success: true, cart: cart as Cart };
  } catch (error) {
    console.error("Read cart error : ", error);
    return {
      success: false,
      error: logs.error.read.cart,
    };
  }
}

async function updateCart(params: {
  where: Prisma.CartWhereUniqueInput;
  data: Prisma.CartUpdateInput;
}) {
  const { where, data } = params;
  return prisma.cart.update({
    data,
    where,
  });
}

async function deleteCart(where: Prisma.CartWhereUniqueInput) {
  return prisma.cart.delete({
    where,
  });
}

export {
  readCart,
  readCarts,
  readCartsCart,
  createCart,
  deleteCart,
  updateCart,
};
