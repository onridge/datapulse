import mongoose, { Schema } from "mongoose";

import type { Document } from "mongoose";

export interface ITrafficSource extends Document {
  userId?: mongoose.Types.ObjectId;
  label: string;
  pct: number;
  color: string;
}

const TrafficSourceSchema = new Schema<ITrafficSource>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  label: { type: String, required: true },
  pct: { type: Number, required: true },
  color: { type: String, required: true },
});

export const TrafficSource = mongoose.model<ITrafficSource>("TrafficSource", TrafficSourceSchema);
