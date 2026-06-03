"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Download } from "lucide-react";
import Link from "next/link";

export default function TransactionsPage() {
  const transactions = [
    {
      id: "txn-1",
      date: "15 Nov 2025",
      description: "Paiement facture TAT-2025-000001",
      amount: 251.94,
      method: "Carte bancaire",
      status: "completed",
      reference: "REF-1234567890",
    },
    {
      id: "txn-2",
      date: "10 Nov 2025",
      description: "Paiement facture TAT-2025-000002",
      amount: 89.99,
      method: "Virement bancaire",
      status: "completed",
      reference: "REF-0987654321",
    },
    {
      id: "txn-3",
      date: "5 Nov 2025",
      description: "Paiement facture TAT-2025-000003",
      amount: 179.98,
      method: "Carte bancaire",
      status: "pending",
      reference: "REF-5555555555",
    },
  ];

  const totalPaid = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/account"
              className="flex items-center gap-2 text-primary hover:underline mb-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Retour au compte
            </Link>
            <h1 className="text-3xl font-bold">Historique des Transactions</h1>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">
              Montant total payé
            </p>
            <p className="text-3xl font-bold text-primary">
              {totalPaid.toFixed(2)}€
            </p>
          </div>
          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">
              Nombre de transactions
            </p>
            <p className="text-3xl font-bold">{transactions.length}</p>
          </div>
          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">
              Transactions en attente
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {transactions.filter((t) => t.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Montant</th>
                  <th className="text-left py-3 px-4 font-semibold">Méthode</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Référence
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b border-border hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{txn.date}</td>
                    <td className="py-3 px-4">{txn.description}</td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      {txn.amount.toFixed(2)}€
                    </td>
                    <td className="py-3 px-4">{txn.method}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {txn.reference}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          txn.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {txn.status === "completed"
                          ? "Complétée"
                          : "En attente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
