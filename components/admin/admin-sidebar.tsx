"use client";

import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

interface AdminSidebarProps {
  links: Array<any>;
  isSidebarOpen: boolean;
  collapsed: boolean;
  emuted?: boolean;
  loading?: boolean;
}

export default function AdminSidebar({
  links,
  isSidebarOpen,
  collapsed,
  emuted = true,
  loading = true,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const enabled = (href: string) => {
    return pathname == href;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-14 h-[calc(100vh-56px)]  w-64 bg-background border-r  border-border z-50 transition-transform duration-300 overflow-y-auto",
        collapsed && " lg:translate-x-0 lg:w-18 lg:z-50 ",
        isSidebarOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
        emuted && "text-muted-foreground animate-pulse"
      )}
    >
      <div className="flex flex-col justify-between px-2.5 h-full ">
        <nav className="py-4 space-y-2">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={index}
                href={emuted || loading ? "#" : link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                  emuted || loading
                    ? "text-muted-foreground bg-muted-foreground"
                    : "hover:bg-accent",
                  !emuted &&
                    !loading &&
                    enabled(link.href) &&
                    "hover:bg-primary-dark bg-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 ",
                    !emuted &&
                      !loading &&
                      (enabled(link.href)
                        ? "text-background"
                        : "text-foreground")
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    collapsed && "lg:hidden",
                    !emuted &&
                      !loading &&
                      (enabled(link.href)
                        ? "text-background"
                        : "text-foreground")
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logo */}
        <Link
          href={emuted || loading ? "#" : "/admin"}
          className={cn("flex items-center gap-2 py-3", "justify-center px-2")}
        >
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-sm">AM</span>
          </div>{" "}
          <Skeleton
            emuted={emuted || loading}
            className={cn(collapsed ? "hidden max-lg:block" : "max-lg:block")}
          >
            <span className={cn("font-bold text-lg sm:inline")}>ADMIN</span>
          </Skeleton>
        </Link>
      </div>
    </aside>
  );
}
