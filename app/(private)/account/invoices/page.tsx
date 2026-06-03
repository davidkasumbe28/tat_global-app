"use client";

import { Button } from "@/components/ui/button";
import { Download, Eye, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function InvoicesPage() {
  const [filterStatus, setFilterStatus] = useState("all");

  const invoices = [
    {
      id: "inv-1",
      number: "TAT-2025-000001",
      date: "15 Nov 2025",
      dueDate: "15 Dec 2025",
      amount: "251.94€",
      status: "paid",
      order: "TAT-2025-001234",
    },
    {
      id: "inv-2",
      number: "TAT-2025-000002",
      date: "10 Nov 2025",
      dueDate: "10 Dec 2025",
      amount: "89.99€",
      status: "issued",
      order: "TAT-2025-001233",
    },
    {
      id: "inv-3",
      number: "TAT-2025-000003",
      date: "5 Nov 2025",
      dueDate: "5 Dec 2025",
      amount: "179.98€",
      status: "overdue",
      order: "TAT-2025-001232",
    },
  ];

  const filteredInvoices =
    filterStatus === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "issued":
        return "bg-blue-100 text-blue-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mes Factures</h1>
          <Link href="/account">
            <Button variant="outline">Retour au compte</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border border-border rounded-lg p-4 flex gap-2 flex-wrap">
          {["all", "paid", "issued", "overdue", "draft"].map((status) => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status)}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              className={filterStatus === status ? "bg-primary text-white" : ""}
            >
              <Filter className="w-3 h-3 mr-2" />
              {status === "all"
                ? "Tous"
                : status === "paid"
                  ? "Payées"
                  : status === "issued"
                    ? "Émises"
                    : status === "overdue"
                      ? "Impayées"
                      : "Brouillon"}
            </Button>
          ))}
        </div>

        {/* Invoices List */}
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">
                    N° Facture
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Commande
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Date d'émission
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Échéance
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Montant</th>
                  <th className="text-left py-3 px-4 font-semibold">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-border hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-semibold text-primary">
                      {invoice.number}
                    </td>
                    <td className="py-3 px-4">{invoice.order}</td>
                    <td className="py-3 px-4">{invoice.date}</td>
                    <td className="py-3 px-4">{invoice.dueDate}</td>
                    <td className="py-3 px-4 font-bold">{invoice.amount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          invoice.status,
                        )}`}
                      >
                        {invoice.status === "paid"
                          ? "Payée"
                          : invoice.status === "issued"
                            ? "Émise"
                            : invoice.status === "overdue"
                              ? "Impayée"
                              : "Brouillon"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/account/invoices/${invoice.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune facture ne correspond à votre recherche.
          </div>
        )}
      </div>
    </main>
  );
}
