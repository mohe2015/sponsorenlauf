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

export function createContext(
  request: Request,
  response: Response,
  connection?: ExecutionParams,
): Context {
  if (connection) {
    console.log('IMPORTANT', connection.context.userId)
    return {
      request: connection.context.request,
      userId: connection.context.userId,
      prisma,
      pubsub,
    }
  } else {
    const Authorization = request.headers.get('Authorization') || ''
    let userId = null

    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      console.log('token', token)
      const verifiedToken = verify(token, APP_SECRET) as Token
      console.log('tokenverified', verifiedToken && verifiedToken.userId)
      userId = verifiedToken && verifiedToken.userId
    }

    return {
      request,
      prisma,
      pubsub,
      userId,
    }
  }
}
