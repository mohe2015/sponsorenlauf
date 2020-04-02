import { schema } from 'nexus'

export const Round = schema.objectType({
  name: 'Round',
  definition(t) {
    t.model.id()
    t.model.student()
    t.model.time()
    t.model.createdBy()
  },
})