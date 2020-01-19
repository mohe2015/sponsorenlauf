import { objectType, enumType, subscriptionField } from 'nexus'
import { withFilter } from 'graphql-yoga';

export const UserRole = enumType({
  name: "UserRole",
  members: ["ADMIN", "AUTHOR"],
  description: "The users role",
});

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.blog()
    t.model.posts({ type: 'Post' })
    t.model.role()
  },
})
