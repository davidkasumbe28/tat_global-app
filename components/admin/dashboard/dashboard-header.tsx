"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeRange } from "@/lib/@types/enums";
import { cn } from "@/lib/utils/utils";


interface AdminDashboardHeaderProps {
    emuted?: boolean;
    loading: boolean;
    time: {
        timeRange: TimeRange;
        setTimeRange: React.Dispatch<React.SetStateAction<TimeRange>>
    }
}

export default function AdminDashboardHeader({
    emuted = true, loading, time
}: AdminDashboardHeaderProps
) {

    const { timeRange, setTimeRange } = time

    return (
        <div className="flex max-md:flex-col items-center gap-4 justify-between">

            <div className="max-md:w-full max-md:flex-col max-md:justify-start">
                <Skeleton emuted={emuted} >
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                </Skeleton>

                <Skeleton emuted={emuted} >
                    <p className={cn("mt-1", !emuted && "text-gray-500 ")} >
                        Panneau d'administration TAT GLOBAL
                    </p>
                </Skeleton>
            </div>

            <div className="flex gap-2 max-md:w-full justify-end items-center">
                {Object.values(TimeRange).map((range) => (
                    <Button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        variant={emuted && loading ? "emuted" : timeRange === range ? "default" : "outline"}
                        className={cn(!emuted && !loading && (timeRange === range
                            ? "bg-foreground hover:bg-primary-dark text-background"
                            : "")
                        )}
                    >
                        {range === TimeRange.DAY
                            ? "Jour"
                            : range === TimeRange.MOTH
                                ? "Mois"
                                : "Année"}
                    </Button>
                ))}
            </div>
        </div>
    );
}
