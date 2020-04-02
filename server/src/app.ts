import { verify, Secret } from 'jsonwebtoken'
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import { GraphQLSchema } from 'graphql'
import { schema, settings } from 'nexus'
import { printSchema } from 'graphql'
import fs from 'fs'
import { Request } from 'nexus/dist/runtime/app'

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
  console.log("yay")
  return {
    userId: requestToUserID(req)
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
