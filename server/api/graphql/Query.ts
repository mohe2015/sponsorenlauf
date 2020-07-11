import { schema } from "nexus";
import { decode } from "../relay-tools-custom";

schema.queryType({
  definition(t) {
    t.field("me", {
      type: "User",
      nullable: true,
      resolve: (parent, args, ctx) => {
        return ctx.db.user.findOne({
          where: {
            id: ctx.userId,
          },
        });
      },
    });

    t.crud.student({});

    t.connection("students", {
      type: "Student",
      nodes: async (root, args, ctx, info) => {
        return await ctx.db.student.findMany();
      },
    });

    t.connection("rounds", {
      type: "Round",
      nodes: async (root, args, ctx, info) => {
        return await ctx.db.round.findMany();
      },
    });

    t.field("node", {
      type: "Node",
      args: { id: schema.idArg({ required: true }) },
      resolve: (root, args, context, info) => {
        const { id, __typename } = decode(args.id);
        const objeto = __typename.charAt(0).toLowerCase() + __typename.slice(1); // from TitleCase to camelCase
        return {
          // @ts-ignore
          ...context.db[objeto].findOne({ where: { id } }),
          __typename,
        };
      },
    });
  },
});