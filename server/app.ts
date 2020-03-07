import { verify, Secret } from 'jsonwebtoken'
import { permissions } from './src/permissions';
import { applyMiddleware } from 'graphql-middleware'
import { PubSub } from 'graphql-subscriptions';
import { mergeSchemas } from 'graphql-tools'
import { newSubField } from './graphql/Subscription';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { ApolloServer } from 'apollo-server'
import { schema, server, settings, log } from "nexus-future"

function requestToUserID(param: any) {
  let req: import("http").IncomingMessage = param.req; // WTF?
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return null;
  }
  const verifiedToken = verify(token as string, process.env.APP_SECRET as Secret) as NexusContext
  console.log(verifiedToken)
  return verifiedToken.userId
}

schema.addToContext(req => {
  return {
    userId: requestToUserID(req),
    pubsub: new PubSub()
  }
})


server.custom(({ schema, context }) => {

  const subscriptionSchema = new GraphQLSchema ({
    // you can ignore this...graphql just wants to me to have a query
    query: new GraphQLObjectType({ name: 'RootQueryType', fields: { fooQuery: { type: GraphQLInt, resolve: source => source } } }),

    subscription: new GraphQLObjectType({
      name: 'Subscription',
      fields: {
        subscribeRounds: {
          type: schema.getType("Round") as GraphQLObjectType,
          resolve: (source, args, context, info) => {
            return context.pubsub.asyncIterator("ROUNDS")
          }
        }
      }
    })
  });
  schema = mergeSchemas({
    schemas: [
      schema, 
      subscriptionSchema
  ]})
  schema = applyMiddleware(schema, permissions)

  const server = new ApolloServer({
    schema,
    context
  })

  return {
    async start() {
      await server.listen()

      console.log(`Apollo Server listening`, {
        url: server.graphqlPath
      })
    },
    stop() {
      return server.stop()
    }
  }
})