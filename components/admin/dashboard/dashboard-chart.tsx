"use client";


import { Skeleton } from "@/components/ui/skeleton";
import { TimeRange } from "@/lib/@types/enums";
import adminChart from "@/lib/data/processed/admin-chart";
import { handleReadStatsLineChart } from "@/lib/handlers/events-handlers/stats-events";
import { cn } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


interface AdminDashboardChartProps {
    emuted?: boolean;
    time: {
        timeRange: TimeRange;
        setTimeRange: React.Dispatch<React.SetStateAction<TimeRange>>
    }
}

export default function AdminDashboardChart({
    emuted = true, time
}: AdminDashboardChartProps
) {
    const [error, setError] = useState("");
    const { timeRange, setTimeRange } = time
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{
        lineChart: {
            month: string;
            revenue: number;
            orders: number;
        }[];
        pieChart: {
            name: string;
            value: number;
            fill: string;
        }[];
    }>(adminChart)

    useEffect(() => {
        handleReadStatsLineChart(timeRange)
            .then((res) => {
                if (res.error) {
                    setError(
                        res.error || "Une erreur est survenue lors de la récupération",
                    );
                    setLoading(false);
                    return;
                }

                setStats(res.data)
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [timeRange])


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className={cn("lg:col-span-2 border border-border rounded-lg p-6", emuted && "animate-pulse bg-transparent")} >
                <Skeleton emuted={emuted} >
                    <h2 className="text-xl font-bold mb-6">Revenus & Commandes</h2>
                </Skeleton>

                {
                    emuted || loading ?
                        <div className="flex justify-center items-center w-full h-75 relative" >
                            <Skeleton emuted={emuted} >
                                <span>Chargement du chart...</span>
                            </Skeleton>
                        </div>
                        :
                        <ResponsiveContainer width="100%" height={300}>
                            {
                                <LineChart data={stats.lineChart}>
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
                                        name="Revenu ($)"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#2c2c2c"
                                        strokeWidth={2}
                                        name="Commandes"
                                    />
                                </LineChart>
                            }
                        </ResponsiveContainer>
                }
            </div>

            {/* Category Distribution */}
            <div className="bg-background border border-border rounded-lg p-6">
                <Skeleton emuted={emuted} >
                    <h2 className="text-xl font-bold mb-6">Ventes par Catégorie</h2>
                </Skeleton>

                {
                    emuted || loading ?
                        <div className="flex justify-center items-center w-full h-75 relative" >
                            <Skeleton emuted={emuted} >
                                <span>Chargement du chart...</span>
                            </Skeleton>
                        </div>
                        :
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.pieChart}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name} ${value}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.pieChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                }
            </div>
        </div>
    );
}
