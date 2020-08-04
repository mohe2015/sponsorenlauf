import { schema } from "nexus";

schema.enumType({
  name: "UserRole",
  members: ["ADMIN", "TEACHER", "VIEWER"],
  description: "The users role",
});

export const User = schema.objectType({
  name: "User",
  definition(t) {
    t.model.id();
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
