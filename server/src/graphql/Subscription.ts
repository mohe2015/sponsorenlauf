import { schema } from 'nexus'
import { Round } from './Round'
schema.subscriptionField('SubscribeRounds', {
  type: Round,
  subscribe: (source, args, context, info) => {
    console.log('Subscribe')
    // maybe this doesn't receive the context?
    console.log(context)
    return context.pubSub.asyncIterator('ROUNDS')
  },
  resolve: (source, args, context, info) => {
    console.log(context)
    console.log(source)
    return source
  },
})
