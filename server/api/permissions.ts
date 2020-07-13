import { shield, rule, deny, not, and, or, allow } from "nexus-plugin-shield";
import { UserRole } from "nexus-plugin-prisma/client";

const rules = {
  isUserWithRole: (roles: UserRole[]) =>
    rule({ cache: "contextual" })(async (parent, args, context, info) => {
      const id = context.userId;
      const user = await context.db.user.findOne({
        where: {
          id,
        },
      });
      return roles.some((r) => user && r === user.role);
    }),
};

export const permissions = shield({
  rules: {
    Query: {
      me: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      students: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      rounds: rules.isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      users: rules.isUserWithRole(["ADMIN"]),
    },
    Mutation: {
      createOneUser: rules.isUserWithRole(["ADMIN"]),
      login: allow,
      createOneRound: rules.isUserWithRole(["ADMIN", "TEACHER"]),
      createOneStudent: rules.isUserWithRole(["ADMIN"]),
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
    Student: rules.isUserWithRole(["ADMIN"]),

    PageInfo: allow,
    RoundConnection: allow,
    StudentConnection: allow,
    UserConnection: allow,
    RoundEdge: allow,
    StudentEdge: allow,
    UserEdge: allow,
    AuthPayload: allow,
  },
  options: { fallbackRule: deny, allowExternalErrors: true },
});
