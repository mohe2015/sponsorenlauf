import { interfaceType } from 'nexus'
import { decode, encode } from "../relay-tools-custom";

export const Node = interfaceType({
  name: "Node",
  resolveType: ({ id }) => decode(id).__typename,
  definition(t) {
    t.string("id", {
      description: "CUID for a resource",
      resolve: ({ id }, args, ctx, { parentType }) => {
        console.log(parentType);
        return encode(id, parentType.name);
      },
    });
  },
});
