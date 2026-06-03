"use client";

import { Collection } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import { Sparkles } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface CollectionCardProps {
  collection: Collection;
  selectedCollection: number;
  setSelectedCollection: React.Dispatch<React.SetStateAction<number>>;
  emuted?: boolean;
}

export default function CollectionCard({
  collection,
  selectedCollection,
  setSelectedCollection,
  emuted = true,
}: CollectionCardProps) {
  return (
    <div
      key={collection.id}
      onClick={() => {
        if (!emuted) setSelectedCollection(collection.id);
      }}
      className={cn(
        "cursor-pointer rounded-lg overflow-hidden min-w-[374px] max-sm:min-w-[295px] transition-all transform hover:scale-105",
        selectedCollection === collection.id && "ring-2 ring-primary-dark",
        emuted &&
          selectedCollection === collection.id &&
          "ring-2 ring-muted-foreground",
      )}
    >
      <div className="relative h-48">
        <img
          src={
            emuted ? "/placeholder.svg" : collection.image || "/placeholder.svg"
          }
          alt={collection.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton emuted={emuted}>
              <Sparkles className="w-4 h-4" />
            </Skeleton>
            <Skeleton emuted={emuted}>
              <span className="text-sm font-semibold">Collection</span>
            </Skeleton>
          </div>
          <Skeleton emuted={emuted}>
            <h3 className="font-bold text-lg">{collection.name}</h3>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn("text-sm", !emuted && "text-gray-200")}>
              {collection.description}
            </p>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
