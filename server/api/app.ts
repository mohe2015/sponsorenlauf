import { use } from "nexus";
import { schema } from "nexus";
import { server } from "nexus";
import { log } from "nexus";
import { settings } from "nexus";
import { prisma } from "nexus-plugin-prisma";
import { PrismaClient } from "nexus-plugin-prisma/client";
import { PubSub } from "graphql-subscriptions";
import { subscriptions } from "nexus-plugin-subscriptions";
import { permissions } from "./permissions";
import { verify, Secret } from "jsonwebtoken";
import cors from "cors";
import { formatErrors } from "./errors";

interface BearerToken {
  userId: string;
}

const db = new PrismaClient();
const pubsub = new PubSub();

use(
  prisma({
    client: {
      instance: db,
    },
    features: {
      crud: true,
    },
  })
);

use(permissions);

use(
  subscriptions({
    ws: { server: server.raw.http, path: "/graphql" }, // use server.raw.http here
    keepAlive: 10 * 1000,
    onConnect: (payload: Record<string, any>) => {
      log.info("client connected");
      return createContext(payload["authorization"]);
    },
    onDisconnect: () => {
      log.info("client disconnected");
    },
  })
);

/*
this hides the stack trace in production:

import graphqlHTTP from 'express-graphql';

const graphQLMiddleware = graphqlHTTP({
  schema: myGraphQLSchema,
  formatError: (error) => ({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack.split('\n') : null,
  })
});

app.use('/graphql', graphQLMiddleware);
*/

server.express.use(cors());

server.express.use(formatErrors);

schema.addToContext(async (req) => {
  return await createContext(req.headers["authorization"]!);
});

async function createContext(authorization: string) {
  const match = /^Bearer (.*)$/.exec(authorization);
  if (match) authorization = match[1];

  if (authorization) {
    const verifiedToken = verify(
      authorization,
      process.env.APP_SECRET as Secret
    ) as BearerToken;
    return {
      userId: verifiedToken.userId,
      pubsub,
      db,
    };
  } else {
    return {
      userId: null,
      pubsub,
      db,
    };
  }
}
