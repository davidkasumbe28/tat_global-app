"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft, Edit, SquareX } from "lucide-react";
import Link from "next/link";
import { formatDate } from "./../../../../lib/utils/date";
import { StatusOrder } from "@/lib/generated/prisma/enums";

interface AdminOrderDetailsHeaderProps {
  order?: Order;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  emuted?: boolean;
  loading: boolean;
}

export default function AdminOrderDetailsHeader({
  order,
  isEditing,
  setIsEditing,
  emuted = true,
  loading,
}: AdminOrderDetailsHeaderProps) {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <Link href={emuted ? "#" : APP.admin.orders}>
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
              {order?.orderNumber || "ID de la commande"}
            </h1>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p className={cn(!emuted && !loading && "text-gray-500")}>
              {formatDate(new Date(order?.createdAt || "Date de création"))}
            </p>
          </Skeleton>
        </div>
      </div>
      {(StatusOrder.PENDING === order?.status ||
        StatusOrder.CONFIRMED === order?.status ||
        StatusOrder.IN_PREPARATION === order?.status) && (
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
      )}
    </div>
  );
}
