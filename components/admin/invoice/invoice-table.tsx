"use client";

import CheckoutStepTwo from "@/components/checkout/checkout-stepTwo";
import { DeleteButton } from "@/components/delete-button";
import { EditButton } from "@/components/edit-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Invoice } from "@/lib/@types/types";
import {
  CATEGORIES_PRODUCT,
  INVOICE_STATUSES,
  PAYMENT,
} from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import {
  PaymentMethod,
  PaymentType,
  StateCollection,
  StatusInvoice,
} from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface InvoiceTableProps {
  invoices: Invoice[];
  handleUpdate: (id: number) => void;
  emuted?: boolean;
  loading: boolean;
  invoiceStatus: StatusInvoice;
  setInvoiceStatus: React.Dispatch<React.SetStateAction<StatusInvoice>>;
}

export default function InvoiceTable({
  invoices,
  handleUpdate,
  emuted = true,
  loading,
  invoiceStatus,
  setInvoiceStatus,
}: InvoiceTableProps) {

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-950 border-b border-border">
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Facture</th>
            <th className="text-left py-3 px-4 font-semibold">Client</th>
            <th className="text-left py-3 px-4 font-semibold">Date</th>
            <th className="text-left py-3 px-4 font-semibold">Montant</th>
            <th className="text-left py-3 px-4 font-semibold">Statut</th>
            <th className="text-left py-3 px-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b border-border hover:bg-accent transition"
            >
              <td className="py-3 px-4 font-semibold">
                {invoice.invoiceNumber}
              </td>
              <td className="py-3 px-4">
                {capitalizeFirstLetter(invoice?.user?.firstName as string) +
                  " " +
                  capitalizeFirstLetter(invoice?.user?.lastName as string)}
              </td>
              <td className="py-3 px-4">
                {formatDate(new Date(invoice.issueDate as Date))}
              </td>
              <td className="py-3 px-4 text-foreground font-bold">
                {invoice?.order?.totalAmount?.toFixed(2)}$
              </td>
              <td className="py-3 px-4">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    invoice.status === StatusInvoice.PAID
                      ? "bg-green-100 text-green-700"
                      : invoice.status === StatusInvoice.ISSUED
                        ? "bg-blue-100 text-blue-700"
                        : invoice.status === StatusInvoice.CANCELLED
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700",
                  )}
                >
                  {INVOICE_STATUSES.map((status) => {
                    if (status.value == invoice.status) return status.label;
                  })}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link
                    href={emuted ? "#" : APP.admin.invoices + "/" + invoice.id}
                  >
                    <Button
                      size="sm"
                      variant={emuted ? "emuted" : "default"}
                      className={cn(!emuted && " hover:bg-primary-dark")}
                    >
                      <Eye className={cn("w-4 h-4")} />
                    </Button>
                  </Link>

                  {
                    <EditButton
                      sku={invoice.invoiceNumber}
                      handleEdit={() => handleUpdate(invoice.id)}
                      text="facture"
                      emuted={emuted}
                    >
                      <div>
                        <div className="space-y-1">
                          {INVOICE_STATUSES.map(
                            (
                              status: {
                                label: string;
                                value: StatusInvoice | "ALL";
                              },
                              index: number,
                            ) =>
                              status.value !== "ALL" && (
                                <label
                                  key={index}
                                  className={cn(
                                    "flex items-center gap-2 py-2 px-4 border border-border rounded-lg cursor-pointer transition",
                                    emuted
                                      ? "bg-transparent animate-pulse"
                                      : "hover:bg-accent",
                                  )}
                                >
                                  <input
                                    type="radio"
                                    disabled={emuted}
                                    value={status.value}
                                    checked={invoiceStatus == status.value || invoice.status == status.value}
                                    onChange={() =>
                                      setInvoiceStatus(status.value as StatusInvoice)
                                    }
                                    className={cn(
                                      "w-4 h-4",
                                      emuted &&
                                        "cursor-not-allowed animate-pulse",
                                    )}
                                  />
                                  <Skeleton emuted={emuted}>
                                    <span>{status.label}</span>
                                  </Skeleton>
                                </label>
                              ),
                          )}
                        </div>

                        <p className=" font-extralight text-end text-sm text-gray-500 py-4">
                          Voulez-vous vraiment modifier cette facture ?
                        </p>
                      </div>
                    </EditButton>
                  }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
