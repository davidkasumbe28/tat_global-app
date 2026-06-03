import { SHIPPING, STATUS_ORDER, TAX } from "@/lib/constants/constants";
import {
  Cart,
  Delivery,
  Order,
  PaymentMethod,
  PaymentType,
  Prisma,
  StateCart,
  StatusInvoice,
  StatusOrder,
} from "@/lib/generated/prisma/client";
import { OrderInclude } from "@/lib/generated/prisma/models";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";
import Igt from "@/modules/class/igt/Igt";
import { order } from "./../../../lib/data/raw/order";
import shipping from "./../../../lib/data/raw/shipping";

async function createDelivery({
  deliveryPersonId,
  userId,
  orderId
}: {
  deliveryPersonId: number;
  userId : number;
  orderId: number;
}): Promise<{
  success: boolean;
  delivery?: Delivery;
  error?: string;
}> {
  try {
    const igt = new Igt();

    const newDelivery: Prisma.DeliveryCreateManyInput = {
      deliveryNumber: igt.generateNumber("DLY", orderId),
      deliveryPersonId,
      userId,
      orderId,
    };

    const delivery = await prisma.$transaction(async (tx) => {
      const delivery = await tx.delivery.create({ data: newDelivery });

      if (!delivery) return delivery;

      await tx.order.update({
        where: { id: delivery.orderId as number },
        data: { status: StatusOrder.SHIPPED },
      });

      return delivery;
    });

    if (!delivery)
      return {
        success: false,
        error: logs.error.create.delivery + ", veuillez réesseyer",
      };

    return { success: true, delivery };
  } catch (error) {
    console.error("Create delivery error : ", error);
    return {
      success: false,
      error: logs.error.create.delivery,
    };
  }
}

async function readInvoicesUser(
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

// async function readDeliveries(
//   paymentType: PaymentType | "ALL" = "ALL",
//   status: StatusOrder | "ALL" = "ALL",
//   searchQuery?: string,
//   sortBy: string = "newest",
//   page: number = 1,
//   limit: number = 10,
// ): Promise<{
//   success: boolean;
//   orders?: Order[];
//   total?: number;
//   error?: string;
// }> {
//   try {
//     const skip = (page - 1) * limit;
//     const take = page * limit;

//     const select: Prisma.OrderSelect = {
//       id: true,
//       orderNumber: true,
//       cart: {
//         select: {
//           userId: true,
//           user: { select: { firstName: true, lastName: true } },
//           // _count: { select: { cartItems: true } },
//         },
//       },
//       totalAmount: true,
//       status: true,
//       // shippingType: true,
//       // trackingNumber: true,
//       // delivery: true,
//       createdAt: true,
//     };

//     const where: Prisma.OrderWhereInput = {
//       paymentType:
//         paymentType !== "ALL"
//           ? paymentType
//           : {
//               in: Object.keys(PaymentType) as PaymentType[],
//             },
//       status:
//         status !== "ALL"
//           ? status
//           : {
//               in: Object.keys(STATUS_ORDER) as StatusOrder[],
//             },
//       OR: [
//         {
//           trackingNumber: {
//             contains: searchQuery,
//             mode: "insensitive",
//           },
//         },
//         {
//           orderNumber: {
//             contains: searchQuery,
//             mode: "insensitive",
//           },
//         },
//       ],
//     };

//     let orderBy: Prisma.OrderOrderByWithRelationInput;

//     switch (sortBy) {
//       case "name-asc":
//         orderBy = {
//           orderNumber: "asc",
//         };
//         break;
//       case "name-desc":
//         orderBy = {
//           orderNumber: "desc",
//         };
//         break;
//       case "newest":
//         orderBy = {
//           createdAt: "desc",
//         };
//         break;
//       default:
//         orderBy = {
//           createdAt: "asc",
//         };
//         break;
//     }

//     const [orders, total] = await prisma.$transaction([
//       prisma.order.findMany({
//         select,
//         skip,
//         take,
//         where,
//         orderBy,
//       }),
//       prisma.order.count({
//         where,
//         orderBy,
//       }),
//     ]);

//     return { success: true, orders, total };
//   } catch (error) {
//     console.error("Read orders error : ", error);
//     return {
//       success: false,
//       error: logs.error.read.orders,
//     };
//   }
// }

// async function readInvoice(id: number): Promise<{
//   success: boolean;
//   invoice?: Invoice;
//   error?: string;
// }> {
//   try {
//     const order = await prisma.order.findUnique({
//       include: {
//         cart: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//                 phone: true,
//               },
//             },
//             cartItems: { include: { product: true } },
//           },
//         },
//         delivery: {
//           include: {
//             deliveryPerson: {
//               include: {
//                 user: {
//                   select: {
//                     firstName: true,
//                     lastName: true,
//                     email: true,
//                     phone: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//       where: { id },
//     });

//     return { success: true, order: order as Order };
//   } catch (error) {
//     console.error("Read order error : ", error);
//     return {
//       success: false,
//       error: logs.error.read.order,
//     };
//   }
// }

// async function updateOrder(
//   id: number,
//   data: Prisma.OrderUpdateInput,
// ): Promise<{
//   success: boolean;
//   order?: Order;
//   error?: string;
// }> {
//   try {
//     const order = await prisma.order.update({ where: { id }, data });

//     if (!order)
//       return {
//         success: false,
//         error: logs.error.update.order + ", veuillez réesseyer",
//       };

//     return { success: true, order };
//   } catch (error) {
//     console.error("Update order error : ", error);
//     return {
//       success: false,
//       error: logs.error.update.order,
//     };
//   }
// }

// async function deleteOrder(id: number): Promise<{
//   success: boolean;
//   order?: Order;
//   error?: string;
// }> {
//   try {
//     const order = await prisma.order.delete({
//       include: { cart: { include: { cartItems: true } } },
//       where: { id },
//     });

//     if (!order)
//       return {
//         success: false,
//         error: logs.error.delete.order + ", veuillez réesseyer",
//       };

//     return { success: true, order };
//   } catch (error) {
//     console.error("Delete order error : ", error);
//     return {
//       success: false,
//       error: logs.error.delete.order,
//     };
//   }
// }

export {
  createDelivery,
};
