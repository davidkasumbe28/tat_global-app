import { Skeleton } from "@/components/ui/skeleton";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";

export default function ForgetPasswordFooter({
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
        <p className={cn(!emuted && "text-gray-600")}>
          <Link
            href={emuted || isloading || loading ? "#" : APP.auth.login}
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
