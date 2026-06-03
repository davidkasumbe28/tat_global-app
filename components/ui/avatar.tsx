"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/lib/utils/utils";

interface AvatarProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
> {
  size?: "very-small" | "small" | "medium" | "large" | "very-large";
  emuted?: boolean;
}

function Avatar({
  className,
  size,
  emuted = true,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & AvatarProps) {
  let sizeStyles = "";

  switch (size) {
    case "very-small":
      sizeStyles = "w-[26px] h-[26px]";
      break;
    case "small":
      sizeStyles = "w-[32px] h-[32px]";
      break;
    case "medium":
      sizeStyles = "w-[38px] h-[38px]";
      break;
    case "large":
      sizeStyles = "w-[54px] h-[54px]";
      break;
    case "very-large":
      sizeStyles = "w-[60px] h-[60px]";
      break;
  }

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden bg-accent rounded-full",
        emuted && "animate-pulse bg-muted-foreground",
        sizeStyles,
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Fallback
> {
  emuted?: boolean;
}

function AvatarFallback({
  className,
  emuted = true,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> &
  AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-foreground flex size-full items-center justify-center rounded-full",
        emuted
          ? "animate-pulse text-muted-foreground bg-muted-foreground"
          : "text-background",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
