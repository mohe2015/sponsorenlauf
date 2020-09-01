import { schema } from "nexus";

schema.objectType({
  name: "RunnerMutationError",
  definition(t) {
    t.string("nameError");
    t.string("gradeError", { nullable: true });
  },
});

schema.objectType({
  name: "RunnerMutationOutput",
  definition(t) {
    t.field("edge", {type: "RunnerEdge"})
  }
})

schema.unionType({
  name: "RunnerMutationResponse",
  definition(t) {
    t.members(
      "RunnerMutationOutput",
      "RunnerMutationError"
    )
    // @ts-expect-error
    t.resolveType((item) => item.__typename);
  }
})