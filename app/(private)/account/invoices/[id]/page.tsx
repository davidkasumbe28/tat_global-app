"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Printer } from "lucide-react";
import Link from "next/link";

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = {
    number: "TAT-2025-000001",
    date: "15 Nov 2025",
    dueDate: "15 Dec 2025",
    status: "paid",
    company: {
      name: "TAT GLOBAL",
      address: "123 Rue Admin, Paris",
      city: "75000 Paris",
      country: "France",
      phone: "+33 1 23 45 67 89",
      email: "contact@tatglobal.com",
      siret: "12345678901234",
    },
    customer: {
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      address: "123 Rue de la Paix",
      city: "75000 Paris",
      country: "France",
    },
    items: [
      {
        name: "T-Shirt Premium Coton",
        quantity: 2,
        unitPrice: 49.99,
        tax: 20,
        subtotal: 99.98,
      },
      {
        name: "Baskets Urbaines",
        quantity: 1,
        unitPrice: 89.99,
        tax: 20,
        subtotal: 89.99,
      },
      {
        name: "Parfum Eau de Toilette",
        quantity: 1,
        unitPrice: 79.99,
        tax: 20,
        subtotal: 79.99,
      },
    ],
    subtotal: 269.96,
    tax: 53.99,
    total: 323.95,
    paymentTerms: "Net 30",
    notes: "Merci pour votre achat chez TAT GLOBAL",
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/account/invoices"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ChevronLeft className="w-5 h-5" />
            Retour aux factures
          </Link>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>

        {/* Content */}

                <div className="bg-white border border-border rounded-lg p-8 space-y-8">
          {/* Company Header */}
          <div className="flex items-start justify-between border-b border-border pb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {invoice.company.name}
              </h1>
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>{invoice.company.address}</p>
                <p>{invoice.company.city}</p>
                <p>{invoice.company.country}</p>
                <p>Tél: {invoice.company.phone}</p>
                <p>Email: {invoice.company.email}</p>
                <p>SIRET: {invoice.company.siret}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-semibold">FACTURE</p>
              <p className="text-2xl font-bold text-primary mt-2">
                {invoice.number}
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Date d'émission:</span>{" "}
                  {invoice.date}
                </p>
                <p>
                  <span className="text-gray-600">Échéance:</span>{" "}
                  {invoice.dueDate}
                </p>
                <p
                  className={`font-semibold ${
                    invoice.status === "paid"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {invoice.status === "paid" ? "PAYÉE" : "ÉMISE"}
                </p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-3">Facturé à:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">
                  {invoice.customer.name}
                </p>
                <p>{invoice.customer.address}</p>
                <p>{invoice.customer.city}</p>
                <p>{invoice.customer.country}</p>
                <p className="mt-3">{invoice.customer.email}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">
                    Désignation
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Quantité
                  </th>
                  <th className="text-right py-3 px-4 font-semibold">
                    Prix unitaire
                  </th>
                  <th className="text-right py-3 px-4 font-semibold">TVA</th>
                  <th className="text-right py-3 px-4 font-semibold">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">
                      {item.unitPrice.toFixed(2)}€
                    </td>
                    <td className="py-3 px-4 text-right">{item.tax}%</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {item.subtotal.toFixed(2)}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total:</span>
                <span className="font-semibold">
                  {invoice.subtotal.toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TVA (20%):</span>
                <span className="font-semibold">{invoice.tax.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-lg border-t border-gray-200 pt-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-primary text-2xl">
                  {invoice.total.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Conditions de paiement:</h4>
              <p className="text-sm text-gray-600">{invoice.paymentTerms}</p>
            </div>
            {invoice.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes:</h4>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
