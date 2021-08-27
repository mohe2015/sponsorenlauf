import { objectType, inputObjectType, unionType } from 'nexus'
import { Context } from '../context';
import { isUserWithRole } from '../permissions';
import { Node } from "./Node";

export const Runner = objectType({
  name: "Runner",
  definition(t) {
    t.implements(Node);
    t.nonNull.id("id", {
      authorize: isUserWithRole(["ADMIN"]),
    });
    t.nonNull.int("startNumber", {
      authorize: isUserWithRole(["ADMIN"]),
    });
    t.nonNull.string("name", {
      authorize: isUserWithRole(["ADMIN"]),
    });
    t.nonNull.string("clazz", {
      authorize: isUserWithRole(["ADMIN"]),
    });
    t.nonNull.int("grade", {
      authorize: isUserWithRole(["ADMIN"]),
    });
    t.nonNull.list.nonNull.field('rounds', {
      type: 'Round',
      authorize: isUserWithRole(["ADMIN"]),
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
    t.nonNull.string("name");
    t.nonNull.string("clazz");
    t.nonNull.int("grade");
  }
})

export const RunnerUpdateInput = inputObjectType({
  name: "RunnerUpdateInput",
  definition(t) {
    t.nullable.string("name");
    t.nullable.string("clazz");
    t.nullable.int("grade");
  }
})

export const RunnerWhereUniqueInput = inputObjectType({
  name: "RunnerWhereUniqueInput",
  definition(t) {
    t.nullable.id("id");
    t.nullable.int("startNumber");
    t.nullable.string("name");
  }
})

export const RunnerMutationError = objectType({
  name: "RunnerMutationError",
  definition(t) {
    t.string("nameError");
    t.nullable.string("gradeError");
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
