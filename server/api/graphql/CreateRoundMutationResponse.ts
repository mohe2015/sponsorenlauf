import { schema } from "nexus";

schema.objectType({
  name: "CreateRoundMutationError",
  definition(t) {
    t.string("startNumberError");
  },
});

schema.objectType({
  name: "CreateRoundMutationOutput",
  definition(t) {
    t.field("edge", {type: "RoundEdge"})
  }
})

schema.unionType({
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