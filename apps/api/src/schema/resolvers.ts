import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/User";

import { analyticsResolvers } from "./analyticsResolvers";
import { dashboardResolvers } from "./dashboardResolvers";

import type { Context } from "../types/context";

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }
      return User.findById(context.userId);
    },
    dashboardStats: dashboardResolvers.dashboardStats,
    revenueChart: dashboardResolvers.revenueChart,
    transactions: dashboardResolvers.transactions,
    activity: dashboardResolvers.activity,
    analytics: analyticsResolvers.analytics,
  },

  Mutation: {
    register: async (
      _: unknown,
      {
        email,
        password,
        firstName,
        lastName,
        jobTitle,
        company,
        teamSize,
        usePage,
      }: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        jobTitle?: string;
        company?: string;
        teamSize?: string;
        usePage?: string;
      }
    ) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("User already exists");

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashed,
        firstName,
        lastName,
        jobTitle,
        company,
        teamSize,
        usePage,
      });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
        expiresIn: "7d",
      });

      return { token, user };
    },

    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
        expiresIn: "7d",
      });

      return { token, user };
    },
  },
};
