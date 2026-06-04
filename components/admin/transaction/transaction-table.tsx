"use client";

import { EditButton } from "@/components/edit-button";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/@types/types";
import {
    PAYMENT,
    TRANSACTION_STATUSES,
    TRANSACTION_TYPES
} from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import {
    StatusTransaction
} from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";
import { Eye } from "lucide-react";
import Link from "next/link";

interface AdminTransactionTableProps {
    transactions: Transaction[];
    emuted?: boolean;
    loading: boolean
}

export default function AdminTransactionTable({
    transactions,
    emuted = true,
    loading,
}: AdminTransactionTableProps) {

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-950 border-b border-border">
                    <tr>
                        <th className="text-left py-3 px-4 font-semibold">Transaction</th>
                        <th className="text-left py-3 px-4 font-semibold">Montant</th>
                        <th className="text-left py-3 px-4 font-semibold">Méthode</th>
                        <th className="text-left py-3 px-4 font-semibold">
                            Type
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                            Référence
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">Statut</th>
                        <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((txn) => (
                        <tr
                            key={txn.id}
                            className="border-b border-border hover:bg-accent transition"
                        >
                            <td className="py-3 px-4">
                                <div className="flex flex-col" >
                                    <span>{txn.transactionNumber}</span>
                                    <span className="text-sm text-gray-500">{formatDate(new Date(txn.createdAt))}</span>
                                </div>
                            </td>
                            <td className="py-3 px-4 font-semibold text-primary">
                                {txn.amount.toFixed(2)}$
                            </td>
                            <td className="py-3 px-4">
                                {PAYMENT.IN_ONE_SLICE.options[txn.method]}
                            </td>
                            <td className="py-3 px-4">
                                {TRANSACTION_TYPES.map((type) => { if (type.value == txn.type) return type.label })}
                            </td>
                            <td className="py-3 px-4 text-sm">
                                {txn.reference}
                            </td>
                            <td className="py-3 px-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${txn.status === StatusTransaction.COMPLETED
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {TRANSACTION_STATUSES.map((status) => { if (status.value == txn.status) return status.label })}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex gap-2">
                                    <Link
                                        href={emuted ? "#" : APP.admin.transactions + "/" + txn.id}
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
                                            sku={txn.transactionNumber}
                                            //   handleEdit={() => handleUpdate(invoice.id)}
                                            handleEdit={() => { }}

                                            text="transaction"
                                            emuted={emuted}
                                        >
                                            <div>
                                                {/* <div className="space-y-1">
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
                                    checked={invoiceStatus == status.value || txn.status == status.value}
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
                        </div> */}

                                                <p className=" font-extralight text-end text-sm text-gray-500 py-4">
                                                    Voulez-vous vraiment modifier cette transaction ?
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
