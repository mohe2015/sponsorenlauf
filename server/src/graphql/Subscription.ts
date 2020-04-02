import { schema } from 'nexus'
import { Round } from './Round'
import { PubSub } from 'graphql-subscriptions'

let pubSub = new PubSub()

schema.subscriptionField('SubscribeRounds', {
  type: Round,
  subscribe: (source, args, context, info) => {
    console.log('Subscribe')
    // maybe this doesn't receive the context?
    return pubSub.asyncIterator('ROUNDS')
  },
  resolve: (source, args, context, info) => {
    console.log(source)
    return source
  },
})
