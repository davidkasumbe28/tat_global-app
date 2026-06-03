"use client";

import ErrorInfo from "@/components/error-info";
import SuccessInfo from "@/components/success-info";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection } from "@/lib/@types/types";
import {
  AVAILABILITY_STATE,
  CATEGORIES_PRODUCT,
} from "@/lib/constants/constants";
import { cn } from "@/lib/utils/utils";
import { useRef } from "react";

interface AdminProductDetailsFormProps {
  formData: Record<string, string>;
  collections: Collection[];
  preview: string;
  isEditingImage: boolean;
  isEditing: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmitFile: (e: React.FormEvent<Element>) => Promise<void>;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  emuted?: boolean;
  loading: boolean;
  uploading: boolean;
  error: string;
  success: string;
}

export default function AdminProductDetailsForm({
  formData,
  collections,
  preview,
  isEditingImage,
  isEditing,
  handleChange,
  handleSubmit,
  handleSubmitFile,
  handleFile,
  emuted = true,
  loading,
  uploading,
  error,
  success,
}: AdminProductDetailsFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-2")}>
      {/* Box Informations */}
      <div className="bg-background border border-border rounded-lg p-6 space-y-4 w-full">
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Informations de base</h2>
        </Skeleton>

        {/* Image , Name , Sku */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Image */}
          <div className="col-span-1 flex justify-between gap-4 items-center ">
            <Avatar
              onClick={openFilePicker}
              size="very-large"
              className={cn("justify-center items-center m-0")}
              emuted={emuted || loading || uploading}
            >
              <AvatarImage
                src={
                  emuted || loading || uploading
                    ? "/placeholder.svg"
                    : preview || formData?.image || " "
                }
                alt={formData?.name}
              />
              <AvatarFallback
                emuted={emuted || loading || uploading}
                className="text-2xl font-bold"
                delayMs={500}
              >
                P
              </AvatarFallback>
            </Avatar>
            <div className="flex items-end justify-end h-full">
              {isEditingImage && (
                <Button
                  onClick={handleSubmitFile}
                  type={"button"}
                  variant={
                    emuted ? "emuted" : isEditingImage ? "default" : "outline"
                  }
                  disabled={emuted || loading || uploading}
                  className={
                    isEditingImage
                      ? "bg-foreground hover:bg-primary-dark text-background"
                      : ""
                  }
                >
                  {uploading || loading ? "Enregistrement...." : "Enregistrer"}
                </Button>
              )}
              <input
                // required
                type="file"
                ref={inputRef}
                onChange={handleFile}
                accept="image/*"
                name="image"
                id="image"
                className="hidden"
              />
            </div>
          </div>

          {/* Name and Sku */}
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 ">
            {/* Name */}
            <div className="sm:col-span-2">
              <Skeleton emuted={emuted}>
                <label className="text-sm font-semibold">Nom du produit</label>
              </Skeleton>
              <input
                required
                disabled={loading || emuted || !isEditing}
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Ex: Chemise Premium Coton"
                className={cn(
                  "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                  (loading || emuted) &&
                    "bg-muted-foreground text-muted-foreground animate-pulse",
                )}
              />
            </div>

            {/* Sku */}
            <div className="sm:col-span-1">
              <Skeleton emuted={emuted}>
                <label className="text-sm font-semibold">Sku</label>
              </Skeleton>
              <input
                required
                disabled
                type="text"
                name="sku"
                value={formData.sku || ""}
                onChange={handleChange}
                placeholder="Ex: CPC-XXXXXXXX"
                className={cn(
                  "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                  (loading || emuted) &&
                    "bg-muted-foreground text-muted-foreground animate-pulse",
                )}
              />
            </div>
          </div>
        </div>

        {/* Description and Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Description */}
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Description</label>
            </Skeleton>
            <textarea
              disabled={loading || emuted || !isEditing}
              name="description"
              value={formData.description || ""}
              minLength={10}
              onChange={handleChange}
              placeholder="Décrivez le produit..."
              rows={5}
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>

          {/* Features */}
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Caractéristiques</label>
            </Skeleton>
            <textarea
              disabled={loading || emuted || !isEditing}
              name="features"
              value={formData.features || ""}
              minLength={10}
              onChange={handleChange}
              placeholder="Ex: Coton premium 100%, Coupe classique, Lavage facile, Disponible en 5 couleurs"
              rows={5}
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>
        </div>

        {/* Category , Cost , Price , Stock and Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Catégorie</label>
            </Skeleton>
            <select
              required
              disabled={loading || emuted || !isEditing}
              value={formData.category}
              name="category"
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            >
              {CATEGORIES_PRODUCT.map(
                (category, index) =>
                  category.value !== "ALL" && (
                    <option
                      key={index}
                      className="text-black"
                      value={category.value}
                    >
                      {category.label}
                    </option>
                  ),
              )}
            </select>
          </div>

          {/* Cost , Price , Stock and Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cost and Price */}
            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <Skeleton emuted={emuted}>
                  <label className="text-sm font-semibold">Prix ($)</label>
                </Skeleton>
                <input
                  required
                  disabled={loading || emuted || !isEditing}
                  value={formData.price || ""}
                  type="number"
                  name="price"
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
              {/* Cost */}
              <div>
                <Skeleton emuted={emuted}>
                  <label className="text-sm font-semibold">Coût ($)</label>
                </Skeleton>
                <input
                  required
                  disabled={loading || emuted || !isEditing}
                  value={formData.cost || ""}
                  type="number"
                  name="cost"
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
            </div>
            {/* Stock and Rating */}
            <div className="lg:col-span-1 grid grid-cols-2 gap-4">
              {/* Stock */}
              <div>
                <Skeleton emuted={emuted}>
                  <label className="text-sm font-semibold">Stock</label>
                </Skeleton>
                <input
                  required
                  disabled={loading || emuted || !isEditing}
                  value={formData.stock || ""}
                  type="number"
                  min={0}
                  name="stock"
                  onChange={handleChange}
                  placeholder="0"
                  className={cn(
                    "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                    (loading || emuted) &&
                      "bg-muted-foreground text-muted-foreground animate-pulse",
                  )}
                />
              </div>
              {/* Rating */}
              <div>
                <Skeleton emuted={emuted}>
                  <label className="text-sm font-semibold">Notation</label>
                </Skeleton>
                <input
                  required
                  type="number"
                  disabled={loading || emuted || !isEditing}
                  value={formData.rating || ""}
                  min={0.0}
                  max={5}
                  name="rating"
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
            </div>
          </div>
        </div>

        {/* Colors and Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Colors */}
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">
                Couleurs disponibles
              </label>
            </Skeleton>
            <input
              required
              type="text"
              disabled={loading || emuted || !isEditing}
              value={formData.colors || ""}
              name="colors"
              onChange={handleChange}
              placeholder="Ex: Blanc, Noir, Bleu"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>
          {/* Sizes */}
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">
                Tailles disponibles
              </label>
            </Skeleton>
            <input
              type="text"
              disabled={loading || emuted || !isEditing}
              value={formData.sizes || ""}
              name="sizes"
              onChange={handleChange}
              placeholder="Ex: XS, S, M, L, XL"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>
        </div>

        {/* Collection and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Collection */}
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Collection</label>
            </Skeleton>
            <select
              disabled={loading || emuted || !isEditing}
              value={formData.collectionId || 0}
              name="collectionId"
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
              {collections.map((collection, index) => (
                <option
                  key={index}
                  className="text-black"
                  value={collection.id}
                >
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="h-full">
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Etat</label>
            </Skeleton>
            <div className="flex gap-2 sm:gap-8 px-2 sm:px-4 py-2 rounded-lg mt-1 border">
              {AVAILABILITY_STATE.map((state, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    required
                    disabled={loading || emuted || !isEditing}
                    type="radio"
                    name="state"
                    value={state.value}
                    checked={formData.state === state.value}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <Skeleton emuted={emuted}>
                    <span>{state.label}</span>
                  </Skeleton>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorInfo info={error} emuted={emuted} />}

      {success && <SuccessInfo info={success} emuted={emuted} />}

      {/* Actions */}
      <div className="flex justify-end">
        {isEditing && (
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
        )}
      </div>
    </form>
  );
}
