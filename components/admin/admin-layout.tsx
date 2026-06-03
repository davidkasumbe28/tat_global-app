"use client";

import type React from "react";
import { useState } from "react";
import links from "@/lib/app/admin/links/links";
import AdminSidebar from "./admin-sidebar";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import AdminNavigation from "../layout/navigation/admin-navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <main className="flex-1 overflow-auto lg:ml-18">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </main>
  );
}
