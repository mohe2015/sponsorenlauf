import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import { schema } from './schema'
import { PrismaClient } from '@prisma/client';
import { PubSub } from "graphql-subscriptions";
import { Context } from './context';
import e from 'express';
import cookieParser from 'cookie-parser';
import cookie from 'cookie'
import express from 'express';
import http from 'http'
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

let nextCleanupCheck = new Date();

const db = new PrismaClient({
  log: ['query', 'info', 'warn'],
});
const pubsub = new PubSub();

async function createContext(cookies: string | undefined, response: e.Response<any>): Promise<Context> {
  // Added for debugging
  //await new Promise((r) => setTimeout(r, 10000));
  
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
  if (cookies) {
    let parsedCookies = cookie.parse(cookies)
    if ('id' in parsedCookies) {
      let userSession = await db.userSession.findUnique({
        where: {
          id: parsedCookies.id,
        },
        include: {
          user: true
        }
      })

      if (userSession && userSession.validUntil.getTime() > Date.now()) {
        return {
          sessionId: parsedCookies.id,
          user: userSession?.user,
          pubsub,
          db,
          response,
        }
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
  const PORT = 4000;

  const app = express();
  const httpServer = createServer(app);

  app.use(cookieParser());

  const server = new ApolloServer({
    schema,
    // https://github.com/apollographql/apollo-server/issues/2315
    context: async ({ req, res, connection }) => {
      if (connection) {
        return connection.context
      }
      // connection and req are exclusive (depending on using http or websocket)
      //console.log("connection: ", connection)
      //console.log("req: ", req)
      return await createContext(req.headers["cookie"], res);
    },
    //debug: true, // TODO FIXME
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }],
    /*formatError: (err) => {
      console.log(err);
      console.log((err as any).extensions.exception)
      return err;
    },*/
    /*subscriptions: {
      onConnect: async (params, websocket, context) => {
        console.log("context: ", context)
        return await createContext(context.request.headers["cookie"], undefined)
      }
    }*/
  })

  const subscriptionServer = SubscriptionServer.create({
    // This is the `schema` we just created.
    schema,
    // These are imported from `graphql`.
    execute,
    subscribe,
 }, {
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // This `server` is the instance returned from `new ApolloServer`.
    path: server.graphqlPath,
 });

  await server.start()

  server.applyMiddleware({app, cors: {
    credentials: true,
    methods: "POST",
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    maxAge: 86400, // 24 hours, max for Firefox
  }})

  server.applyMiddleware({ app });
  
  await new Promise<void>(resolve => httpServer.listen(PORT, resolve));

  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
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