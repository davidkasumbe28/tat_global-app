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

export function ModalButton({
    description = "",
    emuted = true,
    title,
    label = "button",
    size = "sm",
    handler,
    fullWidth = false,
    children,
}: {
    description?: string;
    emuted?: boolean;
    title: string;
    label?: string;
    size?: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
    handler: React.MouseEventHandler<HTMLButtonElement>;
    fullWidth?: boolean;
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
                        !emuted && "text-primary-dark hover:text-background hover:bg-primary-dark",
                        fullWidth && "w-full"
                    )}
                >
                    {label && <span className="mr-2">{label}</span>}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handler}
                        className="hover:bg-primary-dark"
                    >
                        Confirmer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
