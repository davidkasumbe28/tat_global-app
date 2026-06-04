import { TimeRange } from "../@types/enums";

export function parseDevice(ua: string) {
  if (ua.includes("iPhone")) return "iPhone";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Mac")) return "Mac";
  return "Desktop";
}

export function parseOrdersChart(
  orders: { createdAt: Date }[],
  timeRange: TimeRange,
) {
  const grouped: Record<string, number> = {};

  orders.forEach((order) => {
    let key = "";

    switch (timeRange) {
      case TimeRange.DAY:
        key = order.createdAt.toLocaleDateString("fr-FR");
        break;

      case TimeRange.MOTH:
        key = order.createdAt.toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        });
        break;

      case TimeRange.YEAR:
        key = order.createdAt.getFullYear().toString();
        break;
    }

    grouped[key] = (grouped[key] || 0) + 1;
  });

  return Object.entries(grouped).map(([period, count]) => ({
    period,
    count,
  }));
}

export function parseRevenueChart(
  ledgers: { createdAt: Date; balance: number }[],
  timeRange: TimeRange,
) {
  const grouped = new Map<string, number>();

  for (const item of ledgers) {
    let key: string;

    switch (timeRange) {
      case TimeRange.DAY:
        key = item.createdAt.toISOString().split("T")[0];
        break;

      case TimeRange.MOTH:
        key = `${item.createdAt.getFullYear()}-${String(
          item.createdAt.getMonth() + 1,
        ).padStart(2, "0")}`;
        break;

      case TimeRange.YEAR:
        key = item.createdAt.getFullYear().toString();
        break;
    }

    grouped.set(key, (grouped.get(key) || 0) + item.balance);
  }

  const data = Array.from(grouped.entries())
    .map(([period, revenue]) => ({ period, revenue }))
    .sort((a, b) => a.period.localeCompare(b.period));

  const limit =
    timeRange === TimeRange.DAY ? 7 : timeRange === TimeRange.MOTH ? 12 : 5;

  return data.slice(-limit);
}

export function parseMixedChart(
  orders: { createdAt: Date }[],
  ledgers: { createdAt: Date; balance: number }[],
  timeRange: TimeRange,
) {
  const grouped: Record<string, { revenue: number; orders: number }> = {};

  const getKey = (date: Date) => {
    switch (timeRange) {
      case TimeRange.DAY:
        return date.toISOString().split("T")[0];

      case TimeRange.MOTH:
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}`;

      case TimeRange.YEAR:
        return date.getFullYear().toString();
    }
  };

  // 📦 Orders
  for (const o of orders) {
    const key = getKey(o.createdAt);

    if (!grouped[key]) {
      grouped[key] = { revenue: 0, orders: 0 };
    }

    grouped[key].orders += 1;
  }

  // 💰 Revenue
  for (const l of ledgers) {
    const key = getKey(l.createdAt);

    if (!grouped[key]) {
      grouped[key] = { revenue: 0, orders: 0 };
    }

    grouped[key].revenue += l.balance;
  }

  return Object.entries(grouped)
    .map(([period, value]) => ({
      month : period,
      ...value,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
