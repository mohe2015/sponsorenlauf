import { queryType, intArg, stringArg, idArg } from 'nexus'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        return ctx.photon.users.findOne({
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

    t.crud.rounds({ type: 'Round', ordering: true, filtering: true })
  },
})
