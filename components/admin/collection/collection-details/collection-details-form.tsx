"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AVAILABILITY_STATE,
  CATEGORIES_PRODUCT,
  COLLECTION_COLORS,
} from "@/lib/constants/constants";
import { useRef } from "react";
import ErrorInfo from "@/components/error-info";
import SuccessInfo from "@/components/success-info";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";

interface AdminCollectionDetailsFormProps {
  formData: Record<string, string>;
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

export default function AdminCollectionDetailsForm({
  formData,
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
}: AdminCollectionDetailsFormProps) {
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
                C
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
                <label className="text-sm font-semibold">
                  Nom de la collection
                </label>
              </Skeleton>
              <input
                required
                disabled={loading || emuted || !isEditing}
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Ex: Collection Été 2025"
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
                placeholder="Ex: CE-XXXXXXXX"
                className={cn(
                  "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                  (loading || emuted) &&
                    "bg-muted-foreground text-muted-foreground animate-pulse",
                )}
              />
            </div>
          </div>
        </div>

        {/* Color, Category , State and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Description */}
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Description</label>
            </Skeleton>
            <textarea
              required
              disabled={loading || emuted || !isEditing}
              name="description"
              value={formData.description}
              minLength={10}
              onChange={handleChange}
              placeholder="Décrivez la collection..."
              rows={5}
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>

          {/* Color, Category and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Color and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Color */}
              <div>
                <Skeleton emuted={emuted}>
                  <label className="text-sm font-semibold">Couleur</label>
                </Skeleton>
                <select
                  required
                  disabled={loading || emuted || !isEditing}
                  value={formData.color}
                  name="color"
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                    (loading || emuted) &&
                      "bg-muted-foreground text-muted-foreground animate-pulse",
                  )}
                >
                  {COLLECTION_COLORS.map((color, index) => (
                    <option
                      key={index}
                      className="text-black"
                      value={color.value}
                    >
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>

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
