import { rule, shield, deny, allow } from 'graphql-shield'
import { UserRole } from '@prisma/client'

const rules = {
  isUserWithRole: (roles: UserRole[]) =>
    rule({ cache: 'contextual' })(
      async (parent, args, context: NexusContext, info) => {
        const id = context.userId
        const user = await context.db.user.findOne({
          where: {
            id,
          },
        })
        return roles.some(r => user && r === user.role)
      },
    ),
}

export const permissions = shield(
  {
    Query: {
      me: rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
      students: rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
      student: rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
      rounds: rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
    },
    Mutation: {
      createOneUser: rules.isUserWithRole(['ADMIN']),
      login: allow,
      createOneRound: rules.isUserWithRole(['ADMIN', 'TEACHER']),
      createOneStudent: rules.isUserWithRole(['ADMIN']),
    },
    Subscription: {
      subscribeRounds: rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
    },
    User: {
      password: rules.isUserWithRole(['ADMIN']),
      id: allow,
      '*': rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
    },
    Round: {
      '*': rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
    },
    RoundConnection: rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
    PageInfo: allow,
    RoundEdge: allow,
    Student: rules.isUserWithRole(['ADMIN']),
    AuthPayload: allow,
  },
  { fallbackRule: deny, allowExternalErrors: true },
)
