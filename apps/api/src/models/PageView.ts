import mongoose, { Schema } from "mongoose";

import type { Document } from "mongoose";

export interface IPageView extends Document {
  userId?: mongoose.Types.ObjectId;
  page: string;
  views: number;
  bounceRate: number;
  avgTimeSeconds: number;
  createdAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    page: { type: String, required: true },
    views: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    avgTimeSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PageView = mongoose.model<IPageView>("PageView", PageViewSchema);
