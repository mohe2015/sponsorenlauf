import { schema } from 'nexus-future'
import { Student } from './Student'

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

    t.connection('students', {
      type: Student,
      nodes: async (root, args, ctx, info) => {
        return await ctx.db.student.findMany()
      },
    })

    t.connection('rounds', {
      type: 'Round',
      nodes: async (root, args, ctx, info) => {
        return await ctx.db.round.findMany()
      },
    })
  },
})
