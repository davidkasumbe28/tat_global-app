import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  useIcon = true,
  useText = false,
  label= "Supprimer",
  emuted = true,
  text = "text",
  size = "sm",
  fullWidth = false,
  handleDelete
}: {
  useIcon?: boolean;
  useText?: boolean;
  label?:string;
  emuted?: boolean;
  text?: string;
  size?: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
  fullWidth ?: boolean;
  handleDelete:
    | React.MouseEventHandler<HTMLButtonElement>
    | ((e: React.FormEvent<Element>) => Promise<void>);
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={size}
          variant={emuted ? "emuted" : "outline"}
          disabled={emuted}
          className={cn(
            !emuted &&
              "text-destructive hover:text-background hover:bg-destructive",
              fullWidth && "w-full"
          )}
        >
          {useIcon && !useText ? (
            <Trash2 className="w-4 h-4" />
          ) : !useIcon && useText ? (
            "Supprimer"
          ) : (
            <>
              {" "}
              <Trash2 className="w-4 h-4" /> {label}{" "}
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. {text} sera définitivement supprimé.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="hover:bg-primary-dark"
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
