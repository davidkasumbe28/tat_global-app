import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";
import {
  PaymentMethod,
  PaymentType,
  StatusOrder,
  StatusTransaction,
  TransactionType,
} from "@/lib/generated/prisma/enums";

async function handleCreateTransaction(formData: {
  userId: number;
  invoiceId: number;
  amount: number;
  method: PaymentMethod;
  type: TransactionType;
  reference: string;
}) {
  try {
    const res = await api.post(API.private.transactions, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadUserTransactions(
  page: string,
  limit: string,
  status: StatusTransaction | "ALL" = "ALL",
  search: string = "",
  sort: string = "newest",
) {
  try {
    const res = await api.get(
      API.private.myTransactions +
        "?" +
        "page=" +
        page +
        "&limit=" +
        limit +
        "&status=" +
        status +
        "&search=" +
        search +
        "&sort=" +
        sort,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadUserTransaction(id: number) {
  try {
    const res = await api.get(API.private.myTransactions + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadTransactions(
  page?: string,
  limit?: string,
  type?: TransactionType | "ALL",
  status?: StatusTransaction | "ALL",
  search?: string,
  sort?: string,
) {
  try {
    const res = await api.get(
      API.private.transactions +
        "?page=" +
        page +
        "&limit=" +
        limit +
        "&type=" +
        type +
        "&status=" +
        status +
        "&search=" +
        search +
        "&sort=" +
        sort,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadTransaction(id: number) {
  try {
    const res = await api.get(API.private.transactions + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateTransaction(
  id: number,
  formData: Record<string, any>,
) {
  try {
    const res = await api.patch(API.private.transactions + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleDeleteTransaction(id: number) {
  try {
    const res = await api.delete(API.private.transactions + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadTransactionsSummary() {
  try {
    const res = await api.get(API.private.transactions + "/summary");
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}


export {
  handleCreateTransaction,
  handleReadUserTransactions,
  handleReadUserTransaction,
  handleReadTransactions,
  handleReadTransaction,
  handleUpdateTransaction,
  handleDeleteTransaction,
  handleReadTransactionsSummary,
};
