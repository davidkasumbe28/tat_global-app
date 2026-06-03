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
import { Edit, Trash2 } from "lucide-react";

export function EditButton({
  sku,
  useIcon = true,
  useText = false,
  emuted = true,
  text = "text",
  size = "sm",
  handleEdit,
  children,
}: {
  sku: string;
  useIcon?: boolean;
  useText?: boolean;
  emuted?: boolean;
  text?: string;
  size?: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
  handleEdit: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={size}
          variant={emuted ? "emuted" : "outline"}
          disabled={emuted}
          className={cn(
            !emuted && "text-blue-500 hover:text-background hover:bg-blue-500",
          )}
        >
          {useIcon && !useText ? (
            <Edit className="w-4 h-4" />
          ) : !useIcon && useText ? (
            "Modifier"
          ) : (
            <>
              {" "}
              <Edit className="w-4 h-4" /> Modifier{" "}
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Modifier {text}</AlertDialogTitle>
          <AlertDialogDescription>Edit {sku}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            // onClick={handleEdit}
            className="hover:bg-primary-dark"
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
