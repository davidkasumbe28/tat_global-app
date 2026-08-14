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
import { Save } from "lucide-react";

export function SaveButton({
    sku,
    useIcon = true,
    useText = false,
    emuted = true,
    text = "text",
    size = "sm",
    handleSave,
    fullWidth = false,
    children,
}: {
    sku: string;
    useIcon?: boolean;
    useText?: boolean;
    emuted?: boolean;
    text?: string;
    size?: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
    handleSave: React.MouseEventHandler<HTMLButtonElement>;
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
                        !emuted && "text-yellow-500 hover:bg-yellow-500 hover:text-background",
                        fullWidth && "w-full"
                    )}
                >
                    {useIcon && !useText ? (
                        <Save className="w-4 h-4" />
                    ) : !useIcon && useText ? (
                        "Modifier"
                    ) : (
                        <>
                            {" "}
                            <Save className="w-4 h-4" /> Enregistrer{" "}
                        </>
                    )}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Enregistrer {text}</AlertDialogTitle>
                    <AlertDialogDescription>Save {sku}</AlertDialogDescription>
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSave}
                        className="hover:bg-primary-dark"
                    >
                        Enregistrer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
