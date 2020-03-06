import app, { schema, server } from 'nexus-future'
import { verify, Secret } from 'jsonwebtoken'
import { permissions } from './src/permissions';
import { applyMiddleware } from 'graphql-middleware'

function requestToUserID(req: import("http").IncomingMessage) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return null;
  }
  const verifiedToken = verify(token as string, process.env.APP_SECRET as Secret) as NexusContext
  return verifiedToken.userId
}

schema.addToContext(req => {
  return { userId: requestToUserID(req) }
})

server.custom(({ express, schema, context }) => {
  schema = applyMiddleware(schema, permissions)
})
