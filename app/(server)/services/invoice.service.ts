import { SHIPPING, TAX } from "@/lib/constants/constants";
import {
  EntryType,
  Invoice,
  Prisma,
  StatusInvoice,
  StatusOrder,
  TransactionType,
} from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";
import Igt from "@/modules/class/igt/Igt";

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
        reference: "REF" + Date.now(),
        trackingNumber: igt.generateCode(invoice.id, "TRS"),
      };

      const newAccountLedger: Prisma.AccountLedgerCreateInput = {
        wording: igt.generateNumber("USR", userId as number),
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
      status: true,
      order: {
        select: {
          id: true,
          totalAmount: true,
          cart: { select: { _count: { select: { cartItems: true } } } },
        },
        where: { userId },
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
      userId,
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

async function readInvoiceUser(id: number): Promise<{
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
        transactions: {
          select: { id: true, transactionNumber: true },
          where: {
            type: { notIn: [TransactionType.SALE, TransactionType.ADJUSTMENT] },
          },
        },
      },
      where: { id },
    });

    return { success: true, invoice: invoice as Invoice };
  } catch (error) {
    console.error("Read invoice user error : ", error);
    return {
      success: false,
      error: logs.error.read.invoice,
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
        transactions: {
          select: { id: true, transactionNumber: true },
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

async function readInvoicesSelect(
  status: StatusInvoice | "ALL" = "ALL",
  sortBy: string = "newest",
): Promise<{
  success: boolean;
  invoices?: Invoice[];
  error?: string;
}> {
  try {
    const select: Prisma.InvoiceSelect = {
      id: true,
      invoiceNumber: true,
      userId : true,
      status: true,
      shippingAmount: true,
    };

    const where: Prisma.InvoiceWhereInput = {
      status:
        status !== "ALL"
          ? status
          : {
              in: Object.keys(StatusInvoice) as StatusInvoice[],
            },
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

    const invoices = await prisma.invoice.findMany({
      select,
      where,
      orderBy,
    });

    return { success: true, invoices };
  } catch (error) {
    console.error("Read invoices select error:", error);
    return {
      success: false,
      error: logs.error.read.invoices,
    };
  }
}

export {
  createInvoice,
  deleteInvoice,
  readInvoice,
  readInvoices,
  readInvoicesUser,
  readInvoiceUser,
  updateInvoice,
  readInvoicesSelect,
};
