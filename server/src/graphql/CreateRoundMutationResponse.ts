import { objectType, unionType } from '@nexus/schema'

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
  definition(t) {
    t.members(
      "CreateRoundMutationOutput",
      "CreateRoundMutationError"
    )
    // @ts-expect-error
    t.resolveType((item) => item.__typename);
  }
})