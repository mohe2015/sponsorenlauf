import { schema } from 'nexus-future'

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
      nodes(root, args, ctx, info) {
        return ctx.db.user.findMany()
      },
    })
  },
})
