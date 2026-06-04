import { TimeRange } from "@/lib/@types/enums";
import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";

async function handleReadStats() {
  try {
    const res = await api.get(API.private.stats);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadStatsLineChart(timeRange: TimeRange) {
  try {
    const res = await api.get(
      API.private.stats + "/lineChart?timeRange=" + timeRange,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

export { handleReadStats, handleReadStatsLineChart };
