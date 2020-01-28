import { objectType } from 'nexus'

export const Student = objectType({
  name: 'Student',
  definition(t) {
    t.model.startNumber()
    t.model.name()
    t.model.class()
    t.model.grade()
    t.model.rounds({
      pagination: true,
      filtering: true,
      ordering: true,
      type: 'Round',
    })
  },
})
