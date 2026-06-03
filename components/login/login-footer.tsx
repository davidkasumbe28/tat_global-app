import { APP } from "@/lib/data/raw/routes";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";

export default function LoginFooter({
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
          Pas encore inscrit ?{" "}
          <Link
            href={emuted || isloading || loading ? "#" : APP.auth.signup }
            className={cn(
              "font-semibold hover:underline",
              !emuted && !loading && "text-primary-dark hover:text-primary"
            )}
          >
            Créer un compte
          </Link>
        </p>
      </Skeleton>
    </div>
  );
}
