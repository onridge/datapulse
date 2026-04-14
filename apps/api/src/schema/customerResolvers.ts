import { Customer } from "../models/Customer";
import { Transaction } from "../models/Transaction";

const PREMIUM_THRESHOLD = 1000;
const CHURN_DAYS = 90;

const pct = (curr: number, prev: number) =>
  prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100 * 10) / 10;

export const customerResolvers = {
  customers: async (
    _: unknown,
    {
      page = 1,
      limit = 15,
      plan,
      search,
    }: { page?: number; limit?: number; plan?: string; search?: string },
    { userId }: { userId: string | null }
  ) => {
    const ninetyDaysAgo = new Date(Date.now() - CHURN_DAYS * 24 * 60 * 60 * 1000);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseMatch: Record<string, any> = {};
    if (userId) baseMatch.userId = userId;
    if (search) {
      baseMatch.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
      ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [
      { $match: baseMatch },
      {
        $group: {
          _id: "$customerEmail",
          customerName: { $first: "$customerName" },
          customerEmail: { $first: "$customerEmail" },
          totalSpent: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] },
          },
          orderCount: { $sum: 1 },
          firstOrder: { $min: "$createdAt" },
          lastOrder: { $max: "$createdAt" },
        },
      },
      {
        $addFields: {
          plan: {
            $cond: [
              { $lt: ["$lastOrder", ninetyDaysAgo] },
              "churned",
              {
                $cond: [{ $gt: ["$totalSpent", PREMIUM_THRESHOLD] }, "premium", "free"],
              },
            ],
          },
        },
      },
    ];

    if (plan && plan !== "all") {
      pipeline.push({ $match: { plan } });
    }

    pipeline.push({ $sort: { totalSpent: -1 } });

    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Transaction.aggregate(countPipeline);
    const total = countResult[0]?.total ?? 0;

    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const items = await Transaction.aggregate(pipeline);

    return {
      items: items.map((c) => ({
        id: c._id,
        customerName: c.customerName,
        customerEmail: c.customerEmail,
        totalSpent: c.totalSpent,
        orderCount: c.orderCount,
        firstOrder: c.firstOrder.toISOString(),
        lastOrder: c.lastOrder.toISOString(),
        plan: c.plan,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  createCustomer: async (
    _: unknown,
    { name, email, plan = "free" }: { name: string; email: string; plan?: string },
    { userId }: { userId: string | null }
  ) => {
    const existing = await Customer.findOne({ email, ...(userId ? { userId } : {}) });
    if (existing) throw new Error("Customer with this email already exists");

    const customer = await Customer.create({
      name,
      email,
      plan,
      ...(userId ? { userId } : {}),
    });

    return {
      id: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      totalSpent: 0,
      orderCount: 0,
      firstOrder: customer.createdAt.toISOString(),
      lastOrder: customer.createdAt.toISOString(),
      plan: customer.plan,
    };
  },

  customerStats: async (_: unknown, __: unknown, { userId }: { userId: string | null }) => {
    const userFilter = userId ? { userId } : {};
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - CHURN_DAYS * 24 * 60 * 60 * 1000);

    const allCustomers = await Transaction.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: "$customerEmail",
          totalSpent: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] },
          },
          firstOrder: { $min: "$createdAt" },
          lastOrder: { $max: "$createdAt" },
        },
      },
    ]);

    const total = allCustomers.length;
    const newCustomers = allCustomers.filter((c) => c.firstOrder >= thirtyDaysAgo).length;
    const prevNewCustomers = allCustomers.filter(
      (c) => c.firstOrder >= sixtyDaysAgo && c.firstOrder < thirtyDaysAgo
    ).length;
    const premium = allCustomers.filter(
      (c) => c.totalSpent > PREMIUM_THRESHOLD && c.lastOrder >= ninetyDaysAgo
    ).length;
    const prevPremium = allCustomers.filter(
      (c) =>
        c.totalSpent > PREMIUM_THRESHOLD &&
        c.lastOrder >= ninetyDaysAgo &&
        c.firstOrder < thirtyDaysAgo
    ).length;
    const churned = allCustomers.filter((c) => c.lastOrder < ninetyDaysAgo).length;
    const prevChurned = allCustomers.filter(
      (c) =>
        c.lastOrder < ninetyDaysAgo &&
        c.lastOrder >= new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
    ).length;

    const prevTotal = allCustomers.filter((c) => c.firstOrder < thirtyDaysAgo).length;

    return {
      total,
      totalChange: pct(total, prevTotal),
      newCustomers,
      newChange: pct(newCustomers, prevNewCustomers),
      premium,
      premiumChange: pct(premium, prevPremium),
      churned,
      churnedChange: pct(churned, prevChurned),
    };
  },
};
