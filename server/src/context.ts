import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server'

export interface Context {
  prisma: PrismaClient
  request: any
  pubsub: PubSub
  userId: string | null
}
