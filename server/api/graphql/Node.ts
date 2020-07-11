import { schema } from "nexus";
import { decode, encode } from "../relay-tools-custom";

export const Node = schema.interfaceType({
  name: "Node",
  definition(t) {
    t.resolveType(({ id }) => decode(id).__typename as any);
    t.string("id", {
      description: "CUID for a resource",
      nullable: false,
      resolve: ({ id }, args, ctx, { parentType }) => {
        console.log(parentType);
        return encode(id, parentType.name);
      },
    });
  },
});
