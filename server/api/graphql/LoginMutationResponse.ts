import { schema } from "nexus";

schema.objectType({
  name: "LoginMutationError",
  definition(t) {
    t.string("usernameError", { nullable: true });
    t.string("passwordError", { nullable: true });
  },
});


schema.unionType({
  name: "LoginMutationResponse",
  definition(t) {
    t.members(
      "User",
      "LoginMutationError"
    )
    // @ts-expect-error
    t.resolveType((item) => item.__typename);
  }
})