"use client";

import { DeleteButton } from "@/components/delete-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection } from "@/lib/@types/types";
import { CATEGORIES_PRODUCT } from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import { StateCollection } from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";
import { Eye } from "lucide-react";
import Link from "next/link";

interface CollectionTableProps {
  collections: Collection[];
  handleDelete: (id: number) => void;
  emuted?: boolean;
  loading: boolean;
}

export default function CollectionTable({
  collections,
  handleDelete,
  emuted = true,
  loading,
}: CollectionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-950 border-b border-border">
          <tr>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Collection</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Catégorie</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Produits</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Ajouter</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Etat</Skeleton>{" "}
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Actions</Skeleton>{" "}
            </th>
          </tr>
        </thead>
        {collections?.length > 0 && !loading && (
          <tbody>
            {collections?.map((collection) => (
              <tr
                key={collection.id}
                className="border-b border-border hover:bg-accent transition"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded max-lg:hidden">
                      <img
                        src={
                          emuted
                            ? "/placeholder.svg"
                            : collection.image || "/placeholder.svg"
                        }
                        alt={collection.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <Skeleton emuted={emuted}>
                        <span className="font-semibold">{collection.name}</span>
                      </Skeleton>
                      <Skeleton emuted={emuted}>
                        <span
                          className={cn("text-sm", !emuted && "text-gray-500")}
                        >
                          {collection.sku}
                        </span>
                      </Skeleton>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    {CATEGORIES_PRODUCT.map((category) => {
                      if (category.value == collection.category)
                        return category.label;
                    })}
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    {collection?._count?.products || 0}{" "}
                    {(collection?._count?.products || 0) > 1 &&
                    collection?._count?.products !== 0
                      ? "produits"
                      : "produit"}
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    {formatDate(new Date(collection.createdAt))}
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        !emuted &&
                          (collection.state === StateCollection.AVAILABLE
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"),
                      )}
                    >
                      {collection.state == StateCollection.AVAILABLE
                        ? "disponible"
                        : "indisponible"}
                    </span>
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Link
                      href={
                        emuted
                          ? "#"
                          : APP.admin.collections + "/" + collection.id
                      }
                    >
                      <Button
                        size="sm"
                        variant={emuted ? "emuted" : "default"}
                        className={cn(!emuted && " hover:bg-primary-dark")}
                      >
                        <Eye className={cn("w-4 h-4")} />
                      </Button>
                    </Link>
                    <DeleteButton
                      handleDelete={() => handleDelete(collection.id)}
                      text="Cette collection"
                      emuted={emuted}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
