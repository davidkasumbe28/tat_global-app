"use client";

import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import links from "@/lib/app/delivery-person/links/links";
import type React from "react";
import { useState } from "react";
import RoleNavigation from "../layout/role-navigation";
import DeliveryPersonSidebar from "./delivery-person-sidebar";

interface DeliveryPersonLayoutProps {
  children: React.ReactNode;
}

export default function DeliveryPersonLayout({
  children,
}: DeliveryPersonLayoutProps) {
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
        <DeliveryPersonSidebar
          links={links.deliveryPerson}
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
