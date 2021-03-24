import { ApolloServer } from 'apollo-server'

import { schema } from './schema'

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {

  console.log(`🚀 Server ready at ${url}`)

})

/*
import { ApolloServer } from 'apollo-server-express'
import { PubSub } from "graphql-subscriptions";
import { permissions } from "./permissions";
import { ConnectionContext } from "subscriptions-transport-ws";
import WebSocket from 'ws';
import { parse as parseCookie } from "cookie";
import cookieParser from 'cookie-parser';
import createExpress, { Response } from 'express'
import { schema } from './schema'
import * as Http from 'http'
import { PrismaClient } from '@prisma/client';
import { Context } from './context';
import e from 'express';

const db = new PrismaClient({
  log: ['query', 'info', 'warn'],
});
const pubsub = new PubSub();
let nextCleanupCheck = new Date();

async function createContext(cookie: string | null, response: e.Response<any>): Promise<Context> {
  console.log("context")
  // Added for debugging
  //await new Promise((r) => setTimeout(r, 3000));
  
  if (nextCleanupCheck.getTime() < Date.now()) {
    nextCleanupCheck = new Date();
    nextCleanupCheck.setHours(nextCleanupCheck.getMinutes() + 1);
    console.info("session cleanup start")
    let result = await db.userSession.deleteMany({
      where: {
        validUntil: {
          lt: new Date()
        }
      }
    })
    console.info(`cleaned up ${result.count} sessions`)
  }
  if (cookie) {
    let cookies = parseCookie(cookie);
    if (cookies.id) {

      let userSession = await db.userSession.findUnique({
        where: {
          id: cookies.id,
        },
        include: {
          user: true
        }
      })

      if (userSession && userSession.validUntil.getTime() > Date.now()) {
        return {
          sessionId: cookies.id,
          user: userSession?.user,
          pubsub,
          db,
          response,
        }
      }
    }
  }
  return {
    sessionId: null,
    user: null,
    pubsub,
    db,
    response,
  }
}

const apollo = new ApolloServer({
  schema,
  context: async (config) => {
    console.log("jojo")
    return await createContext(config.req.headers.cookie || null, config.res);
  }
})

const express = createExpress()

express.use(cookieParser())

const httpServer = Http.createServer()

apollo.installSubscriptionHandlers(httpServer)

apollo.applyMiddleware({ app: express })

apollo.applyMiddleware({ app: express, cors: {
  credentials: true,
  methods: "POST",
  origin: ["http://localhost:3000", "http://localhost:5000"]
 }})

httpServer.listen({ port: 4000 }, () => {
  console.log(`server at http://localhost:4000${apollo.graphqlPath}`)
  console.log(`Subscriptions server at ws://localhost:4000${apollo.subscriptionsPath}`)
})*/