import { cn } from "@/lib/utils/utils";
import { Button } from "../ui/button";

export default function LoginSocial({
  emuted = true,
  isloading = true,
  loading,
}: {
  emuted?: boolean;
  isloading?: boolean;
  loading: boolean;
}) {
  return (
    <>
      <div className="my-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-gray-600">Ou</span>
        </div>
      </div>
      <div className="space-y-3">
        <Button
          disabled={emuted || loading || isloading}
          variant={emuted ? "emuted" : "outline"}
          className={cn("w-full", !emuted && "bg-transparent")}
        >
          Continuer avec Google
        </Button>
        <Button
          disabled={emuted || loading || isloading}
          variant={emuted ? "emuted" : "outline"}
          className={cn("w-full", !emuted && "bg-transparent")}
        >
          Continuer avec Facebook
        </Button>
      </div>
    </>
  );
}
