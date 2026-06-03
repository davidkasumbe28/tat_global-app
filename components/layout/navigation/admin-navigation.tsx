"use client";

import { useAuth } from "@/hooks/use-auth";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { ListCollapse, LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ThemeButton from "@/components/theme/theme-button";

interface AdminNavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  emuted?: boolean;
  loading?: boolean;
}

export default function AdminNavigation({
  isSidebarOpen,
  setIsSidebarOpen,
  collapsed,
  setCollapsed,
  emuted = true,
  loading = true,
}: AdminNavigationProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const enabled = (href: string) => {
    return pathname == href;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={cn(
        " bg-background text-foreground shadow-sm shadow-foreground sticky top-0 z-40",
        emuted && "text-muted-foreground animate-pulse",
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 sm:px-6 md:px-4">
        <div
          className={cn(
            "flex justify-between items-center gap-2 w-60 ",
            collapsed && "sm:w-auto justify-start",
          )}
        >
          <Link
            href={emuted || loading ? "#" : APP.public.home}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold">
              TG
            </div>{" "}
            <Skeleton emuted={emuted || loading}>
              <span
                className={cn("font-bold hidden sm:inline", collapsed && "")}
              >
                TAT GLOBAL
              </span>
            </Skeleton>
          </Link>
          <Button
            size="sm"
            variant={emuted ? "emuted" : "ghost"}
            onClick={() => setCollapsed(!collapsed)}
            disabled={emuted}
            className="p-2 hover:bg-accent rounded max-lg:hidden"
          >
            <ListCollapse
              className={cn("w-5 h-5 transition", !collapsed && "rotate-180")}
            />
          </Button>
        </div>

        <div className="flex justify-end items-end gap-1">
          {/* Theme Button */}
          <ThemeButton emuted={emuted} />

          <Link href={emuted || loading ? "#" : APP.private.account}>
            <Button size="sm" variant={emuted || loading ? "emuted" : "ghost"}>
              <User
                className={cn(
                  "w-4 h-4 hover:text-primary ",
                  !emuted &&
                    !loading &&
                    enabled("/account") &&
                    "text-primary-dark hover:text-primary",
                )}
              />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant={emuted || loading ? "emuted" : "ghost"}
              onClick={handleLogout}
              disabled={emuted || loading}
              className={cn(
                !emuted &&
                  !loading &&
                  "text-destructive hover:text-destructive",
              )}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            disabled={emuted}
            className={cn(
              "lg:hidden p-2 rounded",
              emuted ? "bg-muted-foreground" : "hover:bg-accent",
            )}
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
