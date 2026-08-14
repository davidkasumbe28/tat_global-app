import {
  EntryType,
  PaymentMethod,
  Prisma,
  StatusInvoice,
  StatusOrder,
  StatusTransaction,
  Transaction,
  TransactionType,
} from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";
import Igt from "@/modules/class/igt/Igt";

async function createTransaction({
  userId,
  invoiceId,
  amount,
  method,
  type,
  reference,
}: {
  userId: number;
  invoiceId: number;
  amount: string;
  method: PaymentMethod;
  type: TransactionType;
  reference: string;
}): Promise<{
  success: boolean;
  transaction?: Transaction;
  error?: string;
}> {
  try {
    const igt = new Igt();

    const newTransaction: Prisma.TransactionCreateManyInput = {
      transactionNumber: igt.generateNumber(
        "TRS",
        invoiceId + Math.floor(Math.random() * 9000) + 100,
      ),
      userId,
      invoiceId,
      amount: parseFloat(amount),
      method,
      status: StatusTransaction.COMPLETED,
      type,
      reference,
      trackingNumber: igt.generateCode(
        invoiceId + Math.floor(Math.random() * 9000) + 100,
        "TRS",
      ),
    };

    const transaction = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        include: { invoice: { select: { id: true, orderId: true } } },
        data: newTransaction,
      });

      if (!transaction) return transaction;

      const order = await tx.order.update({
        where: { id: transaction.invoice?.orderId as number },
        data: { status: StatusOrder.IN_PREPARATION },
      });

      const lastEntry = await tx.accountLedger.findFirst({
        where: {
          entryType: EntryType.CREDIT,
          transaction: { invoiceId: transaction.invoice?.id },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          balance: true,
        },
      });

      const balance = parseFloat(lastEntry?.balance?.toString() ?? "0");

      const totalDebit = await tx.accountLedger.aggregate({
        where: {
          entryType: EntryType.DEBIT,
          transaction: { invoiceId: transaction.invoice?.id },
        },
        _sum: {
          balance: true,
        },
      });

      const balanceInvoice =
        balance +
        transaction.amount -
        parseFloat(totalDebit._sum.balance?.toString() ?? "0");

      const newAccountLedger: Prisma.AccountLedgerUncheckedCreateInput = {
        wording: igt.generateNumber("USR", userId as number),
        entryType: EntryType.CREDIT,
        description: "",
        balance: balance + transaction.amount,
        transactionId: transaction.id,
      };

      if (balanceInvoice == 0) {
        await tx.transaction.updateMany({
          where: { invoiceId: transaction.invoice?.id },
          data: {
            status: StatusTransaction.COMPLETED,
          },
        });
        await tx.invoice.update({
          where: { id: transaction.invoice?.id },
          data: {
            status: StatusInvoice.PAID,
          },
        });
      } else if (balanceInvoice < 0) {
        await tx.invoice.update({
          where: { id: transaction.invoice?.id },
          data: {
            status: StatusInvoice.OVERDUE,
          },
        });
      }

      await tx.accountLedger.create({ data: newAccountLedger });

      return transaction;
    });

    if (!transaction)
      return {
        success: false,
        error: logs.error.create.transaction + ", veuillez réesseyer",
      };

    return { success: true, transaction };
  } catch (error) {
    console.error("Create transaction error : ", error);
    return {
      success: false,
      error: logs.error.create.transaction,
    };
  }
}

async function readTransactionsUser(
  userId: number,
  status: StatusTransaction | "ALL" = "ALL",
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  transactions?: Transaction[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.TransactionSelect = {
      id: true,
      transactionNumber: true,
      amount: true,
      method: true,
      status: true,
      type: true,
      reference: true,
      createdAt: true,
    };

    const where: Prisma.TransactionWhereInput = {
      status:
        status !== "ALL"
          ? status
          : {
              in: Object.keys(StatusTransaction) as StatusTransaction[],
            },

      transactionNumber: {
        contains: searchQuery,
        mode: "insensitive",
      },
      type: { notIn: [TransactionType.SALE, TransactionType.ADJUSTMENT] },
      userId,
    };

    let orderBy: Prisma.TransactionOrderByWithRelationInput;

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

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.transaction.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, transactions, total };
  } catch (error) {
    console.error("Read transactions user error : ", error);
    return {
      success: false,
      error: logs.error.read.orders,
    };
  }
}

