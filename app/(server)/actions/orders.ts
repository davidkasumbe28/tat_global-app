// "use server";

// import type { Order } from "@/lib/@types/types";
// import db from "@/lib/db/db";

// export async function getOrdersAction(): Promise<{
//   success: boolean;
//   orders?: Order[];
//   error?: string;
// }> {
//   try {
//     const data: Order[] = await db.get("/orders");

//     if (!data || data.length === 0) {
//       return { success: false, error: "Aucune commande trouvée" };
//     }

//     return { success: true, orders: data };
//   } catch (error) {
//     console.error("Get orders error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des commandes",
//     };
//   }
// }

// export async function getOrderByIdAction(
//   orderId: number,
// ): Promise<{ success: boolean; order?: Order; error?: string }> {
//   try {
//     const data: Order = await db.get("/orders/" + orderId);

//     if (!data) {
//       return { success: false, error: "Commande non trouvée" };
//     }

//     return { success: true, order: data };
//   } catch (error) {
//     console.error("Get order error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération de la commande",
//     };
//   }
// }

// export async function createOrderAction(
//   cartId: number,
//   userId: number,
//   items: number,
//   totalAmount: number,
//   shippingAddress: {
//     address: string;
//     city: string;
//     zipCode: string;
//     country: string;
//   },
//   shippingMethod: "standard" | "express" | "overnight",
//   trackingNumber: string,
//   paymentMethod: string,
// ): Promise<{ success: boolean; order?: Order; error?: string }> {
//   try {
//     const newOrder: Order = {
//       id: Date.now(),
//       cartId,
//       userId,
//       items,
//       totalAmount,
//       status: "pending",
//       shippingAddress,
//       shippingMethod,
//       trackingNumber,
//       paymentMethod,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const data: Order = await db.post("/orders", newOrder);

//     if (!data) {
//       return {
//         success: false,
//         error: "Erreur lors de la création de la commande",
//       };
//     }

//     return { success: true, order: data };
//   } catch (error) {
//     console.error("Create order error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la création de la commande",
//     };
//   }
// }

// export async function updateOrderAction(
//   orderId: number,
//   order: Record<string, any>,
// ): Promise<{ success: boolean; status?: boolean; error?: string }> {
//   try {
//     const data = await db.patch("/orders/" + orderId, order);

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
