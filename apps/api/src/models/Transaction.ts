import mongoose, { Schema } from "mongoose";

import type { Document } from "mongoose";

export interface ITransaction extends Document {
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  method: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["completed", "pending", "failed"] },
    method: { type: String },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
