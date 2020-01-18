import { objectType, subscriptionField } from 'nexus'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.title()
    t.model.tags()
    t.model.status()
  },
})


export const PostSubscription = subscriptionField('SubscribePosts', {
  type: 'Post',
  subscribe(root, args, ctx) {
    return ctx.pubsub.asyncIterator("PUBLISHED_POSTS")
  },
  resolve(payload) {
    return payload
  },
})