import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import { Token, APP_SECRET } from './utils'
import { PubSub } from 'apollo-server'

const prisma = new PrismaClient()
const pubsub = new PubSub()

export interface Context {
  prisma: PrismaClient
  request: any
  pubsub: PubSub
  userId: string | null
}

export function createContext(context: any): Context {
  if (context.connection) {
    console.log('IMPORTANT', context.connection.context.userId)
    return {
      request: context.connection.context.request,
      userId: context.connection.context.userId,
      prisma,
      pubsub,
    }
  } else {
    const Authorization = context.request.headers.authorization || ''
    let userId = null

    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      // console.log('token', token)
      const verifiedToken = verify(token, APP_SECRET) as Token
      //console.log('tokenverified', verifiedToken && verifiedToken.userId)
      userId = verifiedToken && verifiedToken.userId
    }

    return {
      request: context.request,
      prisma,
      pubsub,
      userId,
    }
  }
}
