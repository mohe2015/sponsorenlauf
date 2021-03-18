import { objectType, unionType } from 'nexus'

export const CreateRoundMutationError = objectType({
  name: "CreateRoundMutationError",
  definition(t) {
    t.string("startNumberError");
  },
});

export const CreateRoundMutationOutput = objectType({
  name: "CreateRoundMutationOutput",
  definition(t) {
    t.field("edge", {type: "RoundEdge"})
  }
})

export const CreateRoundMutationResponse = unionType({
  name: "CreateRoundMutationResponse",
  resolveType: item => item.__typename,
  definition(t) {
    t.members(
      "CreateRoundMutationOutput",
      "CreateRoundMutationError"
    )
  }
})