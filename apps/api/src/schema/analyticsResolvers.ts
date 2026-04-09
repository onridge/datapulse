import { FunnelStep } from "../models/FunnelStep";
import { PageView } from "../models/PageView";
import { TrafficSource } from "../models/TrafficSource";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const analyticsResolvers = {
  analytics: async () => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();

    const startCur = new Date(curYear, curMonth, 1);
    const startPrev = new Date(curYear, curMonth - 1, 1);
    const endPrev = new Date(curYear, curMonth, 0);

    const [currTxns, prevTxns, totalUsers, pageViews, trafficSources, funnelSteps] =
      await Promise.all([
        Transaction.find({ createdAt: { $gte: startCur }, status: "completed" }),
        Transaction.find({ createdAt: { $gte: startPrev, $lte: endPrev }, status: "completed" }),
        User.countDocuments(),
        PageView.find().sort({ views: -1 }).limit(5),
        TrafficSource.find().sort({ pct: -1 }),
        FunnelStep.find().sort({ order: 1 }),
      ]);

    const sum = (txns: any[]) => txns.reduce((s, t) => s + t.amount, 0);
    const pct = (cur: number, prev: number) =>
      prev === 0 ? 100 : Math.round(((cur - prev) / prev) * 100 * 10) / 10;

    const mrr = sum(currTxns);
    const prevMrr = sum(prevTxns);
    const ltv = totalUsers > 0 ? Math.round((mrr / totalUsers) * 12) : 0;
    const prevLtv = totalUsers > 0 ? Math.round((prevMrr / totalUsers) * 12) : 0;

    const churnRate = 2.1;
    const prevChurnRate = 2.4;
    const retention = parseFloat((100 - churnRate).toFixed(1));
    const prevRetention = parseFloat((100 - prevChurnRate).toFixed(1));

    // --- Trend ---
    const trend = await Promise.all(
      Array.from({ length: 12 }, async (_, i) => {
        const month = (curMonth - 11 + i + 12) % 12;
        const yearCur = curYear + (curMonth - 11 + i < 0 ? -1 : 0);
        const yearPrev = yearCur - 1;

        const [cur, prev] = await Promise.all([
          Transaction.find({
            status: "completed",
            createdAt: { $gte: new Date(yearCur, month, 1), $lte: new Date(yearCur, month + 1, 0) },
          }),
          Transaction.find({
            status: "completed",
            createdAt: {
              $gte: new Date(yearPrev, month, 1),
              $lte: new Date(yearPrev, month + 1, 0),
            },
          }),
        ]);

        return {
          month: MONTHS[month],
          current: sum(cur),
          previous: sum(prev),
        };
      })
    );

    // --- Top Pages ---
    const topPages = pageViews.map((p) => {
      const mins = Math.floor(p.avgTimeSeconds / 60);
      const secs = p.avgTimeSeconds % 60;
      return {
        page: p.page,
        views: p.views,
        bounce: p.bounceRate,
        bouncePos: p.bounceRate < 25,
        avgTime: `${mins}m ${secs < 10 ? "0" : ""}${secs}s`,
      };
    });

    // --- Traffic ---
    const traffic = trafficSources.map((t) => ({
      label: t.label,
      pct: t.pct,
      color: t.color,
    }));

    // --- Funnel ---
    const funnel = funnelSteps.map((f) => ({
      label: f.label,
      value: f.value,
      pct: f.pct,
      color: f.color,
    }));

    return {
      stats: {
        mrr,
        mrrChange: pct(mrr, prevMrr),
        churnRate,
        churnChange: pct(churnRate, prevChurnRate),
        retention,
        retentionChange: pct(retention, prevRetention),
        ltv,
        ltvChange: pct(ltv, prevLtv),
      },
      trend,
      funnel,
      topPages,
      traffic,
    };
  },
};
