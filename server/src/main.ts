import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import schema from './schema'
import { createContext, Context } from './context'
import { verify } from 'jsonwebtoken'
import { Token, APP_SECRET } from './utils'
import WebSocket, { Server } from 'ws'
import { ConnectionContext } from 'subscriptions-transport-ws'

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
    ) => {
      //console.log('onConnect')
      let Authorization
      if (connectionParams.Authorization) {
        //console.log('websocket', connectionParams.Authorization)
        Authorization = connectionParams.Authorization
      }
      if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        //console.log('token', token)
        const verifiedToken = verify(token, APP_SECRET) as Token
        //console.log('tokenverified', verifiedToken && verifiedToken.userId)
        context.userId = verifiedToken && verifiedToken.userId
      }
      return context
    },
  },
})

server.listen(
  {
    cors: {
      credentials: true,
      origin: ['http://localhost:3000'],
    },
    port: 4000,
  },
  () => console.log(`🚀 Server ready at http://localhost:4000`),
)
