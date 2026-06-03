"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft, Edit, SquareX } from "lucide-react";
import Link from "next/link";

interface AdminCollectionDetailsHeaderProps {
  collection?: Collection;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  emuted?: boolean;
  loading: boolean;
}

export default function AdminCollectionDetailsHeader({
  collection,
  isEditing,
  setIsEditing,
  emuted = true,
  loading,
}: AdminCollectionDetailsHeaderProps) {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <Link
          href={emuted ? "#" : APP.admin.collections}
        >
          <Button
            disabled={emuted}
            variant={emuted ? "emuted" : "outline"}
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <Skeleton emuted={emuted || loading}>
            <h1 className="text-4xl font-bold">
              {collection?.name || "Nom de la collection"}
            </h1>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p className={cn(!emuted && !loading && "text-gray-500")}>
              {collection?.sku || "Sku"}
            </p>
          </Skeleton>
        </div>
      </div>
      <Button
        disabled={loading || emuted}
        type="button"
        onClick={() => setIsEditing(!isEditing)}
        variant={emuted ? "emuted" : !isEditing ? "default" : "outline"}
        className={cn(
          !isEditing &&
            !emuted &&
            !loading &&
            "bg-foreground text-background hover:bg-primary-dark",
        )}
      >
        {isEditing ? (
          <>
            <SquareX className="sm:hidden" />
            <span className="flex justify-between items-center max-sm:hidden">
              <SquareX className="w-4 h-4 mr-2" />
              <span>Annuler</span>
            </span>
          </>
        ) : (
          <>
            <Edit className="sm:hidden" />
            <span className="flex justify-between items-center max-sm:hidden">
              <Edit className="w-4 h-4 mr-2" />
              <span>Modifier</span>
            </span>
          </>
        )}
      </Button>
    </div>
  );
}
