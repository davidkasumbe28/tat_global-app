"use client";

import { Transaction } from "@/lib/@types/types";
import {
  PAYMENT,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES
} from "@/lib/constants/constants";
import {
  StatusTransaction
} from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils/utils";
import { APP } from "@/lib/data/raw/routes";
import Link from "next/link";

interface AccountTransactionTableProps {
  transactions: Transaction[];
  emuted?: boolean;
  loading: boolean
}

export default function AccountTransactionTable({
  transactions,
  emuted = true,
  loading,
}: AccountTransactionTableProps) {

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
                <Link href={emuted ? "#" : APP.private.transactions + "/" + txn.id}>
                  <Button
                    size="sm"
                    variant={emuted ? "emuted" : "default"}
                    className={cn(!emuted && " hover:bg-primary-dark")}
                  >
                    <Eye className={cn("w-4 h-4")} />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
