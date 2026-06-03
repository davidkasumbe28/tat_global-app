import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";
import {
  PaymentMethod,
  PaymentType,
  StatusOrder,
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

async function handleReadUserOrders(
  page: string,
  limit: string,
  status: StatusOrder | "ALL" = "ALL",
  search: string = "",
  sort: string = "newest",
) {
  try {
    const res = await api.get(
      API.private.myOrders +
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

async function handleReadUserOrder(id: number) {
  try {
    const res = await api.get(API.private.myOrders + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadOrders(
  page?: string,
  limit?: string,
  paymentType?: PaymentType | "ALL",
  status?: StatusOrder | "ALL",
  search?: string,
  sort?: string,
) {
  try {
    const res = await api.get(
      API.private.orders +
        "?page=" +
        page +
        "&limit=" +
        limit +
        "&paymentType=" +
        paymentType +
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

async function handleReadOrder(id: number) {
  try {
    const res = await api.get(API.private.orders + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateUserOrder(
  id: number,
  formData: { status: StatusOrder },
) {
  try {
    const res = await api.patch(API.private.myOrders + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateOrder(id: number, formData: Record<string, any>) {
  try {
    const res = await api.patch(API.private.orders + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleDeleteUserOrder(id: number) {
  try {
    const res = await api.delete(API.private.myOrders + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleDeleteOrder(id: number) {
  try {
    const res = await api.delete(API.private.orders + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

export {
  handleCreateTransaction,
  // handleReadUserOrders,
  // handleReadUserOrder,
  // handleUpdateUserOrder,
  // handleDeleteUserOrder,
  // handleReadOrders,
  // handleReadOrder,
  // handleUpdateOrder,
  // handleDeleteOrder,
};
