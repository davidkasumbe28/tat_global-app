"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/@types/types";
import { PAYMENT, TRANSACTION_STATUSES, TRANSACTION_TYPES } from "@/lib/constants/constants";
import company from "@/lib/data/raw/company";
import { APP } from "@/lib/data/raw/routes";
import { PaymentMethod, StatusTransaction } from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/invoice.utils";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";

interface AdminTransactionDetailsSheetProps {
    transaction?: Transaction;
    emuted?: boolean;
    loading: boolean;
}

export default function AdminTransactionDetailsSheet({
    transaction,
    emuted = true,
    loading,
}: AdminTransactionDetailsSheetProps) {

    const subtotal =
        transaction?.invoice?.order?.cart?.cartItems?.reduce(
            (total, item) => total + (item?.product?.price || 0) * item?.quantity,
            0,
        ) || 0;

    const tax = subtotal * (transaction?.invoice?.taxAmount || 0);

    return (
        <div className="border border-border rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex max-md:flex-col items-start justify-between border-b border-border gap-2 pb-6">
                {/* Company Info */}
                <div className="flex flex-col justify-start items-start w-full">
                    <Skeleton emuted={emuted}>
                        <h1
                            className={cn(
                                "text-3xl font-bold",
                                !emuted && "text-primary-dark",
                            )}
                        >
                            {company.info.name}
                        </h1>
                    </Skeleton>
                    <div className="mt-4 text-sm space-y-1">
                        <Skeleton emuted={emuted}>
                            <p>{company.info.address}</p>
                        </Skeleton>
                        <Skeleton emuted={emuted}>
                            <p>
                                {company.info.city} , {company.info.country}
                            </p>
                        </Skeleton>
                        <Skeleton emuted={emuted}>
                            <p>
                                <span className={cn(!emuted && "text-gray-500 ")}>Tel : </span>
                                {company.info.phone}
                            </p>
                        </Skeleton>
                        <Skeleton emuted={emuted}>
                            <p>
                                <span className={cn(!emuted && "text-gray-500 ")}>
                                    Email :{" "}
                                </span>
                                {company.info.email}
                            </p>
                        </Skeleton>
                        <Skeleton emuted={emuted}>
                            <p>
                                <span className={cn(!emuted && "text-gray-500 ")}>
                                    Siret :{" "}
                                </span>
                                {company.info.siret}
                            </p>
                        </Skeleton>
                    </div>
                </div>

                <div className="flex flex-col justify-end items-end w-full">
                    <div className="mt-4 space-y-2 text-sm text-left">
                        <Skeleton emuted={emuted || loading}>
                            <p
                                className={cn(
                                    "text-2xl font-bold mt-2",
                                    !emuted && !loading && "text-primary-dark",
                                )}
                            >
                                {transaction?.transactionNumber || "ID de la transaction"}
                            </p>
                        </Skeleton>

                        <Skeleton emuted={emuted || loading}>
                            <p>
                                <span
                                    className={cn(
                                        " font-normal",
                                        !emuted && !loading && "text-gray-500",
                                    )}
                                >
                                    Status :{" "}
                                </span>{" "}
                                <span
                                    className={cn(
                                        "font-semibold",
                                        !emuted &&
                                        !loading &&
                                        (transaction?.status === StatusTransaction.COMPLETED
                                            ? "text-green-500"
                                            : transaction?.status === StatusTransaction.PENDING
                                                ? "text-blue-500"
                                                : transaction?.status === StatusTransaction.FAILED
                                                    ? "text-red-500"
                                                    : "text-yellow-500"),
                                    )}
                                >
                                    {TRANSACTION_STATUSES.find(
                                        (status) => status.value === transaction?.status,
                                    )?.label || "Statut inconnu"}
                                </span>
                            </p>
                        </Skeleton>

                        <Skeleton emuted={emuted || loading}>
                            <p>
                                <span className={cn(!emuted && !loading && "text-gray-500")}>
                                    Date de création :
                                </span>{" "}
                                {formatDate(new Date(transaction?.createdAt || new Date()))}
                            </p>
                        </Skeleton>
                        <Skeleton emuted={emuted || loading}>
                            <p>
                                <span className={cn(!emuted && !loading && "text-gray-500")}>
                                    Mise à jour :
                                </span>{" "}
                                {formatDate(new Date(transaction?.updatedAt || new Date()))}
                            </p>
                        </Skeleton>
                    </div>
                </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    {/* <Skeleton emuted={emuted}>
                        <h3 className="font-bold mb-2 ">Facturé à : </h3>
                    </Skeleton> */}
                    <Skeleton emuted={emuted || loading}>
                        <p className="font-semibold">
                            {capitalizeFirstLetter(transaction?.user?.firstName || "John") +
                                " " +
                                capitalizeFirstLetter(transaction?.user?.lastName || "Doe")}
                        </p>
                    </Skeleton>
                    <div
                        className={cn("text-sm", !emuted && !loading && "text-gray-500")}
                    >
                        <Skeleton emuted={emuted || loading}>
                            <p>{transaction?.user?.address}</p>
                        </Skeleton>
                        <Skeleton emuted={emuted || loading}>
                            <p>
                                {transaction?.user?.city} , {transaction?.user?.country}
                            </p>
                        </Skeleton>
                        <Skeleton emuted={emuted || loading}>
                            <p className="">{transaction?.user?.email}</p>
                        </Skeleton>
                    </div>
                </div>
            </div>

            <div className="flex max-md:flex-col-reverse justify-between">
                <div className="flex justify-end items-end gap-3">
                    <span className="text-gray-500" >Facture : </span>
                    <Link className="hover:text-primary-dark" href={emuted && loading ? "#" : APP.admin.invoices + "/" + transaction?.invoiceId} >
                        {transaction?.invoice?.invoiceNumber}
                    </Link>
                </div>
                <div className="sm:w-80 space-y-2 border-t border-gray-200 pt-4">
                    {/* <div className=" space-y-2 pt-4"> */}
                    <div className="flex justify-between">
                        <span className="text-gray-500">Type : </span>
                        <span className="font-semibold">
                            {TRANSACTION_TYPES.map((type) => { if (type.value == transaction?.type) return type.label })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Method :
                        </span>
                        <span className="font-semibold">
                            {PAYMENT.IN_ONE_SLICE.options[transaction?.method as PaymentMethod]}
                        </span>
                    </div>
                    <div className="flex max-sm:flex-col justify-between">
                        <span className="text-gray-500">
                            Référence :
                        </span>
                        <span className="font-semibold">{transaction?.reference}</span>
                    </div>
                    <div className="flex justify-between text-lg border-t border-gray-200 pt-2">
                        <span className="font-bold">Montant:</span>
                        <span className="font-bold text-primary-dark text-2xl">
                            {transaction?.amount?.toFixed(2)}$
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            {/* <div className="border-t border-gray-200 pt-8 space-y-4">
        {invoice?.notes && (
          <div className="text-center">
            <h4 className="font-semibold mb-2">Notes:</h4>
            <p className="text-sm text-gray-500">{invoice?.notes}</p>
          </div>
        )}

        <div className="text-center">
          <h4 className="font-semibold mb-2">Conditions de paiement:</h4>
          <p className="text-sm text-gray-500">
            Les marchandises vendues ne sont ni échangées ni reprises
          </p>
          <p className="text-sm text-gray-500">
            {" "}
            "Autorisation d'acquitter la TVA d'àprès les débits"{" "}
          </p>
        </div>
      </div> */}

        </div>
    );
}
