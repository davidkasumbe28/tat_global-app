"use client"

import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminNavigation from "@/components/layout/navigation/admin-navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import links from "@/lib/data/raw/links";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <AdminNavigation
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        emuted={isloading}
        loading={isloadingAuth}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          links={links.admin}
          isSidebarOpen={isSidebarOpen}
          collapsed={collapsed}
          emuted={isloading}
          loading={isloadingAuth}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto lg:ml-18">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
