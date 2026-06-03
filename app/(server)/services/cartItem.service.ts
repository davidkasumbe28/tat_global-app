import { CartAuth } from "@/lib/@types/cart.type";
import { CartItem, Prisma } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";

async function createCartItems(
  cartId: number,
  data: { productId: number; quantity: number; size: string; color: string }[],
): Promise<{
  success: boolean;
  cart?: CartAuth;
  error?: string;
}> {
  try {
    let productIds = data.map((datum) => datum.productId);

    productIds = await prisma.product
      .findMany({
        where: {
          id: { in: productIds },
          stock: { gt: 1 },
        },
        select: { id: true },
      })
      .then((products) => products.map((p) => p.id));

    const sizes = data.map((datum) => datum.size);

    const colors = data.map((datum) => datum.color);

    const select = {
        id: true,
        productId: true,
        quantity: true,
        size: true,
        color: true,
      },
      where = {
        cartId,
        AND: {
          productId: { in: productIds },
          size: { in: sizes },
          color: { in: colors },
        },
      },
      selectCart: Prisma.CartSelect = {
        id: true,
        state: true,
        cartItems: {
          select: {
            id: true,
            quantity: true,
            product: { select: { price: true } },
          },
        },
      },
      whereCart: Prisma.CartWhereUniqueInput = {
        id: cartId,
      };

    const [existingCartItems, total] = await prisma.$transaction([
      prisma.cartItem.findMany({
        select,
        where,
      }),
      prisma.cartItem.count({
        where,
      }),
    ]);

    if (existingCartItems && total > 0) {
      let cartItemCount;

      const alreadyAdded = existingCartItems.map((c) => ({
        productId: c.productId,
        size: c.size,
        color: c.color,
      }));

      // cartItems: {
      //   id: number;
      //   productId: number;
      //   quantity: number;
      //   size: string;
      //   color: string;
      // }[];

      const newAlreadyAdded = data
        .filter(
          ({
            productId,
            size,
            color,
          }: {
            productId: number;
            size: string;
            color: string;
          }) =>
            alreadyAdded.map((a) => a.productId).includes(productId) &&
            alreadyAdded.map((a) => a.size).includes(size) &&
            alreadyAdded.map((a) => a.color).includes(color),
        )
        .map((datum) => ({
          productId: datum.productId,
          quantity: datum.quantity,
          size: datum.size,
          color: datum.color,
        }));

      if (newAlreadyAdded && newAlreadyAdded.length > 0) {
        cartItemCount = await updateCartItems(cartId, newAlreadyAdded);
      }

      const newCartItems = data
        .filter(
          ({
            productId,
            size,
            color,
          }: {
            productId: number;
            size: string;
            color: string;
          }) =>
            !alreadyAdded.map((a) => a.productId).includes(productId) ||
            !alreadyAdded.map((a) => a.size).includes(size) ||
            !alreadyAdded.map((a) => a.color).includes(color),
        )
        .map((datum) => ({
          cartId,
          productId: datum.productId,
          quantity: datum.quantity,
          size: datum.size,
          color: datum.color,
        }));

      if (newCartItems && newCartItems.length > 0) {
        cartItemCount = await prisma.cartItem.createMany({
          data: newCartItems,
          skipDuplicates: true,
        });
        // const tx = await prisma.$transaction(async (tx) => {
        //   const cartItemCount = await tx.cartItem.createMany({
        //     data: newCartItems,
        //     skipDuplicates: true,
        //   });
        //   const cartItems = await tx.cartItem.findMany({ select, where });

        //   return { cartItemCount, cartItems };
        // });

        // cartItemCount = tx.cartItemCount;
        // cartItems = tx.cartItems;
      }

      if (cartItemCount?.count === 0)
        return {
          success: false,
          error:
            "Produits non ajouter dans votre panier, veuillez réesséyer plus tard.",
        };

      const cart = await prisma.cart.findUnique({
        where: whereCart,
        select: selectCart,
      });

      return { success: true, cart: cart as CartAuth };
    }

    const newCartItems: Prisma.CartItemCreateManyInput[] = data.map(
      (datum) => ({
        cartId: cartId,
        productId: datum.productId,
        quantity: datum.quantity,
        size: datum.size,
        color: datum.color,
      }),
    );

    const [cartItemCount, cart] = await prisma.$transaction([
      prisma.cartItem.createMany({
        data: newCartItems,
        skipDuplicates: true,
      }),
      prisma.cart.findUnique({
        where: whereCart,
        select: selectCart,
      }),
    ]);

    // const cartItemCount = await prisma.cartItem.createMany({
    //   data: newCartItems,
    //   skipDuplicates: true,
    // })

    if (!cartItemCount || cartItemCount.count === 0)
      return {
        success: false,
        error:
          "Produits non ajouter dans votre panier, veuillez réesséyer plus tard.",
      };

    // const cart = await prisma.cart.findUnique({
    //   where: whereCart,
    //   select: selectCart,
    // });

    return { success: true, cart: cart as CartAuth };
  } catch (error) {
    console.error("Create cartItems error : ", error);
    return {
      success: false,
      error: logs.error.create.cartItem,
    };
  }
}

