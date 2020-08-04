import { use, settings } from "nexus";
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

//settings.current.server.playground.path NO

//settings.current.server.host
//settings.current.server.path

settings.change({
  schema: {
    nullable: {
      inputs: false,
      outputs: false,
    },
  },
  server: {
    cors: {
      enabled: true,
      credentials: true,
      methods: "POST",
      origin: ["http://localhost:3000", "http://localhost:5000"]
    },
    playground: {
      enabled: true,
      settings: {
        "request.credentials": "include",
      }
    }
  }
});

declare global {
  interface NexusContext {
    user: User | null;
    pubsub: PubSub;
    db: PrismaClient,
    response: http.ServerResponse;
  }
}

const db = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    }
  ]
});
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

server.express.use(formatErrors);

// @ts-expect-error
schema.addToContext(async ({req, res}) => {
  return await createContext(req.headers.cookie || null, res);
});

// https://github.com/graphql-nexus/nexus/issues/506
async function createContext(cookie: string | null, response: Response | null) {
  // Added for debugging
  //await new Promise((r) => setTimeout(r, 3000));
  
  if (nextCleanupCheck.getTime() < Date.now()) {
    nextCleanupCheck = new Date();
    nextCleanupCheck.setHours(nextCleanupCheck.getMinutes() + 10);
    log.info("session cleanup start")

    let tooOld = new Date();
    tooOld.setHours(tooOld.getHours() - 16);

    let result = await db.userSession.deleteMany({
      where: {
        createdAt: {
          lt: tooOld
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

      let tooOld = new Date();
      tooOld.setHours(tooOld.getHours() - 8);

      if (userSession && userSession.createdAt.getTime() > tooOld.getTime()) {
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
