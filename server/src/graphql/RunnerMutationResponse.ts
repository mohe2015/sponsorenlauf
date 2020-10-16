import { objectType, unionType } from '@nexus/schema'

export const RunnerMutationError = objectType({
  name: "RunnerMutationError",
  definition(t) {
    t.string("nameError");
    t.string("gradeError", { nullable: true });
  },
});

export const RunnerMutationOutput = objectType({
  name: "RunnerMutationOutput",
  definition(t) {
    t.field("edge", {type: "RunnerEdge"})
  }
})

export const RunnerMutationResponse = unionType({
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