import { STATUS_ORDER } from "@/lib/constants/constants";
import {
  Cart,
  Order,
  PaymentMethod,
  PaymentType,
  Prisma,
  StateCart,
  StatusOrder,
} from "@/lib/generated/prisma/client";
import { OrderInclude } from "@/lib/generated/prisma/models";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";
import Igt from "@/modules/class/igt/Igt";
import { order } from "./../../../lib/data/raw/order";
import shipping from "./../../../lib/data/raw/shipping";

async function createOrder({
  userId,
  cartId,
  totalAmount,
  paymentMethod,
  paymentType,
  shippingAddress,
  // shippingType
}: {
  userId: number;
  cartId: number;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  paymentType?: PaymentType;
  shippingAddress: string;
  // shippingType?: string;
}): Promise<{
  success: boolean;
  order?: {
    id: number;
    orderNumber: string;
    user: {
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
    } | null;
    cartId: number | null;
    cart: {
      cartItems: {
        product: {
          name: string;
          sku: string;
          image: string | null;
        } | null;
        quantity: number;
        size: string;
        color: string;
      }[];
    } | null;
    totalAmount: number;
  };
  error?: string;
}> {
  try {
    const igt = new Igt();

    const newOrder: Prisma.OrderCreateManyInput = {
      orderNumber: igt.generateNumber("ORD", cartId),
      userId,
      cartId,
      totalAmount,
      paymentMethod,
      paymentType,
      shippingAddress,
      trackingNumber: igt.generateCode(cartId, "ORD"),
    };

    const select = {
      id: true,
      orderNumber: true,
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      cartId: true,
      cart: {
        select: {
          cartItems: {
            select: {
              product: {
                select: {
                  name: true,
                  sku: true,
                  image: true,
                },
              },
              quantity: true,
              size: true,
              color: true,
            },
          },
        },
      },
      totalAmount: true,
    };

    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ select, data: newOrder });

      if (!order) return order;

      await tx.cart.update({
        where: { id: order.cartId as number },
        data: { state: StateCart.DISABLED },
      });

      return order;
    });

    if (!order)
      return {
        success: false,
        error: logs.error.create.order + ", veuillez réesseyer",
      };

    return { success: true, order };
  } catch (error) {
    console.error("Create order error : ", error);
    return {
      success: false,
      error: logs.error.create.order,
    };
  }
}

async function readOrdersUser(
  userId: number,
  status: StatusOrder | "ALL" = "ALL",
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  orders?: Order[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const userCarts = await prisma.cart.findMany({
      select: { id: true },
      where: { userId, state: StateCart.DISABLED },
    });

    if (!userCarts) return { success: true, orders: [], total: 0 };

    const carts = userCarts.map((uc) => uc.id);

    const select: Prisma.OrderSelect = {
      id: true,
      orderNumber: true,
      cart: {
        select: {
          _count: { select: { cartItems: true } },
        },
        where: { userId },
      },
      totalAmount: true,
      status: true,
      shippingType: true,
      delivery: true,
      createdAt: true,
    };

    const where: Prisma.OrderWhereInput = {
      status:
        status !== "ALL"
          ? status
          : {
              in: Object.keys(STATUS_ORDER) as StatusOrder[],
            },

      orderNumber: {
        contains: searchQuery,
        mode: "insensitive",
      },
      cartId: { in: carts },
    };

    let orderBy: Prisma.OrderOrderByWithRelationInput;

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

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.order.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, orders, total };
  } catch (error) {
    console.error("Read orders user error : ", error);
    return {
      success: false,
      error: logs.error.read.orders,
    };
  }
}

async function readOrders(
  paymentType: PaymentType | "ALL" = "ALL",
  status: StatusOrder | "ALL" = "ALL",
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  orders?: Order[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.OrderSelect = {
      id: true,
      orderNumber: true,
      cart: {
        select: {
          userId: true,
          user: { select: { firstName: true, lastName: true } },
          // _count: { select: { cartItems: true } },
        },
      },
      totalAmount: true,
      status: true,
      // shippingType: true,
      // trackingNumber: true,
      // delivery: true,
      createdAt: true,
    };

    const where: Prisma.OrderWhereInput = {
      paymentType:
        paymentType !== "ALL"
          ? paymentType
          : {
              in: Object.keys(PaymentType) as PaymentType[],
            },
      status:
        status !== "ALL"
          ? status
          : {
              in: Object.keys(STATUS_ORDER) as StatusOrder[],
            },
      OR: [
        {
          trackingNumber: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          orderNumber: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    };

    let orderBy: Prisma.OrderOrderByWithRelationInput;

    switch (sortBy) {
      case "name-asc":
        orderBy = {
          orderNumber: "asc",
        };
        break;
      case "name-desc":
        orderBy = {
          orderNumber: "desc",
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

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.order.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, orders, total };
  } catch (error) {
    console.error("Read orders error : ", error);
    return {
      success: false,
      error: logs.error.read.orders,
    };
  }
}

async function readOrder(id: number): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  try {
    const order = await prisma.order.findUnique({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        cart: {
          include: {
            cartItems: { include: { product: true } },
          },
        },
        delivery: {
          include: {
            deliveryPerson: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
        invoice: {
          include: {
            transactions: {
              select: {
                transactionNumber: true,
                amount: true,
                method: true,
                type: true,
                status: true,
              },
            },
          },
        },
      },
      where: { id },
    });

    return { success: true, order: order as Order };
  } catch (error) {
    console.error("Read order error : ", error);
    return {
      success: false,
      error: logs.error.read.order,
    };
  }
}

async function updateOrder(
  id: number,
  data: Prisma.OrderUpdateInput,
): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  try {
    const order = await prisma.order.update({ where: { id }, data });

    if (!order)
      return {
        success: false,
        error: logs.error.update.order + ", veuillez réesseyer",
      };

    return { success: true, order };
  } catch (error) {
    console.error("Update order error : ", error);
    return {
      success: false,
      error: logs.error.update.order,
    };
  }
}

async function deleteOrder(id: number): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  try {
    const order = await prisma.order.delete({
      include: { cart: { include: { cartItems: true } } },
      where: { id },
    });

    if (!order)
      return {
        success: false,
        error: logs.error.delete.order + ", veuillez réesseyer",
      };

    return { success: true, order };
  } catch (error) {
    console.error("Delete order error : ", error);
    return {
      success: false,
      error: logs.error.delete.order,
    };
  }
}

export {
  createOrder,
  readOrdersUser,
  readOrders,
  readOrder,
  updateOrder,
  deleteOrder,
};
