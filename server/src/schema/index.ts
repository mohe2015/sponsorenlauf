import { AuthPayload } from "./AuthPayload";
import { Mutation } from "./Mutation";
import { Node } from "./Node";
import { Query } from "./Query";
import { Round } from "./Round";
import { Student } from "./Student";
import { Subscription } from "./Subscription";
import { User, UserRole } from "./User";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import {
  makeSchema,
  connectionPlugin,
  queryComplexityPlugin,
} from "@nexus/schema";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "../permissions";

let schema = makeSchema({
  types: [
    AuthPayload,
    Mutation,
    Node,
    Query,
    Round,
    Student,
    Subscription,
    User,
    UserRole,
  ],
  plugins: [
    nexusSchemaPrisma(),
    // https://nexus.js.org/docs/plugin-connection
    connectionPlugin(),
    // https://nexus.js.org/docs/plugin-querycomplexity
    queryComplexityPlugin(),
  ],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("../context"),
        alias: "Context",
      },
    ],
  },
});

export default applyMiddleware(schema, permissions);
