import { queryType, stringArg, makeSchema } from "@nexus/schema";
import { ApolloServer } from "apollo-server";
import * as types from "./schema";
import { verify, Secret } from 'jsonwebtoken'
import { PubSub } from 'graphql-subscriptions'

let pubSub = new PubSub()

const context = async ({ req }: { req: Request }) => {
  return {
    userId: requestToUserID(req),
    pubSub: pubSub
  }
}

function requestToUserID(param: Request) {
  // TODO FIXME ACCESS websocket context
  let authorization = param.headers.get("Authorization")
  const token = authorization?.replace('Bearer ', '')
  if (!token) {
    return null
  }
  const verifiedToken = verify(
    token as string,
    process.env.APP_SECRET as Secret,
  )
  return verifiedToken.userId
}

const schema = makeSchema({
  types: types,
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/typings.ts",
  },
});


const server = new ApolloServer({
  schema,
  context,
});

const port = process.env.PORT || 4000;

server.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);