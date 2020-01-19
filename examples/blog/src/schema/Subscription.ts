import { subscriptionField } from "nexus"

export const RoundsSubscription = subscriptionField('SubscribeRounds', {
    type: 'Round',
    subscribe(root, args, ctx) {
      return ctx.pubsub.asyncIterator("ROUNDS")
    },
    resolve(payload) {
      return payload
    },
  })