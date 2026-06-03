"use client";

import { Button } from "@/components/ui/button";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { UserRound, UserRoundCog } from "lucide-react";
import Link from "next/link";

interface UserHeaderProps {
  emuted?: boolean;
}

export default function UserHeader({ emuted = true }: UserHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 ">
      <h1 className="text-4xl font-bold">Gestion des utilisateurs</h1>
      <div className="flex max-sm:flex-col items-center justify-between gap-2">
        <Link href={emuted ? "#" : APP.admin.customers}>
                <Button
                  variant={emuted ? "emuted" : "default"}
                  className={cn(
                    !emuted && "bg-foreground text-background hover:bg-primary-dark",
                  )}
                >
                  <UserRound className="md:hidden" />
                  <span className="flex justify-between items-center max-md:hidden">
                    <UserRound className="w-4 h-4 mr-2" />
                    <span>Clients</span>
                  </span>
                </Button>
        </Link>
        <Link href={emuted ? "#" : APP.admin.managers}>
                <Button
                  variant={emuted ? "emuted" : "default"}
                  className={cn(
                    !emuted && "bg-foreground text-background hover:bg-primary-dark",
                  )}
                >
                  <UserRoundCog className="md:hidden" />
                  <span className="flex justify-between items-center max-md:hidden">
                    <UserRoundCog className="w-4 h-4 mr-2" />
                    <span>Admins</span>
                  </span>
                </Button>
        </Link>
      </div>
    </div>
  );
}
