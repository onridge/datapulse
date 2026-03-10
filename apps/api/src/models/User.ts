import { Schema, model } from "mongoose";

import type { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  company?: string;
  teamSize?: string;
  usePage?: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    jobTitle: { type: String },
    company: { type: String },
    teamSize: { type: String },
    usePage: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
