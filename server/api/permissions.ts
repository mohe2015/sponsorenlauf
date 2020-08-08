import { shield, rule, deny, not, and, or, allow } from "nexus-plugin-shield";
import { UserRole } from "nexus-plugin-prisma/client";
import { AuthenticationError, ForbiddenError } from "./errors";

const rules = {
  isUserWithRole: (roles: UserRole[]) =>
    rule({ cache: "contextual" })(async (parent, args, context, info) => {
      const user = context.user;
      return roles.some((r) => user && r === user.role);
    }),
};

export const permissions = shield({
  rules: {
    Query: {
      me: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      runners: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      rounds: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      users: rules.isUserWithRole(["ADMIN"]),
      user:  rules.isUserWithRole(["ADMIN"]),
      runner: rules.isUserWithRole(["ADMIN"]),
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

  },
  options: {
    fallbackRule: deny,
    allowExternalErrors: true, 
    fallbackError: (err, parent, args, ctx, info) => {
      // @ts-expect-error
      if (ctx.user) {
        return new ForbiddenError("Unzureichende Berechtigungen!");
      } else {
        return new AuthenticationError("Nicht angemeldet!");
      }
    }
  },
});
