import { schema } from "nexus";

schema.objectType({
  name: "CreateRunnerMutationError",
  definition(t) {
    t.string("usernameError");
    t.string("roleError");
  },
});

schema.objectType({
  name: "CreateRunnerMutationOutput",
  definition(t) {
    t.field("previous_edge", {type: "String"})
    t.field("runner_edge", {type: "RunnerEdge"})
  }
})

schema.unionType({
  name: "CreateRunnerMutationResponse",
  definition(t) {
    t.members(
      "CreateRunnerMutationOutput",
      "CreateRunnerMutationError"
    )
    // @ts-expect-error
    t.resolveType((item) => item.__typename);
  }
})