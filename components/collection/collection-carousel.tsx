import { Collection } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";
import CollectionCard from "./collection-card";

export default function CollectionCarousel({
  emuted = true,
  loading,
  collections,
  selectedCollection,
  setSelectedCollection,
}: {
  emuted?: boolean;
  loading: boolean;
  collections: Collection[];
  selectedCollection: number;
  setSelectedCollection: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <>
      {loading ? (
        <div className="text-center py-12">
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Chargement des collections...
            </p>
          </Skeleton>
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-12">
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Aucune collection disponible.
            </p>
          </Skeleton>
        </div>
      ) : (
        <div className="flex overflow-x-scroll py-4 max-sm:p-2 px-5 max-w-full gap-5 mb-14">
          {collections?.map((collection, index) => (
            <CollectionCard
              key={index}
              collection={collection}
              selectedCollection={selectedCollection}
              setSelectedCollection={setSelectedCollection}
              emuted={emuted}
            />
          ))}
        </div>
      )}
    </>
  );
}
