import { CategoryStat } from "../models/CategoryStat";

export const categoryResolvers = {
  categoryStats: async (_: any, __: any, { userId }: { userId: string | null }) => {
    const filter = userId ? { userId } : {};
    const stats = await CategoryStat.find(filter);
    return stats.map((s) => ({
      name: s.name,
      value: s.value,
      color: s.color,
    }));
  },
};
