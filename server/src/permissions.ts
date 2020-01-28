import { rule, shield, deny, allow } from 'graphql-shield'
import { UserRole } from '@prisma/photon'

const rules = {
  isUserWithRole: (roles: UserRole[]) =>
    rule({ cache: 'contextual' })(async (parent, args, context, info) => {
      const id = context.userId
      console.log('UserId', id)
      const user = await context.photon.users.findOne({
        where: {
          id,
        },
      })
      return roles.some(r => r === user.role)
    }),
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
    User: {
      password: rules.isUserWithRole(['ADMIN']),
      id: allow,
      '*': rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
    },
    Round: {
      '*': rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
    },
    Student: rules.isUserWithRole(['ADMIN']),
    AuthPayload: allow,
  },
  { fallbackRule: deny, allowExternalErrors: true },
)
