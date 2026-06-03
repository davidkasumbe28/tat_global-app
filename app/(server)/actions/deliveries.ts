// "use server";

// import type { Delivery } from "@/lib/@types/types";
// import db from "@/lib/db/db";

// export async function getDeliveriesAction(): Promise<{
//   success: boolean;
//   deliveries?: Delivery[];
//   error?: string;
// }> {
//   try {
//     const data: Delivery[] = await db.get("/deliveries");

//     if (!data || data.length === 0) {
//       return { success: false, error: "Aucune livraison trouvée" };
//     }

//     return { success: true, deliveries: data };
//   } catch (error) {
//     console.error("Get deliveries error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des livraisons",
//     };
//   }
// }

// export async function getDeliveriesDeliveryPersonAction(
//   deliveryPersonId: number,
// ): Promise<{
//   success: boolean;
//   deliveries?: Delivery[];
//   error?: string;
// }> {
//   try {
//     const data: Delivery[] = await db.get(
//       "/deliveries?_expand=order&deliveryPersonId=" + deliveryPersonId,
//     );

//     if (!data) return { success: false, error: "Aucune livraison trouvée" };

//     return { success: true, deliveries: data };
//   } catch (error) {
//     console.error("Get deliveries error", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des livraisons",
//     };
//   }
// }

// export async function getDeliveryByIdAction(
//   deliveryId: number,
// ): Promise<{ success: boolean; delivery?: Delivery; error?: string }> {
//   try {
//     const data: Delivery = await db.get(
//       "/deliveries/" + deliveryId + "?_expand=order",
//     );

//     if (!data) {
//       return { success: false, error: "Livraison non trouvée" };
//     }

//     return { success: true, delivery: data };
//   } catch (error) {
//     console.error("Get delivery error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération de la livraison",
//     };
//   }
// }

// export async function createDeliveryAction(
//   orderId: number,
//   deliveryPersonId: number,
//   status: "not_perform",
// ): Promise<{ success: boolean; delivery?: Delivery; error?: string }> {
//   try {
//     const newDelivery: Delivery = {
//       id: Date.now(),
//       orderId,
//       deliveryPersonId,
//       status,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const data: Delivery = await db.post("/deliveries", newDelivery);

//     if (!data) {
//       return {
//         success: false,
//         error: "Erreur lors de la création de la livraison",
//       };
//     }

//     return { success: true, delivery: data };
//   } catch (error) {
//     console.error("Create delivery error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la création de la livraison",
//     };
//   }
// }

// export async function updateDeliveryAction(
//   deliveryId: number,
//   delivery: Record<string, any>,
// ): Promise<{ success: boolean; status?: boolean; error?: string }> {
//   try {
//     const data = await db.patch("/deliveries/" + deliveryId, delivery);

//     if (!data) {
//       return {
//         success: false,
//         error: "Erreur lors de la mise à jour de la livraison",
//       };
//     }

//     return { success: true, status: true };
//   } catch (error) {
//     console.error("Update delivery error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la mise à jour de la livraison",
//     };
//   }
// }

// export async function updateOrderStatusAction(
//   orderId: number,
//   status: string,
// ): Promise<{ success: boolean; status?: boolean; error?: string }> {
//   try {
//     const validStatuses = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];
//     if (!validStatuses.includes(status)) {
//       return { success: false, error: "Statut invalide" };
//     }

//     const data = await db.patch("/orders/" + orderId, {
//       status: status,
//       updatedAt: new Date(),
//     });

//     if (!data) {
//       return {
//         success: false,
//         error: "Erreur lors de la mise à jour de la commande",
//       };
//     }

//     return { success: true, status: true };
//   } catch (error) {
//     console.error("Update order error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la mise à jour de la commande",
//     };
//   }
// }
