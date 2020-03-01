import { queryType, intArg, stringArg, idArg } from 'nexus'
import { Context } from '../context'
import { findManyCursor } from './findManyCursor'

export const Query = queryType({
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
        first: intArg({
          required: false,
        }),
        last: intArg({
          required: false,
        }),
        after: stringArg({
          required: false,
        }),
        before: stringArg({
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
