// import type {
//   Collection,
//   Delivery,
//   Order,
//   Product,
//   User,
// } from "@/lib/@types/types";
// import { mockProducts } from "@/lib/data/mock/mock-data";
// import db from "@/lib/db/db";

// // Mock storage
// const adminProducts: Product[] = [...mockProducts];
// const adminOrders: Order[] = [];

// // ---------------------------------- stock manager collection action -----------------------------------------------

// export async function createStockManagerCollectionAction(
//   name: string,
//   category: string,
//   description: string,
//   image: string,
//   state: string,
//   color: string,
// ): Promise<{ success: boolean; collection?: Collection; error?: string }> {
//   try {
//     const newCollection: Collection = {
//       id: Date.now(),
//       name: name.trim(),
//       category,
//       description: description.trim(),
//       image,
//       state,
//       color,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const data: Collection = await db.post("/collections", newCollection);

//     if (!data) return { success: false, error: "Collection non enregistrer." };

//     return { success: true, collection: data };
//   } catch (error) {
//     console.error("Create stock Manager collection error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la création de la collection",
//     };
//   }
// }

// export async function getStockManagerCollectionsAction(
//   page = 1,
//   limit = 10,
// ): Promise<{
//   success: boolean;
//   collections?: Collection[];
//   total?: number;
//   error?: string;
// }> {
//   try {
//     const start = (page - 1) * limit;
//     const end = page * limit;

//     const data: Collection[] = await db.get(
//       "/collections?_embed=products" + "&_start=" + start + "&_end=" + end,
//     );

//     if (!data) return { success: false, error: "Aucune collection trouvée" };

//     const allData: Collection[] = await db.get("/collections");

//     if (!data) return { success: false, error: "Aucune collection trouvée" };

//     const total = allData.length;

//     return { success: true, collections: data, total: total };
//   } catch (error) {
//     console.error("Get stock manager collections error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des collections",
//     };
//   }
// }

// export async function getStockManagerCollectionByIdAction(
//   collectionId: number,
// ): Promise<{
//   success: boolean;
//   collection?: Collection;
//   error?: string;
// }> {
//   try {
//     const data: Collection = await db.get("/collections/" + collectionId);

//     if (!data) return { success: false, error: "Collection non trouvée" };

//     return { success: true, collection: data };
//   } catch (error) {
//     console.error("Get stock manager collection error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération de la collection",
//     };
//   }
// }

// export async function updateStockManagerCollectionAction(
//   id: number,
//   collection: Record<string, any>,
// ): Promise<{ success: boolean; state?: true; error?: string }> {
//   try {
//     if (collection?.description)
//       collection.description = collection?.description.trim();
//     if (collection?.name) collection.name = collection?.name?.trim();

//     const data: Collection = await db.patch("/collections/" + id, {
//       ...collection,
//       updatedAt: new Date(),
//     });

//     if (!data) return { success: false, error: "Collection non mise à jour" };

//     return { success: true, state: true };
//   } catch (error) {
//     console.error("Update stock manager collection error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la mise à jour de la collection",
//     };
//   }
// }

// // ---------------------------------- stock manager product action -----------------------------------------------

// export async function createStockManagerProductAction(
//   name: string,
//   sku: string,
//   category: string,
//   description: string,
//   features: string[],
//   price: number,
//   cost: number,
//   image: string,
//   stock: number,
//   rating: number,
//   state: string,
//   collectionId: number,
//   sizes?: string[],
//   colors?: string[],
// ): Promise<{ success: boolean; product?: Product; error?: string }> {
//   try {
//     const newProduct: Product = {
//       id: Date.now(),
//       name: name.trim(),
//       sku,
//       category,
//       description: description.trim(),
//       features,
//       price,
//       cost,
//       image,
//       sizes,
//       colors,
//       stock,
//       rating,
//       state,
//       collectionId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const data: Product = await db.post("/products", newProduct);

//     if (!data) return { success: false, error: "Produit non enregistrer" };

//     return { success: true, product: data };
//   } catch (error) {
//     console.error("Stock Manager Create product error:", error);
//     return { success: false, error: "Erreur lors de la création du produit" };
//   }
// }

