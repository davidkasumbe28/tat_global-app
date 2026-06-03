"use client";

import { Button } from "@/components/ui/button";
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
  const [timeRange, setTimeRange] = useState("month");

  return (
    // <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <main className="flex-1 overflow-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex max-md:flex-col items-center gap-4 justify-between">
          <div className="max-md:w-full max-md:flex-col max-md:justify-start">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Panneau d'administration TAT GLOBAL
            </p>
          </div>

          <div className="flex gap-2 max-md:w-full justify-end items-center">
            {["day", "month", "year"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "outline"}
                className={
                  timeRange === range
                    ? "bg-foreground hover:bg-primary-dark text-background"
                    : ""
                }
              >
                {range === "day"
                  ? "Jour"
                  : range === "month"
                    ? "Mois"
                    : "Année"}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          stat.isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-background border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Revenus & Commandes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adminChart.lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d4a574"
                  strokeWidth={2}
                  name="Revenu (€)"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#2c2c2c"
                  strokeWidth={2}
                  name="Commandes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Ventes par Catégorie</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={adminChart.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {adminChart.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Commandes Récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">
                    ID Commande
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Client</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Montant</th>
                  <th className="text-left py-3 px-4 font-semibold">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "TAT-2025-001234",
                    customer: "Jean Dupont",
                    date: "18 Nov 2025",
                    amount: "251.94€",
                    status: "Livrée",
                  },
                  {
                    id: "TAT-2025-001233",
                    customer: "Marie Martin",
                    date: "17 Nov 2025",
                    amount: "129.99€",
                    status: "En transit",
                  },
                  {
                    id: "TAT-2025-001232",
                    customer: "Pierre Bernard",
                    date: "16 Nov 2025",
                    amount: "199.98€",
                    status: "En préparation",
                  },
                ].map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-semibold">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4 text-foreground font-bold">
                      {order.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Livrée"
                            ? "bg-green-100 text-green-700"
                            : order.status === "En transit"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">
                        Voir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
