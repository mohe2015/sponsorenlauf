import { schema } from 'nexus-future'
import { Context } from '../src/context'
import { findManyCursor } from './findManyCursor'

export const Query = schema.queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findOne({
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

    t.field('rounds', {
      type: 'Rounds',
      args: {
        first: schema.intArg({
          required: false,
        }),
        last: schema.intArg({
          required: false,
        }),
        after: schema.stringArg({
          required: false,
        }),
        before: schema.stringArg({
          required: false,
        }),
      },
      nullable: false,
      resolve: async (parent, args, ctx: Context) => {
        return findManyCursor(
          _args =>
            ctx.prisma.round.findMany({
              ..._args,
              select: {
                id: true,
                time: true, // WTF???
              },
            }),
          args,
        )
      },
    })
  },
})
