import { objectType, inputObjectType, unionType } from 'nexus'
import { Context } from '../context';
import { Node } from "./Node";

export const Runner = objectType({
  name: "Runner",
  definition(t) {
    t.implements(Node);
    t.nonNull.id("id");
    t.nonNull.int("startNumber");
    t.nonNull.string("name");
    t.nonNull.string("clazz");
    t.nonNull.int("grade");
    t.nonNull.list.nonNull.field('rounds', {
      type: 'Round',
      resolve: (parent, _, context: Context) => {
        return context.db.runner.findUnique({
          where: { id: parent.id }
        }).rounds()
      }
    })
    t.nonNull.int("roundCount");
  },
});

export const RunnerOrderByInput = inputObjectType({
  name: "RunnerOrderByInput",
  definition(t) {
    t.nullable.field("id", { type: "SortOrder" })
    t.nullable.field("startNumber", { type: "SortOrder" })
    t.nullable.field("name", { type: "SortOrder" })
    t.nullable.field("clazz", { type: "SortOrder" })
    t.nullable.field("grade", { type: "SortOrder" })
    t.nullable.field("roundCount", { type: "SortOrder" })
  }
})

export const RunnerCreateInput = inputObjectType({
  name: "RunnerCreateInput",
  definition(t) {
    t.nonNull.int("startNumber");
    t.nonNull.string("name");
    t.nonNull.string("clazz");
    t.nonNull.int("grade");
  }
})

export const RunnerUpdateInput = inputObjectType({
  name: "RunnerUpdateInput",
  definition(t) {
    t.nonNull.int("startNumber");
    t.nonNull.string("name");
    t.nonNull.string("clazz");
    t.nonNull.int("grade");
  }
})


export const RunnerWhereUniqueInput = inputObjectType({
  name: "RunnerWhereUniqueInput",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.int("startNumber");
    t.nonNull.string("name");
  }
})


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
  definition(t) {
    t.members(
      "RunnerMutationOutput",
      "RunnerMutationError"
    )
  }
})
