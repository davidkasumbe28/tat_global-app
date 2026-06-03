// "use server";

// import type { AccountLedger, Transaction } from "@/lib/@types/types";

// // Mock storage for ledger and transactions
// const mockLedger: AccountLedger[] = [];
// const mockTransactions: Transaction[] = [];

// export async function createLedgerEntryAction(
//   userId: number,
//   type: "debit" | "credit",
//   amount: number,
//   description: string,
//   invoiceId?: number,
//   orderId?: number,
//   reference?: string,
// ): Promise<{ success: boolean; entry?: AccountLedger; error?: string }> {
//   try {
//     // Calculer le nouveau solde
//     const previousEntries = mockLedger.filter((e) => e.userId === userId);
//     const previousBalance =
//       previousEntries.length > 0
//         ? previousEntries[previousEntries.length - 1].balance
//         : 0;

//     const newBalance =
//       type === "credit" ? previousBalance + amount : previousBalance - amount;

//     const newEntry: AccountLedger = {
//       id: Date.now(),
//       userId,
//       date: new Date(),
//       type,
//       amount,
//       description,
//       invoiceId,
//       orderId,
//       reference,
//       balance: newBalance,
//       createdAt: new Date(),
//     };

//     mockLedger.push(newEntry);
//     console.log("[v0] Ledger entry created:", newEntry.id);

//     return { success: true, entry: newEntry };
//   } catch (error) {
//     console.error("[v0] Create ledger entry error:", error);
//     return { success: false, error: "Erreur lors de la création de l'entrée" };
//   }
// }

// export async function getLedgerAction(userId: number): Promise<{
//   success: boolean;
//   entries?: AccountLedger[];
//   balance?: number;
//   error?: string;
// }> {
//   try {
//     const entries = mockLedger
//       .filter((e) => e.userId === userId)
//       .sort((a, b) => b.date.getTime() - a.date.getTime());
//     const balance = entries.length > 0 ? entries[0].balance : 0;

//     return { success: true, entries, balance };
//   } catch (error) {
//     console.error("[v0] Get ledger error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération du cahier de compte",
//     };
//   }
// }

// export async function createTransactionAction(
//   invoiceId: number,
//   userId: number,
//   amount: number,
//   method: "card" | "bank_transfer" | "check" | "cash",
// ): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
//   try {
//     const newTransaction: Transaction = {
//       id: Date.now(),
//       invoiceId,
//       userId,
//       amount,
//       method,
//       status: "completed",
//       transactionDate: new Date(),
//       reference: `REF-${Date.now()}`,
//       createdAt: new Date(),
//     };

//     mockTransactions.push(newTransaction);

//     // Ajouter une entrée au cahier de compte (crédit)
//     await createLedgerEntryAction(
//       userId,
//       "credit",
//       amount,
//       `Paiement reçu - ${method}`,
//       invoiceId,
//     );

//     console.log("[v0] Transaction created:", newTransaction.id);

//     return { success: true, transaction: newTransaction };
//   } catch (error) {
//     console.error("[v0] Create transaction error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la création de la transaction",
//     };
//   }
// }

// export async function getTransactionsAction(userId: number): Promise<{
//   success: boolean;
//   transactions?: Transaction[];
//   error?: string;
// }> {
//   try {
//     const transactions = mockTransactions.filter((t) => t.userId === userId);
//     return { success: true, transactions };
//   } catch (error) {
//     console.error("[v0] Get transactions error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération des transactions",
//     };
//   }
// }

// export async function getAllLedgerAction(
//   page = 1,
//   limit = 20,
// ): Promise<{
//   success: boolean;
//   entries?: AccountLedger[];
//   total?: number;
//   error?: string;
// }> {
//   try {
//     const start = (page - 1) * limit;
//     const entries = mockLedger
//       .sort((a, b) => b.date.getTime() - a.date.getTime())
//       .slice(start, start + limit);
//     return { success: true, entries, total: mockLedger.length };
//   } catch (error) {
//     console.error("[v0] Get all ledger error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la récupération du cahier de compte",
//     };
//   }
// }
