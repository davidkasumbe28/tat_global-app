import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";

async function handleCreateReview(formData: {
  productId: number;
  rating: String;
  comment?: string;
}) {
  try {
    const res = await api.post(API.private.reviews, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadReviews() {
  try {
    const res = await api.get(API.private.reviews);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadReview(id: number) {
  try {
    const res = await api.get(API.private.reviews + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateReview(id: number, formData: Record<string, any>) {
  try {
    const res = await api.patch(API.private.reviews + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

export {
  handleCreateReview,
  handleReadReviews,
  handleReadReview,
  handleUpdateReview,
};
