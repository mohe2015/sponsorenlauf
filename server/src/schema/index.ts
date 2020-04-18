import { AuthPayload } from "./AuthPayload";
import { Mutation }  from "./Mutation";
import { Node }  from "./Node";
import { Query }  from "./Query";
import { Round }  from "./Round";
import { Student }  from "./Student";
import { Subscription }  from "./Subscription";
import { User }  from "./User";
import { nexusPrismaPlugin } from 'nexus-prisma'
import { makeSchema, connectionPlugin, queryComplexityPlugin } from "@nexus/schema";
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from '../permissions'

let schema = makeSchema({
  types: [AuthPayload, Mutation, Node, Query, Round, Student, Subscription], User,
  plugins: [
    nexusPrismaPlugin(),
    // https://nexus.js.org/docs/plugin-connection
    connectionPlugin(),
    // https://nexus.js.org/docs/plugin-querycomplexity
    queryComplexityPlugin(),
  ],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
  },
});

export default applyMiddleware(schema, permissions)
