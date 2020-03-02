import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import schema from './schema'
import { createContext, Context } from './context'
import { verify } from 'jsonwebtoken'
import { Token, APP_SECRET } from './utils'
import * as WebSocket from 'ws'
import { ConnectionContext } from 'subscriptions-transport-ws'

const server = new ApolloServer({
  schema,
  context: createContext,
  playground: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
  subscriptions: {
    onConnect: (
      connectionParams: Object, // TODO use this https://www.apollographql.com/docs/react/data/subscriptions/#authentication-over-websocket
      websocket: WebSocket,
      context: ConnectionContext,
    ) => {
      // @ts-ignore
      console.log('jooj', connectionParams.Authorization)
      console.log('onConnect', context.request)
      let Authorization
      if (context.request.headers.authorization) {
        console.log('websocket', context.request.headers.authorization)
        Authorization = context.request.headers.authorization
      }
      if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        console.log('token', token)
        const verifiedToken = verify(token, APP_SECRET) as Token
        console.log('tokenverified', verifiedToken && verifiedToken.userId)
        return {
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
