import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { generateToken } from "../utils/jwt";

import type { Context } from "../types/context";

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return User.findById(context.user.id);
    },
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
      if (existing) {
        throw new Error("User already exists");
      }

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

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", {
        expiresIn: "7d",
      });

      return { token, user };
    },

    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Invalid credentials");
      }

      const token = generateToken({ id: user.id });

      return { token, user };
    },
  },
};
