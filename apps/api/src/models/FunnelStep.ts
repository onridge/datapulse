import mongoose, { Schema } from "mongoose";

import type { Document } from "mongoose";

export interface IFunnelStep extends Document {
  label: string;
  value: number;
  pct: number;
  color: string;
  order: number;
}

const FunnelStepSchema = new Schema<IFunnelStep>({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  pct: { type: Number, required: true },
  color: { type: String, required: true },
  order: { type: Number, required: true },
});

export const FunnelStep = mongoose.model<IFunnelStep>("FunnelStep", FunnelStepSchema);
