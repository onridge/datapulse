import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { config } from "./config";
import { getUserFromRequest } from "./middleware/auth";
import { resolvers } from "./schema/resolvers";
import { typeDefs } from "./schema/typeDefs";

import type { Context } from "./types/context";

async function startServer() {
  const app = express();

  app.use(cors());

  await mongoose.connect(config.mongoUri);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }): Context => {
      const user = getUserFromRequest(req);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}${server.graphqlPath}`);
  });
}

startServer().catch(console.error);
