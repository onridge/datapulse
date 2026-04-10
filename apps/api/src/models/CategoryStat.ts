import mongoose, { Schema } from "mongoose";

import type { Document } from "mongoose";

export interface ICategoryStat extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  value: number;
  color: string;
}

const CategoryStatSchema = new Schema<ICategoryStat>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  color: { type: String, required: true },
});

export const CategoryStat = mongoose.model<ICategoryStat>("CategoryStat", CategoryStatSchema);
