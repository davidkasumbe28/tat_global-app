import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { CircleCheckBig, CircleSlash2 } from "lucide-react";

export function ChangeStateButton({
  useIcon = true,
  useText = false,
  emuted = true,
  text = "text",
  currentState = "ENABLED",
  size = "sm",
  fullWidth = false,
  handleChangeState,
}: {
  useIcon?: boolean;
  useText?: boolean;
  emuted?: boolean;
  text?: string;
  currentState: "ENABLED" | "DISABLED";
  size?: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
  fullWidth ?: boolean;
  handleChangeState: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={size}
          variant={emuted ? "emuted" : "outline"}
          disabled={emuted}
          className={cn(
            !emuted && currentState !== "ENABLED"
              ? "text-blue-600 hover:text-background hover:bg-blue-600"
              : "text-destructive hover:text-background hover:bg-destructive",
              fullWidth && "w-full"
          )}
        >
          {useIcon && !useText ? (
            currentState === "ENABLED" ? (
              <CircleSlash2 className="w-4 h-4" />
            ) : (
              <CircleCheckBig className="w-4 h-4" />
            )
          ) : !useIcon && useText ? (
            currentState === "ENABLED" ? (
              "Désactiver"
            ) : (
              "Activer"
            )
          ) : currentState === "ENABLED" ? (
            <>
              {" "}
              <CircleSlash2 className="w-4 h-4" /> Désactiver{" "}
            </>
          ) : (
            <>
              {" "}
              <CircleCheckBig className="w-4 h-4" /> Activer{" "}
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Voulez vous vraiment{" "}
            {currentState === "ENABLED" ? "désactivé" : "activé"} {text}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleChangeState}
            className="hover:bg-primary-dark"
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
