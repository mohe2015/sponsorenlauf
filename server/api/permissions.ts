import { AuthenticationError, ForbiddenError } from "apollo-server-errors";
import { UserRole } from "@prisma/client";
import { Context } from "./context";
import { rule, shield, allow, deny } from "graphql-shield";

const rules = {
  isUserWithRole: (roles: UserRole[]) =>
    rule({ cache: "contextual" })(async (parent, args, context: Context, info) => {
      const user = context.user;
      return roles.some((r) => user && r === user.role);
    }),
};

export const permissions = shield({
  Query: {
    me: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
    runners: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
    rounds: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
    users: rules.isUserWithRole(["ADMIN"]),
    user:  rules.isUserWithRole(["ADMIN"]),
    runner: rules.isUserWithRole(["ADMIN"]),
    runnersByClass: rules.isUserWithRole(["ADMIN"]),
  },
  Mutation: {
    createOneUser: rules.isUserWithRole(["ADMIN"]),
    createOneRunner: rules.isUserWithRole(["ADMIN"]),
    login: allow,
    logout: allow,
    createOneRound: rules.isUserWithRole(["ADMIN", "TEACHER"]),
    deleteOneUser: rules.isUserWithRole(["ADMIN"]),
    updateOneUser: rules.isUserWithRole(["ADMIN"]),
    generatePasswords: rules.isUserWithRole(["ADMIN"]),
    deleteOneRunner: rules.isUserWithRole(["ADMIN"]),
    updateOneRunner: rules.isUserWithRole(["ADMIN"]),
    deleteOneRound: rules.isUserWithRole(["ADMIN"]),
  },
  Subscription: {
    subscribeRounds: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
    subscribeUsers: rules.isUserWithRole(["ADMIN"])
  },
  User: {
    password: rules.isUserWithRole(["ADMIN"]),
    id: allow,
    "*": rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
  },
  Round: {
    "*": rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
  },
  Runner: rules.isUserWithRole(["ADMIN"]),
  PageInfo: allow,
  QueryRunners_Connection: allow,
  RoundConnection: allow,
  QueryUsers_Connection: allow,
  RoundEdge: allow,
  RunnerEdge: allow,
  UserEdge: allow,
  CreateRoundMutationError: allow,
  CreateRoundMutationOutput: allow,
  LoginMutationError: allow,
  UserMutationOutput: allow,
  UserMutationError: allow,
  RunnerMutationError: allow,
  RunnerMutationOutput: allow,
  ClassRunners: rules.isUserWithRole(["ADMIN"]),
}, {
    fallbackRule: deny,
    allowExternalErrors: true,
    debug: true,
    fallbackError: (err, parent, args, ctx, info) => {
      if (ctx.user) {
        return new ForbiddenError("Unzureichende Berechtigungen!");
      } else {
        return new AuthenticationError("Nicht angemeldet!");
      }
    }
});