async function readTransactions(
  transactionType: TransactionType | "ALL" = "ALL",
  status: StatusTransaction | "ALL" = "ALL",
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  transactions?: Transaction[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.TransactionSelect = {
      id: true,
      transactionNumber: true,
      amount: true,
      method: true,
      status: true,
      type: true,
      reference: true,
      trackingNumber: true,
      createdAt: true,
    };

    const where: Prisma.TransactionWhereInput = {
      type:
        transactionType !== "ALL"
          ? transactionType
          : {
              in: Object.keys(TransactionType) as TransactionType[],
            },
      status:
        status !== "ALL"
          ? status
          : {
              in: Object.keys(StatusTransaction) as StatusTransaction[],
            },
      OR: [
        {
          trackingNumber: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          transactionNumber: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    };

    let orderBy: Prisma.TransactionOrderByWithRelationInput;

    switch (sortBy) {
      case "name-asc":
        orderBy = {
          transactionNumber: "asc",
        };
        break;
      case "name-desc":
        orderBy = {
          transactionNumber: "desc",
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

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.transaction.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, transactions, total };
  } catch (error) {
    console.error("Read transactions error : ", error);
    return {
      success: false,
      error: logs.error.read.transactions,
    };
  }
}

async function readTransactionUser(id: number): Promise<{
  success: boolean;
  transaction?: Transaction;
  error?: string;
}> {
  try {
    const transaction = await prisma.transaction.findUnique({
      include: {
        invoice: true,
      },
      where: { id },
    });

    return { success: true, transaction: transaction as Transaction };
  } catch (error) {
    console.error("Read transaction user error : ", error);
    return {
      success: false,
      error: logs.error.read.transaction,
    };
  }
}

async function readTransaction(id: number): Promise<{
  success: boolean;
  transaction?: Transaction;
  error?: string;
}> {
  try {
    const transaction = await prisma.transaction.findUnique({
      include: {
        invoice: true,
        accountLedgers: true,
        user: true,
      },
      where: { id },
    });

    return { success: true, transaction: transaction as Transaction };
  } catch (error) {
    console.error("Read transaction error : ", error);
    return {
      success: false,
      error: logs.error.read.transaction,
    };
  }
}

async function updateTransaction(
  id: number,
  data: Prisma.TransactionUpdateInput,
): Promise<{
  success: boolean;
  transaction?: Transaction;
  error?: string;
}> {
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data,
    });

    if (!transaction)
      return {
        success: false,
        error: logs.error.update.transaction + ", veuillez réesseyer",
      };

    return { success: true, transaction };
  } catch (error) {
    console.error("Update transaction error : ", error);
    return {
      success: false,
      error: logs.error.update.transaction,
    };
  }
}

async function deleteTransaction(id: number): Promise<{
  success: boolean;
  transaction?: Transaction;
  error?: string;
}> {
  try {
    const transaction = await prisma.transaction.delete({
      where: { id },
    });

    if (!transaction)
      return {
        success: false,
        error: logs.error.delete.transaction + ", veuillez réesseyer",
      };

    return { success: true, transaction };
  } catch (error) {
    console.error("Delete transaction error : ", error);
    return {
      success: false,
      error: logs.error.delete.transaction,
    };
  }
}

async function readTransactionsSummary(): Promise<{
  success: boolean;
  summary?: {
    totalTransactions: number;
    totalReceipt: number;
    completedTransactions: number;
    pendingTransactions: number;
    failedTransactions: number;
    refundedTransactions: number;
    saleTransactions: number;
    receiptTransactions: number;
    refundTransactions: number;
    adjustmentTransactions: number;
  };
  error?: string;
}> {
  try {
    const select: Prisma.TransactionSelect = {
      id: true,
      transactionNumber: true,
      amount: true,
      method: true,
      status: true,
      type: true,
      reference: true,
      trackingNumber: true,
      createdAt: true,
    };

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({ select }),
      prisma.transaction.count(),
    ]);

    const summary = {
      totalTransactions: total,
      totalReceipt: transactions
        .filter(
          (t) =>
            t.status === StatusTransaction.COMPLETED &&
            t.type === TransactionType.RECEIPT,
        )
        .reduce((sum, t) => sum + t.amount, 0),
      completedTransactions: transactions.filter(
        (t) => t.status === StatusTransaction.COMPLETED,
      ).length,
      pendingTransactions: transactions.filter(
        (t) => t.status === StatusTransaction.PENDING,
      ).length,
      failedTransactions: transactions.filter(
        (t) => t.status === StatusTransaction.FAILED,
      ).length,
      refundedTransactions: transactions.filter(
        (t) => t.status === StatusTransaction.REFUNDED,
      ).length,
      saleTransactions: transactions.filter(
        (t) => t.type === TransactionType.SALE,
      ).length,
      receiptTransactions: transactions.filter(
        (t) => t.type === TransactionType.RECEIPT,
      ).length,
      refundTransactions: transactions.filter(
        (t) => t.type === TransactionType.REFUND,
      ).length,
      adjustmentTransactions: transactions.filter(
        (t) => t.type === TransactionType.ADJUSTMENT,
      ).length,
    };

    return { success: true, summary };
  } catch (error) {
    console.error("Read transactions summary error : ", error);
    return {
      success: false,
      error: logs.error.read.transactions,
    };
  }
}

export {
  createTransaction,
  deleteTransaction,
  readTransaction,
  readTransactions,
  readTransactionsUser,
  readTransactionUser,
  updateTransaction,
  readTransactionsSummary,
};
