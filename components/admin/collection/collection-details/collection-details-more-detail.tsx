"use client";

import { DeleteButton } from "@/components/delete-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection } from "@/lib/@types/types";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";

interface AdminCollectionDetailsMoreDetailProps {
  collection?: Collection;
  handleDelete: (id: number) => void;
  emuted?: boolean;
  loading: boolean;
}

export default function AdminCollectionDetailsMoreDetail({
  collection,
  handleDelete,
  emuted = true,
  loading,
}: AdminCollectionDetailsMoreDetailProps) {
  return (
    <div className="bg-background border border-border rounded-lg p-6 space-y-4">
      <div className="space-y-4">
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Autre informations</h2>
        </Skeleton>
        <div className="grid grid-cols-1 md:grid-cols-4 space-y-3">
          <div className="col-span-3 grid grid-cols-2 sm:grid-cols-3">
            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Produits
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {collection?._count?.products || 0}{" "}
                  {(collection?._count?.products || 0) > 1
                    ? "produits"
                    : "produit"}
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
                  {formatDate(new Date(collection?.createdAt || Date.now()))}
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
                  {formatDate(new Date(collection?.updatedAt || Date.now()))}
                </p>
              </Skeleton>
            </div>
          </div>
          <div className="flex justify-end items-end">
            <DeleteButton
              useIcon={false}
              handleDelete={() => handleDelete(collection?.id as number)}
              text={"Cette collection"}
              size="default"
              emuted={emuted || loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
