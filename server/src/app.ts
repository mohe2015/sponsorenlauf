import { verify, Secret } from 'jsonwebtoken'
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import { PubSub } from 'graphql-subscriptions'
import { mergeSchemas } from 'graphql-tools'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql'
import { ApolloServer } from 'apollo-server'
import { schema, server, settings, log } from 'nexus-future'
import { ExecutionParams } from 'subscriptions-transport-ws'
import { printSchema } from 'graphql'
import fs from 'fs'

let pubSub = new PubSub()

interface WebSocketContext {
  Authorization: string
}

function requestToUserID(param: any) {
  let req: import('http').IncomingMessage = param.req // WTF?
  let connection: ExecutionParams<WebSocketContext> = param.connection
  let authorization =
    connection?.context?.Authorization || req.headers.authorization
  const token = authorization?.replace('Bearer ', '')
  if (!token) {
    return null
  }
  const verifiedToken = verify(
    token as string,
    process.env.APP_SECRET as Secret,
  ) as NexusContext
  return verifiedToken.userId
}

schema.addToContext((req) => {
  return {
    userId: requestToUserID(req),
    pubsub: pubSub,
  }
})

settings.change({
  schema: {
    //generateGraphQLSDLFile: "generated/graphql.schema",
    connections: {
      default: {
        includeNodesField: true,
      },
    },
  },
})

// https://github.com/apollographql/graphql-subscriptions/blob/master/src/test/asyncIteratorSubscription.ts

function buildSchema(schema: GraphQLSchema) {
  const subscriptionSchema = new GraphQLSchema({
    // you can ignore this...graphql just wants to me to have a query
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: { fooQuery: { type: GraphQLInt, resolve: (source) => source } },
    }),

    subscription: new GraphQLObjectType({
      name: 'Subscription',
      fields: {
        subscribeRounds: {
          type: schema.getType('Round') as GraphQLObjectType,
          // subscribe: withFilter(() => iterator, filterFn),
          subscribe: (source, args, context, info) => {
            return context.pubsub.asyncIterator('ROUNDS')
          },
          resolve: (source, args, context, info) => {
            console.log(source)
            return source
          },
        },
      },
    }),
  })
  schema = mergeSchemas({
    schemas: [schema, subscriptionSchema],
  })
  schema = applyMiddleware(schema, permissions)
  fs.writeFileSync('generated/schema.graphql', printSchema(schema))
  return schema
}

server.custom(({ schema, context, express }) => {
  schema = buildSchema(schema)
  const server = new ApolloServer({
    schema,
    context,
  })

  return {
    async start() {
      await server.listen()

      console.log(`Apollo Server listening`, {
        url: server.graphqlPath,
      })
    },
    stop() {
      return server.stop()
    },
  }
})
