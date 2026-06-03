"use client";

import AccountSideBar from "@/components/account/account-sidebar";
import MainContent from "@/components/account/content/main-content";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";

export default function AccountPage() {
  const { isloading, theme } = useTheme();
  const { isloadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <AccountSideBar
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          emuted={isloading}
          isloading={isloadingAuth}
        />

        <div className="lg:col-span-4">
          <MainContent
            activeTab={activeTab}
            emuted={isloading}
            isloading={isloadingAuth}
            theme={theme}
          />
        </div>
      </div>
    </main>
  );
}
