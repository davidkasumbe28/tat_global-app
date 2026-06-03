"use client";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function Loading({ subject = "" }: { subject?: string }) {
  const { isloading } = useTheme();

  return (
    <main
      className={cn("flex-1 flex items-center justify-center min-h-screen")}
    >
      <Skeleton emuted={isloading}>
        <p className={cn(!isloading && "text-gray-500")}>
          Chargement {subject}...{" "}
        </p>
      </Skeleton>
    </main>
  );
}
