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
    console.log(request.query)
    console.log(request.variables)

    return {
      willSendResponse: async (requestContext) => {
        //console.log(requestContext.response);
        //console.log(requestContext.errors)
      },
    }
  },
}

async function createContext(cookies: any, response: e.Response<any>): Promise<Context> {
  console.log("context")
  // Added for debugging
  //await new Promise((r) => setTimeout(r, 3000));
  
  if (nextCleanupCheck.getTime() < Date.now()) {
    nextCleanupCheck = new Date();
    nextCleanupCheck.setHours(nextCleanupCheck.getMinutes() + 1);
    console.info("session cleanup start")
    // https://github.com/prisma/prisma/issues/4947
    let result = await db.userSession.deleteMany({
      where: {
        validUntil: {
          lt: new Date()
        }
      }
    })
    console.info(`cleaned up ${result.count} sessions`)
  }
  // TODO FIXME store signed session cookie on client?
  if ('id' in cookies) {
    let userSession = await db.userSession.findUnique({
      where: {
        id: cookies.id,
      },
      include: {
        user: true
      }
    })

    if (userSession && userSession.validUntil.getTime() > Date.now()) {
      console.log("a")
      return {
        sessionId: cookies.id,
        user: userSession?.user,
        pubsub,
        db,
        response,
      }
    }
  }
  console.log("b")
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
  app.use(cookieParser());

  const server = new ApolloServer({
    schema,
    context: async (config) => {
      //console.log(config.req.cookies)
      return await createContext(config.req.cookies, config.res);
    },
    debug: true, // TODO FIXME
    plugins: [
      myplugin 
    ],
    formatError: (err) => {
      console.log(err);
      return err;
    },
  })
  //await server.start()

  server.applyMiddleware({app, cors: {
    credentials: true,
    methods: "POST",
    origin: ["http://localhost:3000"],
    maxAge: 86400, // 24 hours, max for Firefox
  }})

  server.applyMiddleware({ app });

  app.listen({ port: 4000 })

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();

// TODO FIXME security headers like
// X-Frame-Options: DENY
// TODO FIXME Cookie Same-Site
// TODO FIXME HttpOnly for session cookie
// TODO FIXME secure for session cookie
// TODO FIXME Content-Security-Policy
// TODO FIXME rel="noopener" https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy

// React check XSS: <div>{ untrustedInput }</div>

/*
import { permissions } from "./permissions";
*/