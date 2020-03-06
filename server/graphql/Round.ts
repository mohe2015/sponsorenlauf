import { schema } from 'nexus-future'

export const Round = schema.objectType({
  name: 'Round',
  definition(t) {
    t.model.id()
    t.model.student()
    t.model.time()
    t.model.createdBy()
  },
})

export const Rounds = schema.objectType({
  name: 'Rounds',
  definition(t) {
    t.field('pageInfo', {
      type: 'PageInfo',
    })
    t.list.field('edges', {
      type: 'RoundEdge',
    })
  },
})

export const PageInfo = schema.objectType({
  name: 'PageInfo',
  definition(t) {
    t.string('startCursor', {
      nullable: true,
    })
    t.string('endCursor', {
      nullable: true,
    })
    t.boolean('hasPreviousPage')
    t.boolean('hasNextPage')
  },
})

export const RoundEdge = schema.objectType({
  name: 'RoundEdge',
  definition(t) {
    t.string('cursor')
    t.field('node', { type: 'Round' })
  },
})
