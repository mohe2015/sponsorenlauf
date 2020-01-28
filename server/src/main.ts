import { GraphQLServer } from 'graphql-yoga'
import schema from './schema'
import { createContext, Context } from './context'
import { permissions } from './permissions'
import { verify } from 'jsonwebtoken'
import { APP_SECRET } from './utils'

const server = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
})

server.start(
  {
    subscriptions: {
      onConnect: (connectionParams: any, request: any, context: Context) => {
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
    cors: {
      credentials: true,
      origin: ['http://localhost:3000'],
    },
  },
  () => console.log(`🚀 Server ready at http://localhost:4000`),
)
