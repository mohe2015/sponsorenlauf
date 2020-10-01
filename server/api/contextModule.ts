

export type Context = {
    user: User | null;
    pubsub: PubSub;
    db: PrismaClient,
    response: http.ServerResponse;
}