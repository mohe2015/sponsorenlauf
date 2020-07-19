import { schema } from "nexus";

schema.objectType({
  name: "CreateOneUserMutationError",
  definition(t) {
    t.string("usernameError");
    t.string("roleError");
  },
});

schema.objectType({
  name: "CreateUserMutationOutput",
  definition(t) {
    t.field("user_edge", {type: "UserEdge"})
  }
})

schema.unionType({
  name: "CreateOneUserMutationResponse",
  definition(t) {
    t.members(
      "CreateUserMutationOutput",
      "CreateOneUserMutationError"
    )
    // @ts-expect-error
    t.resolveType((item) => item.__typename);
  }
})