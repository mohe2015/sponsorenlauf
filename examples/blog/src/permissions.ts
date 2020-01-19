import { rule, shield, deny, allow } from 'graphql-shield'
import { getUserId } from './utils'

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context)
    console.log(Boolean(userId))
    return Boolean(userId)
  }),
  isPostOwner: rule()(async (parent, { id }, context) => {
    const userId = getUserId(context)
    const author = await context.photon.posts
      .findOne({
        where: {
          id,
        },
      })
      .author()
    return userId === author.id
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
  },
  User: allow,
  Mutation: {
    publish: rules.isPostOwner,
  },
}, { fallbackRule: deny, allowExternalErrors: true })