// export async function getStockManagerProductsAction(
//   page = 1,
//   limit = 10,
// ): Promise<{
//   success: boolean;
//   products?: Product[];
//   total?: number;
//   error?: string;
// }> {
//   try {
//     const start = (page - 1) * limit;
//     const end = page * limit;

//     const data: Product[] = await db.get(
//       "/products?" + "_start=" + start + "&_end=" + end,
//     );

//     if (!data) return { success: false, error: "Aucun produit trouvé" };

//     const allData: Product[] = await db.get("/products");

//     if (!data) return { success: false, error: "Aucun produit trouvé" };

//     const total = allData.length;

//     return { success: true, products: data, total: total };
//   } catch (error) {
//     console.error("Get stock manager products error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des produits",
//     };
//   }
// }

// export async function getStockManagerProductByIdAction(
//   productId: number,
// ): Promise<{
//   success: boolean;
//   product?: Product;
//   error?: string;
// }> {
//   try {
//     const data: Product = await db.get("/products/" + productId);

//     if (!data) return { success: false, error: "Produit non trouvée" };

//     return { success: true, product: data };
//   } catch (error) {
//     console.error("Get stock manager product error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération du produit",
//     };
//   }
// }

// export async function updateStockManagerProductAction(
//   id: number,
//   product: Record<string, any>,
// ): Promise<{ success: boolean; state?: true; error?: string }> {
//   try {
//     if (product?.description) product.description = product?.description.trim();
//     if (product?.name) product.name = product?.name?.trim();

//     const data: Product = await db.patch("/products/" + id, {
//       ...product,
//       updatedAt: new Date(),
//     });

//     if (!data) return { success: false, error: "Produit non mise à jour" };

//     return { success: true, state: true };
//   } catch (error) {
//     console.error("Update stock manager product error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la mise à jour du produit",
//     };
//   }
// }

// export async function updateProductAction(
//   productId: number,
//   name?: string,
//   description?: string,
//   price?: number,
//   cost?: number,
//   stock?: number,
//   image?: string,
// ): Promise<{ success: boolean; product?: Product; error?: string }> {
//   try {
//     const product = adminProducts.find((p) => p.id === productId);
//     if (!product) {
//       return { success: false, error: "Produit non trouvé" };
//     }

//     if (name) product.name = name.trim();
//     if (description) product.description = description.trim();
//     if (price !== undefined) product.price = price;
//     if (cost !== undefined) product.cost = cost;
//     if (stock !== undefined) product.stock = stock;
//     if (image) product.image = image;

//     console.log("[v0] Product updated:", productId);

//     return { success: true, product };
//   } catch (error) {
//     console.error("[v0] Update product error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la mise à jour du produit",
//     };
//   }
// }

// export async function deleteProductAction(
//   productId: number,
// ): Promise<{ success: boolean; error?: string }> {
//   try {
//     const index = adminProducts.findIndex((p) => p.id === productId);
//     if (index === -1) {
//       return { success: false, error: "Produit non trouvé" };
//     }

//     adminProducts.splice(index, 1);
//     console.log("[v0] Product deleted:", productId);

//     return { success: true };
//   } catch (error) {
//     console.error("[v0] Delete product error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la suppression du produit",
//     };
//   }
// }

// // ---------------------------------- stock manager order action -----------------------------------------------

// export async function getStockManagerOrdersAction(
//   page = 1,
//   limit = 10,
// ): Promise<{
//   success: boolean;
//   orders?: Order[];
//   total?: number;
//   error?: string;
// }> {
//   try {
//     const start = (page - 1) * limit;
//     const end = page * limit;

//     const data: Order[] = await db.get(
//       "/orders?_expand=user" + "&_start=" + start + "&_end=" + end,
//     );

//     if (!data) return { success: false, error: "Aucune commande trouvée" };

//     const allData: Order[] = await db.get("/orders");

//     if (!data) return { success: false, error: "Aucune commande trouvée" };

//     const total = allData.length;

//     return { success: true, orders: data, total: total };
//   } catch (error) {
//     console.error("Get stock manager orders error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des commandes",
//     };
//   }
// }

