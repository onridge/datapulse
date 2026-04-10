import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

const COLORS = ["#6366f1", "#06b6d4", "#22c55e", "#eab308", "#ef4444", "#a855f7"];

interface TransactionFilter {
  userId?: string;
  status?: string;
}

export const dashboardResolvers = {
  dashboardStats: async (_: unknown, __: unknown, { userId }: { userId: string | null }) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const userFilter = userId ? { userId } : {};

    const [currTxns, prevTxns, totalUsers, prevUsers] = await Promise.all([
      Transaction.find({ ...userFilter, createdAt: { $gte: start } }),
      Transaction.find({ ...userFilter, createdAt: { $gte: prev, $lte: prevEnd } }),
      userId
        ? User.countDocuments({ _id: userId, createdAt: { $gte: start } })
        : User.countDocuments({ createdAt: { $gte: start } }),
      userId
        ? User.countDocuments({ _id: userId, createdAt: { $gte: prev, $lte: prevEnd } })
        : User.countDocuments({ createdAt: { $gte: prev, $lte: prevEnd } }),
    ]);

    const totalRevenue = currTxns
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const prevRevenue = prevTxns
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOrders = currTxns.length;
    const prevOrders = prevTxns.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const prevAvg = prevOrders > 0 ? prevRevenue / prevOrders : 0;

    const pct = (curr: number, prev: number) =>
      prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100 * 10) / 10;

    return {
      totalRevenue,
      revenueChange: pct(totalRevenue, prevRevenue),
      totalUsers,
      usersChange: pct(totalUsers, prevUsers),
      totalOrders,
      ordersChange: pct(totalOrders, prevOrders),
      avgOrderValue,
      avgOrderChange: pct(avgOrderValue, prevAvg),
    };
  },

  revenueChart: async (
    _: unknown,
    { days = 30 }: { days?: number },
    { userId }: { userId: string | null }
  ) => {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const userFilter = userId ? { userId } : {};

    const txns = await Transaction.find({
      ...userFilter,
      createdAt: { $gte: from },
      status: "completed",
    }).sort({ createdAt: 1 });

    const map: Record<string, { revenue: number; orders: number }> = {};

    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - i - 1));
      const key = d.toISOString().split("T")[0];
      map[key] = { revenue: 0, orders: 0 };
    }

    txns.forEach((t) => {
      const key = new Date(t.createdAt).toISOString().split("T")[0];
      if (map[key]) {
        map[key].revenue += t.amount;
        map[key].orders += 1;
      }
    });

    return Object.entries(map).map(([date, val]) => ({ date, ...val }));
  },

  transactions: async (
    _: unknown,
    { page = 1, limit = 10, status }: { page?: number; limit?: number; status?: string },
    { userId }: { userId: string | null }
  ) => {
    const filter: TransactionFilter = userId ? { userId } : {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  activity: async (_: unknown, __: unknown, { userId }: { userId: string | null }) => {
    const filter = userId ? { userId } : {};
    const txns = await Transaction.find(filter).sort({ createdAt: -1 }).limit(10);

    return txns.map((t) => ({
      id: t.id,
      type: t.status,
      message: `${t.customerName} — $${t.amount.toFixed(2)} ${t.status}`,
      time: t.createdAt.toISOString(),
      avatarColor: COLORS[t.customerName.charCodeAt(0) % COLORS.length],
    }));
  },
};
