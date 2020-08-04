import { schema } from "nexus";
import { Node } from "./Node";
import { decode, encode } from "../relay-tools-custom";

schema.enumType({
  name: "UserRole",
  members: ["ADMIN", "TEACHER", "VIEWER"],
  description: "The users role",
});

schema.objectType({
  name: "User",
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
    t.model.password();
    t.model.role();
    t.model.createdRounds({ type: "Round" });
  },
});
