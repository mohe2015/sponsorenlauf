import { objectType, subscriptionField } from 'nexus'

export const Student = objectType({
  name: 'Student',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.class()
    t.model.grade()
    t.model.rounds({type: 'Round'});
  },
})


export const StudentSubscription = subscriptionField('SubscribeStudents', {
  type: 'Student',
  subscribe(root, args, ctx) {
    return ctx.pubsub.asyncIterator("STUDENTS")
  },
  resolve(payload) {
    return payload
  },
})