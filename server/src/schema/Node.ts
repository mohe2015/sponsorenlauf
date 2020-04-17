import { interfaceType } from '@nexus/schema'
import { decode, encode } from '../relay-tools-custom'

export const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.resolveType(({ id }) => decode(id).__typename as any)
    t.string('id', {
      description: 'CUID for a resource',
      nullable: false,
      resolve: ({ id }, args, ctx, { parentType }) => {
        console.log(parentType)
        return encode(id, parentType.name)
      },
    })
  },
})
