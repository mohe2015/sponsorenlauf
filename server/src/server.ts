import { ApolloServer } from "apollo-server";
import { verify, Secret } from 'jsonwebtoken'
import { PubSub } from 'graphql-subscriptions'
import { PrismaClient } from "@prisma/client"
import { config } from 'dotenv'
import schema from './schema'

config()

let pubSub = new PubSub()
const db = new PrismaClient()

const server = new ApolloServer({
  schema,
  context: async ({ req, connection }) => {
    let authToken = connection ? connection.context.Authorization : req.headers.authorization
    const match = /^Bearer (.*)$/.exec(authToken);
    if (match) authToken = match[1]
    
    if (authToken) {
      const verifiedToken = verify(
        authToken,
        process.env.APP_SECRET as Secret,
      )
      return {
        userId: verifiedToken.userId,
        pubSub,
        db
      }
    } else {
      return {
        userId: null,
        pubSub,
        db
      }
    }
  },
  // https://github.com/apollographql/apollo-server/issues/2315
  subscriptions: {
    onConnect: (connectionParams: any) => connectionParams
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});