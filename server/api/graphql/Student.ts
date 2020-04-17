import { schema } from 'nexus'
import { Node } from './Node'

export const Student = schema.objectType({
  name: 'Student',
  definition(t) {
    t.implements(Node)
    t.model.id()
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
