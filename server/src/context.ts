import { PrismaClient, User } from '@prisma/client'
import { PubSub } from 'apollo-server-express'
import { ServerResponse } from 'http'

export type Context = {
    user: User | null;
    pubsub: PubSub;
    db: PrismaClient,
    response: ServerResponse;
}