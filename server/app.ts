import { verify, Secret } from 'jsonwebtoken'
import { permissions } from './src/permissions';
import { applyMiddleware } from 'graphql-middleware'
import { PubSub } from 'graphql-subscriptions';
import { mergeSchemas } from 'graphql-tools'
import { newSubField } from './graphql/Subscription';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { ApolloServer } from 'apollo-server'
import { schema, server, settings, log } from "nexus-future"

function requestToUserID(req: import("http").IncomingMessage) {
  if (!req || !req.headers) {
    return null;
  }
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return null;
  }
  const verifiedToken = verify(token as string, process.env.APP_SECRET as Secret) as NexusContext
  return verifiedToken.userId
}

schema.addToContext(req => {
  return {
    userId: requestToUserID(req),
    pubsub: new PubSub()
  }
})


server.custom(({ schema, context }) => {
  
  const screamType = new GraphQLObjectType({
    name: 'Scream',
    fields: () => ({
      dudeWhyAreYouScreaming: {
        type: GraphQLString
      }
    })
  })

  const subscriptionSchema = new GraphQLSchema ({
    // you can ignore this...graphql just wants to me to have a query
    query: new GraphQLObjectType({ name: 'RootQueryType', fields: { fooQuery: { type: screamType, resolve: source => source } } }),

    subscription: new GraphQLObjectType({
      name :'Subscription',
      fields: {
        screams: {
          type: screamType,
          resolve: source => source
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