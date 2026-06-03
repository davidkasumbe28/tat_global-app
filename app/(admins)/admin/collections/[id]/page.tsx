"use client";

import AdminCollectionDetailsForm from "@/components/admin/collection/collection-details/collection-details-form";
import AdminCollectionDetailsHeader from "@/components/admin/collection/collection-details/collection-details-header";
import AdminCollectionDetailsMoreDetail from "@/components/admin/collection/collection-details/collection-details-more-detail";
import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import { useTheme } from "@/hooks/use-theme";
import { Collection } from "@/lib/@types/types";
import {
  handleDeleteCollection,
  handleReadCollection,
  handleUpdateCollection,
} from "@/lib/handlers/events-handlers/collection-events";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CollectionDetailsPage() {
  const params = useParams();
  const collectionId = params.id as string;
  const { isloading } = useTheme();
  const [collection, setCollection] = useState<Collection>();
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
  const [formData, setFormData] = useState<Record<string, any>>({
    name: collection?.name,
    category: collection?.category,
    description: collection?.description,
    image: collection?.image,
    color: collection?.color,
    state: collection?.state,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setChangeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await handleDeleteCollection(id);

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

    const { name, category, description, color, state } = formData;

    if (
      name == collection?.name &&
      category == collection?.category &&
      description == collection?.description &&
      color == collection?.color &&
      state == collection?.state
    )
      return;

    setError("");
    setLoading(true);
    setSuccess("");

    // Validation
    for (const field of Object.keys(changeData)) {
      if (field !== "description")
        if (!changeData[field]) {
          setError("Veuillez remplir tous les champs");
          setLoading(false);
          break;
        }
    }

    if (changeData?.description?.length < 10) {
      setError("La description doit avoir plus de 10 caractères");
      setLoading(false);
      return;
    }

    const res = await handleUpdateCollection(
      parseInt(collectionId),
      changeData,
    );

    if (res.error) {
      setError(res.error || "Une erreur est survenue lors de la mise à jour");
      setLoading(false);
      return;
    }

    const message = "Mise à jour de la collection : " + collection?.name;

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

      // const res = await handleUploadCollectionImage(
      //   parseInt(collectionId),
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
      const message = "Mise à jour de la collection : " + collection?.name;

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
    handleReadCollection(parseInt(collectionId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }
        setCollection(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [success, isEditing]);

  useEffect(() => {
    if (selectedFile) setIsEditingImage(true);
  }, [selectedFile]);

  if (loading) return <Loading subject="de la collection" />;

  if (!collection && !loading)
    return (
      <Error
        error={error || "Aucune information disponible sur cette collection."}
      />
    );

  return (
    <main className="flex-1 space-y-2">
      {/* Header */}
      <AdminCollectionDetailsHeader
        collection={collection}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        emuted={isloading}
        loading={loading}
      />

      {/* Form */}
      <AdminCollectionDetailsForm
        formData={formData}
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
        <AdminCollectionDetailsMoreDetail
          collection={collection}
          handleDelete={handleDelete}
          emuted={isloading}
          loading={loading}
        />
      )}
    </main>
  );
}
