import { use, settings } from "nexus";
import { Round } from './graphql/Round';
import { server } from "nexus";
import { log } from "nexus";
import { prisma } from "nexus-plugin-prisma";
import { PrismaClient, User } from "nexus-plugin-prisma/client";
import { PubSub } from "graphql-subscriptions";
import { permissions } from "./permissions";
import { ConnectionContext } from "subscriptions-transport-ws";
import WebSocket from 'ws';
import * as http from "http";
import { parse as parseCookie } from "cookie";
import cookieParser from 'cookie-parser';
import { makeSchema } from "@nexus/schema";

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
    },
    subscriptions: {
      enabled: true,
      keepAlive: 10 * 1000,
      onConnect: (connectionParams: Record<string, any>, webSocket: WebSocket, context: ConnectionContext) => {
        log.info("client connected");
        return createContext(context.request.headers.cookie || null, null);
      },
      onDisconnect: () => {
        log.info("client disconnected");
      },
    }
  },
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
  log: ['query', 'info', 'warn'],
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

server.express.use(cookieParser())

const schema = makeSchema({
  types: [Round]
})



schema.addToContext(async ({req, res}) => {
  return await createContext(req.headers.cookie || null, res);
});

async function createContext(cookie: string | null, response: import("/home/moritz/Documents/sponsorenlauf/server/node_modules/nexus/dist/runtime/schema/schema").Response | null) {
  // Added for debugging
  //await new Promise((r) => setTimeout(r, 3000));
  
  if (nextCleanupCheck.getTime() < Date.now()) {
    nextCleanupCheck = new Date();
    nextCleanupCheck.setHours(nextCleanupCheck.getMinutes() + 1);
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
