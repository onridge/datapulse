import mongoose, { Schema } from "mongoose";

import type { Document } from "mongoose";

export interface ICustomer extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  plan: "free" | "premium";
  createdAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
