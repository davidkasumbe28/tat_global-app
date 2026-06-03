"use client";

import { DeleteButton } from "@/components/delete-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/@types/types";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";

interface AdminProductDetailsMoreDetailProps {
  product?: Product;
  handleDelete: (id: number) => void;
  emuted?: boolean;
  loading: boolean;
}

export default function AdminProductDetailsMoreDetail({
  product,
  handleDelete,
  emuted = true,
  loading,
}: AdminProductDetailsMoreDetailProps) {
  return (
    <div className="bg-background border border-border rounded-lg p-6 space-y-4">
      <div className="space-y-4">
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Autre informations</h2>
        </Skeleton>

        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-4 grid grid-cols-1 sm:grid-cols-4">
            <div className="col-span-2">
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Numéro de suivi
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">{product?.trackingNumber}</p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Favoris
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {product?._count?.favorites || 0}{" "}
                  {(product?._count?.favorites || 0) > 1 ? "favoris" : "favori"}
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Avis
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {product?._count?.reviews || 0} avis{", note : "}
                  {product?.reviews?.length && product?.reviews?.length > 0
                    ? (product?.reviews?.reduce(
                        (total, item) => total + item?.rating,
                        0,
                      ) || 0) / (product?.reviews?.length || 0)
                    : 0}
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Panier
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {product?._count?.cartItems || 0} fois
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Ajouter
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {formatDate(new Date(product?.createdAt || Date.now()))}
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Modifier
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {formatDate(new Date(product?.updatedAt || Date.now()))}
                </p>
              </Skeleton>
            </div>

            {/* <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Produits
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {product?._count?.products || 0}{" "}
                  {(product?._count?.products || 0) > 1
                    ? "produits"
                    : "produit"}
                </p>
              </Skeleton>
            </div> */}
          </div>
          <div className="flex justify-end items-end">
            <DeleteButton
              useIcon={false}
              handleDelete={() => handleDelete(product?.id as number)}
              text={"Ce produit"}
              size="default"
              emuted={emuted || loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
