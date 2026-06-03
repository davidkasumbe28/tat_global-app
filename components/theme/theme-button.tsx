"use client";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils/utils";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function ThemeButton({ emuted = true }: { emuted?: boolean }) {
  const { theme, toggleTheme, isloadingTheme } = useTheme();

  return (
    <Skeleton emuted={isloadingTheme || emuted}>
      <Button
        size="sm"
        variant={isloadingTheme || emuted ? "emuted" : "ghost"}
        onClick={toggleTheme}
        disabled={isloadingTheme || emuted}
        className={cn("hover:bg-muted rounded-lg transition-colors")}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun
            className={cn(
              "w-5 h-5",
              isloadingTheme || emuted
                ? "text-muted-foreground"
                : "text-slate-200"
            )}
          />
        ) : (
          <Moon
            className={cn(
              "w-5 h-5 ",
              isloadingTheme || emuted
                ? "text-muted-foreground"
                : "text-slate-700"
            )}
          />
        )}
      </Button>
    </Skeleton>
  );
}
