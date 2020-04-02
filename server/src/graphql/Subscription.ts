import { schema } from 'nexus'
import { Round } from './Round'

schema.subscriptionField('SubscribeRounds', {
  type: Round,
  subscribe: (source, args, context, info) => {
    console.log('Subscribe')
    return context.pubsub.asyncIterator('ROUNDS')
  },
  resolve: (source, args, context, info) => {
    console.log(source)
    return source
  },
})
