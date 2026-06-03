"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CustomOrder } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";


interface CustomOrdersItemProps {
  order: CustomOrder;
  libAppOrder: {
    status: {
      colors: Record<string, string>;
      labels: Record<string, string>;
    };
  };
}

export default function CustomOrdersItem({
  order,
  libAppOrder,
}: CustomOrdersItemProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold">{order.title}</h3>
          <p className="text-sm text-muted-foreground">{order.description}</p>
        </div>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium ",
            libAppOrder.status.colors[order.status],
          )}
        >
          {libAppOrder.status.labels[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <span className="text-muted-foreground">Budget</span>
          <p className="font-bold">{order.budget.toLocaleString()} FCFA</p>
        </div>
        <div>
          <span className="text-muted-foreground">Devis</span>
          <p className="font-bold">
            {order.quotedPrice
              ? order.quotedPrice.toLocaleString() + " FCFA"
              : "-"}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Créée le</span>
          <p className="font-bold">{order.createdAt}</p>
        </div>
      </div>

      {order.status === "quoted" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-blue-900">
            Un devis de {order.quotedPrice?.toLocaleString()} FCFA a été proposé
            pour cette commande
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {order.status === "quoted" && (
          <>
            <Button className="flex-1 bg-green-600 text-white ">
              Accepter
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Refuser
            </Button>
          </>
        )}
        {order.status === "pending" && (
          <Button variant="outline" className="w-full bg-transparent">
            En attente de devis
          </Button>
        )}
        {order.status === "in_progress" && (
          <Button variant="outline" className="w-full bg-transparent" disabled>
            En cours de réalisation
          </Button>
        )}
        {order.status === "completed" && (
          <Button className="w-full bg-green-600 text-white" disabled>
            Complétée
          </Button>
        )}
      </div>
    </Card>
  );
}
