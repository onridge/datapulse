import mongoose, { Schema } from "mongoose";

import type { Document } from "mongoose";

export interface ITrafficSource extends Document {
  label: string;
  pct: number;
  color: string;
}

const TrafficSourceSchema = new Schema<ITrafficSource>({
  label: { type: String, required: true },
  pct: { type: Number, required: true },
  color: { type: String, required: true },
});

export const TrafficSource = mongoose.model<ITrafficSource>("TrafficSource", TrafficSourceSchema);
