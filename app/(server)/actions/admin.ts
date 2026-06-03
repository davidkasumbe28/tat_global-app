// "use server";

// import type { Order, Product, User } from "@/lib/@types/types";
// import { mockProducts } from "@/lib/data/mock/mock-data";
// import db from "@/lib/db/db";
// import { hashPassword } from "@/lib/utils/bcrypt";

// // Mock storage
// const adminProducts: Product[] = [...mockProducts];
// const adminOrders: Order[] = [];

// export async function registerEmployeeAction(
//   email: string,
//   firstName: string,
//   lastName: string,
//   password: string,
//   phone: string,
//   role: string,
// ): Promise<{ success: boolean; user?: User; error?: string }> {
//   try {
//     const passwordHash = await hashPassword(password);

//     // Mock user creation
//     const newUser = {
//       id: new Date().getMilliseconds() + Math.round(Math.random()),
//       email,
//       password: passwordHash, // Never store plain password
//       firstName,
//       lastName,
//       phone,
//       address: "",
//       city: "",
//       zipCode: "",
//       country: "",
//       role,
//       state: "enabled",
//       status: "in progress",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const data: User = await db.post("/users", newUser);

//     if (!data) return { success: false, error: "Employé non enregistrer." };

//     return { success: true, user: data };
//   } catch (error) {
//     console.error("Register employee error:", error);
//     return { success: false, error: "Erreur lors de l'enregistrement." };
//   }
// }

// export async function getAdminEmployeesAction(
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

// export async function getAdminCustomersAction(
//   page = 1,
//   limit = 10,
// ): Promise<{
//   success: boolean;
//   customers?: User[];
//   total?: number;
//   error?: string;
// }> {
//   try {
//     const start = (page - 1) * limit;
//     const end = page * limit;

//     const data: User[] = await db.get(
//       "/users?" + "_start=" + start + "&_end=" + end,
//     );

//     const allData: User[] = await db.get("/users?" + "role=user");

//     const total = allData.length;

//     return { success: true, customers: data, total: total };
//   } catch (error) {
//     console.error("Get admin customers error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des clients",
//     };
//   }
// }

// export async function getAdminCustomersByIdAction(customerId: number): Promise<{
//   success: boolean;
//   customer?: User;
//   error?: string;
// }> {
//   try {
//     const data: User = await db.get("/users/" + customerId);

//     return { success: true, customer: data };
//   } catch (error) {
//     console.error("Get admin customer error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération du client",
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
