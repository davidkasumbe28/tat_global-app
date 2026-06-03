"use client";

import AdminCustomerDetailsForm from "@/components/admin/user/customer-details/customer-details-form";
import AdminCustomerDetailsHeader from "@/components/admin/user/customer-details/customer-details-header";
import AdminCustomerDetailsMoreDetail from "@/components/admin/user/customer-details/customer-details-more-detail";
import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import { useTheme } from "@/hooks/use-theme";
import { Customer } from "@/lib/@types/types";
import { StateUser } from "@/lib/generated/prisma/enums";
import {
  handleReadUser,
  handleUpdateUser,
} from "@/lib/handlers/events-handlers/user-events";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerDetailsPage() {
  const params = useParams();
  const customerId = params.id as string;
  const { isloading } = useTheme();
  const [customer, setCustomer] = useState<Customer>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChangeState = async (id: number, currentState: StateUser) => {
    setLoading(true);

    const newState =
      currentState === StateUser.ENABLED
        ? StateUser.DISABLED
        : StateUser.ENABLED;

    const res = await handleUpdateUser(id, { state: newState });

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setSuccess("success");
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    handleReadUser(parseInt(customerId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }
        setCustomer(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [success, isEditing]);

  if (loading) return <Loading subject="des informations du client" />;

  if (!customer && !loading)
    return (
      <Error error={error || "Aucune information disponible du client."} />
    );

  return (
    <main className="flex-1 space-y-2">
      {/* Header */}
      <AdminCustomerDetailsHeader
        customer={customer}
        emuted={isloading}
        loading={loading}
      />

      {/* Form */}
      <AdminCustomerDetailsForm
        formData={formData}
        isEditing={isEditing}
        emuted={isloading}
        loading={loading}
        error={error}
        success={success}
      />

      {/* More informations */}
      <AdminCustomerDetailsMoreDetail
        customer={customer}
        handleChangeState={handleChangeState}
        emuted={isloading}
        loading={loading}
      />
    </main>
  );
}
