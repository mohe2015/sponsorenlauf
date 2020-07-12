import { use } from "nexus";
import { schema } from "nexus";
import { server } from "nexus";
import { log } from "nexus";
import { prisma } from "nexus-plugin-prisma";
import { PrismaClient } from "nexus-plugin-prisma/client";
import { PubSub } from "graphql-subscriptions";
import { subscriptions } from "nexus-plugin-subscriptions";
import { permissions } from "./permissions";
import { verify, Secret } from "jsonwebtoken";
import cors from "cors";
import { formatErrors } from "./errors";
import { Request } from "nexus/dist/runtime/schema/schema";
import { ConnectionContext } from "subscriptions-transport-ws";
import * as http from "http";

declare global {
  interface NexusContext {
    userId: string | null;
    pubsub: PubSub;
    db: PrismaClient,
    response: http.ServerResponse;
  }
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
    onConnect: (connectionParams: Record<string, any>, webSocket: WebSocket, context: ConnectionContext) => {
      log.info("client connected");
      return createContext(context.request.headers.cookie || null, null);
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

schema.addToContext(async (req: Request) => {
    // @ts-expect-error
  return await createContext(req.headers.cookie || null, req.res);
});

// https://github.com/graphql-nexus/nexus/issues/506
async function createContext(cookie: string | null, response: Response | null) {
  // TODO FIXME check session
  if (cookie) {
    console.log(cookie);
    return {
      userId: cookie,
      pubsub,
      db,
      response,
    }
  } else {
    return {
      userId: null,
      pubsub,
      db,
      response,
    }
  }
}
