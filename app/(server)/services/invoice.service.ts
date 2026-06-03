import { SHIPPING, STATUS_ORDER, TAX } from "@/lib/constants/constants";
import {
  Cart,
  EntryType,
  Invoice,
  Order,
  PaymentMethod,
  PaymentType,
  Prisma,
  StateCart,
  StatusInvoice,
  StatusOrder,
  TransactionType,
} from "@/lib/generated/prisma/client";
import { OrderInclude } from "@/lib/generated/prisma/models";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";
import Igt from "@/modules/class/igt/Igt";
import { order } from "./../../../lib/data/raw/order";
import shipping from "./../../../lib/data/raw/shipping";
import Invoices from "./../../../components/account/content/invoices";

async function createInvoice({
  userId,
  orderId,
  notes,
}: {
  userId: number;
  orderId: number;
  notes?: string;
}): Promise<{
  success: boolean;
  invoice?: {
    id: number;
    invoiceNumber: string;
    user: {
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
    } | null;
    orderId: number;
    order: {
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
      orderNumber: string;
      totalAmount: number;
    } | null;
    shippingAmount: number;
    taxAmount: number;
  };
  error?: string;
}> {
  try {
    const igt = new Igt();

    const newInvoice: Prisma.InvoiceCreateManyInput = {
      invoiceNumber: igt.generateNumber("INV", orderId),
      userId,
      orderId,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
      // totalAmount,
      shippingAmount: SHIPPING,
      taxAmount: TAX,
      status: StatusInvoice.ISSUED,
      notes,
      trackingNumber: igt.generateCode(orderId, "INV"),
    };

    const select = {
      id: true,
      invoiceNumber: true,
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      orderId: true,
      order: {
        select: {
          totalAmount: true,
          orderNumber: true,
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
        },
      },
      // totalAmount: true,
      shippingAmount: true,
      taxAmount: true,
    };

    const invoice = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({ select, data: newInvoice });

      if (!invoice) return invoice;

      const order = await tx.order.update({
        where: { id: invoice.orderId as number },
        data: { status: StatusOrder.CONFIRMED },
      });

      if (!order) return invoice;

      const newTransaction: Prisma.TransactionCreateManyInput = {
        transactionNumber: igt.generateNumber("TRS", invoice.id),
        userId,
        invoiceId: invoice.id,
        amount: order.totalAmount,
        method: order.paymentMethod,
        status: "PENDING",
        type: TransactionType.SALE,
        reference: `Emission de la facture ${invoice.id}`,
        trackingNumber: igt.generateCode(invoice.id, "TRS"),
      };

      const newAccountLedger: Prisma.AccountLedgerCreateInput = {
        wording: "",
        entryType: EntryType.DEBIT,
        description: "",
        balance: order.totalAmount,
        transaction: { create: newTransaction },
      };

      await tx.accountLedger.create({ data: newAccountLedger });

      return invoice;
    });

    if (!invoice)
      return {
        success: false,
        error: logs.error.create.invoice + ", veuillez réesseyer",
      };

    return { success: true, invoice };
  } catch (error) {
    console.error("Create invoice error : ", error);
    return {
      success: false,
      error: logs.error.create.invoice,
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

async function readInvoices(
  status: StatusInvoice | "ALL" = "ALL",
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  invoices?: Invoice[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.InvoiceSelect = {
      id: true,
      invoiceNumber: true,
      user: {
        select: { email: true, firstName: true, lastName: true },
      },
      status: true,
      order: {
        select: {
          id: true,
          totalAmount: true,
        },
      },
      issueDate: true,
      dueDate: true,
      shippingAmount: true,
      taxAmount: true,
      createdAt: true,
    };

    const where: Prisma.InvoiceWhereInput = {
      status:
        status !== "ALL"
          ? status
          : {
              in: Object.keys(StatusInvoice) as StatusInvoice[],
            },
      OR: [
        {
          trackingNumber: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          invoiceNumber: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    };

    let orderBy: Prisma.InvoiceOrderByWithRelationInput;

    switch (sortBy) {
      case "name-asc":
        orderBy = {
          invoiceNumber: "asc",
        };
        break;
      case "name-desc":
        orderBy = {
          invoiceNumber: "desc",
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

    const [invoices, total] = await prisma.$transaction([
      prisma.invoice.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.invoice.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, invoices, total };
  } catch (error) {
    console.error("Read invoices error : ", error);
    return {
      success: false,
      error: logs.error.read.invoices,
    };
  }
}

async function readInvoice(id: number): Promise<{
  success: boolean;
  invoice?: Invoice;
  error?: string;
}> {
  try {
    const invoice = await prisma.invoice.findUnique({
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            trackingNumber: true,
            totalAmount: true,
            cart: {
              select: {
                cartItems: {
                  select: {
                    quantity: true,
                    product: {
                      select: { name: true, sku: true, price: true },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            address: true,
            city: true,
            country: true,
          },
        },
      },
      where: { id },
    });

    return { success: true, invoice: invoice as Invoice };
  } catch (error) {
    console.error("Read invoice error : ", error);
    return {
      success: false,
      error: logs.error.read.invoice,
    };
  }
}

async function updateInvoice(
  id: number,
  data: Prisma.InvoiceUpdateInput,
): Promise<{
  success: boolean;
  invoice?: Invoice;
  error?: string;
}> {
  try {
    const invoice = await prisma.invoice.update({ where: { id }, data });

    if (!invoice)
      return {
        success: false,
        error: logs.error.update.invoice + ", veuillez réesseyer",
      };

    return { success: true, invoice };
  } catch (error) {
    console.error("Update invoice error : ", error);
    return {
      success: false,
      error: logs.error.update.invoice,
    };
  }
}

async function deleteInvoice(id: number): Promise<{
  success: boolean;
  invoice?: Invoice;
  error?: string;
}> {
  try {
    const invoice = await prisma.invoice.delete({
      where: { id },
    });

    if (!invoice)
      return {
        success: false,
        error: logs.error.delete.invoice + ", veuillez réesseyer",
      };

    return { success: true, invoice };
  } catch (error) {
    console.error("Delete invoice error : ", error);
    return {
      success: false,
      error: logs.error.delete.invoice,
    };
  }
}

export {
  createInvoice,
  readInvoicesUser,
  readInvoices,
  readInvoice,
  updateInvoice,
  deleteInvoice
};
