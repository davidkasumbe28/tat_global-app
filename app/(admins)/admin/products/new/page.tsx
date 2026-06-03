"use client";

import AdminNewHeader from "@/components/admin/admin-new-header";
import AdminProductNewForm from "@/components/admin/product/product-new/product-new-form";
import { useTheme } from "@/hooks/use-theme";
import { Collection } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { CategoryProduct, StateProduct } from "@/lib/generated/prisma/enums";
import { handleReadSelectCollections } from "@/lib/handlers/events-handlers/collection-events";
import { handleCreateProduct } from "@/lib/handlers/events-handlers/product-events";
import { useEffect, useState } from "react";

export default function CollectionNewPage() {
  const { isloading } = useTheme();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "",
    category: CategoryProduct.OTHER,
    description: null,
    features: null,
    price: 0.0,
    cost: 0.0,
    sizes: "",
    colors: "",
    stock: 0,
    rating: 0.0,
    state: StateProduct.AVAILABLE,
    collectionId: null,
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
      name === "price" ||
      name === "cost" ||
      name === "stock" ||
      name === "rating"
    ) {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
      return;
    }

    if (name === "colors" || name === "sizes")
      if (value.split(",")?.length === 1) {
        setFormData((prev) => ({ ...prev, [name]: value + "," }));
        return;
      }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { description, price, cost, stock, rating } = formData;

    for (const field of Object.keys(formData)) {
      if (
        field !== "description" &&
        field !== "collectionId" &&
        field !== "features"
      )
        if (!formData[field]) {
          setError("Tous les champs requis sont obligatoires");
          setLoading(false);
          return;
        }
    }

    if (price <= 0 || cost <= 0 || stock < 0 || rating < 0) {
      setError("Les prix et stocks doivent être positifs");
      setLoading(false);
      return;
    }

    if (cost >= price) {
      setError("Le prix doit être supérieur au coût");
      setLoading(false);
      return;
    }

    if (description?.length < 10) {
      setError("La description doit avoir plus de 10 caractères");
      setLoading(false);
      return;
    }

    const res = await handleCreateProduct(formData);

    if (res.error) {
      setError(res.error || "Une erreur est survenue lors de l'ajout");
      setLoading(false);
      return;
    }

    const product = res.data.name;

    setSuccess("Ajout du produit : " + product);

    setFormData({
      name: "",
      description: null,
      features: null,
      price: 0.0,
      cost: 0.0,
      sizes: "",
      colors: "",
      stock: 0,
      rating: 0.0,
      state: StateProduct.AVAILABLE,
      categoryId: null,
    });

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    handleReadSelectCollections("ALL", "ALL", "newest")
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }

        setCollections(res?.data);
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
        linkBack={APP.admin.products}
        labelText={"Ajouter un produit"}
        emuted={isloading}
      />

      {/* Form */}
      <AdminProductNewForm
        formData={formData}
        collections={collections}
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
