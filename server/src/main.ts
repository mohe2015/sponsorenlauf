import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import schema from './schema'
import { verify } from 'jsonwebtoken'
import { Token, APP_SECRET } from './utils'
import WebSocket from 'ws'
import { ConnectionContext } from 'subscriptions-transport-ws'
import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server'
import { Request, Response } from 'apollo-server-env'
import { ExecutionParams } from 'subscriptions-transport-ws'
import { Context } from './context'

const prisma = new PrismaClient()
const pubsub = new PubSub()

interface ExpressContext {
  req: Request
  res: Response
  connection?: ExecutionParams<Context>
}

export function createContext(expressContext: ExpressContext): Context {
  //console.log('createContext')
  if (expressContext.connection) {
    //console.log('IMPORTANT', expressContext.connection.context.userId)
    return {
      request: expressContext.connection.context.request,
      userId: expressContext.connection.context.userId,
      prisma,
      pubsub,
    }
  } else {
    // @ts-ignore
    const Authorization = expressContext.req.headers.authorization
    let userId = null

    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      //console.log('atoken', token)
      const verifiedToken = verify(token, APP_SECRET) as Token
      //console.log('atokenverified', verifiedToken && verifiedToken.userId)
      userId = verifiedToken && verifiedToken.userId
    }

    return {
      request: expressContext.req,
      prisma,
      pubsub,
      userId,
    }
  }
}

const server = new ApolloServer({
  schema,
  context: createContext,
  playground: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
  subscriptions: {
    onConnect: (
      connectionParams: Object,
      websocket: WebSocket,
      context: ConnectionContext,
    ): Context => {
      // @ts-ignore
      if (connectionParams.Authorization) {
        // @ts-ignore
        const token = connectionParams.Authorization.replace('Bearer ', '')
        const verifiedToken = verify(token, APP_SECRET) as Token
        return {
          request: context.request,
          prisma,
          pubsub,
          userId: verifiedToken && verifiedToken.userId,
        }
      }
      throw new Error('Missing auth token!')
    },
  },
})

server
  .listen({
    cors: {
      credentials: true,
      origin: ['http://localhost:3000'],
    },
    port: 4000,
  })
  .then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`)
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
  })
