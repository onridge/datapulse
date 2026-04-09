import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
};
