"use client";

import AdminNewHeader from "@/components/admin/admin-new-header";
import AdminTransactionNewForm from "@/components/admin/transaction/transaction-new/transaction-new-form";
import { useTheme } from "@/hooks/use-theme";
import { APP } from "@/lib/data/raw/routes";
import { Invoice } from "@/lib/generated/prisma/client";
import { handleReadSelectInvoices } from "@/lib/handlers/events-handlers/invoice-events";
import { handleCreateTransaction } from "@/lib/handlers/events-handlers/transaction-events";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function CollectionNewPage() {
  const { isloading } = useTheme();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({
    userId: user?.id || 0,
    invoiceId: null,
    amount: 0.0,
    method: "",
    type: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (
      name === "amount"
    ) {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setFormData((prev) => ({ ...prev, userId: user?.id || 0 }));

    const { invoiceId, amount, method, type } = formData;

    if (amount <= 0.99) {
      setError("Le montant doit être positif et supérieur à zéro");
      setLoading(false);
      return;
    }

    for (const field of Object.keys(formData)) {

      if (!formData[field]) {
        setError("Tous les champs requis sont obligatoires");
        setLoading(false);
        return;
      }
    }

    const res = await handleCreateTransaction({
      userId: user?.id || 0, // You can add the userId if needed
      invoiceId: parseInt(invoiceId),
      amount,
      method,
      type,
      reference: "REF" + Date.now(), // You can add a reference if needed
    });

    if (res.error) {
      setError(res.error || "Une erreur est survenue lors de la création de la transaction");
      setLoading(false);
      return;
    }

    const transaction = res.data.transactionNumber;

    setError("");
    setSuccess("Création de la transaction : " + transaction);

    setFormData({
      userId: user?.id || 0,
      invoiceId: null,
      amount: 0.0,
      method: "",
      type: "",
    });

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    handleReadSelectInvoices("ALL", "newest")
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }

        setInvoices(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [success]);

  return (
    <main className="flex-1 space-y-5">
      {/* Header */}
      <AdminNewHeader
        linkBack={APP.admin.transactions}
        labelText={"Nouvelle Transaction"}
        emuted={isloading}
      />

      {/* Form */}
      <AdminTransactionNewForm
        formData={formData}
        invoices={invoices}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        emuted={isloading}
        loading={loading}
        error={error}
        success={success}
      />
    </main>
  );
}
