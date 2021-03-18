import { objectType, unionType } from 'nexus'

export const LoginMutationError = objectType({
  name: "LoginMutationError",
  definition(t) {
    t.nullable.string("usernameError");
    t.nullable.string("passwordError");
  },
});


export const LoginMutationResponse = unionType({
  name: "LoginMutationResponse",
  resolveType: item => item.__typename,
  definition(t) {
    t.members(
      "User",
      "LoginMutationError"
    )
  }
})