import { PrismaClient } from '@prisma/client'

export type Context = {
    user: User | null;
    pubsub: PubSub;
    db: PrismaClient,
    response: http.ServerResponse;
}