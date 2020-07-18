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
      me: deny, // rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"])
      runners: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      rounds: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      users: rules.isUserWithRole(["ADMIN"]),
    },
    Mutation: {
      createOneUser: rules.isUserWithRole(["ADMIN"]),
      login: allow,
      createOneRound: rules.isUserWithRole(["ADMIN", "TEACHER"]),
      createOneRunner: rules.isUserWithRole(["ADMIN"]),
    },
    Subscription: {
      SubscribeRounds: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
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
    RoundConnection: allow,
    QueryRunners_Connection: allow,
    UserConnection: allow,
    RoundEdge: allow,
    RunnerEdge: allow,
    UserEdge: allow,
    LoginMutationError: allow,
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
