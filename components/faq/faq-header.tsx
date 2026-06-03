import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function FAQHeader({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="text-center mb-12">
      <Skeleton emuted={emuted}>
        <h1 className="text-5xl font-bold mb-4">
          Questions Fréquemment Posées
        </h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className={cn("text-xl", !emuted && "text-gray-500")}>
          Trouvez les réponses à vos questions sur nos services et produits
        </p>
      </Skeleton>
    </div>
  );
}
