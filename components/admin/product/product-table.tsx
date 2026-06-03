"use client";

import { DeleteButton } from "@/components/delete-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/@types/types";
import { CATEGORIES_PRODUCT } from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import { StateProduct } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/utils";
import { Eye } from "lucide-react";
import Link from "next/link";

interface ProductTableProps {
  products: Product[];
  handleDelete: (id: number) => void;
  emuted?: boolean;
  loading: boolean;
}

export default function ProductTable({
  products,
  handleDelete,
  emuted = true,
  loading,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-950 border-b border-border">
          <tr>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Produit</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Catégorie</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Prix</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Stock</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Etat</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Actions</Skeleton>
            </th>
          </tr>
        </thead>
        {products?.length > 0 && !loading && (
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border hover:bg-accent transition"
              >
                <td className="py-3 px-4 ">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-100 rounded max-lg:hidden">
                      <img
                        src={
                          emuted
                            ? "/placeholder.svg"
                            : product.image || "/placeholder.svg"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <Skeleton emuted={emuted}>
                        <span className="font-semibold">{product.name}</span>
                      </Skeleton>
                      <Skeleton emuted={emuted}>
                        <span
                          className={cn("text-sm", !emuted && "text-gray-500")}
                        >
                          {product.sku}
                        </span>
                      </Skeleton>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    {CATEGORIES_PRODUCT.map((category) => {
                      if (category.value == product.category)
                        return category.label;
                    })}
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    <span
                      className={cn("font-bold", !emuted && "text-foreground")}
                    >
                      {parseFloat(product?.price?.toString())?.toFixed(2)}$
                    </span>
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        !emuted &&
                          (product.stock > 20
                            ? "bg-green-100 text-green-700"
                            : product.stock > 10
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"),
                      )}
                    >
                      {product.stock} 
                      {/* {" produits"}  */}
                    </span>
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        !emuted &&
                          (product.state === StateProduct.AVAILABLE
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"),
                      )}
                    >
                      {product.state === StateProduct.AVAILABLE
                        ? "disponible"
                        : "indisponible"}
                    </span>
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Link
                      href={
                        emuted ? "#" : APP.admin.products + "/" + product.id
                      }
                    >
                      <Button
                        size="sm"
                        variant={emuted ? "emuted" : "default"}
                        className={cn(!emuted && " hover:bg-primary-dark")}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DeleteButton
                      handleDelete={() => handleDelete(product.id)}
                      text="Ce produit"
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
