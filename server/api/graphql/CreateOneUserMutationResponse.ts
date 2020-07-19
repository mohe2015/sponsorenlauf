import { schema } from "nexus";

schema.objectType({
  name: "CreateOneUserMutationError",
  definition(t) {
    t.string("usernameError");
    t.string("roleError");
  },
});


schema.unionType({
  name: "CreateOneUserMutationResponse",
  definition(t) {
    t.members(
      "User",
      "CreateOneUserMutationError"
    )
    // @ts-expect-error
    t.resolveType((item) => item.__typename);
  }
})