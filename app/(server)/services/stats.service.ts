import { TimeRange } from "@/lib/@types/enums";
import { CATEGORIES_PRODUCT } from "@/lib/constants/constants";
import { CategoryProduct } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";
import { parseMixedChart } from "@/lib/utils/parse";

async function readStats(): Promise<{
  success: boolean;
  stats?: {
    revenue?: number;
    orders: number;
    users: number;
    products: number;
    collections: number;
  };
  error?: string;
}> {
  try {
    const [revenue, orders, users, products, collections] =
      await prisma.$transaction([
        prisma.accountLedger.aggregate({
          where: {
            entryType: "CREDIT",
          },
          _sum: {
            balance: true,
          },
        }),
        prisma.order.count(),
        prisma.user.count(),
        prisma.product.count(),
        prisma.collection.count(),
      ]);

    return {
      success: true,
      stats: {
        revenue: revenue?._sum.balance || 0,
        orders,
        users,
        products,
        collections,
      },
    };
  } catch (error) {
    console.error("Read stats error : ", error);
    return {
      success: false,
      error: logs.error.read.stats,
    };
  }
}

async function readStatsChart(timeRange: TimeRange): Promise<{
  success: boolean;
  stats?: {
    lineChart: {
      revenue: number;
      orders: number;
      month: string;
    }[];
    pieChart: {
      name?:{
            label: string;
            value: CategoryProduct | "ALL";
          }
        | undefined;
      value: number;
      fill: string;
    }[];
  };
  error?: string;
}> {
  try {
    const [orders, ledgers, products] = await prisma.$transaction([
      prisma.order.findMany({
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.accountLedger.findMany({
        where: {
          entryType: "CREDIT",
        },
        select: {
          balance: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.product.groupBy({
        by: ["category"],
        _count: {
          _all: true,
        },
      }),
    ]);

    const lineChart = parseMixedChart(orders, ledgers, timeRange);
    const pieChart = products.map((item) => ({
      name: CATEGORIES_PRODUCT.findLast((cat) => {
        if (cat.value == item.category) {
          return cat.label;
        }
      }),
      value: item._count._all,
      fill:
        item.category == CategoryProduct.CLOTHING
          ? "#d4a574"
          : item.category == CategoryProduct.PERFUMES
            ? "#2c2c2c"
            : item.category == CategoryProduct.SHOES && "#b8934a",
    }));

    return {
      success: true,
      stats: {
        lineChart,
        pieChart,
      },
    };
  } catch (error) {
    console.error("Read stats chart error : ", error);
    return {
      success: false,
      error: logs.error.read.stats,
    };
  }
}

export { readStats, readStatsChart };
