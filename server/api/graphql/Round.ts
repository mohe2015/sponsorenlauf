import { inputObjectType, objectType, unionType } from 'nexus'

export const Round = objectType({
  name: "Round",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.field('student', {
      type: 'Runner',
      resolve: async (parent, _, context) => {
        return (await context.db.round.findUnique({
          where: { id: parent.id }
        }).student())!;
      }
    });
    t.nonNull.field("time", { type: "DateTime" });
    t.nonNull.field('createdBy', {
      type: 'User',
      resolve: async (parent, _, context) => {
        return (await context.db.round.findUnique({
          where: { id: parent.id }
        }).createdBy())!;
      }
    })
  },
});

export const RoundOrderByInput = inputObjectType({
  name: "RoundOrderByInput",
  definition(t) {
    t.nullable.field("id", { type: "SortOrder" })
    t.nullable.field("student", { type: "SortOrder" })
    t.nullable.field("time", { type: "SortOrder" })
    t.nullable.field("createdBy", { type: "SortOrder" })
  },
});

export const RoundCreateInput = inputObjectType({
  name: "RoundCreateInput",
  definition(t) {
    t.nonNull.id('studentId');
    t.nonNull.field("time", { type: "DateTime" });
    t.nonNull.id('createdById');
  }
})

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
  }
})
