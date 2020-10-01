import { use, settings } from "nexus";
import { ApolloServer } from 'apollo-server-express'
import { prisma } from "nexus-plugin-prisma";
import { PrismaClient } from "nexus-plugin-prisma/client";
import { PubSub } from "graphql-subscriptions";
import { permissions } from "./permissions";
import { ConnectionContext } from "subscriptions-transport-ws";
import WebSocket from 'ws';
import * as http from "http";
import { parse as parseCookie } from "cookie";
import cookieParser from 'cookie-parser';
import createExpress from 'express'
import { schema } from './schema'
import * as Http from 'http'

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
        return createContext(context.request.headers.cookie || null, null);
      },
      onDisconnect: () => {
      },
    }
  },
});


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

const apollo = new ApolloServer({
  schema,
  context: async () => {
    return await createContext(req.headers.cookie || null, res);
  }
})

const express = createExpress()

express.use(cookieParser())

const httpServer = Http.createServer(/* app */)

apollo.installSubscriptionHandlers(httpServer)

apollo.applyMiddleware({ app: express })

//apollo.applyMiddleware({ app: express, cors: { ... } })

httpServer.listen({ port: 4000 }, () => {
  console.log(`server at http://localhost:4000${apollo.graphqlPath}`)
  console.log(`Subscriptions server at ws://localhost:4000${apollo.subscriptionsPath}`)
})