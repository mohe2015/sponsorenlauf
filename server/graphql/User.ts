import { schema } from 'nexus-future'

export const UserRole = schema.enumType({
  name: 'UserRole',
  members: ['ADMIN', 'TEACHER', 'VIEWER'],
  description: 'The users role',
})

export const User = schema.objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.password()
    t.model.role()
    t.model.createdRounds({ type: 'Round' })
  },
})
