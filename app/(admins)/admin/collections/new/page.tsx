"use client";

import AdminNewHeader from "@/components/admin/admin-new-header";
import AdminCollectionNewForm from "@/components/admin/collection/collection-new/collection-new-form";
import { useTheme } from "@/hooks/use-theme";
import { APP } from "@/lib/data/raw/routes";
import { CategoryProduct, StateCollection } from "@/lib/generated/prisma/enums";
import { handleCreateCollection } from "@/lib/handlers/events-handlers/collection-events";
import { useState } from "react";

export default function CollectionNewPage() {
  const { isloading } = useTheme();
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "",
    category: CategoryProduct.CLOTHING,
    description: null,
    color: "bg-blue-50",
    state: StateCollection.AVAILABLE,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { description } = formData;

    for (const field of Object.keys(formData)) {
      if (field !== "description")
        if (!formData[field]) {
          setError("Tous les champs requis sont obligatoires");
          setLoading(false);
          return;
        }
    }

    if (description.length < 10) {
      setError("La description doit avoir plus de 10 caractères");
      setLoading(false);
      return;
    }

    const res = await handleCreateCollection(formData);

    if (res.error) {
      setError(res.error || "Une erreur est survenue lors de l'ajout");
      setLoading(false);
      return;
    }

    const collection = res.data.name;

    setSuccess("Ajout de la collection : " + collection);

    setFormData({
      name: "",
      category: CategoryProduct.CLOTHING,
      description: null,
      color: "bg-blue-50",
      state: StateCollection.AVAILABLE,
    });

    setLoading(false);
  };

  return (
    <main className="flex-1 space-y-5">
      {/* Header */}
      {/* <AdminCollectionNewHeader emuted={isloading} /> */}
      <AdminNewHeader
        linkBack={APP.admin.collections}
        labelText={"Ajouter une collection"}
        emuted={isloading}
      />

      {/* Form */}
      <AdminCollectionNewForm
        formData={formData}
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
