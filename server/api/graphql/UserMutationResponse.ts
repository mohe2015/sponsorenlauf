import { objectType, unionType } from '@nexus/schema'

export const UserMutationError = objectType({
  name: "UserMutationError",
  definition(t) {
    t.string("usernameError");
    t.string("roleError", { nullable: true });
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
  definition(t) {
    t.members(
      "UserMutationOutput",
      "UserMutationError"
    )
    t.resolveType((item) => item.__typename);
  }
})