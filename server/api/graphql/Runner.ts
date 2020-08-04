import { schema } from "nexus";
import { Node } from "./Node";
import { decode, encode } from "../relay-tools-custom";

schema.objectType({
  name: "Runner",
  definition(t) {
    t.implements(Node);
    t.string("id", {
      description: "CUID for a resource",
      nullable: false,
      resolve: (parent, args, ctx, { parentType }) => {
        console.log(parentType);
        return encode(parent.identifier + "", parentType.name);
      },
    });
    t.model.identifier();
    t.model.name();
    t.model.clazz();
    t.model.grade();
    t.model.rounds({
      pagination: true,
      filtering: true,
      ordering: true,
      type: "Round",
    });
  },
});
