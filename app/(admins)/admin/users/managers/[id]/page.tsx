"use client";

import AdminManagerDetailsForm from "@/components/admin/user/manager-details/manager-details-form";
import AdminManagerDetailsHeader from "@/components/admin/user/manager-details/manager-details-header";
import AdminManagerDetailsMoreDetail from "@/components/admin/user/manager-details/manager-details-more-detail";
import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import { useTheme } from "@/hooks/use-theme";
import { Manager } from "@/lib/@types/types";
import { StateUser } from "@/lib/generated/prisma/enums";
import {
  handleReadUser,
  handleUpdateUser,
} from "@/lib/handlers/events-handlers/user-events";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManagerDetailsPage() {
  const params = useParams();
  const managerId = params.id as string;
  const { isloading } = useTheme();
  const [manager, setManager] = useState<Manager>();
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
    handleReadUser(parseInt(managerId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }
        setManager(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [success, isEditing]);

  if (loading) return <Loading subject="des informations de l'admin " />;

  if (!manager && !loading)
    return (
      <Error error={error || "Aucune information disponible de l'admin."} />
    );

  return (
    <main className="flex-1 space-y-2">
      {/* Header */}
      <AdminManagerDetailsHeader
        manager={manager}
        emuted={isloading}
        loading={loading}
      />

      {/* Form */}
      <AdminManagerDetailsForm
        formData={formData}
        isEditing={isEditing}
        emuted={isloading}
        loading={loading}
        error={error}
        success={success}
      />

      {/* More informations */}
      <AdminManagerDetailsMoreDetail
        manager={manager}
        handleChangeState={handleChangeState}
        emuted={isloading}
        loading={loading}
      />
    </main>
  );
}
