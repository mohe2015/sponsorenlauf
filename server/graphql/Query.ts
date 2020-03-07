import { schema } from 'nexus-future'
import { connectionPlugin } from "nexus";

export const Query = schema.queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        return ctx.db.user.findOne({
          where: {
            id: ctx.userId,
          },
        })
      },
    })

    t.crud.student({})

    t.crud.students({
      filtering: true,
      pagination: false,
    })
    
    t.connection("rounds", {
      type: "Round",
      nodes: async (root, args, ctx, info) => {
        return await ctx.db.round.findMany()
      },
      cursorFromNode: async (node, args, ctx, info, { index, nodes }) => {
        if (args.last && !args.before) {
          const totalCount = await ctx.db.round.count();
          return `cursor:${totalCount - args.last! + index + 1}`;
        }
        // TODO FIXME this uses the connectionPlugin
        return connectionPlugin.defaultCursorFromNode(node, args, ctx, info, {
          index,
          nodes,
        });
      }
    })
  },
})
