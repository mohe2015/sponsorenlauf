import { objectType, unionType } from 'nexus'
/*
export const UserMutationError = objectType({
  name: "UserMutationError",
  definition(t) {
    t.string("usernameError");
    t.string("roleError");
  },
});

export const UserMutationOutput = objectType({
  name: "UserMutationOutput",
  definition(t) {
    t.field("edge", {type: "UserEdge"})
  }
})

export const UserMutationResponse = unionType({
  name: "UserMutationResponse",
  resolveType: item => item.__typename,
  definition(t) {
    t.members(
      "UserMutationOutput",
      "UserMutationError"
    )
  }
})
*/