async function createCartItem(
  cartId: number,
  productId: number,
  quantity: number,
  size: string,
  color: string,
): Promise<{
  success: boolean;
  cart?: CartAuth;
  error?: string;
}> {
  try {
    const select = {
        id: true,
        productId: true,
        quantity: true,
        size: true,
        color: true,
      },
      where: Prisma.CartItemWhereUniqueInput = {
        cartId_productId_size_color: {
          cartId,
          productId,
          size,
          color,
        },
      },
      selectCart: Prisma.CartSelect = {
        id: true,
        state: true,
        cartItems: {
          select: {
            id: true,
            quantity: true,
            product: { select: { price: true } },
          },
        },
      },
      whereCart: Prisma.CartWhereUniqueInput = {
        id: cartId,
      };

    const existingCartItem = await prisma.cartItem.findUnique({
      select,
      where,
    });

    if (existingCartItem) {
      const [cartItem, product, cart] = await prisma.$transaction([
        prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: { increment: quantity } },
        }),

        prisma.product.update({
          where: { id: existingCartItem.productId },
          data: { stock: { decrement: quantity } },
        }),

        prisma.cart.findUnique({
          where: { id: cartId },
          select: {
            id: true,
            state: true,
            cartItems: true,
          },
        }),
      ]);

      if (!cartItem)
        return {
          success: false,
          error: "Produit non ajouter dans votre panier, veuillez réesseyer.",
        };

      return { success: true, cart: cart as CartAuth };
    }

    const newCartItem: Prisma.CartItemCreateManyInput = {
      cartId,
      productId,
      quantity,
      size,
      color,
    };

    const [cartItem, product, cart] = await prisma.$transaction([
      prisma.cartItem.create({ data: newCartItem }),
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      }),
      prisma.cart.findUnique({
        where: { id: cartId },
        select: {
          id: true,
          state: true,
          cartItems: {
            select: {
              id: true,
              quantity: true,
              product: { select: { price: true } },
            },
          },
        },
      }),
    ]);

    if (!cartItem)
      return {
        success: false,
        error: "Produit non ajouter dans votre panier, veuillez réesseyer.",
      };

    return { success: true, cart: cart as CartAuth };
  } catch (error) {
    console.error("Create cartItem error : ", error);
    return {
      success: false,
      error: logs.error.create.cartItem,
    };
  }
}

async function readCartItemsCart(
  cartId: number,
  sortBy?: string,
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  cartItems?: CartItem[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.CartItemSelect = {
      id: true,
      cartId: true,
      product: true,
      quantity: true,
      size: true,
      color: true,
    };

    const where: Prisma.CartItemWhereInput = {
      cartId,
    };

    let orderBy: Prisma.CartItemOrderByWithRelationInput;

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

    const [cartItems, total] = await prisma.$transaction([
      prisma.cartItem.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.cartItem.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, cartItems, total };
  } catch (error) {
    console.error("Read cartItems cart error : ", error);
    return {
      success: false,
      error: logs.error.read.cartItems,
    };
  }
}

async function readCartItems(cartId: number): Promise<{
  success: boolean;
  cartItems?: CartItem[];
  total?: number;
  error?: string;
}> {
  try {
    const select: Prisma.CartItemSelect = {
      id: true,
      cartId: true,
      product: true,
      quantity: true,
      size: true,
      color: true,
    };

    const where: Prisma.CartItemWhereInput = {
      cartId,
    };

    const [cartItems, total] = await prisma.$transaction([
      prisma.cartItem.findMany({
        select,
        where,
      }),
      prisma.cartItem.count({
        where,
      }),
    ]);

    return { success: true, cartItems, total };
  } catch (error) {
    console.error("Read cartItems error : ", error);
    return {
      success: false,
      error: logs.error.read.cartItems,
    };
  }
}

async function readCartItem(id: number): Promise<{
  success: boolean;
  cartItem?: CartItem;
  error?: string;
}> {
  try {
    const select: Prisma.CartItemSelect = {
      id: true,
      cartId: true,
      productId: true,
      product: true,
      quantity: true,
      size: true,
      color: true,
    };

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: id },
      select,
    });

    return { success: true, cartItem: cartItem as CartItem };
  } catch (error) {
    console.error("Read cartItem error : ", error);
    return {
      success: false,
      error: logs.error.read.cartItem,
    };
  }
}

