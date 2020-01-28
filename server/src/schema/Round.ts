import { objectType } from 'nexus'

export const Round = objectType({
  name: 'Round',
  definition(t) {
    t.model.id()
    t.model.student()
    t.model.time()
    t.model.createdBy()
  },
})

export const Rounds = objectType({
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

export const PageInfo = objectType({
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

export const RoundEdge = objectType({
  name: 'RoundEdge',
  definition(t) {
    t.string('cursor')
    t.field('node', { type: 'Round' })
  },
})
