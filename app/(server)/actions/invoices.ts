// "use server";

// import type { Invoice, InvoiceLineItem } from "@/lib/@types/types";
// import { mockOrders } from "@/lib/data/mock/mock-data";

// // Mock storage for invoices
// const mockInvoices: Invoice[] = [];

// export async function createInvoiceAction(
//   orderId: number,
//   userId: number,
// ): Promise<{ success: boolean; invoice?: Invoice; error?: string }> {
//   try {
//     // Récupérer la commande
//     const order = mockOrders.find((o) => o.id === orderId);
//     if (!order) {
//       return { success: false, error: "Commande non trouvée" };
//     }

//     // Créer les articles de facture
//     const invoiceItems: InvoiceLineItem[] = order.items.map((item) => ({
//       id: Date.now() - Math.random(),
//       productId: item?.productId,
//       productName: item?.product.name,
//       description: item?.product.description || "",
//       quantity: item?.quantity,
//       unitPrice: item?.product.price,
//       taxRate: 0.2, // TVA 20%
//       subtotal: item?.quantity * item?.product.price,
//     }));

//     const subtotal = invoiceItems.reduce((sum, item) => sum + item.subtotal, 0);
//     const taxAmount = invoiceItems.reduce(
//       (sum, item) => sum + item.subtotal * item.taxRate,
//       0,
//     );
//     const totalAmount = subtotal + taxAmount;

//     const newInvoice: Invoice = {
//       id: Date.now(),
//       invoiceNumber: `TAT-${new Date().getFullYear()}-${String(mockInvoices.length + 1).padStart(6, "0")}`,
//       orderId,
//       userId,
//       issueDate: new Date(),
//       dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
//       subtotal,
//       taxAmount,
//       totalAmount,
//       status: "issued",
//       items: invoiceItems,
//       paymentTerms: "Net 30",
//       notes: "Merci pour votre achat chez TAT GLOBAL",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     mockInvoices.push(newInvoice);
//     console.log("[v0] Invoice created:", newInvoice.invoiceNumber);

//     return { success: true, invoice: newInvoice };
//   } catch (error) {
//     console.error("[v0] Create invoice error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la création de la facture",
//     };
//   }
// }

// export async function getInvoicesAction(userId: number): Promise<{
//   success: boolean;
//   invoices?: Invoice[];
//   error?: string;
// }> {
//   try {
//     const invoices = mockInvoices.filter((inv) => inv.userId === userId);
//     return { success: true, invoices };
//   } catch (error) {
//     console.error("[v0] Get invoices error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des factures",
//     };
//   }
// }

// export async function getInvoiceByIdAction(invoiceId: number): Promise<{
//   success: boolean;
//   invoice?: Invoice;
//   error?: string;
// }> {
//   try {
//     const invoice = mockInvoices.find((inv) => inv.id === invoiceId);
//     if (!invoice) {
//       return { success: false, error: "Facture non trouvée" };
//     }
//     return { success: true, invoice };
//   } catch (error) {
//     console.error("[v0] Get invoice error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération de la facture",
//     };
//   }
// }

// export async function updateInvoiceStatusAction(
//   invoiceId: number,
//   status: "draft" | "issued" | "paid" | "overdue" | "cancelled",
// ): Promise<{ success: boolean; invoice?: Invoice; error?: string }> {
//   try {
//     const invoice = mockInvoices.find((inv) => inv.id === invoiceId);
//     if (!invoice) {
//       return { success: false, error: "Facture non trouvée" };
//     }

//     const updatedInvoice = { ...invoice, status, updatedAt: new Date() };
//     const index = mockInvoices.findIndex((inv) => inv.id === invoiceId);
//     mockInvoices[index] = updatedInvoice;

//     console.log("[v0] Invoice status updated:", invoiceId, status);

//     return { success: true, invoice: updatedInvoice };
//   } catch (error) {
//     console.error("[v0] Update invoice error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la mise à jour de la facture",
//     };
//   }
// }

// export async function getAllInvoicesAction(
//   page = 1,
//   limit = 10,
// ): Promise<{
//   success: boolean;
//   invoices?: Invoice[];
//   total?: number;
//   error?: string;
// }> {
//   try {
//     const start = (page - 1) * limit;
//     const invoices = mockInvoices.slice(start, start + limit);
//     return { success: true, invoices, total: mockInvoices.length };
//   } catch (error) {
//     console.error("[v0] Get all invoices error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des factures",
//     };
//   }
// }