async function updateCartItems(
  cartId: number,
  items: {
    productId: number;
    quantity: number;
    size: string;
    color: string;
  }[] = [],
  chunkSize = 500,
) {
  let count = 0;

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const updateCartItems = await prisma.$transaction(
      chunk.flatMap((item) => [
        prisma.cartItem.updateMany({
          where: {
            cartId,
            productId: item.productId,
            size: item.size,
            color: item.color,
          },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        }),

        prisma.product.updateMany({
          where: {
            id: item.productId,
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        }),
      ]),
    );

    for (const cartItem of updateCartItems) {
      count += cartItem.count;
    }
  }

  return { count };
}

async function updateCartItem(
  id: number,
  quantity: number,
): Promise<{
  success: boolean;
  cart?: CartAuth;
  error?: string;
}> {
  try {
    const [cartItem, cart] = await prisma.$transaction(async (tx) => {
      const cartItemQ = await tx.cartItem.findUnique({
        where: { id },
        select: { quantity: true },
      });

      const cartItem = await tx.cartItem.update({
        where: { id },
        data: { quantity },
      });

      const stockUpdate =
        (cartItemQ?.quantity || 0) >= quantity
          ? { increment: (cartItemQ?.quantity || 0) - quantity }
          : { decrement: quantity - (cartItemQ?.quantity || 0) };

      await tx.product.update({
        where: { id: cartItem.productId },
        data: { stock: stockUpdate },
      });

      const cart = await tx.cart.findUnique({
        where: { id: cartItem.id },
        select: {
          id: true,
          state: true,
          cartItems: {
            select: {
              id: true,
              quantity: true,
              product: { select: { price: true } },
            },
          },
        },
      });

      return [cartItem, cart];
    });

    if (!cartItem)
      return {
        success: false,
        error:
          "La quantité du produit n'a pas été mise à jour dans votre panier, veuillez réesseyer.",
      };

    return { success: true, cart: cart as CartAuth };
  } catch (error) {
    console.error("Update cartItem error : ", error);
    return {
      success: false,
      error: logs.error.update.cartItem,
    };
  }
}

async function deleteCartItem(id: number): Promise<{
  success: boolean;
  cart?: CartAuth;
  error?: string;
}> {
  try {
    const [cartItem, cart] = await prisma.$transaction(async (tx) => {
      const cartItemQ = await tx.cartItem.findUnique({
        where: { id },
        select: { quantity: true },
      });

      const cartItem = await tx.cartItem.delete({ where: { id } });

      await tx.product.update({
        where: { id: cartItem.productId },
        data: { stock: { increment: cartItemQ?.quantity } },
      });

      const cart = await tx.cart.findUnique({
        where: { id: cartItem.id },
        select: {
          id: true,
          state: true,
          cartItems: {
            select: {
              id: true,
              quantity: true,
              product: { select: { price: true } },
            },
          },
        },
      });

      return [cartItem, cart];
    });

    if (!cartItem)
      return {
        success: false,
        error:
          "Le produit n'a pas été retiré de votre panier, veuillez réesseyer.",
      };

    return { success: true, cart: cart as CartAuth };
  } catch (error) {
    console.error("Delete cartItem error : ", error);
    return {
      success: false,
      error: logs.error.delete.cartItem,
    };
  }
}

export {
  readCartItem,
  readCartItems,
  readCartItemsCart,
  createCartItem,
  createCartItems,
  deleteCartItem,
  updateCartItem,
  updateCartItems,
};
