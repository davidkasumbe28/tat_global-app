"use client";

import type React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {

  return (
    <main className="flex-1 overflow-auto lg:ml-18">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </main>
  );
}
