"use client";

import invoices from "@/lib/data/processed/invoices";
import Link from "next/link";
import { Button } from "../../ui/button";

export default function Invoices() {
  return (
    <div className="bg-background border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Factures</h2>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="border border-border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-lg">{invoice.id}</p>
                <p className="text-sm text-gray-600">{invoice.date}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-foreground text-lg">
                  {invoice.amount}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/account/invoices/${invoice.id}`}>
                  <Button size="sm" variant="outline">
                    Voir
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
