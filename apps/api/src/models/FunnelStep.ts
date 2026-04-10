import mongoose, { Schema } from "mongoose";

import type { Document } from "mongoose";

export interface IFunnelStep extends Document {
  userId?: mongoose.Types.ObjectId;
  label: string;
  value: number;
  pct: number;
  color: string;
  order: number;
}

const FunnelStepSchema = new Schema<IFunnelStep>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  label: { type: String, required: true },
  value: { type: Number, required: true },
  pct: { type: Number, required: true },
  color: { type: String, required: true },
  order: { type: Number, required: true },
});

export const FunnelStep = mongoose.model<IFunnelStep>("FunnelStep", FunnelStepSchema);
