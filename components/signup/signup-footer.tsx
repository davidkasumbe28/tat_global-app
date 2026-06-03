import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";

export default function SignupFooter({
  emuted = true,
  isloading = true,
  loading,
}: {
  emuted?: boolean;
  isloading?: boolean;
  loading: boolean;
}) {
  return (
    <div className="mt-8 text-center">
      <Skeleton emuted={emuted}>
        <p className={cn(emuted ? "text-muted-foreground" : "text-gray-500")}>
          Déjà inscrit ?{" "}
          <Link
            href={emuted || loading || isloading ? "#" : "/login"}
            className={cn(
              "font-semibold hover:underline",
              !emuted && !loading && "text-primary-dark hover:text-primary"
            )}
          >
            Se connecter
          </Link>
        </p>
      </Skeleton>
    </div>
  );
}
