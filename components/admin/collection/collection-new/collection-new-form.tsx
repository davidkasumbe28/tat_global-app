"use client";

import ErrorInfo from "@/components/error-info";
import SuccessInfo from "@/components/success-info";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AVAILABILITY_STATE,
  CATEGORIES_PRODUCT,
  COLLECTION_COLORS,
} from "@/lib/constants/constants";
import { acronyme } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";

interface AdminCollectionNewFormProps {
  formData: Record<string, string>;
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

export default function AdminCollectionNewForm({
  formData,
  handleChange,
  handleSubmit,
  emuted = true,
  loading,
  error,
  success,
}: AdminCollectionNewFormProps) {
  return (
    <form onSubmit={handleSubmit} className={cn("space-y-2")}>
      {/* Box Informations */}
      <div className="bg-background border border-border rounded-lg p-6 space-y-4 w-full">
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Informations de base</h2>
        </Skeleton>

        {/* Name and Sku */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/* Name */}
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">
                Nom de la collection
              </label>
            </Skeleton>
            <input
              required
              disabled={loading || emuted}
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
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Sku</label>
            </Skeleton>
            <input
              disabled
              type="text"
              name="sku"
              value={acronyme(formData.sku || "X X") + "-00000000"}
              onChange={handleChange}
              placeholder="Ex: CE-00000000"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
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
              disabled={loading || emuted}
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
                  disabled={loading || emuted}
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
                  disabled={loading || emuted}
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
                      disabled={loading || emuted}
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
        <Button
          type={"submit"}
          variant={emuted ? "emuted" : "default"}
          disabled={loading || emuted}
          className={cn(
            !emuted && "bg-foreground text-background hover:bg-primary-dark",
          )}
        >
          {loading ? "Ajout..." : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}
