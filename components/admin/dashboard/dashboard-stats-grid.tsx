"use client";


import { Skeleton } from "@/components/ui/skeleton";
import adminStats from "@/lib/data/processed/admin-stats";
import { handleReadStats } from "@/lib/handlers/events-handlers/stats-events";
import { cn } from "@/lib/utils/utils";
import { Boxes, LucideProps, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react";


interface AdminDashboardStatsGridProps {
    emuted?: boolean;
}

export default function AdminDashboardStatsGrid({
    emuted = true
}: AdminDashboardStatsGridProps
) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{
        title: string;
        value: any;
        change: string;
        isPositive: boolean;
        icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    }[]>(adminStats)

    useEffect(() => {
        handleReadStats()
            .then((res) => {
                if (res.error) {
                    setError(
                        res.error || "Une erreur est survenue lors de la récupération",
                    );
                    setLoading(false);
                    return;
                }

                const adminStats = [
                    {
                        title: "Revenu Total",
                        value: (res.data.revenue || 0).toFixed(2) + " $",
                        change: "+12.5%",
                        isPositive: true,
                        icon: TrendingUp,
                    },
                    {
                        title: "Commandes",
                        value: res.data.orders,
                        change: "+8.2%",
                        isPositive: true,
                        icon: ShoppingBag,
                    },
                    {
                        title: "Clients",
                        value: res.data.users,
                        change: "+5.3%",
                        isPositive: true,
                        icon: Users,
                    },
                    {
                        title: "Collections",
                        value: res.data.collections,
                        change: "+2.1%",
                        isPositive: true,
                        icon: Boxes,
                    },
                    {
                        title: "Produits",
                        value: res.data.products,
                        change: "+2.1%",
                        isPositive: true,
                        icon: Package,
                    },
                ]

                setStats(adminStats)

                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={cn("border border-border rounded-lg p-6 hover:shadow-lg transition", emuted && "bg-transparent animate-pulse")}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <Skeleton emuted={emuted} >
                                        <p className={cn("text-sm mb-1", !emuted && "text-gray-500")} >{stat.title}</p>
                                    </Skeleton>
                                    <Skeleton emuted={emuted || loading} >
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                    </Skeleton>
                                    {/* <div className="flex items-center gap-1 mt-2">
                                    {stat.isPositive ? (
                                        <Skeleton emuted={emuted || loading} >
                                            <ArrowUpRight className={cn("w-4 h-4", !emuted && !loading && "text-green-600")} />
                                        </Skeleton>
                                    ) : (
                                        <Skeleton emuted={emuted || loading} >
                                            <ArrowDownRight className={cn("w-4 h-4", !emuted && !loading && "text-red-600")} />
                                        </Skeleton>
                                    )}
                                    <Skeleton emuted={emuted || loading} >
                                        <span
                                            className={cn("text-sm font-semibold", !emuted && !loading && (stat.isPositive ? "text-green-600" : "text-red-600"))}
                                        >
                                            {stat.change}
                                        </span>
                                    </Skeleton>
                                </div> */}
                                </div>
                                <div className={cn("w-12 h-12 bg-accent rounded-lg flex items-center justify-center", emuted && "animate-pulse")} >
                                    <Skeleton emuted={emuted} >
                                        <Icon className={cn("w-6 h-6 ", !emuted && "text-foreground")} />
                                    </Skeleton>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}
