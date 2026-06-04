import {
    AccountLedger,
    EntryType,
    Prisma
} from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";

// async function createTransaction({
//   userId,
//   invoiceId,
//   amount,
//   method,
//   type,
//   reference,
// }: {
//   userId: number;
//   invoiceId: number;
//   amount: string;
//   method: PaymentMethod;
//   type: TransactionType;
//   reference: string;
// }): Promise<{
//   success: boolean;
//   transaction?: Transaction;
//   error?: string;
// }> {
//   try {
//     const igt = new Igt();

//     const newTransaction: Prisma.TransactionCreateManyInput = {
//       transactionNumber: igt.generateNumber(
//         "TRS",
//         invoiceId + Math.floor(Math.random() * 9000) + 100,
//       ),
//       userId,
//       invoiceId,
//       amount: parseFloat(amount),
//       method,
//       type,
//       reference,
//       trackingNumber: igt.generateCode(
//         invoiceId + Math.floor(Math.random() * 9000) + 100,
//         "TRS",
//       ),
//     };

//     const transaction = await prisma.$transaction(async (tx) => {
//       const transaction = await tx.transaction.create({
//         include: { invoice: { select: { id: true, orderId: true } } },
//         data: newTransaction,
//       });

//       if (!transaction) return transaction;

//       const order = await tx.order.update({
//         where: { id: transaction.invoice?.orderId as number },
//         data: { status: StatusOrder.IN_PREPARATION },
//       });

//       const newAccountLedger: Prisma.AccountLedgerUncheckedCreateInput = {
//         wording: "",
//         entryType: EntryType.CREDIT,
//         description: "",
//         balance: order.totalAmount,
//         transactionId: transaction.id,
//       };

//       await tx.accountLedger.create({ data: newAccountLedger });

//       return transaction;
//     });

//     if (!transaction)
//       return {
//         success: false,
//         error: logs.error.create.transaction + ", veuillez réesseyer",
//       };

//     return { success: true, transaction };
//   } catch (error) {
//     console.error("Create transaction error : ", error);
//     return {
//       success: false,
//       error: logs.error.create.transaction,
//     };
//   }
// }

async function readAccountLedgers(
  entryType: EntryType | "ALL" = "ALL",
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  accountLedgers?: AccountLedger[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.AccountLedgerSelect = {
      id: true,
      wording: true,
      transaction: true,
      entryType: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    };

    const where: Prisma.AccountLedgerWhereInput = {
      entryType:
        entryType !== "ALL"
          ? entryType
          : {
              in: Object.keys(EntryType) as EntryType[],
            },
      OR: [
        {
          wording: {
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
    };

    let orderBy: Prisma.AccountLedgerOrderByWithRelationInput;

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

    const [accountLedgers, total] = await prisma.$transaction([
      prisma.accountLedger.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.accountLedger.count({
        where,
        orderBy,
      }),
    ]);

    return { success: true, accountLedgers, total };
  } catch (error) {
    console.error("Read accountLedgers error : ", error);
    return {
      success: false,
      error: logs.error.read.accountLedgers,
    };
  }
}

async function readAccountLedger(id: number): Promise<{
  success: boolean;
  accountLedger?: AccountLedger;
  error?: string;
}> {
  try {
    const accountLedger = await prisma.accountLedger.findUnique({
      include: {
        transaction: {
          include: {
            invoice: true,
          },
        },
      },
      where: { id },
    });

    return { success: true, accountLedger: accountLedger as AccountLedger };
  } catch (error) {
    console.error("Read accountLedger error : ", error);
    return {
      success: false,
      error: logs.error.read.accountLedger,
    };
  }
}

async function updateAccountLedger(
  id: number,
  data: Prisma.AccountLedgerUpdateInput,
): Promise<{
  success: boolean;
  accountLedger?: AccountLedger;
  error?: string;
}> {
  try {
    const accountLedger = await prisma.accountLedger.update({
      where: { id },
      data,
    });

    if (!accountLedger)
      return {
        success: false,
        error: logs.error.update.accountLedger + ", veuillez réesseyer",
      };

    return { success: true, accountLedger };
  } catch (error) {
    console.error("Update accountLedger error : ", error);
    return {
      success: false,
      error: logs.error.update.accountLedger,
    };
  }
}

async function deleteAccountLedger(id: number): Promise<{
  success: boolean;
  accountLedger?: AccountLedger;
  error?: string;
}> {
  try {
    const accountLedger = await prisma.accountLedger.delete({
      where: { id },
    });

    if (!accountLedger)
      return {
        success: false,
        error: logs.error.delete.accountLedger + ", veuillez réesseyer",
      };

    return { success: true, accountLedger };
  } catch (error) {
    console.error("Delete accountLedger error : ", error);
    return {
      success: false,
      error: logs.error.delete.accountLedger,
    };
  }
}

export {
    deleteAccountLedger,
    readAccountLedger,
    readAccountLedgers,
    updateAccountLedger
};

