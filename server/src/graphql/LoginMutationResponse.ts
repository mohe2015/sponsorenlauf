import { objectType, unionType } from 'nexus'

export const LoginMutationError = objectType({
  name: "LoginMutationError",
  definition(t) {
    t.string("usernameError", { nullable: true });
    t.string("passwordError", { nullable: true });
  },
});


export const LoginMutationResponse = unionType({
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