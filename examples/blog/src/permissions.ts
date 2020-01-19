import { rule, shield, deny, allow } from 'graphql-shield'
import { getUserId } from './utils'
import { UserRole } from '@prisma/photon'

const rules = {
  isUserWithRole: (roles: UserRole[]) =>
    rule({ cache: 'contextual' })(
      async (parent, args, context, info) => {
        const id = getUserId(context)
        const user = await context.photon.users
          .findOne({
            where: {
              id,
            },
          })
        return roles.some(r => r === user.role)
      },
    ),
}

export const permissions = shield({
  Query: {
    me: rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
    students: rules.isUserWithRole(['ADMIN', 'TEACHER', 'VIEWER']),
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
    "*": allow,
  },
  AuthPayload: allow,
}, { fallbackRule: deny, allowExternalErrors: true })