import { use } from "nexus";
import { schema } from "nexus";
import { server } from "nexus";
import { log } from "nexus";
import { prisma } from "nexus-plugin-prisma";
import { PrismaClient, User } from "nexus-plugin-prisma/client";
import { PubSub } from "graphql-subscriptions";
import { subscriptions } from "nexus-plugin-subscriptions";
import { permissions } from "./permissions";
import { verify, Secret } from "jsonwebtoken";
import cors from "cors";
import { formatErrors } from "./errors";
import { Request } from "nexus/dist/runtime/schema/schema";
import { ConnectionContext } from "subscriptions-transport-ws";
import * as http from "http";
import { parse as parseCookie } from "cookie";

declare global {
  interface NexusContext {
    user: User | null;
    pubsub: PubSub;
    db: PrismaClient,
    response: http.ServerResponse;
  }
}

const db = new PrismaClient();
const pubsub = new PubSub();
let nextCleanupCheck = new Date();

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

server.express.use(cors({
  credentials: true,
  methods: "POST",
  origin: ["http://localhost:3000", "http://localhost:5000"]
}));

server.express.use(formatErrors);

schema.addToContext(async (req: Request) => {
  // @ts-expect-error
  return await createContext(req.headers.cookie || null, req.res);
});

// https://github.com/graphql-nexus/nexus/issues/506
async function createContext(cookie: string | null, response: Response | null) {
  // Added for debugging
  await new Promise((r) => setTimeout(r, 1000));
  
  if (nextCleanupCheck.getTime() < Date.now()) {
    nextCleanupCheck = new Date();
    nextCleanupCheck.setHours(nextCleanupCheck.getMinutes() + 1); // TODO FIXME TEST
    log.info("session cleanup start")
    let result = await db.userSession.deleteMany({
      where: {
        validUntil: {
          lt: new Date()
        }
      }
    })
    log.info(`cleaned up ${result.count} sessions`)
  }
  if (cookie) {
    let cookies = parseCookie(cookie);
    if (cookies.id) {

      let userSession = await db.userSession.findOne({
        where: {
          id: cookies.id,
        },
        include: {
          user: true
        }
      })

      if (userSession && userSession.validUntil.getTime() > Date.now()) {
        return {
          user: userSession?.user,
          pubsub,
          db,
          response,
        }
      }
    }
  }
  return {
    user: null,
    pubsub,
    db,
    response,
  }
}
