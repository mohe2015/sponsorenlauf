import { objectType } from '@nexus/schema'

export const Round = objectType({
  name: 'Round',
  definition(t) {
    t.model.id()
    t.model.student()
    t.model.time()
    t.model.createdBy()
  },
})