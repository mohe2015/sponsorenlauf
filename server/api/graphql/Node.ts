import { schema } from "nexus";
import { decode, encode } from "../relay-tools-custom";

export const Node = schema.interfaceType({
  name: "Node",
  definition(t) {
    t.resolveType((source, context, info) => {
      console.log(source)
      return decode(source.id).__typename as any;
    })
    t.string("id", {
      description: "CUID for a resource",
      nullable: false,
      resolve: (parent, args, ctx, { parentType }) => {
        console.log(parentType);
        return encode(parent.identifier + "", parentType.name);
      },
    });
  },
});
