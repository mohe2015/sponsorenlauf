import { schema } from "nexus";
import { Node } from "./Node";
import { decode, encode } from "../relay-tools-custom";

schema.enumType({
  name: "UserRole",
  members: ["ADMIN", "TEACHER", "VIEWER"],
  description: "The users role",
});

export const User = schema.objectType({
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
    t.model.hashedPassword();
    t.field("password", {
      type: "String",
      nullable: true,
      resolve: async (parent, args, context, info) => {
        return null
      }
    })
    t.model.role();
    t.model.createdRounds({ type: "Round" });
  },
}).value.rootTyping;
