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
import { Round } from './graphql/Round'

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
  )
  // @ts-ignore
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
    generateGraphQLSDLFile: 'generated/graphql.schema',
    connections: {
      default: {
        includeNodesField: true,
      },
    },
  },
})

// https://github.com/apollographql/graphql-subscriptions/blob/master/src/test/asyncIteratorSubscription.ts

function buildSchema(schema: GraphQLSchema) {
  schema = applyMiddleware(schema, permissions)
  fs.writeFileSync('generated/schema.graphql', printSchema(schema))
  return schema
}
