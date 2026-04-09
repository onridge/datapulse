import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { config } from "./config";
import { resolvers } from "./schema/resolvers";
import { typeDefs } from "./schema/typeDefs";

import type { Context } from "./types/context";
import type { Express } from "express";

async function startServer() {
  const app: Express = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    })
  );

  await mongoose.connect(config.mongoUri);
  console.log("✓ Connected to MongoDB");

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }): Context => {
      const token = req.cookies?.token ?? req.headers.authorization?.split(" ")[1];

      let userId = null;
      if (token) {
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
          userId = payload.id;
        } catch {}
      }

      return { req, res, userId, token };
    },
  });

  await server.start();
  server.applyMiddleware({ app: app as any }); // ← as any фиксит конфликт типов

  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}${server.graphqlPath}`);
  });
}

startServer().catch(console.error);
