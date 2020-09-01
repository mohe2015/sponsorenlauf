import { schema } from "nexus";

schema.objectType({
  name: "UserMutationError",
  definition(t) {
    t.string("usernameError");
    t.string("roleError", { nullable: true });
  },
});

schema.objectType({
  name: "UserMutationOutput",
  definition(t) {
    t.field("edge", {type: "UserEdge"})
  }
})

schema.unionType({
  name: "UserMutationResponse",
  definition(t) {
    t.members(
      "UserMutationOutput",
      "UserMutationError"
    )
    // @ts-expect-error
    t.resolveType((item) => item.__typename);
  }
})