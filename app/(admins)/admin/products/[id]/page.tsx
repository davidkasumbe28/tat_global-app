"use client";

import AdminProductDetailsForm from "@/components/admin/product/product-details/product-details-form";
import AdminProductDetailsHeader from "@/components/admin/product/product-details/product-details-header";
import AdminProductDetailsMoreDetail from "@/components/admin/product/product-details/product-details-more-detail";
import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import { useTheme } from "@/hooks/use-theme";
import { Collection, Product } from "@/lib/@types/types";
import { handleReadSelectCollections } from "@/lib/handlers/events-handlers/collection-events";
import {
  handleDeleteProduct,
  handleReadProduct,
  handleUpdateProduct,
} from "@/lib/handlers/events-handlers/product-events";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  const { isloading } = useTheme();
  const [product, setProduct] = useState<Product>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [changeData, setChangeData] = useState<Record<string, any>>({});
  const [collections, setCollections] = useState<Collection[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({
    name: product?.name,
    sku: product?.sku,
    category: product?.category,
    description: product?.description,
    features: product?.features,
    price: product?.price,
    cost: product?.cost,
    sizes: product?.sizes,
    colors: product?.colors,
    stock: product?.stock,
    rating: product?.rating,
    state: product?.state,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (
      name === "price" ||
      name === "cost" ||
      name === "stock" ||
      name === "rating"
    ) {
      setChangeData((prev) => ({ ...prev, [name]: parseFloat(value) }));
      return;
    }

    if (name === "colors" || name === "sizes")
      if (value.split(",")?.length === 1) {
        setChangeData((prev) => ({ ...prev, [name]: value + "," }));
        return;
      }

    setChangeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await handleDeleteProduct(id);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setSuccess("success");
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      name,
      sku,
      description,
      category,
      features,
      price,
      cost,
      sizes,
      colors,
      stock,
      rating,
      state,
    } = formData;

    if (
      name == product?.name &&
      sku == product?.sku &&
      category == product?.category &&
      description == product?.description &&
      features == product?.features &&
      price == product?.price &&
      cost == product?.cost &&
      sizes == product?.sizes &&
      colors == product?.colors &&
      stock == product?.stock &&
      rating == product?.rating &&
      state == product?.state
    )
      return;

    setLoading(true);
    setError("");
    setSuccess("");

    for (const field of Object.keys(changeData)) {
      if (
        field !== "description" &&
        field !== "collectionId" &&
        field !== "features"
      )
        if (!changeData[field]) {
          setError("Tous les champs requis sont obligatoires");
          setLoading(false);
          return;
        }
    }

    if (
      changeData?.price <= 0 ||
      changeData?.cost <= 0 ||
      changeData?.stock < 0 ||
      changeData?.rating < 0
    ) {
      setError("Les prix et stocks doivent être positifs");
      setLoading(false);
      return;
    }

    if (changeData?.cost >= changeData?.price) {
      setError("Le prix doit être supérieur au coût");
      setLoading(false);
      return;
    }

    if (changeData?.description?.length < 10) {
      setError("La description doit avoir plus de 10 caractères");
      setLoading(false);
      return;
    }

    const res = await handleUpdateProduct(parseInt(productId), changeData);

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de la mise à jour du produit",
      );
      setLoading(false);
      return;
    }

    const message = "Mise à jour du produit : " + product?.name;

    setSuccess(message);
    setIsEditing(false);
    setLoading(false);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleSubmitFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier");
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();

      form.append("file", selectedFile);

      // const res = await handleUploadProductImage(
      //   parseInt(productId),
      //   selectedFile,
      //   setProgress,
      //   setUploading,
      //   inputRef,
      //   setError,
      // );

      // if (res.error) {
      //   setError(
      //     res.error ||
      //       "Une erreur est survenue lors de la mise à jour de l' image",
      //   );
      //   return;
      // }

      const message = "Mise à jour du produit : " + product?.name;

      setSuccess(message);
      setIsEditingImage(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsEditingImage(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    handleReadSelectCollections(formData?.category || "ALL", "ALL", "newest")
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
  }, [success, formData?.category]);

  useEffect(() => {
    setLoading(true);

    handleReadProduct(parseInt(productId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }
        setProduct(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [success]);

  useEffect(() => {
    if (selectedFile) setIsEditingImage(true);
  }, [selectedFile]);

  if (loading) return <Loading subject="du produit" />;

  if (!product && !loading)
    return (
      <Error error={error || "Aucune information disponible sur ce produit."} />
    );

  return (
    <main className="flex-1 space-y-4">
      {/* Header */}
      <AdminProductDetailsHeader
        product={product}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        emuted={isloading}
        loading={loading}
      />

      {/* Form */}
      <AdminProductDetailsForm
        formData={formData}
        collections={collections}
        preview={preview}
        isEditingImage={isEditingImage}
        isEditing={isEditing}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSubmitFile={handleSubmitFile}
        handleFile={handleFile}
        emuted={isloading}
        loading={loading}
        uploading={uploading}
        error={error}
        success={success}
      />

      {/* More informations */}
      {!isEditing && (
        <AdminProductDetailsMoreDetail
          product={product}
          handleDelete={handleDelete}
          emuted={isloading}
          loading={loading}
        />
      )}
    </main>
  );
}
