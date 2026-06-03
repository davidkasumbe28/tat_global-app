import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";

async function handleCreateDelivery(formData: {
  deliveryPersonId: number;
  userId: number;
  orderId: number;
}) {
  try {
    const res = await api.post(API.private.deliveries, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// async function handleGetDeliveries() {
//   try {
//     const res = await api.get("/deliveries");
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetDelivery(delivery: number) {
//   try {
//     const res = await api.get("/deliveries/" + delivery);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetDeliveriesDeliveryPerson(deliveryPersonId: number) {
//   try {
//     const res = await api.get("/deliveries/deliveryPerson/" + deliveryPersonId);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

export {
  handleCreateDelivery,
  //   handleGetDeliveries,
  //   handleGetDeliveriesDeliveryPerson,
  //   handleGetDelivery,
};
