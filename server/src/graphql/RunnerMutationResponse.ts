import { objectType, unionType } from 'nexus'

export const RunnerMutationError = objectType({
  name: "RunnerMutationError",
  definition(t) {
    t.string("nameError");
    t.string("gradeError");
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
  resolveType: item => item.__typename,
  definition(t) {
    t.members(
      "RunnerMutationOutput",
      "RunnerMutationError"
    )
  }
})