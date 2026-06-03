"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP } from "@/lib/data/raw/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminNewHeaderProps {
  linkBack: string;
  labelText: string;
  emuted?: boolean;
}

export default function AdminNewHeader({
  linkBack = APP.admin.dashboard,
  labelText = "Ajouter un produit",
  emuted = true,
}: AdminNewHeaderProps) {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <Link href={emuted ? "#" : linkBack}>
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
            <h1 className="text-4xl font-bold">{labelText}</h1>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
