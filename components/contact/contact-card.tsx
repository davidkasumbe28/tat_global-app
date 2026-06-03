import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";
import { LucideProps } from "lucide-react";

export default function ContactCard({
  emuted = true,
  contact,
}: {
  emuted?: boolean;
  contact: {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    label: string;
    value1: string;
    value2: string;
  };
}) {
  return (
    <div
      className={cn(
        "border border-border rounded-lg p-8 text-center",
        emuted ? "bg-transparent animate-pulse" : "bg-background"
      )}
    >
      <contact.icon
        className={cn(
          "w-12 h-12 mx-auto mb-4",
          emuted
            ? "text-muted-foreground bg-muted-foreground rounded"
            : "text-foreground"
        )}
      />
      <Skeleton emuted={emuted}>
        <h3 className="font-bold text-lg mb-2">{contact.label}</h3>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className={cn(!emuted && "text-gray-500")}>{contact.value1}</p>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className={cn(!emuted && "text-gray-500")}>{contact.value2}</p>
      </Skeleton>
    </div>
  );
}
