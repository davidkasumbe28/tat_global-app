"use client";

import type React from "react";
import { useState } from "react";
import StockManagerSidebar from "./stock-manager-sidebar";
import links from "@/lib/app/stock-manager/links/links";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import RoleNavigation from "../layout/navigation/admin-navigation";

interface StockManagerLayoutProps {
  children: React.ReactNode;
}

export default function StockManagerLayout({
  children,
}: StockManagerLayoutProps) {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <RoleNavigation
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        emuted={isloading}
        loading={isloadingAuth}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <StockManagerSidebar
          links={links?.stockManager}
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
