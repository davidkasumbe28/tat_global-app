"use client";

import ErrorInfo from "@/components/error-info";
import SuccessInfo from "@/components/success-info";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    PAYMENT_METHOD,
    TRANSACTION_STATUSES,
    TRANSACTION_TYPES
} from "@/lib/constants/constants";
import { Invoice } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils/utils";

interface AdminTransactionNewFormProps {
    formData: Record<string, string>;
    invoices: Invoice[];
    handleChange: (
        e: React.ChangeEvent<
            HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
        >,
    ) => void;
    handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
    emuted?: boolean;
    loading: boolean;
    error: string;
    success: string;
}

export default function AdminTransactionNewForm({
    formData,
    invoices,
    handleChange,
    handleSubmit,
    emuted = true,
    loading,
    error,
    success,
}: AdminTransactionNewFormProps) {
    return (
        <form onSubmit={handleSubmit} className={cn("space-y-2")}>
            {/* Box Informations */}
            <div className="bg-background border border-border rounded-lg p-6 space-y-4 w-full">
                <Skeleton emuted={emuted}>
                    <h2 className="text-xl font-bold">Transaction</h2>
                </Skeleton>

                {/* Invoice , Amount and Method */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Invoice */}
                    <div>
                        <Skeleton emuted={emuted}>
                            <label className="text-sm font-semibold">Invoice</label>
                        </Skeleton>
                        <select
                            required
                            disabled={loading || emuted}
                            value={formData.invoiceId || 0}
                            name="invoiceId"
                            onChange={handleChange}
                            className={cn(
                                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                                (loading || emuted) &&
                                "bg-muted-foreground text-muted-foreground animate-pulse",
                            )}
                        >
                            <option className="text-black" value={""}>
                                Aucune
                            </option>
                            {invoices.map((invoice, index) => (
                                <option
                                    key={index}
                                    className="text-black"
                                    value={invoice.id}
                                >
                                    {invoice.invoiceNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Amount */}
                    <div>
                        <Skeleton emuted={emuted}>
                            <label className="text-sm font-semibold">Montant ($)</label>
                        </Skeleton>
                        <input
                            required
                            disabled={loading || emuted}
                            value={formData.amount || ""}
                            type="number"
                            name="amount"
                            min={0.0}
                            onChange={handleChange}
                            placeholder="0.0"
                            step={0.1}
                            className={cn(
                                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                                (loading || emuted) &&
                                "bg-muted-foreground text-muted-foreground animate-pulse",
                            )}
                        />
                    </div>

                    {/* Method */}
                    <div>
                        <Skeleton emuted={emuted}>
                            <label className="text-sm font-semibold">Methode</label>
                        </Skeleton>
                        <select
                            required
                            disabled={loading || emuted}
                            value={formData.method}
                            name="method"
                            onChange={handleChange}
                            className={cn(
                                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                                (loading || emuted) &&
                                "bg-muted-foreground text-muted-foreground animate-pulse",
                            )}
                        >
                            <option className="text-black" value={""}>
                                Aucune
                            </option>
                            {PAYMENT_METHOD.map(
                                (method, index) =>
                                (
                                    <option
                                        key={index}
                                        className="text-black"
                                        value={method.value}
                                    >
                                        {method.label}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>

                </div>

                {/* Type , TransactionNumber and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Type */}
                    <div>
                        <Skeleton emuted={emuted}>
                            <label className="text-sm font-semibold">Type</label>
                        </Skeleton>
                        <select
                            required
                            disabled={loading || emuted}
                            value={formData.type}
                            name="type"
                            onChange={handleChange}
                            className={cn(
                                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                                (loading || emuted) &&
                                "bg-muted-foreground text-muted-foreground animate-pulse",
                            )}
                        >
                            <option className="text-black" value={""}>
                                Aucune
                            </option>
                            {TRANSACTION_TYPES.map(
                                (type, index) =>
                                    type.value !== "ALL" && (
                                        <option
                                            key={index}
                                            className="text-black"
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ),
                            )}
                        </select>
                    </div>

                    {/* TransactionNumber */}
                    <div>
                        <Skeleton emuted={emuted}>
                            <label className="text-sm font-semibold">N° Transaction</label>
                        </Skeleton>
                        <input
                            required
                            disabled
                            type="text"
                            name="transactionNumber"
                            value={"TRS-00000000"}
                            onChange={handleChange}
                            placeholder="Ex: TRS-XXXXXXXX"
                            className={cn(
                                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                                (loading || emuted) &&
                                "bg-muted-foreground text-muted-foreground animate-pulse",
                            )}
                        />
                    </div>

                    {/* Reference */}
                    <div>
                        <Skeleton emuted={emuted}>
                            <label className="text-sm font-semibold">Référence</label>
                        </Skeleton>
                        <input
                            required
                            disabled
                            type="text"
                            name="reference"
                            value={"REF0000000000"}
                            onChange={handleChange}
                            placeholder="Ex: REFXXXXXXXXXX"
                            className={cn(
                                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                                (loading || emuted) &&
                                "bg-muted-foreground text-muted-foreground animate-pulse",
                            )}
                        />
                    </div>

                </div>

            </div>

            {error && <ErrorInfo info={error} emuted={emuted} />}

            {success && <SuccessInfo info={success} emuted={emuted} />}

            {/* Actions */}
            <div className="flex justify-end">
                <Button
                    type={"submit"}
                    variant={emuted ? "emuted" : "default"}
                    disabled={loading || emuted}
                    className={cn(
                        !emuted && "bg-foreground text-background hover:bg-primary-dark",
                    )}
                >
                    {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </div>
        </form>
    );
}
