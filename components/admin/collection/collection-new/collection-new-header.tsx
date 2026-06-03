"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP } from "@/lib/data/raw/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminCollectionNewHeaderProps {
  emuted?: boolean;
}

export default function AdminCollectionNewHeader({
  emuted = true,
}: AdminCollectionNewHeaderProps) {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <Link href={emuted ? "#" : APP.admin.collections}>
          <Button
            disabled={emuted}
            variant={emuted ? "emuted" : "outline"}
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <Skeleton emuted={emuted}>
            <h1 className="text-4xl font-bold">Ajouter une collection</h1>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
