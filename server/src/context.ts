import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import { Token, APP_SECRET } from './utils'
import { PubSub } from 'apollo-server'
import { Request, Response } from 'apollo-server-env'
import { ExecutionParams } from 'subscriptions-transport-ws'

const prisma = new PrismaClient()
const pubsub = new PubSub()

export interface Context {
  prisma: PrismaClient
  request: any
  pubsub: PubSub
  userId: string | null
}

interface ExpressContext {
  req: Request
  res: Response
  connection?: ExecutionParams
}

export function createContext(expressContext: ExpressContext): Context {
  console.log(expressContext.req.headers)
  if (expressContext.connection) {
    console.log('IMPORTANT', expressContext.connection.context.userId)
    return {
      request: expressContext.connection.context.request,
      userId: expressContext.connection.context.userId,
      prisma,
      pubsub,
    }
  } else {
    // @ts-ignore
    const Authorization = expressContext.req.headers.authorization || ''
    let userId = null

    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      console.log('token', token)
      const verifiedToken = verify(token, APP_SECRET) as Token
      console.log('tokenverified', verifiedToken && verifiedToken.userId)
      userId = verifiedToken && verifiedToken.userId
    }

    return {
      request: expressContext.req,
      prisma,
      pubsub,
      userId,
    }
  }
}
