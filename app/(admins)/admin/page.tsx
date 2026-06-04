"use client";

import AdminDashboardChart from "@/components/admin/dashboard/dashboard-chart";
import AdminDashboardHeader from "@/components/admin/dashboard/dashboard-header";
import AdminDashboardRecentOrders from "@/components/admin/dashboard/dashboard-recent-orders";
import AdminDashboardStatsGrid from "@/components/admin/dashboard/dashboard-stats-grid";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { TimeRange } from "@/lib/@types/enums";
import adminChart from "@/lib/data/processed/admin-chart";
import adminStats from "@/lib/data/processed/admin-stats";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const { isloading } = useTheme()
  const [timeRange, setTimeRange] = useState(TimeRange.MOTH);
  const [loading, setLoading] = useState(false)

  return (
    // <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
    <main className="flex-1 overflow-auto">
      <div className="space-y-8">
        {/* Header */}
        <AdminDashboardHeader time={{ timeRange, setTimeRange }} emuted={isloading} loading={loading} />

        {/* Stats Grid */}
        <AdminDashboardStatsGrid emuted={isloading} />

        {/* Charts */}
        <AdminDashboardChart time={{ timeRange, setTimeRange }} emuted={isloading} />

        {/* Recent Orders */}
        <AdminDashboardRecentOrders emuted={isloading} />

      </div>
    </main>
  );
}
