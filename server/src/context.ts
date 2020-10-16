import { PrismaClient, User } from '@prisma/client'
import { PubSub } from 'apollo-server-express'
import e from 'express'
import { ServerResponse } from 'http'

export type Context = {
    sessionId: string | null;
    user: User | null;
    pubsub: PubSub;
    db: PrismaClient;
    response: e.Response<any>;
}