import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";


export default function VerifyHeader({
  emuted = true,
  isloading = true,
  user,
}: {
  emuted?: boolean;
  isloading?: boolean;
  user: { avatar?: string; name?: string; email?: string };
}) {
  return (
    <div className="text-start">
      <div
        className={cn(
          "w-12 h-12 bg-foreground rounded-lg flex items-center justify-center mx-2 mb-4",
          emuted && "animate-pulse",
        )}
      >
        <span className="text-background font-bold text-2xl">TG</span>
      </div>
      <div className="flex flex-col justify-center items-start gap-3 py-4">
        <Skeleton emuted={emuted}>
          <h1 className="text-3xl font-bold">Récupération de compte</h1>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <p className={cn(!emuted && "text-gray-500")}>
            Afin de protéger votre compte, TAT GLOBAL veut s'assurer que c'est bien
            vous qui essayez de récuperer votre compte.
          </p>
        </Skeleton>
      </div>

      <div className="pt-4">
        <Avatar
          size="small"
          emuted={isloading || emuted}
          className={cn("justify-center items-center m-0")}
        >
          <AvatarImage
            src={isloading || emuted ? "" : user.avatar}
            alt="Photo de profil"
          />
          <AvatarFallback
            emuted={isloading || emuted}
            className="text-2xl font-bold"
            delayMs={600}
          >
            {user.name?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Skeleton emuted={emuted}>
          <p className={cn(!emuted && "text-gray-500")}>{user.email}</p>
        </Skeleton>
      </div>

    </div>
  );
}
