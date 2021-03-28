import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import { schema } from './schema'
import { PrismaClient } from '@prisma/client';
import { PubSub } from "graphql-subscriptions";
import { Context } from './context';
import e from 'express';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'

let nextCleanupCheck = new Date();

const db = new PrismaClient({
  log: ['query', 'info', 'warn'],
});
const pubsub = new PubSub();

let myplugin: ApolloServerPlugin = {
  requestDidStart: ({ request }) => {
    console.debug(request)

    return {
      willSendResponse: async (requestContext) => {
        console.debug(requestContext.response);
        console.debug(requestContext.errors)
      },
    }
  },
}

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

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    schema,
    context: async (config) => {
      console.log(config.req.cookies)

      console.log("jojo")
      return await createContext(config.req.headers.cookie || null, config.res);
    },
    debug: true, // TODO FIXME
    plugins: [
      myplugin 
    ],
    formatError: (err) => {
      console.error("Errorrrr ", err);
      return err;
    },
  })
  await server.start()

  app.use(cors({
    credentials: true,
      methods: "POST",
      origin: ["http://localhost:3000", "http://192.168.2.129:3000", "https://studio.apollographql.com"],
      maxAge: 86400, // 24 hours, max for Firefox
  }))
  app.use(cookieParser());

  server.applyMiddleware({ app });


  app.listen({ port: 4000 })

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();

/*
import { permissions } from "./permissions";
import { parse as parseCookie } from "cookie";
*/