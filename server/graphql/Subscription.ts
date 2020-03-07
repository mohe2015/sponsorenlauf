import { subscriptionField } from '@nexus/schema'

export const newSubField = subscriptionField('SubscribeRounds', {
  type: 'Round',
  subscribe: async (root, args, context, info) => {
    return context.pubsub.asyncIterator("ROUNDS")
  },
  resolve: async (payload) => {
    return payload
  }
})