import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
import mongoose from "mongoose";

import { FunnelStep } from "./models/FunnelStep";
import { PageView } from "./models/PageView";
import { TrafficSource } from "./models/TrafficSource";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("✓ Connected to MongoDB");

  // --- Page Views ---
  await PageView.deleteMany({});
  await PageView.insertMany([
    { page: "/dashboard", views: 8432, bounceRate: 21, avgTimeSeconds: 252 },
    { page: "/analytics", views: 5217, bounceRate: 18, avgTimeSeconds: 404 },
    { page: "/transactions", views: 3891, bounceRate: 34, avgTimeSeconds: 178 },
    { page: "/customers", views: 2543, bounceRate: 28, avgTimeSeconds: 201 },
    { page: "/settings", views: 1876, bounceRate: 15, avgTimeSeconds: 105 },
  ]);
  console.log("✓ Seeded page views");

  // --- Traffic Sources ---
  await TrafficSource.deleteMany({});
  await TrafficSource.insertMany([
    { label: "Organic Search", pct: 42, color: "#6366f1" },
    { label: "Direct", pct: 28, color: "#06b6d4" },
    { label: "Social Media", pct: 18, color: "#22c55e" },
    { label: "Referral", pct: 8, color: "#eab308" },
    { label: "Email", pct: 4, color: "#a855f7" },
  ]);
  console.log("✓ Seeded traffic sources");

  // --- Funnel Steps ---
  await FunnelStep.deleteMany({});
  await FunnelStep.insertMany([
    { label: "Visitors", value: 21093, pct: 100, color: "#6366f1", order: 1 },
    { label: "Sign ups", value: 14343, pct: 68, color: "#06b6d4", order: 2 },
    { label: "Trials", value: 8015, pct: 38, color: "#eab308", order: 3 },
    { label: "Paid", value: 3797, pct: 18, color: "#22c55e", order: 4 },
    { label: "Retained", value: 2320, pct: 11, color: "#ef4444", order: 5 },
  ]);
  console.log("✓ Seeded funnel steps");

  await mongoose.disconnect();
  console.log("✓ Done");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
