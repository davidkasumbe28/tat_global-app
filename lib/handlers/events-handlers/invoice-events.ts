import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";
import {
  PaymentMethod,
  PaymentType,
  StatusInvoice,
  StatusOrder,
} from "@/lib/generated/prisma/enums";

async function handleCreateInvoice(formData: {
  userId: number;
  orderId: number;
  notes?: string;
}) {
  try {
    const res = await api.post(API.private.invoices, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadUserInvoices(
  page: string,
  limit: string,
  status: StatusOrder | "ALL" = "ALL",
  search: string = "",
  sort: string = "newest",
) {
  try {
    const res = await api.get(
      API.private.myInvoices +
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

async function handleReadUserInvoice(id: number) {
  try {
    const res = await api.get(API.private.myInvoices + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadInvoices(
  page?: string,
  limit?: string,
  status?: StatusInvoice | "ALL",
  search?: string,
  sort?: string,
) {
  try {
    const res = await api.get(
      API.private.invoices +
        "?page=" +
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

async function handleReadInvoice(id: number) {
  try {
    const res = await api.get(API.private.invoices + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateUserInvoice(
  id: number,
  formData: { status: StatusOrder },
) {
  try {
    const res = await api.patch(API.private.myInvoices + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateInvoice(id: number, formData: Record<string, any>) {
  try {
    const res = await api.patch(API.private.invoices + "/" + id, formData);
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
  handleCreateInvoice,
  handleReadUserInvoices,
  handleReadUserInvoice,
  handleUpdateUserInvoice,
  // handleDeleteUserOrder,
  handleReadInvoices,
  handleReadInvoice,
  handleUpdateInvoice,
  // handleDeleteOrder,
};
