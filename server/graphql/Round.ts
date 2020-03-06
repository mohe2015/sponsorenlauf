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