import { makeSchema, connectionPlugin, queryComplexityPlugin } from "@nexus/schema";
import { ApolloServer } from "apollo-server";
import { ExpressContext } from "apollo-server-express/src/ApolloServer"
import * as types from "./schema";
import { verify, Secret } from 'jsonwebtoken'
import { PubSub } from 'graphql-subscriptions'
import { nexusPrismaPlugin } from 'nexus-prisma'

let pubSub = new PubSub()

const schema = makeSchema({
  types: types,
  plugins: [
    nexusPrismaPlugin(),
    // https://nexus.js.org/docs/plugin-connection
    connectionPlugin(),
    // https://nexus.js.org/docs/plugin-querycomplexity
    queryComplexityPlugin(),
  ],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
  },
});


const server = new ApolloServer({
  schema,
  context: async ({ req, connection }) => {
    let authToken;
    if (connection) {
      authToken = connection.context.Authorization;
    } else {
      const match = /^Bearer (.*)$/.exec(req.headers.authorization as string);
      if (match) authToken = match[1]
    }

    if (authToken) {
      const verifiedToken = verify(
        authToken,
        process.env.APP_SECRET as Secret,
      )
      return {
        userId: verifiedToken.userId,
        pubSub
      }
    } else {
      return {
        userId: null,
        pubSub
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