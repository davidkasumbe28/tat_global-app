import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function BeautyHeader({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="text-center mb-12">
      <Skeleton emuted={emuted}>
        <h1 className="text-4xl font-bold mb-4">Services de Beauté</h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className={cn("text-xl", !emuted && "text-gray-500")}>
          Coiffure, manucure et maquillage à domicile ou en salon
        </p>
      </Skeleton>
    </div>
  );
}