// export async function getStockManagerOrderByIdAction(orderId: number): Promise<{
//   success: boolean;
//   order?: Order;
//   error?: string;
// }> {
//   try {
//     const data: Order = await db.get(
//       "/orders/" + orderId + "?_expand=user&_embed=deliveries",
//     );

//     if (!data) return { success: false, error: "Commande non trouvée" };

//     return { success: true, order: data };
//   } catch (error) {
//     console.error("Get stock manager order error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération de la commande",
//     };
//   }
// }

// export async function updateStockManagerOrderAction(
//   orderId: number,
//   order: Record<string, any>,
// ): Promise<{ success: boolean; state?: boolean; error?: string }> {
//   try {
//     const data: Order = await db.patch("/orders/" + orderId, order);

//     if (!data) return { success: false, error: "Commande non trouvée" };

//     return { success: true, state: true };
//   } catch (error) {
//     console.error("Update order error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la mise à jour de la commande",
//     };
//   }
// }

// // ---------------------------------- stock manager delivery person action -----------------------------------------------

// export async function getStockManagerDeliveryPersonAction(
//   page = 1,
//   limit = 10,
// ): Promise<{
//   success: boolean;
//   employees?: User[];
//   total?: number;
//   error?: string;
// }> {
//   try {
//     const start = (page - 1) * limit;
//     const end = page * limit;

//     const data: User[] = await db.get(
//       "/users?" + "role_ne=user&_start=" + start + "&_end=" + end,
//     );

//     const allData: User[] = await db.get("/users?" + "role_ne=user");

//     const total = allData.length;

//     return { success: true, employees: data, total: total };
//   } catch (error) {
//     console.error("Get admin employees error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des employés",
//     };
//   }
// }

// export async function getStockManagerDeliveryMenAction(): Promise<{
//   success: boolean;
//   deliveryMen?: User[];
//   error?: string;
// }> {
//   try {
//     const data: User[] = await db.get("/users?role=delivery-person");

//     if (!data) return { success: false, error: "Aucun livreur trouvé" };

//     return { success: true, deliveryMen: data };
//   } catch (error) {
//     console.error("Get stock manager delivery men error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des livreurs",
//     };
//   }
// }

// export async function createStockManagerDeliveryAction(
//   orderId: number,
//   deliveryPersonId: number,
// ): Promise<{ success: boolean; delivery?: Delivery; error?: string }> {
//   try {
//     const newDelivery: Delivery = {
//       id: Date.now(),
//       orderId,
//       deliveryPersonId,
//       status: "not perform",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const data: Delivery = await db.post("/deliveries", newDelivery);

//     if (!data) return { success: false, error: "Livraison non enregistrer" };

//     return { success: true, delivery: data };
//   } catch (error) {
//     console.error("Stock Manager Create delivery error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la création de la livraison",
//     };
//   }
// }

// export async function getAdminEmployeeByIdAction(employeeId: number): Promise<{
//   success: boolean;
//   employee?: User;
//   error?: string;
// }> {
//   try {
//     const data: User = await db.get("/users/" + employeeId + "?role_ne=user");

//     return { success: true, employee: data };
//   } catch (error) {
//     console.error("Get admin employee error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération de l'employé",
//     };
//   }
// }

// export async function getAdminDashboardStatsAction(): Promise<{
//   success: boolean;
//   stats?: Record<string, any>;
//   error?: string;
// }> {
//   try {
//     const stats = {
//       totalProducts: adminProducts.length,
//       totalOrders: adminOrders.length,
//       totalRevenue: adminOrders
//         .filter((o) => o.status !== "cancelled")
//         .reduce((sum, order) => sum + order.totalAmount, 0),
//       pendingOrders: adminOrders.filter((o) => o.status === "pending").length,
//       shippedOrders: adminOrders.filter((o) => o.status === "shipped").length,
//       productsOutOfStock: adminProducts.filter((p) => p.stock === 0).length,
//     };

//     return { success: true, stats };
//   } catch (error) {
//     console.error("[v0] Get dashboard stats error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des statistiques",
//     };
//   }
// }
