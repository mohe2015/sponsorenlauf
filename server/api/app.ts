import { verify, Secret } from 'jsonwebtoken'
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import { GraphQLSchema } from 'graphql'
import { printSchema } from 'graphql'
import fs from 'fs'
import { Request } from 'nexus/dist/runtime/app'
import { PubSub } from 'graphql-subscriptions'
import { use, schema, settings } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'

use(prisma())

let pubSub = new PubSub()

function requestToUserID(param: Request) {
  // TODO FIXME ACCESS websocket context
  let authorization = param.headers.authorization
  const token = authorization?.replace('Bearer ', '')
  if (!token) {
    return null
  }
  const verifiedToken = verify(
    token as string,
    process.env.APP_SECRET as Secret,
  )
  return verifiedToken.userId
}

schema.addToContext((req) => {
  return {
    userId: requestToUserID(req),
    pubSub: pubSub
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
