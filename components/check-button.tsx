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
import { CheckCircle } from "lucide-react";

export function CheckButton({
    sku,
    useIcon = true,
    useText = false,
    emuted = true,
    text = "text",
    size = "sm",
    handleCheck,
    fullWidth = false,
    children,
}: {
    sku: string;
    useIcon?: boolean;
    useText?: boolean;
    emuted?: boolean;
    text?: string;
    size?: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
    handleCheck: React.MouseEventHandler<HTMLButtonElement>;
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
                        <CheckCircle className="w-4 h-4" />
                    ) : !useIcon && useText ? (
                        "Modifier"
                    ) : (
                        <>
                            {" "}
                            <CheckCircle className="w-4 h-4" /> Confirmer{" "}
                        </>
                    )}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer {text}</AlertDialogTitle>
                    <AlertDialogDescription>Confirm {sku}</AlertDialogDescription>
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter>
                    <AlertDialogCancel>Non</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleCheck}
                        className="hover:bg-primary-dark"
                    >
                        Oui
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
