import mongoose, { Schema } from "mongoose";

import type { Document } from "mongoose";

export interface ITransaction extends Document {
  customerName: string;
  customerEmail: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  method: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["completed", "pending", "failed"], default: "pending" },
    method: { type: String, default: "card" },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
