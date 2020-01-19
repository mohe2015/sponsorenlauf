import { queryType, intArg, stringArg, idArg } from 'nexus'
import { getUserId } from '../utils'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.photon.users.findOne({
          where: {
            id: userId,
          },
        })
      },
    })

    t.crud.students({
      pagination: false,
    })

    t.crud.rounds({ type: 'Round', ordering: true, filtering: true })
  },
})
