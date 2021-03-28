import { interfaceType } from 'nexus'
import { decode, encode } from "../relay-tools-custom";

export const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", {
      description: "CUID for a resource",
      resolve: ({ id }, args, ctx, { parentType }) => {
        console.log(parentType);
        return encode(id, parentType.name);
      },
    });
  },
});
