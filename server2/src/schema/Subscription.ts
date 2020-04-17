import { subscriptionField } from '@nexus/schema'
import { Round } from './Round'

export const Subscription = subscriptionField('SubscribeRounds', {
  type: Round,
  subscribe: (source, args, context, info) => {
    return context.pubSub.asyncIterator('ROUNDS')
  },
  resolve: (source, args, context, info) => {
    return source
  },
})
